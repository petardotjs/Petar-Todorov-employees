import { INVALID_DATE_FORMAT } from "../constants/date-formats.js";
import { parse } from "../node_modules/date-fns/index.mjs";

export function findMaxDaysWorkedPair(employees, dateFormat) {
  let maxOverlap = 0;
  let maxPair = null;

  for (let i = 0; i < employees.length; i++) {
    for (let j = i + 1; j < employees.length; j++) {
      if (employees[i].projectId === employees[j].projectId) {
        const overlap = calculateOverlap(
          employees[i],
          employees[j],
          dateFormat
        );

        if (overlap > maxOverlap) {
          maxOverlap = overlap;
          maxPair = {
            employeeId1: employees[i].employeeId,
            employeeId2: employees[j].employeeId,
            projectId: employees[i].projectId,
            daysWorked: overlap,
          };
        }
      }
    }
  }

  return maxPair;
}

export function parseDate(dateString, format) {
  if (dateString === "NULL") {
    return new Date();
  }

  const parsedDate = parse(dateString, format, new Date());
  if (isNaN(parsedDate)) {
    throw new Error(INVALID_DATE_FORMAT);
  }
  return parsedDate;
}

export function calculateOverlap(employee1, employee2, dateFormat) {
  const employee1StartDate = parseDate(employee1.dateFrom, dateFormat);
  const employee1EndDate = parseDate(employee1.dateTo, dateFormat);
  const employee2StartDate = parseDate(employee2.dateFrom, dateFormat);
  const employee2EndDate = parseDate(employee2.dateTo, dateFormat);

  const latestStartDate = new Date(
    Math.max(employee1StartDate, employee2StartDate)
  );
  const earliestEndDate = new Date(
    Math.min(employee1EndDate, employee2EndDate)
  );

  if (latestStartDate < earliestEndDate) {
    return Math.round(
      (earliestEndDate - latestStartDate) / (1000 * 60 * 60 * 24) + 1
    );
  } else {
    return 0;
  }
}

const indexToKeyMap = {
  0: "employeeId",
  1: "projectId",
  2: "dateFrom",
  3: "dateTo",
};

export function csvToArray(csvRaw) {
  const parsedData = Papa.parse(csvRaw, {
    header: false,
    dynamicTyping: true,
    skipEmptyLines: true,
    transform: (value) => value.trim(),
  });

  const result = parsedData.data.map((row) => {
    return row.reduce((acc, curr, index) => {
      const key = indexToKeyMap[index];
      if (key) {
        acc[key] = curr;
      }
      return acc;
    }, {});
  });

  const isSchemaConsistentForAllRecords = !result.some(
    (emp) => Object.keys(emp).length !== Object.keys(indexToKeyMap).length
  );
  if (!isSchemaConsistentForAllRecords) {
    throw new Error("Invalid csv file. Missing data for some records.");
  }

  return result;
}
