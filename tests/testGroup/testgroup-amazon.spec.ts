import test, { Page } from '@playwright/test';
import testData from '../../fixtures/testData.json'; 
import { AmazonProducts } from '../../page-classes/amazonproducts';
import { MasterDataValue, parseSlaveData } from '../../utils/fileUtils';

const executionType = process.env.Execution || 'Regression';
const masterData: MasterDataValue = testData;
const amazonproducts = masterData.data?.['searchproducts'] || [];

test.describe('Amazon website products - Execution Type: ' + executionType, () => {
  amazonproducts.forEach(testCaseId => {
    test(`Search Amazon products for: ${testCaseId}`, async ({ page }) => {
      const searchObj = new AmazonProducts(page);
      const testData = await parseSlaveData(searchObj.filePath, [testCaseId]);
      
      if (testData.length === 0) {
        console.log(`No matching test data found for test case: ${testCaseId}`);
        return;
      }

      console.log(`Executing test case: ${testCaseId}`);
      await searchObj.runTestCases();
    });
  });
});
