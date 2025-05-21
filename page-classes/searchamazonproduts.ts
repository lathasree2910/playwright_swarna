import { Page } from '@playwright/test';

// Static locators for repeated elements

const locators = {
  searchInput: 'input[name="field-keywords"]',
  searchResults: '.s-main-slot .s-result-item[data-component-type="s-search-result"]',
  productTitle: 'h2 span.a-size-base-plus',
  productDescription: 'h2.a-text-normal span',
  productPrice: 'span.a-price-whole',
};

// Function to search for a product
export async function searchProduct(page: Page, searchQuery: string) {
  await page.fill(locators.searchInput, searchQuery);
  await page.press(locators.searchInput, 'Enter');
  await page.waitForSelector(locators.searchResults);

}

// Function to extract product details

export async function extractProductDetails(page: Page, count: number) {
  const productCards = page.locator(locators.searchResults);
  const productDetails: { name: string; description: string; price: string }[] = [];

  for (let i = 0; i < count; i++) {
    const product = productCards.nth(i);
    const name = await product.locator(locators.productTitle).textContent().catch(() => 'N/A');
    const description = await product.locator(locators.productDescription).textContent().catch(() => 'N/A');
    const price = await product.locator(locators.productPrice).textContent().catch(() => 'N/A');
    productDetails.push({
      name: name?.trim() || 'N/A',
      description: description?.trim() || 'N/A',
      price: price?.trim() || 'N/A',
    });

  }

  return productDetails;

}