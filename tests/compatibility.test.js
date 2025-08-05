const playwright = require('playwright');
const config = require('./playwright.config');

async function runCompatibilityTests() {
  // Test different browsers
  for (const browserType of ['chromium', 'firefox', 'webkit']) {
    console.log(`Testing in ${browserType}...`);
    const browser = await playwright[browserType].launch();
    const context = await browser.newContext();
    const page = await context.newPage();

    try {
      // Test core functionality
      await testCoreFunctionality(page);
      
      // Test responsive design
      await testResponsiveDesign(page);
      
      // Test performance
      await testPerformance(page);

      console.log(`✅ ${browserType} tests passed`);
    } catch (error) {
      console.error(`❌ ${browserType} tests failed:`, error);
    } finally {
      await browser.close();
    }
  }
}

async function testCoreFunctionality(page) {
  // Load the application
  await page.goto('http://localhost:3000');
  
  // Test canvas initialization
  await page.waitForSelector('canvas');
  
  // Test text addition
  await page.click('text=Add Text');
  await page.waitForTimeout(500);
  
  // Test shape addition
  await page.click('text=Add Shape');
  await page.waitForTimeout(500);
  
  // Test export functionality
  await page.click('text=Export');
  await page.waitForTimeout(500);
}

async function testResponsiveDesign(page) {
  // Test mobile viewport
  await page.setViewportSize({ width: 375, height: 667 });
  await page.waitForTimeout(1000);
  
  // Test tablet viewport
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.waitForTimeout(1000);
  
  // Test desktop viewport
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.waitForTimeout(1000);
}

async function testPerformance(page) {
  // Test load time
  const loadStart = Date.now();
  await page.goto('http://localhost:3000');
  const loadTime = Date.now() - loadStart;
  console.log(`Page load time: ${loadTime}ms`);
  
  // Test canvas operations
  const operationStart = Date.now();
  await page.click('text=Add Text');
  await page.waitForTimeout(500);
  const operationTime = Date.now() - operationStart;
  console.log(`Canvas operation time: ${operationTime}ms`);
}

// Run tests
runCompatibilityTests().catch(console.error);
