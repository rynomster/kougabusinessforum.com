# 🚀 Installation & Deployment Guide

## Prerequisites

1. **Node.js** (v18 or later)
2. **Wrangler** - Cloudflare's CLI tool
3. **Git** (for version control)

---

## Quick Start

### 1. Install Wrangler

```bash
npm i wrangler --save-dev
```

### 2. Navigate to the workers folder

```bash
cd /home/rynom/workspace/kouga-business-forum/workers
```

### 3. Set environment variables

```bash
# Option A: Via wrangler.toml (recommended)
# Add your vars to wrangler.toml under [vars] section

# Option B: Via command line (development only)
wrangler secret put ADMIN_EMAIL
wrangler secret put ADMIN_PHONE
wrangler secret put KBF_WEBSITE
```

### 4. Deploy the worker

```bash
# Deploy to Cloudflare Workers
npx wrangler deploy

# This will output:
# Your worker has been deployed at https://kbf-submissions-worker.workers.dev
```

---

## Cloudflare Pages Integration (Recommended)

For seamless routing with your KBF website:

### 1. Create a Cloudflare Pages project

```bash
# Initialize Pages project
npx wrangler pages init kbf-submissions

# Follow prompts to link to your GitHub repo or upload code
```

### 2. Configure Routes

In Cloudflare Dashboard → Pages → kbf-submissions → Routes:

```
kbf-web-2026/api/membership
kbf-web-2026/api/directory
kbf-web-2026/api/submissions/:submissionId
kbf-web-2026/api/admin/webhook
```

### 3. Enable Worker compatibility

In Pages settings → Functions → Enable (this makes Pages behave like Workers for your routes)

---

## Testing Locally

### 1. Start development server

```bash
cd /home/rynom/workspace/kouga-business-forum/workers
npx wrangler dev
```

### 2. Test with curl

```bash
# Test membership endpoint
curl -X POST http://localhost:8787/api/membership \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "email": "test@example.com",
    "membershipType": "annual",
    "company": "Test Company"
  }'

# Test directory endpoint
curl -X POST http://localhost:8787/api/directory \
  -H "Content-Type: application/json" \
  -d '{
    "businessName": "Test Business",
    "ownerName": "Owner Name",
    "ownerPhone": "063 123 4567",
    "ownerEmail": "owner@example.com",
    "category": "retail",
    "address": {
      "street": "123 Test St",
      "town": "Jeffreys Bay"
    }
  }'
```

### 3. Expected responses

**Membership:**
```json
{
  "success": true,
  "message": "Membership application received",
  "submissionId": "mem_xxxxxxxx",
  "nextSteps": "Admin will verify and approve within 48 hours",
  "pricing": "R200 one-time + R100/month OR R1200 annual"
}
```

**Directory:**
```json
{
  "success": true,
  "message": "Directory submission received",
  "submissionId": "dir_xxxxxxxx",
  "pendingApproval": true,
  "estimatedApprovalTime": "48-72 hours"
}
```

---

## Form Integration

### Update your KBF website forms to post to the worker

#### Membership Form (contact.html)

```html
<form id="membershipForm">
  <!-- Form fields -->
  
  <input type="hidden" name="action" value="membership">
  
  <button type="submit">Apply for Membership</button>
</form>

<script>
document.getElementById('membershipForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData);
  
  try {
    const response = await fetch('/api/membership', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    const result = await response.json();
    
    if (result.success) {
      alert(`Thank you! Your application ID is: ${result.submissionId}`);
      e.target.reset();
    } else {
      alert('Error: ' + result.error);
    }
  } catch (error) {
    alert('Failed to submit application. Please contact office@kougabusinessforum.com');
  }
});
</script>
```

#### Directory Submission Form (directory.html)

```html
<form id="directoryForm">
  <!-- Form fields -->
  
  <input type="hidden" name="action" value="directory">
  
  <button type="submit">Submit Business</button>
</form>

<script>
document.getElementById('directoryForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData);
  
  try {
    const response = await fetch('/api/directory', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    const result = await response.json();
    
    if (result.success) {
      alert(`Thank you! Your submission ID is: ${result.submissionId}`);
      e.target.reset();
    } else {
      alert('Error: ' + result.error);
    }
  } catch (error) {
    alert('Failed to submit. Please contact office@kougabusinessforum.com');
  }
});
</script>
```

---

## Database Setup (Optional - For Production)

### Using Cloudflare D1 (SQL Database)

```bash
# Create database
npx wrangler d1 create kbf-submissions-db

# Create tables
npx wrangler d1 execute kbf-submissions-db --command=
"CREATE TABLE submissions (
  submission_id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  data JSON NOT NULL,
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  reviewed_by TEXT,
  reviewed_at TIMESTAMP
);"

# Create index for faster lookups
npx wrangler d1 execute kbf-submissions-db --command=
"CREATE INDEX idx_submissions_status ON submissions(status);
CREATE INDEX idx_submissions_submitted_at ON submissions(submitted_at);
CREATE INDEX idx_submissions_type ON submissions(type);
"
```

### Using Cloudflare KV (Key-Value Store)

```bash
# Create namespace
npx wrangler kv:namespace create kbf-submissions-store

# Bind in wrangler.toml
[[kv_namespaces]]
binding = "KV_SUBMISSIONS"
id = "your-kv-namespace-id"
prefix = "submissions/"
```

---

## Production Checklist

- [ ] Set environment variables in Cloudflare dashboard
- [ ] Configure routes in Cloudflare Pages
- [ ] Test all endpoints with curl
- [ ] Verify email notifications (if implemented)
- [ ] Set up database (D1 or KV)
- [ ] Configure rate limiting
- [ ] Add input validation and sanitization
- [ ] Set up monitoring/alerting
- [ ] Document admin procedures
- [ ] Test rollback procedure

---

## Troubleshooting

### Worker not responding

```bash
# Check worker status
npx wrangler tail

# Redeploy
npx wrangler deploy
```

### Route not matching

1. Verify domain is correctly configured in Cloudflare
2. Check that Pages/Workers are enabled for the route
3. Ensure the path prefix is correct (kbf-web-2026/)

### CORS errors

- Routes must be configured in wrangler.toml
- Ensure domain matches exactly (including https://)

---

## Next Steps

1. **Database Setup** - Choose D1, KV, or external service
2. **Admin Dashboard** - Build admin interface for reviewing submissions
3. **Email Integration** - Configure actual email sending
4. **Payment Integration** - Add PayFast for membership payments
5. **Analytics** - Track submissions and user behavior

---

## Support

- **Email:** office@kougabusinessforum.com
- **Phone:** 063 902 1597
- **GitHub:** https://github.com/rynomster/kbf-web-2026
