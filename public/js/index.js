function navBar(showNavBar) {
  console.log("Button pressed");
  if (showNavBar) {
    document.getElementById("left-column").style.display = "block";
    document.getElementById("openNavBar").style.display = "none";
  } else {
    document.getElementById("left-column").style.display = "none";
    document.getElementById("openNavBar").style.display = "block";
  }
}
