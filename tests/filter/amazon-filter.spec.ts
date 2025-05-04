import { test, expect } from "@playwright/test";
import assert, { AssertionError } from "assert";

test.use({ headless: false });

test("Navigate to Amazon and filter Samsung mobiles", async ({ page }) => {
  // Open Amazon homepage
  await page.goto("https://www.amazon.in");

  // Click on "Mobiles" in the navigation bar
  await page.click('a[href*="/mobile-phones"]');

  // Scroll to the "Samsung" brand filter to ensure it is visible
  await page.locator('span.a-size-base.a-color-base:has-text("Samsung")').scrollIntoViewIfNeeded();

  // Click on the "Samsung" brand checkbox in the filters
  await page.click('span.a-size-base.a-color-base:has-text("Apple")');

  // Wait for the filtered results to load
  await page.waitForSelector('div.s-main-slot div[data-component-type="s-search-result"]');

  // Retrieve product titles
  const productTitles = await page.locator('div.s-main-slot div[data-component-type="s-search-result"] h2 span').allTextContents();
  // Check if all product titles contain "Samsung"

  for (const title of productTitles) {
    try {
      assert(
        title.toLowerCase().includes('samsung'),
        new AssertionError({
          message: `Product title does not contain "Samsung".`,
          expected: 'samsung',
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
  
  console.log('Assertion passed: All product titles contain "Samsung".');
})  
