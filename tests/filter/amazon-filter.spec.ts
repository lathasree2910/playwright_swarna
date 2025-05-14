import { test, expect } from "@playwright/test";
import dotenv from "dotenv";
import assert, { AssertionError } from "assert";

dotenv.config();

// Retrieve locators and search keywords from environment variables
const locators = {
  searchInput: process.env.SEARCH_INPUT || 'input[name="field-keywords"]',
  searchResults: process.env.SEARCH_RESULTS || 'div.s-main-slot div[data-component-type="s-search-result"]',
  brandFilter: process.env.BRAND_FILTER || 'span.a-size-base.a-color-base:has-text',
  productTitle: process.env.PRODUCT_TITLE || 'h2 span.a-size-base-plus',
  productDescription: process.env.PRODUCT_DESCRIPTION || 'h2.a-text-normal span',
  productPrice: process.env.PRODUCT_PRICE || 'span.a-price-whole',
};

// Retrieve dynamic search keywords from environment variables
const searchKeyword = process.env.SEARCH_KEYWORD || "Samsung"; // Default to "Samsung" if not provided

test.use({ headless: false });

// BeforeEach Hook - Setup before each test case
test.beforeEach(async ({ page }) => {
  console.log("Launching Amazon India...");
  await page.goto("https://www.amazon.in");
});

// AfterEach Hook - Cleanup after each test case
test.afterEach(() => {
  console.log("Test Execution Completed Successfully!");
});

test(`Navigate to Amazon and filter ${searchKeyword} mobiles`, async ({ page }) => {
  // Click on "Mobiles" in the navigation bar
  await page.click('a[href*="/mobile-phones"]');

  // Scroll to the brand filter to ensure it is visible
  await page.locator(`${locators.brandFilter}("${searchKeyword}")`).scrollIntoViewIfNeeded();

  // Click on the brand filter checkbox
  await page.click(`${locators.brandFilter}("${searchKeyword}")`);

  // Wait for the filtered results to load
  await page.waitForSelector(locators.searchResults);

  // Retrieve product titles
  const productTitles = await page.locator(locators.productTitle).allTextContents();

  // Assertion: Verify all product titles contain the search keyword
  for (const title of productTitles) {
    try {
      assert(
        title.toLowerCase().includes(searchKeyword.toLowerCase()),
        new AssertionError({
          message: `Product title does not contain "${searchKeyword}".`,
          expected: searchKeyword.toLowerCase(),
          actual: title.toLowerCase(),
        })
      );
    } catch (error) {
      if (error instanceof AssertionError) {
        console.error("Assertion failed:", error.message);
        console.error("Expected:", error.expected);
        console.error("Actual:", error.actual);
        throw error; // Re-throw the error to fail the test
      }
    }
  }

  console.log(`Assertion passed: All product titles contain "${searchKeyword}".`);
});
