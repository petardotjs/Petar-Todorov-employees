import assert from "node:assert";
import Papa from "papaparse";
import { csvToArray } from "../utils/misc.js";

// in the browser, this package is installed through a cdn
// and thus the csvToArray function accesses it through the global object
globalThis.Papa = Papa;

function testMissingData() {
  const invalidCsv = `1,A,2023-01-01,2023-01-15
    2,A,2023-01-10
    3,B,2023-01-05,2023-01-25
    4,B,2023-01-05,2023-01-25,2023-01-25`;

  assert.throws(() => csvToArray(invalidCsv), {
    message: "Invalid csv file. Missing data for some records.",
  });
}

function testStandardCsv() {
  const validCsv = `1,A,2023-01-01,2023-01-15
    2,A,2023-01-10,2023-01-20
    3,B,2023-01-05,2023-01-25
    4,B,2023-01-05,2023-01-25`;

  const result = csvToArray(validCsv);
  assert.deepStrictEqual(
    result,
    [
      {
        employeeId: 1,
        projectId: "A",
        dateFrom: "2023-01-01",
        dateTo: "2023-01-15",
      },
      {
        employeeId: 2,
        projectId: "A",
        dateFrom: "2023-01-10",
        dateTo: "2023-01-20",
      },
      {
        employeeId: 3,
        projectId: "B",
        dateFrom: "2023-01-05",
        dateTo: "2023-01-25",
      },
      {
        employeeId: 4,
        projectId: "B",
        dateFrom: "2023-01-05",
        dateTo: "2023-01-25",
      },
    ],
    "Valid csv file should be parsed correctly"
  );
}

testMissingData();
testStandardCsv();

console.info("✅ All CSV parser tests passed!");
