const divisionFields = window.divisionFields || [];
const programFields = window.programFields || [];
const payees = window.payees || [];
const reviewYear = window.reviewYear || [];

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

  const parentContainer = document.getElementById("programs");
  const selectedYear = document.getElementById("year").value;
  if (parentContainer) {
    const id = divisionDropdown.selectedIndex + 1;

    // 1. Filter by Division (Always happens)
    let programsList = programFields.filter(
      (program) => program.division_id === id
    );

    // 2. Filter by Year/Toggle (Conditional)
    if (toggleState) {
      programsList = programsList.filter(
        // Ensures the filter uses the academic_year property we merged in app.js
        (program) => program.academic_year === selectedYear
      );
    }

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
    const payeeInputsHTML = renderPayeeInputs(
      payeesList,
      program.program_id
    );
    const academic_year = document.getElementById("year").value;
    formWrapper.innerHTML = `<form method="POST" action ="/submit_program/${program.program_id
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
                class="programInput${program.program_id} readonly-input"
                readonly
              />
          </div>
          <div class="grid-item">
              <label>Payee(s)</label>
              <div class="payee-inputs-container" id="payee-inputs-container${program.program_id
      }">
                ${payeeInputsHTML}
                </div>

              </div>
<div class="payeeButtonContainer"> 
        <button 
            type="button" 
            id="add-payee-btn-${program.program_id}" 
            onclick="addPayee(${program.program_id})" 
            class="addPayeeButton"
            style="display: none;"> +
        </button>
    </div>

          <div class="notes">
              <label for="notess">Notes</label>
              <textarea 
                name="notes" 
                id="notes"
                class="programInput${program.program_id} readonly-input"
                readonly
                >${program.notes || ""}</textarea>
                </div>
                <div> 
                  <input type="text" name="academic_year" id="academic_year" value=${academic_year}
                </div>

                <button type="button" id="edit-details${program.program_id
      }" class="save-button" onclick="isEditable(${program.program_id
      }, true)">
                Edit Details
                </button>

                <div class="save-cancelButtons"> 

    <button style="display: none" type="button" id="cancel-button${program.program_id
      }" class="cancel-button" onclick="isEditable(${program.program_id}, false)"
    })">Cancel</button>
                <button style="display: none" type="submit" id="save-program${program.program_id
      }" class="save-button">
                Save
              </button>
                </div>
      </div>
    </form>`;
    targetContainer.appendChild(formWrapper);
  });
}

function isEditable(index, isEditable) {
  // 1. Toggle Inputs (Read-only state)
  // Now that we fixed renderForms, this selector will correctly find the Payee inputs too
  const programInputs = document.querySelectorAll(`.programInput${index}`);

  if (isEditable) {
    programInputs.forEach((input) => {
      input.removeAttribute("readonly");
      input.classList.remove("readonly-input");
    });
  } else {
    programInputs.forEach((input) => {
      input.setAttribute("readonly", "true");
      input.classList.add("readonly-input");
    });
  }

  // 2. Toggle Main Buttons (Edit/Save/Cancel)
  const editBtn = document.getElementById(`edit-details${index}`);
  const cancelBtn = document.getElementById(`cancel-button${index}`);
  const saveBtn = document.getElementById(`save-program${index}`);

  if (editBtn) editBtn.style.display = isEditable ? "none" : "block";
  if (cancelBtn) cancelBtn.style.display = isEditable ? "block" : "none";
  if (saveBtn) saveBtn.style.display = isEditable ? "block" : "none";

  // 3. Toggle Payee Buttons (Add + and Trash Icons)
  // This finds the specific add button for this program
  const addPayeeBtn = document.getElementById(`add-payee-btn-${index}`);
  if (addPayeeBtn) {
    addPayeeBtn.style.display = isEditable ? "block" : "none";
  }

  // This finds all trash cans associated with this program
  const deleteButtons = document.querySelectorAll(`.delete-btn-${index}`);
  deleteButtons.forEach((btn) => {
    btn.style.display = isEditable ? "block" : "none";
  });
}

function deletePayee(programId, index) {
  const payeeElements = document.querySelectorAll(
    `#programs .payee-pair[id^="payee-pair-${programId}-"]`
  );
  if (payeeElements.length <= 1) {
    alert("At least one payee must exist.");
    return; // Stop the function, don’t delete
  }
  document.getElementById(`payee-pair-${programId}-${index}`).remove();
}

function renderPayeeInputs(payeesArray, programId) {
  if (payeesArray.length === 0) {
    payeesArray = [{ name: "", amount: 0 }];
  }
  return payeesArray
    .map((payee, index) => {
      return `
            <div class="payee-pair" id="payee-pair-${programId}-${index}">
                <input 
                    type="text" 
                    name="payee_name" 
                    value="${payee.payee_name || ""}"
                    placeholder="Payee Name"
                    class="programInput${programId} readonly-input"
                    readonly
                />
                <input 
                    type="number" 
                    name="amount" 
                    value="${payee.amount || ""}"
                    placeholder="Amount"
                    class="programInput${programId} readonly-input"
                    readonly
                />
                <button type="button" 
                        onclick="deletePayee(${programId}, ${index})" 
                        class="transparent-button delete-btn-${programId}"
                        style="display: none;">
                    <i class="fa fa-trash-o" style="font-size:34px;color:red"></i>
                </button>
            </div>
        `;
    })
    .join("");
}

function addPayee(programId) {
  const container = document.getElementById(`payee-inputs-container${programId}`);
  const currentPayees = container.querySelectorAll(".payee-pair").length; // Removed -1 logic to just count total

  // NOTE: Removed 'readonly' attribute and 'readonly-input' class
  // NOTE: Delete button is visible (display: block or inline)
  const newPayeeHTML = `
    <div class="payee-pair" id="payee-pair-${programId}-${currentPayees}">
        <input 
            type="text" 
            name="payee_name" 
            value=""
            placeholder="Payee Name"
            class="programInput${programId}" 
        />
        <input 
            type="number" 
            name="amount" 
            value=""
            placeholder="Amount"
            class="programInput${programId}" 
        />
        <button type="button" 
                onclick="deletePayee(${programId}, ${currentPayees})" 
                class="transparent-button delete-btn-${programId}">
            <i class="fa fa-trash-o" style="font-size:34px;color:red"></i>
        </button>
    </div>
  `;

  container.insertAdjacentHTML('beforeend', newPayeeHTML);
}

// Add a listener for the year dropdown/input
const yearInput = document.getElementById("year");
if (yearInput) {
  yearInput.addEventListener("change", () => {
    // Replicate the filtering logic from the division and toggle listeners
    setFormFields();

    const selectedYear = yearInput.value;

    const parentContainer = document.getElementById("programs");
    if (parentContainer) {
      const id = divisionDropdown.selectedIndex + 1;

      // 1. Start with the list filtered by Division
      let programsList = programFields.filter(
        (program) => program.division_id === id
      );

      // 2. UNIFIED FILTERING: If toggle is ON, overwrite programsList 
      //    with the list filtered by academic_year.
      if (toggleState) {
        programsList = programsList.filter(
          (program) => program.academic_year === selectedYear
        );
      }

      // 3. Render and Log the Final List
      console.log("Selected Year:", selectedYear);
      console.log("Final Programs List:", programsList);

      // Pass the fully filtered list to the renderer
      renderForms(programsList, parentContainer);

      // Apply read-only state after re-rendering program forms
      if (typeof window.setFormEditability === "function") {
        window.setFormEditability(false);
      }
    }
  });
}