// Grab the dropdown
const selectedDivision = document.getElementById("division");

setFormFields();

// Update fields whenever dropdown changes
selectedDivision.addEventListener("change", () => {
  setFormFields();
});

function setFormFields() {
  clearErrors();
  // Get the selected option text
  const selectedText =
    selectedDivision.options[selectedDivision.selectedIndex].text;

  // Gets the id of the option
  const deptKey = optionMap.get(selectedText);

  // assign new object to the object in the map
  const myObject = departmentMap.get(deptKey);

  // Populate input fields
  if (myObject) {
    document.getElementById("dean").value = myObject.dean;
    document.getElementById("pen").value = myObject.pen;
    document.getElementById("locRep").value = myObject.locRep;
    document.getElementById("chair").value = myObject.chair;
  } else {
    document.getElementById("dean").value = "";
    document.getElementById("pen").value = "";
    document.getElementById("locRep").value = "";
    document.getElementById("chair").value = "";
  }

  const programDropdown = document.getElementById('program');
  
  // clear existing options
  programDropdown.innerHTML = '<option value="">-- Select Program --</option>';

  // get the list of programs for the selected division
  const programs = divisionToProgramsMap[selectedText];

  // populate the dropdown if programs exist
  if (programs) {
    programs.forEach(program => {
      const option = document.createElement('option');
      option.value = program.toLowerCase().replace(/[^a-z0-9]/g, ''); // cleans up values
      option.textContent = program;
      programDropdown.appendChild(option);
    });
  }
}
