# 🗃️ Directory Management Guide

## 📂 File Structure
- **Data Store:** `directory.json`
- **Frontend:** `directory.html` (fetches the JSON)
- **Logic:** `js/main.js` (or inline script in directory.html)

## 🛠️ How to Add/Update Listings
1. Open `directory.json`.
2. Add a new object to the `listings` array:
   ```json
   {
     "id": 501,
     "name": "Example Business",
     "category": "retail",
     "location": "jeffreys-bay",
     "description": "Short 1-2 sentence description.",
     "contact": "0421234567",
     "email": "contact@example.com",
     "icon": "🛍️",
     "verified": true,
     "membership_year": 2026
   }
   ```
3. Save and push to GitHub.

## 🔵 Badge Logic
- `"verified": true` → Displays **🔵 KBF Verified** badge.
- `"verified": false` → Displays **⚪ Basic** badge.

## 📈 Scalability (JSON vs DB)
- **Current Size (2 entries):** ~0.8 KB
- **Estimated Size (500 entries):** ~250 KB to 400 KB.
- **Performance:** For 500 businesses, JSON is **extremely fast**. Most modern browsers can parse a 1MB JSON file in milliseconds.
- **Verdict:** We don't need a database yet. JSON is perfect for this scale and keeps hosting free on GitHub Pages.
