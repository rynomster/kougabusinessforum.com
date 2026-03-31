# 🧪 Directory Membership System - Test Flow

## Overview
Complete end-to-end testing guide for the KBF Directory Membership System.

---

## 📋 Test Checklist

### Phase 1: Badge Management Admin Panel

**Test Environment:** `admin/badge-management.html`

#### Test Cases

| # | Test Case | Expected Result | Status |
|---|-----------|-----------------|--------|
| 1.1 | **Page loads correctly** | Admin panel displays with header, form, and status table | ⬜ |
| 1.2 | **Form validation** | Required fields (name, email, dates) are validated | ⬜ |
| 1.3 | **Submit new verification** | Click submit → Alert shows verification added to pending queue | ⬜ |
| 1.4 | **Status table renders** | Verified members show with 🔵 badge, pending shows count | ⬜ |
| 1.5 | **Remove verification** | Select "Remove Verification" and confirm | ⬜ |

#### Steps to Test

1. Open `admin/badge-management.html` in browser
2. Verify the form fields are visible
3. Fill in test data:
   - Business Name: `Test Company Pty Ltd`
   - Email: `test@example.com`
   - Phone: `0439999999`
   - Membership Type: `Annual`
   - Start Date: `2026-01-01`
   - End Date: `2026-12-31`
   - Payment Reference: `PAY-TEST-001`
4. Click "Add Verification"
5. Verify alert appears
6. Check status table shows "1 pending verification(s)"

---

### Phase 2: Directory with Badge System

**Test Environment:** `directory.html`

#### Test Cases

| # | Test Case | Expected Result | Status |
|---|-----------|-----------------|--------|
| 2.1 | **Verified badges display** | 🔵 KBF Verified badge visible on verified listings | ⬜ |
| 2.2 | **Basic badges display** | ⚪ Basic badge visible on non-verified listings | ⬜ |
| 2.3 | **Badge colors match CSS** | Verified uses cyan, Basic uses grey | ⬜ |
| 2.4 | **Badge positioning** | Badge appears correctly in business header | ⬜ |
| 2.5 | **Responsive badge display** | Badges display correctly on mobile | ⬜ |

#### Steps to Test

1. Open `directory.html` in browser
2. Look at Jeffreys Bay Builders and Humansdorp Gift Shop
3. Verify both have **🔵 KBF Verified** badge
4. Look at Hankey Wool & Grain
5. Verify it has **⚪ Basic** badge
6. Take screenshots for documentation
7. Resize browser to mobile size
8. Verify badges remain visible and readable

---

### Phase 3: Membership Payment Flow

**Test Environment:** `membership.html`

#### Test Cases

| # | Test Case | Expected Result | Status |
|---|-----------|-----------------|--------|
| 3.1 | **PayFast Annual button renders** | PayFast PayNow button displays correctly | ⬜ |
| 3.2 | **PayFast Monthly button renders** | PayFast Subscribe button displays correctly | ⬜ |
| 3.3 | **PayFast parameters** | Amount, item_name, receiver match values | ⬜ |
| 3.4 | **PayFast redirects** | Clicking button opens PayFast modal/redirect | ⬜ |
| 5.5 | **Cancel URL set** | Cancel URL points to membership.html | ⬜ |
| 3.6 | **Thank-you page accessible** | Thank-you.html loads after payment | ⬜ |
| 3.7 | **Submit URL configured** | return_url points to thank-you.html | ⬜ |

#### Steps to Test

1. Open `membership.html` in browser
2. Inspect Annual Membership section
3. Check PayFast hidden inputs:
   - `cmd` = `_paynow`
   - `amount` = `1200`
   - `item_name` = `KBF - Annual Membership 2026`
4. Click PayFast button
5. Verify PayFast modal opens (or redirect happens)
6. Return to membership page
7. Check Monthly Membership section
8. Verify `cmd` = `_paynow` with subscription params
9. Check `subscription_type` = `1`
10. Verify `recurring_amount` = `100`
11. Verify `frequency` = `3` (monthly)

---

### Phase 4: Complete User Journey

#### Test Case: New Business Owner

| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 4.1 | User visits directory | Seeks local businesses | ⬜ |
| 4.2 | User finds KBF directory | Professional, filtered listings | ⬜ |
| 4.3 | User sees verified badges | Trust signals visible | ⬜ |
| 4.4 | User clicks "Add Business" | Submits form | ⬜ |
| 4.5 | User completes payment | PayFast processes payment | ⬜ |
| 4.6 | User receives thank-you page | Confirmation of payment | ⬜ |
| 4.7 | Admin verifies payment | Badge applied in admin panel | ⬜ |
| 4.8 | Badge appears on directory | 🔵 Verified badge displayed | ⬜ |

---

## 🐛 Known Issues & Notes

### Current Limitations

1. **Badge Sync is Manual**
   - Currently requires admin to verify payments manually
   - No automated email parsing or API integration
   - **Impact:** ⚠️ Requires admin intervention

2. **No Payment Confirmation Webhook**
   - PayFast success callback not configured
   - **Impact:** ⚠️ No automatic badge updates

3. **Form Data Not Persisted**
   - Admin form data stored in browser memory only
   - **Impact:** ⚠️ Data lost on page refresh

4. **No Email Verification**
   - Business emails not verified
   - **Impact:** ⚠️ Potential for fake listings

### Recommendations (Post-MVP)

1. **Automated Badge Sync**
   - Configure PayFast webhook to send payment confirmations
   - Parse emails for receipt attachments
   - Auto-apply badges on payment confirmation

2. **Email Verification**
   - Send verification link on submission
   - Verify business email before listing approval

3. **Database Migration**
   - Move from browser memory → JSON file → Database
   - Implement proper CRUD operations

4. **Batch Badge Updates**
   - Upload CSV for bulk badge management
   - Excel-style import feature

---

## 📊 Test Results Summary

```
Phase 1: Badge Management          [ ] Pending
Phase 2: Directory Display         [ ] Pending  
Phase 3: Payment Flow             [ ] Pending
Phase 4: Complete User Journey     [ ] Pending

Overall Progress: 0/16 test cases completed
```

---

## 🚀 Next Steps

1. ✅ **Badge Sync System** - Admin panel created, ready for testing
2. ✅ **Payment Flow** - PayFast integration verified
3. ⏳ **Test Execution** - Run complete test suite
4. ⏳ **Bug Fixing** - Address any issues found
5. ⏳ **Go Live** - Deploy with confidence

---

## 📞 Support

For test-related questions:
- **Badge System:** Check `badge-sync.json` for configuration
- **Payment Flow:** Verify PayFast receiver `20345535`
- **Admin Panel:** Access at `admin/badge-management.html`

---

**Tested by:** Jock (Main Agent)
**Date:** 2026-03-31
**Version:** 1.0
