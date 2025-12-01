// helper function to handle arrays, nulls, and undefined values cleanly
function formatValue(value) {
  if (Array.isArray(value)) {
    return value.join("; ") || "N/A";
  }
  return value === null || value === undefined ? "N/A" : value;
}

// Grab the dropdown
const divisionDropdown = document.getElementById("division");

// Update fields whenever dropdown changes
divisionDropdown.addEventListener("change", () => {
  setFormFields();

  // const selectedText =
  //   divisionDropdown.options[divisionDropdown.selectedIndex].text;
  const parentContainer = document.getElementById("programs");
  const selectedYear = document.getElementById("year").value;
  if (parentContainer) {
    // Corrected Logic: Safely check programsUnderReviewByYear[selectedYear] before accessing [selectedText]
    // const programsList = toggleState
    //   ? programsUnderReviewByYear[selectedYear] &&
    //     programsUnderReviewByYear[selectedYear][selectedText]
    //   : divisionToProgramsMap[selectedText];
    const id = divisionDropdown.selectedIndex + 1;
    let programsList = programFields.filter(
      (program) => program.division_id === id
    );
    if (toggleState) {
      programsList = programsList.filter(
        (program) => program.academic_year == selectedYear
      );
    }
    console.log(programsList);
    renderForms(programsList || [], parentContainer);

    // Apply read-only state after re-rendering program forms
    if (typeof window.setFormEditability === "function") {
      // The form should revert to a non-editable state after division change
      window.setFormEditability(false);
    }
  }
});

toggle.addEventListener("click", () => {
  setFormFields();
  const id = divisionDropdown.selectedIndex + 1;
  let programsList = programFields.filter(
    (program) => program.division_id === id
  );

  const selectedYear = document.getElementById("year").value;

  const parentContainer = document.getElementById("programs");

  if (parentContainer) {
    if (toggleState) {
      const underReviewprogramsList = programsList.filter(
        (program) => program.academic_year === selectedYear
      );
      renderForms(underReviewprogramsList, parentContainer);
    } else {
      renderForms(programsList, parentContainer);
    }

    // Apply read-only state
    if (typeof window.setFormEditability === "function") {
      window.setFormEditability(false);
    }
  }
});

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

const id = divisionDropdown.selectedIndex + 1;
let programsList = programFields.filter(
  (program) => program.division_id === id
);

const parentContainer = document.getElementById("programs");
// initialize form fields on load
setFormFields();
// FIX: Use an empty array if the map lookup returns undefined
renderForms(programsList || [], parentContainer);

// Apply read-only state after initial form render on page load
if (typeof window.setFormEditability === "function") {
  window.setFormEditability(false);
}

// updates fields and populates program dropdown on Division change
function setFormFields() {
  // clearErrors();

  // Get the selected option text
  const index = divisionDropdown.selectedIndex;
  // assign new object to the object in the map

  document.getElementById("dean").value = formatValue(
    divisionFields[index].dean
  );
  document.getElementById("pen_contact").value = formatValue(
    divisionFields[index].pen_contact
  );
  document.getElementById("loc_rep").value = formatValue(
    divisionFields[index].loc_rep
  );
  document.getElementById("chair").value = formatValue(
    divisionFields[index].chair
  );
}

// updates fields with program-specific data on program change
function updateProgramDetails() {
  const selectedProgramName = programDropdown.value;

  if (selectedProgramName) {
    // lookup the program-specific data
    const progObject = programDetailsMap[selectedProgramName];

    document.getElementById("dean").value = formatValue(progObject.dean);
    document.getElementById("loc_rep").value = formatValue(progObject.locRep);
    document.getElementById("pen_contact").value = formatValue(progObject.pen);
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

function renderForms(programs, targetContainer) {
  // clears the existing content
  targetContainer.innerHTML = "";

  // Check if programs is a valid array before iterating
  if (!Array.isArray(programs) || programs.length === 0) {
    targetContainer.innerHTML =
      '<p class="no-programs" style="padding: 10px;">No programs to display for this view.</p>';
    return;
  }

  programs.forEach((program) => {
    const formWrapper = document.createElement("div");
    formWrapper.className = "program-block";
    const payeesList = payees.filter(
      (payee) => program.assessment_id === payee.assessment_id
    );
    const payeeInputsHTML = renderPayeeInputs(payeesList, program);
    const academic_year = document.getElementById("year").value;
    formWrapper.innerHTML = `<form method="POST" action ="/submit_program/${
      program.program_id
    }">
      <div class="grid-container">
        <h3>${program.program_name}</h3>
          <div class="grid-item">
            <label for="report_submitted">Report:</label>
              <input 
                type="text" 
                name="report_submitted" 
                id="report_submitted"
                value="${program.report_submitted || ""}"
                class="dynamic-field"
              />
          </div>
          <div class="grid-item">
              <label>Payee(s)</label>
              <div class="payee-inputs-container">
                ${payeeInputsHTML}
                </div>
              </div>
          <div class="notes">
              <label for="notess">Notes</label>
              <textarea 
                name="notes" 
                id="notes"
                class="dynamic-field"
                >${program.notes || ""}</textarea>
                </div>
                <div> 
                  <input type="text" name="academic_year" id="academic_year" value=${academic_year}
                </div>
                <button type="button" id="edit-details"${
                  program.program_id
                } class="main-button">
                Edit Details
                </button>
                <button type="button" id="cancel-button${
                  program.program_id
                }" class="cancel-button"">Cancel</button>
                <button type="submit" id="save-program${
                  program.program_id
                }" class="save-button">
                Save
              </button>
      </div>
    </form>`;
    targetContainer.appendChild(formWrapper);
  });
}

function renderPayeeInputs(payeesArray, programId) {
  if (payeesArray.length === 0) {
    // Render a single blank pair if no payees exist
    payeesArray = [{ name: "", amount: 0 }];
  }

  // Use .map() to create an HTML string for each payee object
  return payeesArray
    .map((payee, index) => {
      // Use a unique index in the name/id for identification during saving

      return `
            <div class="payee-pair">
                <input 
                    type="text" 
                    name="payee_name" 
                    id="payee_name"
                    value="${payee.payee_name || ""}"
                    placeholder="Payee Name"
                    class="dynamic-payee-name dynamic-field"
                />
                <input 
                    type="number" 
                    name="amount" 
                    id="amount"
                    value="${payee.amount || ""}"
                    placeholder="Amount"
                    class="dynamic-payee-amount dynamic-field"
                />
            </div>
        `;
    })
    .join(""); // Join the array of HTML strings into one continuous string
}

// Add a listener for the year dropdown/input
const yearInput = document.getElementById("year");
if (yearInput) {
  yearInput.addEventListener("change", () => {
    // Replicate the filtering logic from the division and toggle listeners
    setFormFields();

    // selectedYear is now automatically the new value of yearInput
    const selectedYear = yearInput.value;

    const parentContainer = document.getElementById("programs");
    if (parentContainer) {
      const id = divisionDropdown.selectedIndex + 1;
      let programsList = programFields.filter(
        (program) => program.division_id === id
      );

      if (toggleState) {
        const underReviewprogramsList = programsList.filter(
          (program) => program.academic_year === selectedYear
        );
        renderForms(underReviewprogramsList, parentContainer);
      } else {
        renderForms(programsList, parentContainer);
      }

      // Apply read-only state after re-rendering program forms
      if (typeof window.setFormEditability === "function") {
        window.setFormEditability(false);
      }
    }
  });
}
