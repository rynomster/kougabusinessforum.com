const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  const files = ['index.html', 'directory.html', 'about.html'];

  for (const file of files) {
    const url = `file://${path.resolve(file)}`;
    await page.goto(url);

    // Check for Contact link and absence of Membership link in nav
    const navText = await page.textContent('.nav');
    if (!navText.includes('Contact')) {
      console.error(`Error: 'Contact' link missing in ${file}`);
      process.exit(1);
    }
    // "Membership" might still be in the "Join Now" button text if we aren't careful,
    // but the task said "get rid of the 'Membership' button, as its duplicated in Join now".
    // Let's check for the standalone "Membership" link.
    const standaloneMembership = await page.$('nav.nav a[href="membership.html"]:not(.btn)');
    if (standaloneMembership) {
      console.error(`Error: Standalone 'Membership' link still exists in ${file}`);
      process.exit(1);
    }

    const joinNow = await page.$('nav.nav a.btn-primary[href="membership.html"]');
    if (!joinNow) {
      console.error(`Error: 'Join Now' button missing or wrong href in ${file}`);
      process.exit(1);
    }
  }

  console.log('Verification successful: Header cleaned up and navigation updated.');
  await browser.close();
})();
