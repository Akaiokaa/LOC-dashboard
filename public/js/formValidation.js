// Function to manage read-only state and appearance for all fields (Now global)
window.setFormEditability = function(isEditable) {
    // 1. Division Fields (Dean, PEN, etc.)
    const divisionInputs = [
        document.getElementById("dean"),
        document.getElementById("pen"),
        document.getElementById("locRep"),
        document.getElementById("chair"),
    ];

    divisionInputs.forEach((input) => {
        if (input) {
            input.readOnly = !isEditable;
            // The class is added when NOT editable (view-only)
            input.classList.toggle("view-only", !isEditable); 
        }
    });

    // 2. Program Fields (Report, Notes, Payees - .dynamic-field)
    const dynamicFields = document.querySelectorAll(".dynamic-field");

    dynamicFields.forEach(field => {
        field.readOnly = !isEditable;
        // The class is added when NOT editable (view-only)
        field.classList.toggle("view-only", !isEditable);
    });

    setButtonVisibility(false);
}

// Function to control which main buttons are visible
function setButtonVisibility(isEditMode) {
    // Edit Details is visible only when NOT in edit mode
    document.getElementById("edit-details").style.display = isEditMode ? "none" : "block";
    // Cancel and Save are visible only when in edit mode
    document.getElementById("cancel-button").style.display = isEditMode ? "block" : "none";
    document.getElementById("save-button").style.display = isEditMode ? "block" : "none";
}

// runs when division-form is submitted
document.getElementById("division-form").onsubmit = () => {
  clearErrors();

  let isValid = true;
  let dean = document.getElementById("dean").value.trim();
  let pen = document.getElementById("pen").value.trim();
  let locRep = document.getElementById("locRep").value.trim();
  let chair = document.getElementById("chair").value.trim();

  //   this checks to see if any inputs are missing (Division Fields)
  if (!dean) {
    isValid = false;
    document.getElementById("err-dean").style.display = "inline-block";
  }

  if (!pen) {
    isValid = false;
    document.getElementById("err-pen").style.display = "inline-block";
  }

  if (!locRep) {
    isValid = false;
    document.getElementById("err-locRep").style.display = "inline-block";
  }

  if (!chair) {
    isValid = false;
    document.getElementById("err-chair").style.display = "inline-block";
  }

  const dynamicFields = document.querySelectorAll(".dynamic-field");
  
  dynamicFields.forEach(field => {
    const value = field.value.trim();
    
    // Check if the field is empty
    if (!value) {
      isValid = false;
      // Visually indicate an error by changing the input's border
      field.style.borderColor = "red";
      field.style.borderWidth = "2px";
    }
  });

  return isValid;
};

//makes form editable and shows Cancel/Save buttons
document.getElementById("edit-details").onclick = () => {
  clearErrors();
  
  // Set all fields to editable
  window.setFormEditability(true);
  
  // Show Cancel/Save, hide Edit Details
  setButtonVisibility(true);
};

//cancels edit mode and reverts fields
document.getElementById("cancel-button").onclick = () => {
  setFormFields(); 
  clearErrors(); 
  
  // Re-render the program blocks to reset their values (triggers change in formData.js)
  const divisionDropdown = document.getElementById("division");
  if (divisionDropdown) {
      // NOTE: This re-renders the program forms based on the current toggle state, 
      // ensuring the forms (and the list cards) remain correctly filtered.
      divisionDropdown.dispatchEvent(new Event('change'));
  }
  
  // Set all fields back to read-only (view mode)
  window.setFormEditability(false); 

  // Show Edit Details, hide Cancel/Save
  setButtonVisibility(false);
};

// function that clears all errors initially
function clearErrors() {
  // Clear error spans (for division fields)
  let errors = document.getElementsByClassName("error");
  for (let error of errors) {
    error.style.display = "none";
  }

  // Clear dynamic field errors (red borders)
  const dynamicFields = document.querySelectorAll(".dynamic-field");
  dynamicFields.forEach(field => {
    // Reset border style back to a default (e.g., light gray, 1px)
    field.style.borderColor = "#ccc";
    field.style.borderWidth = "1px";
  });
}

// Set the initial state for buttons and fields on page load
window.setFormEditability(false);
setButtonVisibility(false);