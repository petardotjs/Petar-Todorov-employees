import { csvToArray, findMaxDaysWorkedPair } from "./utils/misc.js";
import { dateFormats } from "../constants/date-formats.js";
import { INVALID_DATE_FORMAT } from "./constants/date-formats.js";

const form = document.querySelector("#employee-form");
const dateFormatSelect = form.querySelector("#date-format-input");
const displayDataDiv = document.querySelector("#display-data");
const formErrorDiv = document.querySelector("#employee-form-error");
const employeeDataUploadDiv = form.querySelector("#employee-data-upload");
const employeeDataUploadInput = form.querySelector(
  "#employee-data-upload-input"
);
const employeeDataUploadLabel = document.querySelector(
  "#employee-data-upload-label"
);

renderDateFormatSelectOptions(dateFormats);

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const dateFormat = dateFormatSelect.value;

  if (!(employeeDataUploadInput.files.length > 0)) {
    displayDataDiv.innerHTML = "";
    formErrorDiv.textContent = "Please upload a file";
    form["aria-invalid"] = true;
    return;
  }

  if (!dateFormats.includes(dateFormat)) {
    displayDataDiv.innerHTML = "";
    formErrorDiv.textContent = "Please select a valid date format";
    form["aria-invalid"] = true;
    return;
  }

  const file = employeeDataUploadInput.files[0];
  const reader = new FileReader();

  reader.onload = (event) => {
    const text = event.target.result;
    const employees = csvToArray(text);

    try {
      const pair = findMaxDaysWorkedPair(employees, dateFormat);
      renderTable(pair);
      formErrorDiv.textContent = "";
    } catch (error) {
      displayDataDiv.innerHTML = "";
      formErrorDiv.textContent =
        error.message === INVALID_DATE_FORMAT
          ? error.message
          : "Something seems to be off. Please double check your csv file for errors and try again";
      form["aria-invalid"] = true;
      return;
    }
  };

  reader.readAsText(file);
});

employeeDataUploadInput.addEventListener("change", () => {
  employeeDataUploadLabel.textContent = employeeDataUploadInput.files[0].name;
});

employeeDataUploadInput.addEventListener("dragover", () => {
  employeeDataUploadDiv.classList.add("file-drag-over");
});

employeeDataUploadInput.addEventListener("dragleave", () => {
  employeeDataUploadDiv.classList.remove("file-drag-over");
});

function renderTable(pairData) {
  displayDataDiv.innerHTML = "";
  const table = document.createElement("table");
  const thead = document.createElement("thead");
  const tbody = document.createElement("tbody");
  {
    const tr = document.createElement("tr");
    const th1 = document.createElement("th");
    th1.textContent = "Employee ID 1";
    const th2 = document.createElement("th");
    th2.textContent = "Employee ID 2";
    const th3 = document.createElement("th");
    th3.textContent = "Project ID";
    const th4 = document.createElement("th");
    th4.textContent = "Days worked";
    tr.appendChild(th1);
    tr.appendChild(th2);
    tr.appendChild(th3);
    tr.appendChild(th4);
    thead.appendChild(tr);
  }
  if (!pairData) {
    const tr = document.createElement("tr");
    const td = document.createElement("td");
    td.setAttribute("colspan", "4");
    td.textContent =
      "No employees who have worked on the same project for an overlapping period of time were found";
    tr.appendChild(td);
    tbody.appendChild(tr);
    table.appendChild(thead);
    table.appendChild(tbody);
    displayDataDiv.appendChild(table);
    return;
  }
  {
    const tr = document.createElement("tr");
    const td1 = document.createElement("td");
    td1.textContent = pairData.employeeId1;
    const td2 = document.createElement("td");
    td2.textContent = pairData.employeeId2;
    const td3 = document.createElement("td");
    td3.textContent = pairData.projectId;
    const td4 = document.createElement("td");
    td4.textContent = pairData.daysWorked;
    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);
    tr.appendChild(td4);
    tbody.appendChild(tr);
  }
  table.appendChild(thead);
  table.appendChild(tbody);
  displayDataDiv.appendChild(table);
}

function renderDateFormatSelectOptions(dateFormats) {
  dateFormats.forEach((format) => {
    const option = document.createElement("option");
    option.textContent = format;
    document.querySelector("#date-format-input").appendChild(option);
  });
}
