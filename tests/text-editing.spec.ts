import { test, expect } from '@playwright/test';

test.describe('Logo Editor Text Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
    // Wait for canvas to be ready
    await page.waitForSelector('canvas');
  });

  test('can add text to canvas', async ({ page }) => {
    // Click the text tab
    await page.click('button[role="tab"]:has-text("Text")');
    
    // Click add text button
    await page.click('button:has-text("Add Text")');
    
    // Verify text controls appear
    await expect(page.locator('text=Text Properties')).toBeVisible();
    
    // Verify text appears on canvas
    const canvasObjects = await page.evaluate(() => {
      // @ts-ignore - canvas is available in the page context
      return window.canvas.getObjects().length;
    });
    expect(canvasObjects).toBeGreaterThan(0);
  });

  test('can edit text properties', async ({ page }) => {
    // Add text first
    await page.click('button[role="tab"]:has-text("Text")');
    await page.click('button:has-text("Add Text")');
    
    // Test font size change
    await page.fill('input[type="range"][aria-label="Font Size"]', '48');
    
    // Test font weight change
    await page.selectOption('select[aria-label="Font Weight"]', 'bold');
    
    // Test color change
    await page.fill('input[type="color"]', '#ff0000');
    
    // Verify changes were applied
    const textProperties = await page.evaluate(() => {
      // @ts-ignore - canvas is available in the page context
      const textObject = window.canvas.getObjects()[0];
      return {
        fontSize: textObject.fontSize,
        fontWeight: textObject.fontWeight,
        fill: textObject.fill
      };
    });
    
    expect(textProperties).toEqual({
      fontSize: 48,
      fontWeight: 'bold',
      fill: '#ff0000'
    });
  });

  test('can delete text', async ({ page }) => {
    // Add text
    await page.click('button[role="tab"]:has-text("Text")');
    await page.click('button:has-text("Add Text")');
    
    // Select text object
    await page.click('canvas');
    
    // Delete text
    await page.keyboard.press('Delete');
    
    // Verify text was removed
    const canvasObjects = await page.evaluate(() => {
      // @ts-ignore - canvas is available in the page context
      return window.canvas.getObjects().length;
    });
    expect(canvasObjects).toBe(0);
  });

  test('supports multiple text objects', async ({ page }) => {
    // Add first text
    await page.click('button[role="tab"]:has-text("Text")');
    await page.click('button:has-text("Add Text")');
    
    // Add second text
    await page.click('button:has-text("Add Text")');
    
    // Verify both texts exist
    const canvasObjects = await page.evaluate(() => {
      // @ts-ignore - canvas is available in the page context
      return window.canvas.getObjects().length;
    });
    expect(canvasObjects).toBe(2);
  });
});
