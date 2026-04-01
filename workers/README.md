# Cloudflare Worker for KBF Website

## Endpoints

### 1. Membership Sign-Up POST `/api/membership`

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "063 123 4567",
  "membershipType": "annual|monthly|complimentary",
  "company": "ABC Company",
  "address": {
    "street": "123 Main St",
    "town": "Jeffreys Bay",
    "region": "Kouga"
  },
  "businessType": "retail|service|manufacturing|Other",
  "website": "https://example.com",
  "category": "restaurants|retail|services|manufacturing|Other",
  "socialMedia": {
    "facebook": "",
    "instagram": "",
    "linkedin": "",
    "twitter": ""
  },
  "notes": ""
}
```

**Response:**
```json
{
  "success": true,
  "message": "Membership application received",
  "submissionId": "mem_1234567890",
  "nextSteps": "Admin will verify and approve within 48 hours"
}
```

---

### 2. Directory Addition POST `/api/directory`

**Request Body:**
```json
{
  "businessName": "ABC Business",
  "ownerName": "Owner Name",
  "ownerPhone": "063 123 4567",
  "ownerEmail": "owner@example.com",
  "website": "https://abcbusiness.co.za",
  "businessType": "retail|service|manufacturing|Other",
  "category": "restaurants|retail|services|manufacturing|Other",
  "subCategory": "cafes|clothing|consulting|electronics|Other",
 
  "address": {
    "street": "123 Main Street",
    "town": "Jeffreys Bay",
    "region": "Kouga",
    "postalCode": "5210",
    "coordinates": {
      "lat": -34.1322,
      "lng": 24.8195
    }
  },
 
  "hours": {
    "monday": "08:00-17:00",
    "tuesday": "08:00-17:00",
    "wednesday": "08:00-17:00",
    "thursday": "08:00-17:00",
    "friday": "08:00-17:00",
    "saturday": "09:00-13:00",
    "sunday": "Closed"
  },
 
  "description": "Brief description of business",
 
  "membershipStatus": "paid|basic|complimentary",
  "membershipId": "mem_1234567890",
 
  "socialMedia": {
    "facebook": "https://facebook.com/abc",
    "instagram": "@abc",
    "linkedin": "https://linkedin.com/company/abc",
    "twitter": "@abc"
  },
 
  "images": [
    "https://example.com/image1.jpg",
    "https://example.com/image2.jpg"
  ],
 
  "awards": [],
  "certifications": [],
  "notes": "Additional information for admin review"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Directory submission received",
  "submissionId": "dir_1234567890",
  "pendingApproval": true,
  "estimatedApprovalTime": "48-72 hours"
}
```

---

### 3. Submission Status GET `/api/submissions/:id`

**Response:**
```json
{
  "submissionId": "mem_1234567890",
  "type": "membership",
  "status": "pending|approved|rejected",
  "submittedAt": "2026-04-01T10:30:00Z",
  "reviewedBy": "admin@example.com",
  "reviewedAt": "2026-04-02T14:00:00Z",
  "reviewNotes": "All good, approved"
}
```

---

### 4. Admin Webhook POST `/api/admin/webhook`

**Purpose:** Send notifications to admin email when new submissions are received.

**Authentication:** Requires `Authorization: Bearer <token>` header or `x-webhook-secret: <secret>` header.

**Request Body:**
```json
{
  "submissionId": "mem_1234567890",
  "type": "membership",
  "submittedAt": "2026-04-01T10:30:00Z",
  "email": "john@example.com",
  "company": "ABC Company"
}
```

---

## Worker Configuration

### Wrangler.toml
```toml
name = "kbf-submissions-worker"
main = "src/index.js"
compatibility_date = "2024-01-01"

[vars]
ADMIN_EMAIL = "office@kougabusinessforum.com"
ADMIN_PHONE = "063 902 1597"
KBF_WEBSITE = "https://new.kougabusinessforum.com"
MEMBERSHIP_PRICING = "R200 one-time + R100/month OR R1200 annual"

[[routes]]
zone_name = "kougabusinessforum.com"
pattern = "kbf-web-2026/api/membership"
methods = ["POST"]

[[routes]]
zone_name = "kougabusinessforum.com"
pattern = "kbf-web-2026/api/directory"
methods = ["POST"]

[[routes]]
zone_name = "kougabusinessforum.com"
pattern = "kbf-web-2026/api/submissions/:submissionId"
methods = ["GET"]

[[routes]]
zone_name = "kougabusinessforum.com"
pattern = "kbf-web-2026/api/admin/webhook"
methods = ["POST"]
```

---

## Deployment

```bash
# Install Wrangler (if not already installed)
npm i wrangler --save-dev

# Deploy
npx wrangler deploy

# Watch mode for development
npx wrangler dev
```

---

## Admin Dashboard (Future)

A simple dashboard can be created to:
- View all submissions
- Approve/reject directory listings
- Update membership statuses
- Export data to CSV
- Manage admin users

---

## Data Storage Options

### Option 1: Cloudflare D1 (Recommended)
- Serverless SQL database
- Free tier: 10GB storage, unlimited reads
- Automatic scaling

### Option 2: Cloudflare KV
- Key-value store
- Free tier: 1GB storage
- Simple for smaller datasets

### Option 3: External Service
- Google Sheets API (current approach)
- Airtable
- Supabase

---

## Security Considerations

1. **Rate Limiting:** Implemented (10 requests/minute per IP)
2. **Input Validation:** All inputs are sanitized (HTML entity encoding)
3. **CORS:** Restricted to KBF domain only
4. **Authentication:** Webhook endpoint requires Bearer token or secret header
5. **Logging:** Structured logging for debugging
6. **Webhooks:** Secret token verification for webhook endpoints

---

## Future Enhancements

- [ ] Email notifications to business owners
- [ ] Payment integration (PayFast, Yoco)
- [ ] Admin email notifications
- [ ] Analytics tracking
- [ ] Searchable directory API
- [ ] Business profile management
- [ ] Member verification workflow
