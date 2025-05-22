import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('https://www.amazon.in/');

  // Search for "kurthi sets"
  await page.fill('//input[@type="text"]', 'kurthi sets');
  await page.waitForSelector('//div[@id="sac-suggestion-row-1"]');
  await page.click('//div[@id="sac-suggestion-row-1"]');
  //await page.click('input[type="submit"]');
  // Wait for search results to load
  await page.waitForSelector('.s-main-slot');

  const products = await page.evaluate(() => {
    // Define an array to store product details
    const productDetails: { name: string; description: string; price: string }[] = [];
    
    // Select all product elements
    const productElements = document.querySelectorAll('.s-main-slot .s-result-item[3]');
  
    // Loop through the first 3 product elements
    for (let i = 0; i < Math.min(3, productElements.length); i++) {
      const item = productElements[i];
      if (item) {
        // Extract name
        const nameElement = item.querySelector('h2 span[4]');
        const name = nameElement?.textContent?.trim() || 'No name';
  
        // Extract description
        const descriptionElement = item.querySelector('h2 span');
        const description = descriptionElement?.textContent?.trim() || 'No description';
  
        // Extract price
        const priceElement = item.querySelector('.a-price .a-offscreen');
        const price = priceElement?.textContent?.trim() || 'No price';
  
        // Add product details to the array
        productDetails.push({ name, description, price });
      }
    }
  
    // Return the product details
    return productDetails;
  });
  
  console.log('Top 3 Products:', products);
});  