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
  // Capture price and description
  const productDetails = await page.evaluate(() => {
    const price = document.querySelectorAll('.a-price-whole')[4]?.textContent?.trim();
    const description = document.querySelectorAll('a-size-base-plus a-spacing-none a-color-base a-text-normal')[4]?.textContent?.trim();
    const name= document.querySelectorAll('a-size-base-plus a-color-base')[4]?.textContent?.trim();
    return `Price: ₹${price}, Description: ${description}, Name:${name}`;
  });

  // Print product details
  console.log(productDetails);
  
});


