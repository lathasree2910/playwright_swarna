import { test, expect } from '@playwright/test';
import { get } from 'http';

test('has title', async ({ page }) => {
  await page.goto('https://www.amazon.in/');

  // Search for "kurthi sets"
  await page.fill('//input[@type="text"]', 'kurthi sets');
  await page.waitForSelector('//div[@id="sac-suggestion-row-1"]');
  await page.click('//div[@id="sac-suggestion-row-1"]');
  //await page.click('input[type="submit"]');
  // Wait for search results to load
  //await page.waitForSelector('(//a[@data-type="productTitle"])[1]');
  //await page.click('(//a[@data-type="productTitle"])[1]');
  await page.waitForSelector('.s-main-slot');

  // Capture details for the first 3 products
  const products = await page.evaluate(() => {
    const productDetails: { name: string; description: string; price: string }[] = [];
    const productElements = document.querySelectorAll('.s-main-slot .s-result-item'); // Get all product items
    for (let i = 0; i < 3; i++) {
      const item = productElements[i];
      if (item) {
        const name = item.querySelector('h2.a-size-mini span')?.textContent?.trim() || 'No name';
        const description = item.querySelector('h2.a-size-base-plus span')?.textContent?.trim() || 'No description';
        const price = item.querySelector('.a-price .a-offscreen')?.textContent?.trim() || 'No price';

        productDetails.push({name, description, price});
      }
    }
    return productDetails;
  });

  // Print the product details
  console.log('Top 3 Products:', products);
});