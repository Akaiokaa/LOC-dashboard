// runs when department-form is submitted
document.getElementById("department-form").onsubmit = () => {
  clearErrors();

  let isValid = true;
  let division = document.getElementById("Division").value.trim();
  let dean = document.getElementById("Dean").value.trim();
  let pen = document.getElementById("Pen").value.trim();
  let locRep = document.getElementById("LocRep").value.trim();
  let chair = document.getElementById("Chair").value.trim();

  //   this checks to see if any inputs are missing
  if (!division) {
    isValid = false;
    document.getElementById("err-division").style.display = "block";
  }
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

// function that clears all errors initially
function clearErrors() {
  let errors = document.getElementsByClassName("error");
  for (let error of errors) {
    error.style.display = "none";
  }
}
