const programsTables = document.querySelectorAll(".program-table-section");

const clickableTds = document.querySelectorAll("td:not(.division):not(.left)");

clickableTds.forEach((td) => {
  td.classList.add("clickable");
  td.addEventListener("click", () => {
    td.innerText = td.innerText === "X" ? "" : "X";
  });
});

const search_program = document.querySelector(".table-search-program");

search_program.addEventListener("input", () => {
  const inputText = search_program.value.toLowerCase();
  programsTables.forEach((tableSection) => {
    const divisionName = tableSection
      .querySelector(".division")
      .innerText.toLowerCase();
    if (divisionName.includes(inputText)) {
      tableSection.style.display = "table-row-group";
    } else {
      tableSection.style.display = "none";
    }
  });
});
