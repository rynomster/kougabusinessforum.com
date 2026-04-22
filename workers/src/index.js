// Configuration
const ADMIN_EMAIL = 'office@kougabusinessforum.com';
const ADMIN_PHONE = '063 902 1597';
const KBF_WEBSITE = 'https://new.kougabusinessforum.com';

/**
 * Helper to get CORS headers
 */
function getCorsHeaders(env) {
  const allowedOrigin = env?.KBF_WEBSITE || KBF_WEBSITE;
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-webhook-secret',
    'Access-Control-Max-Age': '86400',
  };
}

/**
 * Helper function to log with timestamp
 */
function log(message, type = 'info') {
  const timestamp = new Date().toISOString();
  const prefix = {
    info: 'ℹ️',
    warn: '⚠️',
    error: '❌',
    success: '✅'
  }[type] || '🔹';
  console.log(`[${timestamp}] ${prefix} ${message}`);
}

/**
 * Helper to build JSON response with CORS headers
 */
function jsonResponse(data, status = 200, env = null) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...getCorsHeaders(env),
    },
  });
}

/**
 * Helper for error responses with CORS
 */
function errorResponse(error, status = 400, env = null) {
  log(`Error: ${error} (Status: ${status})`, 'error');
  return jsonResponse({
    success: false,
    error,
    timestamp: new Date().toISOString()
  }, status, env);
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

// Rate limiting - simple in-memory store (volatile on Worker restart)
const requestCounts = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 20; // Increased to 20 per minute

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

/**
 * Generate unique submission ID
 */
function generateSubmissionId(type) {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `${type}_${timestamp}_${random}`;
}

/**
 * Helper to send email notification (Placeholder)
 */
async function sendAdminNotification(submission, env) {
  const adminEmail = env?.ADMIN_EMAIL || ADMIN_EMAIL;
  const kbfWebsite = env?.KBF_WEBSITE || KBF_WEBSITE;

  log(`📧 Admin notification would be sent to ${adminEmail}`, 'info');

  const emailBody = `New ${submission.type} submission received on ${kbfWebsite}.

Submission ID: ${submission.submissionId}
Submitted at: ${new Date(submission.submittedAt).toLocaleString()}

${submission.data.email ? `Email: ${submission.data.email}\n` : ''}
${submission.data.company || submission.data.businessName ? `Entity: ${submission.data.company || submission.data.businessName}\n` : ''}

Please review in the admin dashboard.`;

  log(emailBody, 'info');
}

// --- Route Handlers ---

/**
 * Handle RSS proxy - fetches from 9ty9.co.za to bypass local Cloudflare restrictions
 */
async function handleRssProxy(method, env) {
  if (method !== 'GET') {
    return errorResponse('Method not allowed', 405, env);
  }

  const RSS_URL = 'https://9ty9.co.za/event/feed';
  log(`🔄 Proxying RSS from ${RSS_URL}`, 'info');

  try {
    const response = await fetch(RSS_URL, {
      headers: {
        'User-Agent': 'KBF-RSS-Proxy/1.0',
        'Accept': 'application/rss+xml, application/xml, text/xml, */*',
        'Referer': 'https://9ty9.co.za/'
      }
    });

    if (!response.ok) {
      throw new Error(`Target RSS returned HTTP ${response.status}`);
    }

    const xml = await response.text();
    log(`📡 RSS proxy success: ${xml.length} bytes`, 'success');

    return new Response(xml, {
      status: 200,
      headers: {
        'Content-Type': 'application/rss+xml; charset=UTF-8',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=1800' // Cache for 30 minutes
      }
    });
  } catch (error) {
    log(`RSS proxy error: ${error.message}`, 'error');
    return errorResponse(`Failed to fetch RSS feed: ${error.message}`, 502, env);
  }
}

/**
 * Handle membership submission
 */
async function handleMembershipSubmission(method, body, env) {
  if (method !== 'POST') return errorResponse('Method not allowed', 405, env);

  const requiredFields = ['firstName', 'lastName', 'email', 'membershipType'];
  for (const field of requiredFields) {
    if (!body[field]) return errorResponse(`Missing required field: ${field}`, 400, env);
  }

  const sanitized = sanitizeObject(body, ['firstName', 'lastName', 'email', 'company', 'notes']);
  const submissionId = generateSubmissionId('membership');

  const submission = {
    submissionId,
    type: 'membership',
    data: sanitized,
    status: 'pending',
    submittedAt: new Date().toISOString()
  };

  log(`👤 New membership application: ${sanitized.firstName} ${sanitized.lastName}`, 'success');
  await sendAdminNotification(submission, env);

  return jsonResponse({
    success: true,
    message: 'Membership application received',
    submissionId,
    nextSteps: 'Admin will verify and approve within 48 hours'
  }, 201, env);
}

/**
 * Handle directory submission
 */
async function handleDirectorySubmission(method, body, env) {
  if (method !== 'POST') return errorResponse('Method not allowed', 405, env);

  const requiredFields = ['businessName', 'ownerName', 'ownerEmail', 'category', 'address'];
  for (const field of requiredFields) {
    if (!body[field]) return errorResponse(`Missing required field: ${field}`, 400, env);
  }

  const sanitized = sanitizeObject(body, ['businessName', 'ownerName', 'ownerEmail', 'description', 'notes']);
  const submissionId = generateSubmissionId('directory');

  const submission = {
    submissionId,
    type: 'directory',
    data: sanitized,
    status: 'pending',
    submittedAt: new Date().toISOString()
  };

  log(`🏢 New directory submission: ${sanitized.businessName}`, 'success');
  await sendAdminNotification(submission, env);

  return jsonResponse({
    success: true,
    message: 'Directory submission received',
    submissionId,
    pendingApproval: true
  }, 201, env);
}

/**
 * Handle newsletter subscription
 */
async function handleNewsletter(method, body, env) {
  if (method !== 'POST') return errorResponse('Method not allowed', 405, env);
  if (!body || !body.email) return errorResponse('Email is required', 400, env);

  log(`📧 Newsletter subscription: ${body.email}`, 'success');
  return jsonResponse({ success: true, message: 'Subscribed successfully' }, 201, env);
}

// --- Main Handler ---

async function handleRequest(req, env) {
  const url = new URL(req.url);
  const method = req.method;
  const path = url.pathname;

  log(`${method} ${path}`);

  // CORS Preflight
  if (method === 'OPTIONS') {
    return new Response(null, { headers: getCorsHeaders(env) });
  }

  // Rate Limiting
  const clientIP = req.headers.get('CF-Connecting-IP') || 'unknown';
  if (!checkRateLimit(clientIP)) {
    log(`Rate limit exceeded: ${clientIP}`, 'warn');
    return errorResponse('Too many requests. Please try again later.', 429, env);
  }

  // Body Parsing
  let body = null;
  if (['POST', 'PUT', 'PATCH'].includes(method)) {
    try {
      body = await req.json();
    } catch (e) {
      return errorResponse('Invalid JSON body', 400, env);
    }
  }

  // Routing
  try {
    switch (path) {
      case '/api/membership':
        return await handleMembershipSubmission(method, body, env);
      case '/api/directory':
        return await handleDirectorySubmission(method, body, env);
      case '/api/newsletter':
        return await handleNewsletter(method, body, env);
      case '/api/rss':
      case '/rss':
        return await handleRssProxy(method, env);
      default:
        return errorResponse('Not found', 404, env);
    }
  } catch (error) {
    log(`Internal error: ${error.message}`, 'error');
    return errorResponse('Internal server error', 500, env);
  }
}

export default {
  async fetch(req, env) {
    return handleRequest(req, env);
  }
};
