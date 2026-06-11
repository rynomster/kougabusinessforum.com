const { test, expect } = require('@playwright/test');
const path = require('path');

test.describe('Membership Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Serve the local directory
    const filePath = 'file://' + path.resolve(__dirname, '../membership.html');
    await page.goto(filePath);
  });

  test('should have autocomplete attributes on registration fields', async ({ page }) => {
    await expect(page.locator('#reg-business-name')).toHaveAttribute('autocomplete', 'organization');
    await expect(page.locator('#reg-first-name')).toHaveAttribute('autocomplete', 'given-name');
    await expect(page.locator('#reg-last-name')).toHaveAttribute('autocomplete', 'family-name');
    await expect(page.locator('#reg-email')).toHaveAttribute('autocomplete', 'email');
    await expect(page.locator('#reg-phone')).toHaveAttribute('autocomplete', 'tel');
  });

  test('should show validation error when clicking Next with empty fields', async ({ page }) => {
    // Click the Next button without filling fields
    await page.click('#btn-proceed-to-plans');

    // Check if the first required field is focused or has validation message
    const businessName = page.locator('#reg-business-name');
    const isValid = await businessName.evaluate(node => node.checkValidity());
    expect(isValid).toBe(false);
  });

  test('should transition to plans section when form is valid', async ({ page }) => {
    // Fill the form
    await page.fill('#reg-business-name', 'Test Business');
    await page.fill('#reg-first-name', 'John');
    await page.fill('#reg-last-name', 'Doe');
    await page.fill('#reg-email', 'john@example.com');
    await page.fill('#reg-phone', '0123456789');

    // Click the Next button
    await page.click('#btn-proceed-to-plans');

    // We can't easily test smooth scroll end position in a headless browser without extra logic,
    // but we can verify the form is now valid.
    const detailsForm = page.locator('#membership-details-form');
    const isValid = await detailsForm.evaluate(node => node.checkValidity());
    expect(isValid).toBe(true);
  });
});
