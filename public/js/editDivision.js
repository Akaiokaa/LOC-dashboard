const form = document.getElementById("division-form");
const saveButton = document.getElementById("save-division");

saveButton.addEventListener("click", (event) => {
  event.preventDefault(); // stop auto-submit until we validate

  let isValid = true;

  // Get your fields
  const dean = document.getElementById("dean").value.trim();
  const pen = document.getElementById("pen_contact").value.trim();
  const locRep = document.getElementById("loc_rep").value.trim();
  const chair = document.getElementById("chair").value.trim();
  const dynamicFields = document.querySelectorAll(".dynamic-field");

  // Clear old errors (if you have a function)
  clearErrors?.();

  // Validate required static fields
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

  // Validate dynamic fields
  dynamicFields.forEach((field) => {
    if (!field.value.trim()) {
      isValid = false;
      field.style.borderColor = "red";
      field.style.borderWidth = "2px";
    }
  });

  // If ANYTHING is invalid → stop here
  if (!isValid) return;

  // Otherwise submit the form
  const divisionId = document.getElementById("division").value;
  form.action = `/divisions/${divisionId}?_method=PUT`;
  form.submit();
});
