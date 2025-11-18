// helper function to handle arrays, nulls, and undefined values cleanly
function formatValue(value) {
  if (Array.isArray(value)) {
    return value.join("; ") || "N/A";
  }
  return value === null || value === undefined ? "N/A" : value;
}

// Grab the dropdown

const divisionDropdown = document.getElementById("division");
const programDropdown = document.getElementById("program");

// Update fields whenever dropdown changes
divisionDropdown.addEventListener("change", () => {
  setFormFields();

  const selectedText =
    divisionDropdown.options[divisionDropdown.selectedIndex].text;

  const parentContainer = document.getElementById("programs");

  if (parentContainer) {

    if (toggleState) {
      renderForms(divisionToProgramsReviewMap[selectedText], parentContainer);
    } else {
      renderForms(divisionToProgramsMap[selectedText], parentContainer);
    }
  }
});

// programDropdown.addEventListener("change", updateProgramDetails);

//Returns the value using URLSearchParams
function getDivisionFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("division"); // would return Humanites etc.
}

const urlDivision = getDivisionFromUrl(); // Humanites would be stored here.

//If the division exists, then.
if (urlDivision) {
  //Loop through the divisions dropdown until you find the matching one.
  for (let i = 0; i < divisionDropdown.options.length; i++) {
    if (divisionDropdown.options[i].text === urlDivision) {
      //Set the drop down to this option.
      divisionDropdown.selectedIndex = i;
      break;
    }
  }
  setFormFields();
} else {
  setFormFields();
}

const selectedText =
  divisionDropdown.options[divisionDropdown.selectedIndex].text;

const parentContainer = document.getElementById("programs");
// initialize form fields on load
setFormFields();
renderForms(divisionToProgramsMap[selectedText], parentContainer);
// updates fields and populates program dropdown on Division change
function setFormFields() {
  clearErrors();

  // Get the selected option text
  const selectedText =
    divisionDropdown.options[divisionDropdown.selectedIndex].value;
  // assign new object to the object in the map
  const myObject = departmentMap.get(selectedText);

  document.getElementById("dean").value = formatValue(myObject.dean);
  document.getElementById("pen").value = formatValue(myObject.pen);
  document.getElementById("locRep").value = formatValue(myObject.locRep);
  document.getElementById("chair").value = formatValue(myObject.chair);
}

// updates fields with program-specific data on program change
function updateProgramDetails() {
  const selectedProgramName = programDropdown.value;

  if (selectedProgramName) {
    // lookup the program-specific data
    const progObject = programDetailsMap[selectedProgramName];

    document.getElementById("dean").value = formatValue(progObject.dean);
    document.getElementById("locRep").value = formatValue(progObject.locRep);
    document.getElementById("pen").value = formatValue(progObject.pen);
    document.getElementById("chair").value = formatValue(progObject.chair);

    document.getElementById("payee").value = formatValue(progObject.payees);
    if (progObject.hasBeenPaid != null) {
      document.getElementById("paid").checked = true;
    }
    document.getElementById("report").value = formatValue(
      progObject.reportSubmitted
    );
    document.getElementById("notes").value = formatValue(progObject.notes);
  } else {
    setFormFields();
  }
}

// helper function to clear all detail fields to "N/A"
function clearDetailFields() {
  const NA = "N/A";
  document.getElementById("dean").value = NA;
  document.getElementById("locRep").value = NA;
  document.getElementById("pen").value = NA;
  document.getElementById("chair").value = NA;
  document.getElementById("payee").value = NA;
  document.getElementById("paid").checked = false;
  document.getElementById("report").value = NA;
  document.getElementById("notes").value = NA;
}

function renderForms(programs, targetContainer) {
  // clears the existing content
  targetContainer.innerHTML = "";

  console.log(programs);

  programs.forEach((program) => {
    const programDetails = programDetailsMap[program];

    const formWrapper = document.createElement("div");
    formWrapper.className = "expense-entry";
    formWrapper.setAttribute("data-entry-id", program.programId);
    const payeeInputsHTML = renderPayeeInputs(programDetails.payees, program);

    formWrapper.innerHTML = `
    <div class="grid-container">
      <h3>${program}</h3>
        <div class="grid-item">
            <label for="report-${program}">Report:</label>
            <input 
                        type="text" 
                        name="report" 
                        id="report-${program}"
                        value="${programDetails.reportSubmitted}"
                        class="dynamic-field"
                        data-entry-id="${program}" 
                    />
        </div>
      <div class="grid-item">
                    <label for="payee-${program}">Payee(s)</label>
                   <div class="payee-inputs-container">
                        ${payeeInputsHTML} 
                </div>
                </div>
       <div class="notes">
                    <label for="notes-${program}">Notes</label>
                    <textarea 
                        name="notes" 
                        id="notes-${program}"
                        class="dynamic-field"
                        data-entry-id="${program}" 
                    >${programDetails.notes}</textarea>
                </div>
    </div>
`;
    targetContainer.appendChild(formWrapper);
  });
}

/**
 * Generates the HTML string for payee inputs (name and amount).
 * @param {Array<Object>} payeesArray - The array of {name, amount} objects.
 * @param {string} programId - The unique ID of the main program (for unique input names).
 * @returns {string} The HTML markup for all payee input pairs.
 */
function renderPayeeInputs(payeesArray, programId) {
  if (payeesArray.length === 0) {
    // Render a single blank pair if no payees exist
    payeesArray = [{ name: "", amount: 0 }];
  }

  // Use .map() to create an HTML string for each payee object
  return payeesArray
    .map((payee, index) => {
      // Use a unique index in the name/id for identification during saving
      const uniqueSuffix = `${programId}-${index}`;

      return `
            <div class="payee-pair" data-payee-index="${index}">
                <input 
                    type="text" 
                    name="payee-name-${programId}" 
                    id="payee-name-${uniqueSuffix}"
                    value="${payee.name}"
                    placeholder="Payee Name"
                    class="dynamic-payee-name dynamic-field"
                    data-entry-id="${programId}"
                />
                <input 
                    type="number" 
                    name="payee-amount-${programId}" 
                    id="payee-amount-${uniqueSuffix}"
                    value="${payee.amount || ""}"
                    placeholder="Amount"
                    class="dynamic-payee-amount dynamic-field"
                    data-entry-id="${programId}"
                />
            </div>
        `;
    })
    .join(""); // Join the array of HTML strings into one continuous string
}
