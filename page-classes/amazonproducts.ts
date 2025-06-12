import { Page } from '@playwright/test';
import { readTestCasesFromCSV, TestCase } from '../utils/fileUtils';
import { parseMasterData } from '../utils/fileUtils';

const locators = {
  searchInput: 'input[name="field-keywords"]',
  searchResults: '.s-main-slot .s-result-item[data-component-type="s-search-result"]',
  productTitle: 'h2 span.a-size-base-plus',
  productDescription: 'h2.a-text-normal span',
  productPrice: 'span.a-price-whole',
};

export class AmazonProducts {
  readonly page: Page;
  readonly filePath: string;

  constructor(page: Page) {
    this.page = page;
    this.filePath = './test-data/search-amazon-products.csv';
  }

  async beforeEach() {
    console.log('Launching Amazon India...');
    await this.page.goto('https://www.amazon.in');
  }

  async afterEach() {
    console.log('Test Execution Completed Successfully!');
  }

  async searchProduct(searchQuery: string) {
    await this.page.fill(locators.searchInput, searchQuery);
    await this.page.press(locators.searchInput, 'Enter');
    await this.page.waitForSelector(locators.searchResults);
  }

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

  async runTestCases() {
    console.log('Parsing master data...');
    const masterData = await parseMasterData('./testGroup/amazon-products.csv');
    
    const executionFilter = process.env.Execution || '';
    if (!executionFilter) {
      console.error('Execution environment variable not set!');
      return;
    }

    console.log(`Filtering test cases for execution type: ${executionFilter}`);
    
    if (!masterData['searchproducts']) {
      console.log('No test cases found for execution.');
      return;
    }

    console.log('Reading slave test cases...');
    const slaveTestCases: TestCase[] = await readTestCasesFromCSV('./test-data/search-amazon-products.csv');

    const filteredTestCases = slaveTestCases.filter(tc => masterData['searchproducts'].includes(tc.testCaseId));

    if (filteredTestCases.length === 0) {
      console.log('No matching test cases found.');
      return;
    }

    for (const { testCaseId, keyword, productCount } of filteredTestCases) {
      console.log(`Running test case: ${testCaseId}`);
      await this.beforeEach();
      await this.searchProduct(keyword);
      const productDetails = await this.extractProductDetails(productCount);
      await this.afterEach();

      console.log(`Extracted products for "${keyword}":`, productDetails);
    }
  }
}
