const form = document.getElementById("division-form");
const saveButton = document.getElementById("save-division");

saveButton.addEventListener("click", () => {
  const divisionId = document.getElementById("division").value;

  // modify the form action to include PUT
  form.action = `/divisions/${divisionId}?_method=PUT`;

  form.submit();
});
