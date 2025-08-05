import { test, expect } from '@playwright/test';

test.describe('Shape Manipulation Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForSelector('canvas');
  });

  test('can add basic shapes', async ({ page }) => {
    // Test rectangle
    await page.click('button:has-text("Rectangle")');
    await expect(page.locator('text=Shape Properties')).toBeVisible();
    
    // Test circle
    await page.click('button:has-text("Circle")');
    
    // Test triangle
    await page.click('button:has-text("Triangle")');
    
    // Verify shapes were added
    const shapeCount = await page.evaluate(() => {
      // @ts-ignore
      return window.canvas.getObjects().length;
    });
    expect(shapeCount).toBe(3);
  });

  test('can modify shape properties', async ({ page }) => {
    // Add a rectangle
    await page.click('button:has-text("Rectangle")');
    
    // Change fill color
    await page.fill('input[type="color"][aria-label="Fill Color"]', '#ff0000');
    
    // Change stroke width
    await page.fill('input[type="range"][aria-label="Stroke Width"]', '5');
    
    // Change opacity
    await page.fill('input[type="range"][aria-label="Opacity"]', '0.5');
    
    // Verify changes
    const properties = await page.evaluate(() => {
      // @ts-ignore
      const shape = window.canvas.getObjects()[0];
      return {
        fill: shape.fill,
        strokeWidth: shape.strokeWidth,
        opacity: shape.opacity
      };
    });
    
    expect(properties).toEqual({
      fill: '#ff0000',
      strokeWidth: 5,
      opacity: 0.5
    });
  });
});
