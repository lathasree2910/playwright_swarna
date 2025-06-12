import { Page } from '@playwright/test';
import { readTestCasesFromCSV, TestCase } from '../utils/fileUtils';

// Static locators for repeated elements
const locators = {
  searchInput: 'input[name="field-keywords"]',
  searchResults: '.s-main-slot .s-result-item[data-component-type="s-search-result"]',
  productTitle: 'h2 span.a-size-base-plus',
  productDescription: 'h2.a-text-normal span',
  productPrice: 'span.a-price-whole',
};

export class SearchAmazonProducts {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async beforeEach() {
    console.log('Launching Amazon India...');
    await this.page.goto('https://www.amazon.in');
  }

  async afterEach() {
    console.log('Test Execution Completed Successfully!');
  }
   // Function to search for a product

  async searchProduct(searchQuery: string) {
    await this.page.fill(locators.searchInput, searchQuery);
    await this.page.press(locators.searchInput, 'Enter');
    await this.page.waitForSelector(locators.searchResults);
  }
  
  // Function to extract product details 

  async extractProductDetails(count: number) {
    const productCards = this.page.locator(locators.searchResults);
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
  // Read test cases from CSV
  // GET TEST_CASE_ID from environment variable

  async runTestCases() {
    const allTestCases: TestCase[] = await readTestCasesFromCSV('./testdata.csv');
    const testCaseId = process.env.TEST_CASE_ID;
    const assertCountFromEnv = process.env.ASSERT_COUNT ? parseInt(process.env.ASSERT_COUNT, 10) : undefined;

    const testCases = testCaseId === 'all'
      ? allTestCases
      : allTestCases.filter((testCase) => testCase.testCaseId === testCaseId);

  // Check if there are any test cases to run

    if (testCases.length === 0) {
      console.log(`No test cases found for TEST_CASE_ID: ${testCaseId}`);
      return;
    }
    // Run loop through each test case

    for (const { testCaseId, keyword, productCount } of testCases) {
      console.log(`Running test case: ${testCaseId}`);
      console.log(`Searching for: ${keyword}`);
      await this.beforeEach();
      await this.searchProduct(keyword);
      const productDetails = await this.extractProductDetails(productCount);
      await this.afterEach();

      // Error handling for assertcount
      if (assertCountFromEnv !== undefined && productDetails.length !== assertCountFromEnv) {
        console.error(`Test Case ${testCaseId} Failed! Expected ${assertCountFromEnv} products but found ${productDetails.length}.`);
        continue; // Skip to next test case
      }

      console.log(`First ${productCount} Products for "${keyword}":`, productDetails);
    }
  }
}