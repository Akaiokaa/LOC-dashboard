// Grab the dropdown
const selectedDivision = document.getElementById("Division");

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
    document.getElementById("Dean").value = myObject.dean;
    document.getElementById("Pen").value = myObject.pen;
    document.getElementById("LocRep").value = myObject.locRep;
    document.getElementById("Chair").value = myObject.chair;
  } else {
    document.getElementById("Dean").value = "";
    document.getElementById("Pen").value = "";
    document.getElementById("LocRep").value = "";
    document.getElementById("Chair").value = "";
  }
}
