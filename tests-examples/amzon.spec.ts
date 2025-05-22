import { test, expect } from '@playwright/test';
//import { console } from 'inspector';

test('Pull Text - Approch - 1', async ({ page }) => {
  await page.goto('https://www.amazon.in/');

  // Search With Product Name
  await page.locator('#nav-search').getByPlaceholder('Search Amazon.in').click()
  await page.locator('#nav-search').getByPlaceholder('Search Amazon.in').fill('kurti for woman')

  // Click on First Result
  await page.locator('.autocomplete-results-container #sac-suggestion-row-1').click()

  const searchResults = await page.locator('[data-component-type="s-search-result"]')

  // Loop for getting first three data
  for(let i = 0; i < 3; i++){
    const productTitle = await searchResults.nth(i).locator('[data-cy="title-recipe"]').getByRole('heading').first().textContent()
    const productDescription = await searchResults.nth(i).locator('[data-cy="title-recipe"]').getByRole('heading').nth(1).textContent()
    const productPrice = await searchResults.nth(i).locator('[data-cy="price-recipe"] [aria-describedby="price-link"] .a-price-whole').textContent()

    console.log('Item Name: ' + productTitle + ';' + 'Item Description: ' + productDescription + ';' + 'Item Price: ' + productPrice)

  }
});
