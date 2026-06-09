const { test, expect } = require('@playwright/test');
const path = require('path');

test.describe('Membership Flow Verification', () => {
  test.beforeEach(async ({ page }) => {
    // Serve the local membership.html file
    const filePath = 'file://' + path.resolve('membership.html');
    await page.goto(filePath);
    // Set a large viewport
    await page.setViewportSize({ width: 1280, height: 800 });
  });

  test('Next: Select Your Plan button exists and is styled correctly', async ({ page }) => {
    const proceedBtn = page.locator('#btn-proceed-to-plans');
    await expect(proceedBtn).toBeVisible();
    await expect(proceedBtn).toContainText('Next: Select Your Plan');
    await expect(proceedBtn).toHaveClass(/btn-primary/);
    await expect(proceedBtn).toHaveClass(/btn-lg/);
  });

  test('Form validation prevents scrolling when invalid', async ({ page }) => {
    const proceedBtn = page.locator('#btn-proceed-to-plans');
    await proceedBtn.scrollIntoViewIfNeeded();

    // Give time for scroll to settle
    await page.waitForTimeout(500);
    const initialScrollY = await page.evaluate(() => window.scrollY);

    await proceedBtn.click();

    // Wait a bit to see if any scroll happens
    await page.waitForTimeout(500);
    const finalScrollY = await page.evaluate(() => window.scrollY);

    // It should not have scrolled further down significantly
    // Native validation might scroll slightly to the first invalid field, but not to Step 2
    expect(finalScrollY).toBeLessThan(2000); // Step 2 is further down

    const step2Heading = page.locator('h2:has-text("Step 2: Choose Your Plan")');
    const step2Box = await step2Heading.boundingBox();
    // Step 2 heading should be below the current scroll position + viewport
    if (step2Box) {
        expect(step2Box.y).toBeGreaterThan(0); // If it's 0 or negative, it's above or at top of viewport
    }
  });

  test('Form validation allows scrolling when valid', async ({ page }) => {
    // Fill in required fields
    await page.fill('#reg-business-name', 'Test Business');
    await page.fill('#reg-first-name', 'John');
    await page.fill('#reg-last-name', 'Doe');
    await page.fill('#reg-email', 'john@example.com');
    await page.fill('#reg-phone', '0123456789');

    const proceedBtn = page.locator('#btn-proceed-to-plans');
    await proceedBtn.click();

    // Wait for smooth scroll to complete
    await page.waitForTimeout(2000);

    // Check if Step 2 is now in viewport
    const step2Heading = page.locator('h2:has-text("Step 2: Choose Your Plan")');
    await expect(step2Heading).toBeInViewport();
  });
});
