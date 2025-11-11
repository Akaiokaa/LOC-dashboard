function myNavBar() {
  let aside = document.getElementById("left-column");
  if (aside.style.display == "block") {
    document.getElementById("left-column").style.display = "none";
  } else {
    document.getElementById("left-column").style.display = "block";
  }
}

function toggleNavBar() {
  const body = document.body;
  const isMobile = window.innerWidth <= 700;

  if (isMobile) {
    // Mobile Logic: Toggle the "nav-open-mobile" class
    const isNavOpen = body.classList.contains("nav-open-mobile");
    body.classList.toggle("nav-open-mobile");

    // Toggle the open button visibility based on the new state
    const openButton = document.getElementById("openNavBar");
    if (openButton) {
      // If it was open, it is now closed, so show the button (opposite of previous logic)
      openButton.style.display = isNavOpen ? "block" : "none";
    }
  } else {
    // Desktop Logic: Toggle the "nav-closed" class
    body.classList.toggle("nav-closed");
  }
}
//get the search and department cards
const search = document.querySelector(".search");
const departments = document.querySelectorAll(".card");

//when the user interacts with the search bar
search.addEventListener("input", () => {
  //console.log("banished")
  //store the text from the user in a variable, lowercase for even comparison later.
  const inputText = search.value.toLowerCase();

  //While it is not empty run this
  if (search.value !== "") {
    //loop though the department in our case its the cards I set
    departments.forEach((department) => {
      //store the inner text from the department to compare it with the users text
      const departmentValues = department
        .querySelector("h2")
        .innerText.toLowerCase();

      //if it does include the users text show the relevant card if not hide it
      if (departmentValues.includes(inputText)) {
        department.style.display = "block";
      } else {
        department.style.display = "none";
      }
    });
    //catch after to return to original state.
  } else {
    departments.forEach((department) => {
      department.style.display = "block";
    });
  }
});
// Seach Bar filtering
// Inspired by QCT on YouTube
// Video URL: https://www.youtube.com/watch?v=Qbg-iA2Mo10
