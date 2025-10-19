// runs when department-form is submitted
document.getElementById("department-form").onsubmit = () => {
  clearErrors();

  // console.log("form submitted");
  let isValid = true;
  let dean = document.getElementById("Dean").value.trim();
  let pen = document.getElementById("Pen").value.trim();
  let locRep = document.getElementById("LocRep").value.trim();
  let chair = document.getElementById("Chair").value.trim();


  //   this checks to see if any inputs are missing
  if (!dean) {
    isValid = false;
    document.getElementById("err-dean").style.display = "block";
  }

  if (!pen) {
    isValid = false;
    document.getElementById("err-pen").style.display = "block";
  }

  if (!locRep) {
    isValid = false;
    document.getElementById("err-locRep").style.display = "block";
  }

  if (!chair) {
    isValid = false;
    document.getElementById("err-chair").style.display = "block";
  }
  return isValid;
};

document.getElementById("cancel-button").onclick = () => {
  clearErrors();

  // console.log("cancel button clicked");
  document.getElementById("cancel-button").style.display = "none";
  document.getElementById("save-button").style.display = "none";

  const deanInput = document.getElementById("Dean");
  const penInput = document.getElementById("Pen");
  const locRepInput = document.getElementById("LocRep");
  const chairInput = document.getElementById("Chair");

  const allInputs = [deanInput, penInput, locRepInput, chairInput];

  allInputs.forEach(input => {
      // ensure the element was found before trying to modify it
      if (input) {
          // set the input field to non-editable
          input.readOnly = true;

          // add the class for greyed-out appearance
          input.classList.add('view-only');
      }
  });
}

// function that clears all errors initially
function clearErrors() {
  let errors = document.getElementsByClassName("error");
  for (let error of errors) {
    error.style.display = "none";
  }
}
