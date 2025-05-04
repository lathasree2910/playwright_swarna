import { test } from '@playwright/test';

test.use({ headless: false });

test('Extract product details for first 3 products on Amazon', async ({ page }) => {
  await page.goto('https://www.amazon.in');

  // Search for "kurthi sets"
  await page.fill('input[name="field-keywords"]', 'kurthi sets');
  await page.press('input[name="field-keywords"]', 'Enter');

  // Wait for search results to load
  await page.waitForSelector('.s-main-slot .s-result-item[data-component-type="s-search-result"]');

  const productCards = page.locator('.s-main-slot .s-result-item[data-component-type="s-search-result"]');
  const productDetails: { name: string; description: string; price: string }[] = [];

  // Extract details for the first 3 products
  for (let i = 0; i < 3; i++) {
    const product = productCards.nth(i);
    const name = await product.locator('h2 span.a-size-base-plus').textContent().catch(() => 'N/A');
    const description = await product.locator('h2.a-text-normal span').textContent().catch(() => 'N/A');
    const price = await product.locator('span.a-price-whole').textContent().catch(() => 'N/A');

    productDetails.push({
      name: name?.trim() || 'N/A',
      description: description?.trim() || 'N/A',
      price: price?.trim() || 'N/A',
    });
  }

  console.log('First 3 Products:', productDetails);
});

test('Extract product details for first 5 products on Amazon (shoes)', async ({ page }) => {
  await page.goto('https://www.amazon.in');

  // Search for "shoes"
  await page.fill('input[name="field-keywords"]', 'shoes');
  await page.press('input[name="field-keywords"]', 'Enter');

  // Wait for search results to load
  await page.waitForSelector('.s-main-slot .s-result-item[data-component-type="s-search-result"]');

  const productCards = page.locator('.s-main-slot .s-result-item[data-component-type="s-search-result"]');
  const productDetails: { name: string; description: string; price: string }[] = [];

  // Extract details for the first 5 products
  for (let i = 0; i < 5; i++) {
    const product = productCards.nth(i);
    const name = await product.locator('h2 span.a-size-base-plus').textContent().catch(() => 'N/A');
    const description = await product.locator('h2.a-text-normal span').textContent().catch(() => 'N/A');
    const price = await product.locator('span.a-price-whole').textContent().catch(() => 'N/A');

    productDetails.push({
      name: name?.trim() || 'N/A',
      description: description?.trim() || 'N/A',
      price: price?.trim() || 'N/A',
    });
  }

  console.log('First 5 Products:', productDetails);
});
