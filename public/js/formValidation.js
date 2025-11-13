// runs when department-form is submitted
// document.getElementById("department-form").onsubmit = () => {
//   clearErrors();

//   // console.log("form submitted");
//   let isValid = true;
//   let dean = document.getElementById("dean").value.trim();
//   let pen = document.getElementById("pen").value.trim();
//   let locRep = document.getElementById("locRep").value.trim();
//   let chair = document.getElementById("chair").value.trim();
//   let program = document.getElementById("program").value;

//   //   this checks to see if any inputs are missing
//   if (!dean) {
//     isValid = false;
//     document.getElementById("err-dean").style.display = "inline-block";
//   }

//   if (!pen) {
//     isValid = false;
//     document.getElementById("err-pen").style.display = "inline-block";
//   }

//   if (!locRep) {
//     isValid = false;
//     document.getElementById("err-locRep").style.display = "inline-block";
//   }

//   if (!chair) {
//     isValid = false;
//     document.getElementById("err-chair").style.display = "inline-block";
//   }

//   if (program == "none") {
//     isValid = false;
//     document.getElementById("err-program").style.display = "inline-block";
//   }

//   return isValid;
// };

//make buttons reappear
document.getElementById("edit-details").onclick = () => {
  clearErrors();
  document.getElementById("edit-details").style.display = "none";
  document.getElementById("cancel-button").style.display = "block";
  document.getElementById("save-button").style.display = "block";

  const deanInput = document.getElementById("dean");
  const penInput = document.getElementById("pen");
  const locRepInput = document.getElementById("locRep");
  const chairInput = document.getElementById("chair");


  const allInputs = [
    deanInput,
    penInput,
    locRepInput,
    chairInput,
  ];

  allInputs.forEach((input) => {
    if (input) {
      input.readOnly = false;
    }
  });
};

document.getElementById("cancel-button").onclick = () => {
  setFormFields();

  //Make button reappear
  document.getElementById("edit-details").style.display = "block";
  document.getElementById("cancel-button").style.display = "none";
  document.getElementById("save-button").style.display = "none";

  const deanInput = document.getElementById("dean");
  const penInput = document.getElementById("pen");
  const locRepInput = document.getElementById("locRep");
  const chairInput = document.getElementById("chair");

  const allInputs = [deanInput, penInput, locRepInput, chairInput];

  
  allInputs.forEach((input) => {
    // ensure the element was found before trying to modify it
    if (input) {
      // set the input field to non-editable
      input.readOnly = true;

      // add the class for greyed-out appearance
      input.classList.add("view-only");
    }
  });
};

// function that clears all errors initially
function clearErrors() {
  let errors = document.getElementsByClassName("error");
  for (let error of errors) {
    error.style.display = "none";
  }
}
