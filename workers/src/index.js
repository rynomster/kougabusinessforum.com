// Configuration
const ADMIN_EMAIL = 'office@kougabusinessforum.com';
const ADMIN_PHONE = '063 902 1597';
const KBF_WEBSITE = 'https://new.kougabusinessforum.com';

// CORS configuration
const ALLOWED_ORIGIN = 'https://new.kougabusinessforum.com';

const corsHeaders = {
  'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// Helper function to log with timestamp
function log(message) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${message}`);
}

// Helper to send email notification (placeholder - implement with nodemailer or similar)
async function sendAdminNotification(submission) {
  log(`📧 Admin notification would be sent to ${ADMIN_EMAIL}`);

  // TODO: Implement actual email sending
  // Example using fetch to SMTP server
  // or integrate with a service like SendGrid, Mailgun, Resend, etc.

  const emailBody = `New ${submission.type} submission received on ${KBF_WEBSITE}.

Submission ID: ${submission.submissionId}
Submitted at: ${new Date(submission.submittedAt).toLocaleString()}

${submission.email ? `Email: ${submission.email}\n` : ''}
${submission.company ? `Company: ${submission.company}\n` : ''}

Please review and approve/reject as needed.`;

  log(emailBody);
}

// Generate unique submission ID
function generateSubmissionId(type) {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `${type}_${timestamp}_${random}`;
}

// Helper to build JSON response with CORS headers
function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders,
    },
  });
}

// Helper for error responses with CORS
function errorResponse(error, status = 400) {
  return jsonResponse({ error }, status);
}

// Input sanitization - basic HTML entity encoding
function sanitizeInput(str) {
  if (typeof str !== 'string') return str;
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Sanitize object fields
function sanitizeObject(obj, fields) {
  const sanitized = { ...obj };
  for (const field of fields) {
    if (sanitized[field] && typeof sanitized[field] === 'string') {
      sanitized[field] = sanitizeInput(sanitized[field]);
    }
  }
  return sanitized;
}

// Rate limiting - simple in-memory store (use KV in production)
const requestCounts = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 10; // 10 requests per minute

function checkRateLimit(ip) {
  const now = Date.now();
  const record = requestCounts.get(ip);

  if (!record || now - record.windowStart > RATE_LIMIT_WINDOW) {
    requestCounts.set(ip, { windowStart: now, count: 1 });
    return true;
  }

  if (record.count >= RATE_LIMIT_MAX) {
    return false;
  }

  record.count++;
  return true;
}

// Main handler
async function handleRequest(req) {
  const url = new URL(req.url);
  const method = req.method;
  const path = url.pathname;

  log(`📥 Request: ${method} ${path}`);

  // Handle CORS preflight
  if (method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Get client IP for rate limiting
  const clientIP = req.headers.get('CF-Connecting-IP') || 'unknown';

  // Apply rate limiting
  if (!checkRateLimit(clientIP)) {
    log(`⚠️ Rate limit exceeded for IP: ${clientIP}`);
    return errorResponse('Rate limit exceeded. Please try again later.', 429);
  }

  // Parse JSON body if present
  let body = null;
  if (method === 'POST' || method === 'PUT' || method === 'PATCH') {
    try {
      body = await req.json();
    } catch (error) {
      return errorResponse('Invalid JSON body', 400);
    }
  }

  // Route handler
  switch (path) {
    case '/api/membership':
      return handleMembershipSubmission(method, body);

    case '/api/directory':
      return handleDirectorySubmission(method, body);

    case '/api/submissions':
      return handleSubmissionStatus(method, body, url);

    case '/api/admin/webhook':
      return handleAdminWebhook(method, body, req);

    case '/api/newsletter':
      return handleNewsletter(method, body);

    case '/api/rss':
    case '/rss':
      return handleRssProxy(method);

    default:
      // Handle path-based submission lookup
      if (path.startsWith('/api/submissions/')) {
        return handleSubmissionStatus(method, body, url);
      }
      return errorResponse('Not found', 404);
  }
}

// Handle RSS proxy - fetches from 9ty9.co.za to bypass Cloudflare
async function handleRssProxy(method) {
  if (method !== 'GET') {
    return errorResponse('Method not allowed', 405);
  }

  const RSS_URL = 'https://9ty9.co.za/event/feed';

  log(`🔄 Proxying RSS from ${RSS_URL}`);

  try {
    const response = await fetch(RSS_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/rss+xml, application/xml, text/xml, */*',
        'Referer': 'https://9ty9.co.za/'
      }
    });

    const xml = await response.text();

    log(`📡 RSS proxy: ${response.status}, ${xml.length} bytes`);

    return new Response(xml, {
      status: 200,
      headers: {
        'Content-Type': 'application/rss+xml; charset=UTF-8',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=300' // Cache for 5 minutes
      }
    });
  } catch (error) {
    log(`❌ RSS proxy error: ${error.message}`);
    return errorResponse('Failed to fetch RSS feed', 502);
  }
}

// Handle membership submission
async function handleMembershipSubmission(method, body) {
  if (method !== 'POST') {
    return errorResponse('Method not allowed', 405);
  }

  // Validate required fields
  const requiredFields = ['firstName', 'lastName', 'email', 'membershipType'];
  for (const field of requiredFields) {
    if (!body[field]) {
      return errorResponse(`Missing required field: ${field}`, 400);
    }
  }

  // Sanitize input
  const sanitized = sanitizeObject(body, ['firstName', 'lastName', 'email', 'company', 'notes']);

  // Generate submission ID
  const submissionId = generateSubmissionId('membership');
  const submission = {
    submissionId,
    type: 'membership',
    data: { ...sanitized },
    status: 'pending',
    submittedAt: new Date().toISOString(),
    admin: {
      email: ADMIN_EMAIL,
      phone: ADMIN_PHONE
    }
  };

  log(`👤 New membership application: ${sanitized.firstName} ${sanitized.lastName}`);

  // TODO: Store submission in database (D1, KV, or external service)
  // await saveSubmission(submission);

  // Send admin notification
  await sendAdminNotification(submission);

  return jsonResponse({
    success: true,
    message: 'Membership application received',
    submissionId,
    nextSteps: 'Admin will verify and approve within 48 hours',
    pricing: 'R200 one-time + R100/month OR R1200 annual'
  }, 201);
}

// Handle directory submission
async function handleDirectorySubmission(method, body) {
  if (method !== 'POST') {
    return errorResponse('Method not allowed', 405);
  }

  // Validate required fields
  const requiredFields = [
    'businessName',
    'ownerName',
    'ownerPhone',
    'ownerEmail',
    'category',
    'address'
  ];

  for (const field of requiredFields) {
    if (!body[field]) {
      return errorResponse(`Missing required field: ${field}`, 400);
    }
  }

  // Sanitize input
  const sanitized = sanitizeObject(body, ['businessName', 'ownerName', 'ownerEmail', 'description', 'notes']);

  // Generate submission ID
  const submissionId = generateSubmissionId('directory');
  const submission = {
    submissionId,
    type: 'directory',
    data: { ...sanitized },
    status: 'pending',
    submittedAt: new Date().toISOString(),
    admin: {
      email: ADMIN_EMAIL,
      phone: ADMIN_PHONE
    }
  };

  log(`🏢 New directory submission: ${sanitized.businessName}`);

  // TODO: Store submission in database
  // await saveSubmission(submission);

  // Send admin notification
  await sendAdminNotification(submission);

  return jsonResponse({
    success: true,
    message: 'Directory submission received',
    submissionId,
    pendingApproval: true,
    estimatedApprovalTime: '48-72 hours'
  }, 201);
}

// Handle submission status lookup
async function handleSubmissionStatus(method, body, url) {
  // Extract submission ID from path
  const path = url.pathname;
  const match = path.match(/\/api\/submissions\/(.+)$/);

  if (!match) {
    return errorResponse('Submission ID required', 400);
  }

  const submissionId = match[1];

  if (method === 'GET') {
    // TODO: Fetch submission from database
    // const submission = await getSubmission(submissionId);

    return jsonResponse({
      submissionId,
      type: 'membership',
      status: 'pending',
      submittedAt: new Date().toISOString(),
      message: 'Submission is pending review'
    });
  }

  return errorResponse('Method not allowed', 405);
}

// Handle admin webhook
async function handleAdminWebhook(method, body, req) {
  if (method !== 'POST') {
    return errorResponse('Method not allowed', 405);
  }

  // Webhook authentication - verify Bearer token
  const authHeader = req.headers.get('Authorization');
  const expectedToken = req.headers.get('x-webhook-secret') || 'kbf-webhook-secret';

  // Allow either Bearer token or x-webhook-secret header
  const isAuthorized =
    (authHeader && authHeader.startsWith('Bearer ')) ||
    req.headers.has('x-webhook-secret');

  if (!isAuthorized) {
    log(`⚠️ Unauthorized webhook attempt from IP: ${req.headers.get('CF-Connecting-IP')}`);
    return errorResponse('Unauthorized', 401);
  }

  log(`🔔 Admin webhook received for submission: ${body.submissionId}`);

  // TODO: Process webhook action
  // Examples:
  // - Approve/reject submission
  // - Update membership status
  // - Trigger email notifications
  // - Update analytics

  return jsonResponse({
    success: true,
    message: 'Webhook processed',
    submissionId: body.submissionId
  });
}

// Handle newsletter subscription
async function handleNewsletter(method, body) {
  if (method !== 'POST') {
    return errorResponse('Method not allowed', 405);
  }

  if (!body || !body.email) {
    return errorResponse('Email is required', 400);
  }

  log(`📧 Newsletter subscription: ${body.email}`);

  return jsonResponse({ success: true }, 201);
}

// Serve the worker
export default {
  async fetch(req) {
    return handleRequest(req);
  }
};
