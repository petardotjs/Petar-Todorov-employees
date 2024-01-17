import assert from "node:assert";
import { findMaxDaysWorkedPair, calculateOverlap } from "../utils/misc.js";

function createEmployee(employeeId, projectId, dateFrom, dateTo) {
  return { employeeId, projectId, dateFrom, dateTo };
}

function testCalculateOverlap() {
  const employee1 = createEmployee(1, "A", "2023-01-01", "2023-01-15");
  const employee2 = createEmployee(2, "A", "2023-01-10", "2023-01-20");
  const dateFormat = "yyyy-MM-dd";

  const overlap = calculateOverlap(employee1, employee2, dateFormat);
  assert.strictEqual(overlap, 6, "Overlap should be 6 days");
}

function testFindMaxDaysWorkedPair() {
  const employees = [
    createEmployee(1, "A", "2023-01-01", "2023-01-15"),
    createEmployee(2, "A", "2023-01-10", "2023-01-20"),
    createEmployee(3, "B", "2023-01-05", "2023-01-25"),
  ];
  const dateFormat = "yyyy-MM-dd";

  const result = findMaxDaysWorkedPair(employees, dateFormat);
  assert.deepStrictEqual(
    result,
    {
      employeeId1: 1,
      employeeId2: 2,
      projectId: "A",
      daysWorked: 6,
    },
    "Max pair days worked is incorrect"
  );
}

function testDifferentDateFormats() {
  const employee1 = createEmployee(1, "A", "01-01-2023", "01-15-2023");
  const employee2 = createEmployee(2, "A", "01-10-2023", "01-20-2023");
  const dateFormat = "MM-dd-yyyy";

  const overlap = calculateOverlap(employee1, employee2, dateFormat);
  assert.strictEqual(overlap, 6, "Overlap should be 6 days");

  const employee3 = createEmployee(3, "A", "01/01/2023", "01/15/2023");
  const employee4 = createEmployee(4, "A", "01/10/2023", "01/20/2023");
  const dateFormat2 = "MM/dd/yyyy";

  const overlap2 = calculateOverlap(employee3, employee4, dateFormat2);
  assert.strictEqual(overlap2, 6, "Overlap should be 6 days");

  const employee5 = createEmployee(5, "A", "01.01.2023", "01.15.2023");
  const employee6 = createEmployee(6, "A", "01.10.2023", "01.20.2023");
  const dateFormat3 = "MM.dd.yyyy";

  const overlap3 = calculateOverlap(employee5, employee6, dateFormat3);
  assert.strictEqual(overlap3, 6, "Overlap should be 6 days");

  const employee7 = createEmployee(7, "A", "01 Jan 2023", "15 Jan 2023");
  const employee8 = createEmployee(8, "A", "10 Jan 2023", "20 Jan 2023");
  const dateFormat4 = "dd MMM yyyy";

  const overlap4 = calculateOverlap(employee7, employee8, dateFormat4);
  assert.strictEqual(overlap4, 6, "Overlap should be 6 days");
}

testCalculateOverlap();
testFindMaxDaysWorkedPair();
testDifferentDateFormats();

console.log("✅ All date-related tests passed!");
