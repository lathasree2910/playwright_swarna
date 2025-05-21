import { test } from '@playwright/test';
import { readTestCasesFromCSV, TestCase } from '../../utils/fileUtils';
import { extractProductDetails, searchProduct } from '../../page-classes/searchamazonproduts';

// Test Execution

test('Extract product details from CSV file', async ({ page }) => {
  
  // Read test cases from CSV

  const allTestCases: TestCase[] = await readTestCasesFromCSV('./testdata.csv');

  // GET TEST_CASE_ID from environment variable

  const testCaseId = process.env.TEST_CASE_ID;
  //console.log ( 'TEST_CASE_ID:', testCaseId);


  // Filter test cases based on TEST_CASE_ID

  const testCases = testCaseId === 'all'
    ? allTestCases
    : allTestCases.filter((testCase) => testCase.testCaseId === testCaseId);
  //console.log('filtered testCases:', testCases);
  
  // Check if there are any test cases to run
  
  if (testCases.length === 0) {
    console.log(`No test cases found for TEST_CASE_ID: ${testCaseId}`);
    return;
  }

  // Loop through each test case

  for (const { testCaseId, keyword, productCount } of testCases) {
    console.log(`Running test case: ${testCaseId}`);
    console.log(`Searching for: ${keyword}`);
    await page.goto('https://www.amazon.in');
    await searchProduct(page, keyword);
    const productDetails = await extractProductDetails(page, productCount);
    console.log(`First ${productCount} Products for "${keyword}":`, productDetails);
  }

});