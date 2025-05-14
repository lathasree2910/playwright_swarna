import { test } from '@playwright/test';

// Static locators for repeated elements
const locators = {
  searchInput: 'input[name="field-keywords"]',
  searchResults: '.s-main-slot .s-result-item[data-component-type="s-search-result"]',
  productTitle: 'h2 span.a-size-base-plus',
  productDescription: 'h2.a-text-normal span',
  productPrice: 'span.a-price-whole',
};

// Static search queries with expected product count
const searchQueries = [
  { keyword: 'kurthi sets', productCount: 3 },
  { keyword: 'shoes', productCount: 5 },
];

test.use({ headless: false });

// BeforeEach Hook - run before each test case
test.beforeEach(async ({ page }) => {
  console.log('Launching Amazon India...');
  await page.goto('https://www.amazon.in');
});

// AfterEach Hook - clenup after each test case
test.afterEach(() => {
  console.log('Test Execution Completed Successfully!');
});

// Function to search for a product
async function searchProduct(page, searchQuery: string) {
  await page.fill(locators.searchInput, searchQuery);
  await page.press(locators.searchInput, 'Enter');
  await page.waitForSelector(locators.searchResults);
}

// Function to extract product details
async function extractProductDetails(page, count: number) {
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

// Test Execution Loop for Multiple Searches
searchQueries.forEach(({ keyword, productCount }) => {
  test(`Extract product details for first ${productCount} products on Amazon - ${keyword}`, async ({ page }) => {
    await searchProduct(page, keyword);
    const productDetails = await extractProductDetails(page, productCount);
    console.log(`First ${productCount} Products for '${keyword}':`, productDetails);
  });
});
