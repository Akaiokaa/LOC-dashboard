// import { academicDivisions } from "../data/divisionsData.js";
// import { programsUnderReview } from "../data/yearData.js";
const programsUnderReview = window.programsUnderReview || {};

const toggle = document.getElementById("toggle");
const listItems = document.querySelectorAll(".review-list-items");

window.toggleNavBar = function () {
  const body = document.body;

  body.classList.toggle("nav-closed");
};

document.addEventListener("DOMContentLoaded", () => {
  // Attach event listeners to all remove buttons
  document.querySelectorAll(".remove-program-btn").forEach((button) => {
    button.addEventListener("click", handleRemoveProgramClick);
  });

  // Attach event listeners to all add buttons
  document.querySelectorAll(".add-program-btn").forEach((button) => {
    button.addEventListener("click", handleAddProgramClick);
  });
});

/**
 * Applies the current global filter (toggleState and currentYear)
 * to all program list items across all division cards.
 */
function applyFilterToAllPrograms() {
  // Always get a fresh list of all program list items
  const listItems = document.querySelectorAll(".review-list-items");

  listItems.forEach((item) => {
    const program = item.textContent.trim();
    const card = item.closest(".card");

    // Start by making everything visible
    item.style.display = "list-item";
    card.style.display = "flex";

    // If the toggle is ON, we apply the filter
    if (toggleState) {
      // Check if year data is available and if the program is under review
      const reviewList =
        currentYear && programsUnderReview[currentYear]
          ? programsUnderReview[currentYear]
          : [];

      if (!reviewList.includes(program)) {
        // Hide programs that are NOT under review
        item.style.display = "none";
      }
    }
  });

  // After filtering, check if any card is left completely empty and needs to be hidden.
  // This part is only necessary when the toggle is ON.
  if (toggleState) {
    document.querySelectorAll(".card").forEach((card) => {
      const visibleItems = card.querySelectorAll(
        ".review-list-items:not([style*='display: none'])"
      );
      if (visibleItems.length === 0) {
        card.style.display = "none";
      }
    });
  }
}

/**
    Generates the program removal dropdown when the '-' button is clicked.
    This version reads the program list directly from the UI.
 */
function handleRemoveProgramClick(event) {
  event.preventDefault();
  const button = event.currentTarget;
  console.log("Remove '-' button clicked.", button);

  const divisionName = button.getAttribute("data-division");
  const divisionId = button.getAttribute("data-division-id");
  const card = button.closest(".card");
  const dropdownContainer = card.querySelector(".remove-dropdown-container");

  console.log(`Division: ${divisionName}, ID: ${divisionId}`);

  // Get the list of programs *currently in the UI* for this card
  const allProgramItems = card.querySelectorAll(".review-list-items");

  // Handle divisions with no programs to remove
  if (allProgramItems.length === 0) {
    console.warn("No programs found in UI to remove.");
    dropdownContainer.innerHTML =
      '<p style="margin: 0; padding: 5px; color: #ff0000; font-size: 0.9em;">No programs to remove.</p>';
    return;
  }

  // Toggle the dropdown: Check if the dropdown is already open (close it if it is)
  if (dropdownContainer.children.length > 0) {
    console.log("Closing remove dropdown.");
    dropdownContainer.innerHTML = "";
    return;
  }

  // Determine which programs to list based on the toggle state
  let programsToShow = [];
  allProgramItems.forEach((item) => {
    // Check if the item is currently visible (style.display is not 'none')
    if (item.style.display !== "none") {
      programsToShow.push(item.textContent.trim());
    }
  });

  // Handle cases where the *filtered* list is empty
  // (e.g., toggle is on and no programs are under review)
  if (programsToShow.length === 0) {
    const message = toggleState
      ? "No programs under review to remove."
      : "No programs to remove.";
    dropdownContainer.innerHTML = `<p style="margin: 0; padding: 5px; color: #ff0000; font-size: 0.9em;">${message}</p>`;
    return;
  }

  // Generate the dropdown HTML from the (now filtered) list
  let optionsHTML = programsToShow
    .map((program) => `<option value="${program}">${program}</option>`)
    .join("");

  // Inject the dropdown and Apply/Cancel buttons
  dropdownContainer.innerHTML = `
        <div class="removal-form" style="padding: 10px; border: 1px solid #ccc; margin: 10px 0; border-radius: 5px; background-color: #f9f9f9;">
            <select class="program-select-to-remove" style="width: 100%; padding: 5px; margin-bottom: 5px; border-radius: 3px;">
                ${optionsHTML}
            </select>
            <div style="display: flex; gap: 10px;">
                <button type="button" class="apply-remove-btn" 
                        data-division-id="${divisionId}" 
                        style="flex-grow: 1; padding: 8px; background-color: #d9534f; color: white; border: none; border-radius: 3px; cursor: pointer;">
                    Apply Remove
                </button>
                <button type="button" class="cancel-remove-btn" 
                        style="flex-grow: 1; padding: 8px; background-color: #6c757d; color: white; border: none; border-radius: 3px; cursor: pointer;">
                    Cancel
                </button>
            </div>
        </div>
    `;
  // Attach event listener to the 'Apply Remove' button
  card
    .querySelector(".apply-remove-btn")
    .addEventListener("click", confirmProgramRemoval);

  // Attach event listener to the 'Cancel' button
  card.querySelector(".cancel-remove-btn").addEventListener("click", () => {
    // Simple action: clear the container content to close the dropdown
    dropdownContainer.innerHTML = "";
  });
}

/**
    Removes the selected program by sending a request to the server.
 */
async function confirmProgramRemoval(event) {
  const button = event.currentTarget;
  const divisionId = button.getAttribute("data-division-id"); // Get the ID
  const card = button.closest(".card");
  const dropdownContainer = card.querySelector(".remove-dropdown-container");
  const selectElement = card.querySelector(".program-select-to-remove");
  const programToRemove = selectElement ? selectElement.value : null;

  console.log(
    `Attempting to remove: '${programToRemove}' from division ID: ${divisionId}`
  );

  if (!programToRemove || !divisionId) {
    console.error("Missing program name or division ID.");
    return;
  }

  try {
    const response = await fetch("/remove-program", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        programName: programToRemove,
        divisionId: divisionId,
      }),
    });

    const result = await response.json();
    console.log("Server response:", result);

    if (result.success) {
      console.log("Program removed successfully from UI.");
      // SUCCESS: Remove the program from the UI
      const programListUL = card.querySelector(".program-list");
      const itemToRemove = Array.from(programListUL.children).find(
        (li) => li.textContent.trim() === programToRemove
      );
      if (itemToRemove) {
        itemToRemove.remove();
      }

      dropdownContainer.innerHTML = `<p style="color: green; padding: 5px;">'${programToRemove}' removed!</p>`;
    } else {
      // FAIL: Show an error
      console.error("Server returned an error:", result.message);
      dropdownContainer.innerHTML = `<p style="color: red; padding: 5px;">Error: ${result.message}</p>`;
    }
  } catch (err) {
    console.error("Fetch network error:", err);
    dropdownContainer.innerHTML = `<p style="color: red; padding: 5px;">Network error.</p>`;
  }

  // Clear message after 2s
  setTimeout(() => (dropdownContainer.innerHTML = ""), 2000);
}

/**
    Generates the program addition form when the '+' button is clicked.
 */
function handleAddProgramClick(event) {
  event.preventDefault();
  const button = event.currentTarget; // This is the '+' button
  console.log("Add '+' button clicked.", button);

  const divisionName = button.getAttribute("data-division");
  const divisionId = button.getAttribute("data-division-id");

  console.log(`Division: ${divisionName}, ID: ${divisionId}`);

  const card = button.closest(".card");
  const dropdownContainer = card.querySelector(".remove-dropdown-container");

  // Toggle the form: Check if the form is already open (close it if it is)
  if (dropdownContainer.children.length > 0) {
    console.log("Closing add form.");
    dropdownContainer.innerHTML = "";
    return;
  }

  // Inject the input form and Apply/Cancel buttons
  dropdownContainer.innerHTML = `
        <div class="addition-form" style="padding: 10px; border: 1px solid #ccc; margin: 10px 0; border-radius: 5px; background-color: #f9f9f9;">
            <input type="text" class="program-input-to-add" 
                   placeholder="New Program Name" 
                   style="width: 100%; padding: 5px; margin-bottom: 5px; border-radius: 3px; box-sizing: border-box;" />
            <div style="display: flex; gap: 10px;">
                <button type="button" class="apply-add-btn" 
                        data-division-id="${divisionId}" 
                        style="flex-grow: 1; padding: 8px; background-color: #5cb85c; color: white; border: none; border-radius: 3px; cursor: pointer;">
                    Apply Add
                </button>
                <button type="button" class="cancel-add-btn" 
                        style="flex-grow: 1; padding: 8px; background-color: #6c757d; color: white; border: none; border-radius: 3px; cursor: pointer;">
                    Cancel
                </button>
            </div>
        </div>
    `;

  // Attach event listener to the 'Apply Add' button
  card
    .querySelector(".apply-add-btn")
    .addEventListener("click", confirmProgramAddition);

  // Attach event listener to the 'Cancel' button
  card.querySelector(".cancel-add-btn").addEventListener("click", () => {
    dropdownContainer.innerHTML = "";
  });
}

/**
    Adds the new program by sending a request to the server.
 */
async function confirmProgramAddition(event) {
  const button = event.currentTarget;
  // Get the current value of the year dropdown
  const currentYear = document.getElementById("year").value;
  const divisionId = button.getAttribute("data-division-id"); // Get the ID
  const card = button.closest(".card");
  const dropdownContainer = card.querySelector(".remove-dropdown-container");
  const inputElement = card.querySelector(".program-input-to-add");
  const programToAdd = inputElement ? inputElement.value.trim() : null;

  console.log(
    `Attempting to add: '${programToAdd}' to division ID: ${divisionId}`
  );

  inputElement.style.borderColor = "#ccc";
  if (!programToAdd) {
    console.warn("No program name entered.");
    inputElement.style.borderColor = "red";
    inputElement.placeholder = "Please enter a name";
    return;
  }

  if (!divisionId) {
    console.error("Could not find division ID on 'Apply Add' button.");
    dropdownContainer.innerHTML = `<p style="color: red; padding: 5px;">Error: Could not find division ID.</p>`;
    setTimeout(() => (dropdownContainer.innerHTML = ""), 2000);
    return;
  }

  try {
    const response = await fetch("/add-program", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        programName: programToAdd,
        divisionId: divisionId,
        selectedYear: currentYear
      }),
    });

    const result = await response.json();
    console.log("Server response:", result);

    if (result.success) {
      console.log("Program added successfully to UI.");
      // SUCCESS: Add the new program to the UI
      const programListUL = card.querySelector(".program-list");
      const newLi = document.createElement("li");
      newLi.className = "review-list-items";
      newLi.textContent = programToAdd;
      programListUL.appendChild(newLi);

      // Apply filter state to the new item
      applyFilterToAllPrograms();

      dropdownContainer.innerHTML = `<p style="color: green; padding: 5px;">'${programToAdd}' added!</p>`;
    } else {
      // FAIL: Show an error (e.g., duplicate program)
      console.error("Server returned an error:", result.message);
      inputElement.style.borderColor = "red";
      inputElement.value = "";
      inputElement.placeholder = result.message || "Error saving program.";
    }
  } catch (err) {
    console.error("Fetch network error:", err);
    dropdownContainer.innerHTML = `<p style="color: red; padding: 5px;">Network error.</p>`;
  }

  // Clear message after 2s, unless there was an error
  if (!inputElement.style.borderColor.includes("red")) {
    setTimeout(() => (dropdownContainer.innerHTML = ""), 2000);
  }
}

//Toggle functionality
toggle.addEventListener("click", () => {
  // This now flips the global toggleState
  toggleState = !toggleState;
  console.log("Toggle state:", toggleState);
  // Query for the items *inside* the listener to get a fresh list
  const listItems = document.querySelectorAll(".review-list-items");
  listItems.forEach((item) => {
    const program = item.textContent.trim();
    const card = item.closest(".card");
    card.querySelector(".remove-dropdown-container").innerHTML = "";

    if (toggleState) {
      // If toggle is ON (show review only)
      // Use currentYear, and check that the year data exists
      if (
        currentYear &&
        programsUnderReview[currentYear] &&
        programsUnderReview[currentYear].includes(program)
      ) {
        item.style.display = "list-item";
      } else {
        item.style.display = "none";
        const visibleItems = card.querySelectorAll(
          ".review-list-items:not([style*='display: none'])"
        );
        if (visibleItems.length === 0) {
          card.style.display = "none";
        }
      }
    } else {
      // If toggle is OFF (show all)
      item.style.display = "list-item";
      card.style.display = "flex";
    }
  });

  toggle.classList.toggle("active");
});

const yearSelect = document.getElementById("year");

// Set the initial value for the global currentYear on load
currentYear = yearSelect.value;

yearSelect.addEventListener("change", () => {
  currentYear = yearSelect.value;

  const parentContainer = document.getElementById("programs");
  const divisionDropdown = document.getElementById("division");
  let selectedText = null;
  if (divisionDropdown) {
    selectedText =
      divisionDropdown.options[divisionDropdown.selectedIndex].text;
  }
  // NOTE: You may want to trigger a re-render or list filter here
  // if the user changes the year while the toggle is active.
  const listItems = document.querySelectorAll(".review-list-items");

  listItems.forEach((item) => {
    const program = item.textContent.trim();
    const card = item.closest(".card");

    card.querySelector(".remove-dropdown-container").innerHTML = "";

    item.style.display = "list-item";
    card.style.display = "flex";

    if (toggleState) {
      if (
        !(
          currentYear &&
          programsUnderReview[currentYear] &&
          programsUnderReview[currentYear].includes(program)
        )
      ) {
        item.style.display = "none";
      }
    }

    const visibleItems = card.querySelectorAll(
      ".review-list-items:not([style*='display: none'])"
    );
    if (visibleItems.length === 0) {
      card.style.display = "none";
    }
  });

  const reviewProgramsForYear = programsUnderReview[currentYear];
  if (parentContainer && selectedText && reviewProgramsForYear) {
    // Only call renderForms if the year data exists
    renderForms(reviewProgramsForYear[selectedText] || [], parentContainer);
  }
  if (typeof window.setFormEditability === "function") {
    window.setFormEditability(false);
  }
});