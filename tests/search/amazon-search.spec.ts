import { test } from '@playwright/test';
import { SearchAmazonProducts } from '../../page-classes/searchamazonproduts';

test('Extract product details from CSV file', async ({ page }) => {
  const amazonSearch = new SearchAmazonProducts(page);
  await amazonSearch.runTestCases();
});
