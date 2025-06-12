import path from 'path';
import fs from 'fs';
import csv from 'csv-parser';
// Correct default import for csv-parser

export interface TestCase {
  testCaseId: string;
  keyword: string;
  productCount: number;

}
export type DataValue = {
  [key: string]: any;
};

export type MasterDataValue = {
  success?: boolean;
  data?: {
    [key: string]: string[];
  };
};

export type SuiteDataValue = {
  success?: boolean;
  data?: [
    {
      suitePath: string;
      suiteExecution: string;
      suiteGroup: string;
      suiteName: string;
      suiteOwner: string;
      suiteBU: string;
    }
  ];
  testSuitePath?: string;
};

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

export async function parseMasterData(filePath: string) {
  const execution = process.env.Execution || '';
  const fileData: Record<string, any>[] = await readTestCasesFromCSV(filePath);
  const filteredData: Record<string, any>[] = fileData.filter(data =>
    execution
      .split(',')
      .map(t => t.trim())
      .includes(data.Execution)
  );
  const masterData: Record<string, any> = {};
  filteredData.forEach(data => {
    if (!masterData[data['testGroup']]) {
      masterData[data['testGroup']] = [];
    }
    masterData[data['testGroup']].push(data['testCase']);
  });
  return masterData;
}

export async function parseSlaveData(filePath: string, caseIds: string[] = []) {
  const fileData: Record<string, any>[] = await readTestCasesFromCSV(filePath);
  let data;
  // below if case is used to filter the rows based on the case ID passed order instead of order in sheet data
  if (caseIds.length > 0) {
    const temp: Record<string, any>[] = [];
    for (const row of caseIds) {
      for (const obj of fileData) {
        if (row == obj.testCase) temp.push(obj);
      }
    }
    data = temp;
  } else {
    data = fileData;
  }
  return data;
  // return caseIds.length > 0 ? fileData.filter(data => caseIds.includes(data.testCase)) : fileData;
}

export async function parseLoginCombination(filePath: string) {
  return await readTestCasesFromCSV(filePath);
}

export const fileExists = (filePath: string) => {
  try {
    return fs.existsSync(path.resolve(filePath));
  } catch (err) {
    console.debug(err);
    return false; // Return false if there is an error
  }
};
