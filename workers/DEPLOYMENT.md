# 🚀 KBF Worker - Deployment & Troubleshooting Guide

## Prerequisites

1. **Cloudflare Account** - Access to the `kougabusinessforum.com` zone.
2. **Node.js** (v18+) & **npm**.
3. **API Token** - A Cloudflare API token with `Account.Workers Scripts: Edit` and `Zone.Workers Routes: Edit` permissions.

---

## 🛠️ Deployment Instructions

### 1. Initialize Project
Navigate to the workers directory and install dependencies:
```bash
cd workers
npm install
```

### 2. Configure Environment
Set your Cloudflare credentials as environment variables or in a `.env` file (not committed):
```bash
export CLOUDFLARE_API_TOKEN="your-token"
export CLOUDFLARE_ACCOUNT_ID="your-account-id"
```

### 3. Deploy to Production
Deploy the worker to Cloudflare using Wrangler:
```bash
npm run deploy
```

---

## 🏗️ Deployment Architectures

### Option A: Cloudflare Worker (Recommended)
The worker is deployed as a standalone script that listens on the patterns defined in `wrangler.toml`. This is the most robust method for API handlers.

### Option B: Cloudflare Pages Functions
If you are hosting the main site on Cloudflare Pages, you can move `src/index.js` to a `functions/` directory in the project root. Pages will automatically deploy it as a Function.

---

## 🔍 Troubleshooting API Error 7003

The error `Could not route to /client/v4/accounts/***/workers/services/kbf-submissions-worker, perhaps your object identifier is invalid? [code: 7003]` is usually caused by one of the following:

1. **Incorrect Account ID (31-char truncation):**
   Verify your Account ID in the Cloudflare Dashboard (found in the Workers & Pages overview sidebar). Ensure `CLOUDFLARE_ACCOUNT_ID` is exactly **32 characters long**.

   *Note: A common error is a 31-character ID, which usually happens if the first or last character is missed during copying. Cloudflare IDs are always 32-character hexadecimal strings.*

2. **Invalid API Token:**
   The token must have permission to edit Workers. Test your token with:
   ```bash
   curl -X GET "https://api.cloudflare.com/client/v4/user/tokens/verify" \
        -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN"
   ```

3. **Wrong API Token Type:**
   Ensure you are using an **API Token**, not a Global API Key. Tokens are safer and more specific.

4. **Wrangler Version Mismatch:**
   Ensure you are using the local wrangler version provided in `package.json`:
   ```bash
   npx wrangler --version
   ```

---

## 🧪 Local Development

Run the worker locally for testing:
```bash
npm run dev
```

Test an endpoint using curl:
```bash
curl -X POST http://localhost:8787/api/newsletter \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'
```

---

## 📝 Technical Notes
- **CORS:** Allowed origins are restricted to `KBF_WEBSITE` (default: `https://new.kougabusinessforum.com`).
- **Rate Limiting:** Default is 20 requests per minute per IP.
- **Routes:** Handled via the `api/*` wildcard in `wrangler.toml`.
