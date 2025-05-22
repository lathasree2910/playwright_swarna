import * as fs from 'fs';
import csv from 'csv-parser'; // Correct default import for csv-parser

export interface TestCase {
  testCaseId: string;
  keyword: string;
  productCount: number;

}

// Function to read test cases from a CSV file

export async function readTestCasesFromCSV(filePath: string): Promise<TestCase[]> {
  const testCases: TestCase[] = [];
  return new Promise((resolve, reject) => {

    fs.createReadStream(filePath)
      .pipe(csv()) // Correct usage of csv-parser
      .on('data', (row) => {
        testCases.push({
          testCaseId: row.testCaseId,
          keyword: row.keyword,
          productCount: parseInt(row.productCount, 10),
        });

      })

      .on('end', () => resolve(testCases))
      .on('error', (error) => reject(error));
  });

}