/* eslint sonarjs/cognitive-complexity: ["error", 16] */
const fs = require('fs');
const path = require('path');
const csvParser = require('csv-parser');

const projectRoot = path.resolve(__dirname, './');

async function parseCSV(csvFilePath) {
  const fullPath = path.join(projectRoot, csvFilePath);
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(fullPath)
      .pipe(csvParser())
      .on('data', data => results.push(data))
      .on('end', () => resolve(results))
      .on('error', err => reject(err));
  });
}

async function loadFileData(filesUnderTest) {
  const fileDataPromises = filesUnderTest.map(async file => {
    const filePath = file.replace('spec.ts', 'csv');
    return await parseCSV(filePath);
  });
  return await Promise.all(fileDataPromises);
}

function filterData(data, inputExecutionList) {
  return data.filter(d => {
    const sheetExecutionList = d.Execution.split(',').map(t => t.trim());
    return inputExecutionList.some(executionItem => sheetExecutionList.includes(executionItem));
  });
}

async function getFilteredData() {
  let filteredData = [];
  if (process.argv.slice(2).length > 0) {
    const execution = process.env.Execution || '';
    let filesUnderTest = process.argv.slice(2);
    let fileData = await loadFileData(filesUnderTest);
    const executionArray = execution.split('|');
    filteredData = filesUnderTest.flatMap((suite, index) => {
      if (index < fileData.length) {
        let data = fileData[index];
        const inputExecutionList = executionArray[index].split(',').map(t => t.trim());
        data = filterData(data, inputExecutionList);
        return data;
      }
      return [];
    });
  } else {
    const suiteData = require('./fixtures/suiteData.json');
    let suitesToTest = suiteData.testSuitePath.split(' ');
    const dataToTest = await loadFileData(suitesToTest);
    filteredData = suitesToTest.flatMap((suiteFile, index) => {
      if (index < dataToTest.length) {
        let data = dataToTest[index];
        const suiteInfo = suiteData.data.find(item => item.suitePath === suiteFile);

        if (!suiteInfo || !suiteInfo.suiteExecution) {
          console.warn(`No execution info found for suite file: ${suiteFile}`);
          return []; // Skip if no matching suite info
        }

        const inputExecutionList = suiteInfo.suiteExecution.split(',').map(t => t.trim());

        data = filterData(data, inputExecutionList);
        return data;
      }
      return [];
    });
  }
  return filteredData;
}

async function parseMasterData() {
  let filteredData = await getFilteredData();
  let masterData = {};
  let envData = {
    global: {},
  };
  filteredData.forEach(data => {
    const testGroup = data['testGroup'];
    const testCase = data['testCase'];
    if (!masterData[testGroup]) {
      masterData[testGroup] = [];
    }
    masterData[testGroup].push(testCase);

    if (!envData[testCase]) {
      envData[testCase] = {};
    }
  });
  const jsonOutputPath = path.join(projectRoot, './fixtures/testData.json');
  fs.writeFileSync(jsonOutputPath, JSON.stringify({ success: true, data: masterData }, null, 2));

  const envFileOutputPath = path.join(projectRoot, './fixtures/envVariable.json');
  fs.writeFileSync(envFileOutputPath, JSON.stringify(envData, null, 2));
  return masterData;
}

parseMasterData().then(result => {
  console.log(result);
});
