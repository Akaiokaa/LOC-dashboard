import { academicDivisions } from '../data/divisionsData.js';
import { programsUnderReview } from '../data/yearData.js';

const toggle = document.getElementById("toggle");
const listItems = document.querySelectorAll(".review-list-items");

console.log(programsUnderReview);

window.toggleNavBar = function () {
    const body = document.body;

    body.classList.toggle("nav-closed");
    //   footer.classList.toggle("active");
}

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
            const reviewList = (currentYear && programsUnderReview[currentYear])
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
        document.querySelectorAll(".card").forEach(card => {
            const visibleItems = card.querySelectorAll(".review-list-items:not([style*='display: none'])");
            if (visibleItems.length === 0) {
                card.style.display = "none";
            }
        });
    }
}

/**
    Generates the program removal dropdown when the '-' button is clicked.
 */
function handleRemoveProgramClick(event) {
    event.preventDefault();
    const button = event.currentTarget;
    const divisionName = button.getAttribute('data-division');
    const card = button.closest('.card');
    const dropdownContainer = card.querySelector('.remove-dropdown-container');

    // Find the division data
    const division = academicDivisions.find(d => d.divisionName === divisionName);

    // Handle divisions with no programs to remove
    if (!division || division.programs.length === 0) {
        dropdownContainer.innerHTML = '<p style="margin: 0; padding: 5px; color: #ff0000; font-size: 0.9em;">No programs to remove.</p>';
        return;
    }

    // Toggle the dropdown: Check if the dropdown is already open (close it if it is)
    if (dropdownContainer.children.length > 0) {
        dropdownContainer.innerHTML = '';
        return;
    }

    // Determine which programs to list based on the toggle state
    let programsToShow = division.programs;

    // Check if toggle is on AND the year data is valid
    if (toggleState && currentYear && programsUnderReview[currentYear]) {
        const reviewList = programsUnderReview[currentYear];
        programsToShow = division.programs.filter(program => reviewList.includes(program));
    }

    // Handle cases where the *filtered* list is empty
    if (programsToShow.length === 0) {
        const message = toggleState
            ? "No programs under review for this division."
            : "No programs to remove."; // This case was already handled, but good to keep
        dropdownContainer.innerHTML = `<p style="margin: 0; padding: 5px; color: #ff0000; font-size: 0.9em;">${message}</p>`;
        return;
    }

    // Generate the dropdown HTML from the (potentially) filtered list
    let optionsHTML = programsToShow.map(program =>
        `<option value="${program}">${program}</option>`
    ).join('');

    // Inject the dropdown and Apply/Cancel buttons
    dropdownContainer.innerHTML = `
        <div class="removal-form" style="padding: 10px; border: 1px solid #ccc; margin: 10px 0; border-radius: 5px; background-color: #f9f9f9;">
            <select class="program-select-to-remove" style="width: 100%; padding: 5px; margin-bottom: 5px; border-radius: 3px;">
                ${optionsHTML}
            </select>
            <div style="display: flex; gap: 10px;">
                <button type="button" class="apply-remove-btn" 
                        data-division="${divisionName}" 
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
    card.querySelector('.apply-remove-btn').addEventListener('click', confirmProgramRemoval);

    // Attach event listener to the 'Cancel' button
    card.querySelector('.cancel-remove-btn').addEventListener('click', () => {
        // Simple action: clear the container content to close the dropdown
        dropdownContainer.innerHTML = '';
    });
}

/**
    Removes the selected program from the data and updates the UI.
 */
function confirmProgramRemoval(event) {
    const button = event.currentTarget;
    const divisionName = button.getAttribute('data-division');
    const card = button.closest('.card');
    const dropdownContainer = card.querySelector('.remove-dropdown-container');
    const selectElement = card.querySelector('.program-select-to-remove');
    const programToRemove = selectElement ? selectElement.value : null;

    if (!programToRemove) return;

    // Remove from the 'academicDivisions' data structure
    const division = academicDivisions.find(d => d.divisionName === divisionName);
    if (division) {
        const index = division.programs.indexOf(programToRemove);
        if (index > -1) {
            division.programs.splice(index, 1);
        }

        // Update the UI list: Always re-render the *full* list from the updated data
        const programListUL = card.querySelector('.program-list');
        // Re-render the full list with the required class
        programListUL.innerHTML = division.programs.map(p => `<li class="review-list-items">${p}</li>`).join('');

        // Apply the current global filter state (ON/OFF) to ALL programs on the page
        applyFilterToAllPrograms();

        // Close the form after removal
        dropdownContainer.innerHTML = `<p style="color: green; padding: 5px;">'${programToRemove}' removed!</p>`;
        setTimeout(() => dropdownContainer.innerHTML = '', 2000); // Clear message after 2s

        // NOTE: In a real application, you would send an AJAX request here 
        // to save the updated 'academicDivisions' data back to the server.
    }
}

/**
    Generates the program addition form when the '+' button is clicked.
 */
function handleAddProgramClick(event) {
    event.preventDefault();
    const button = event.currentTarget;
    const divisionName = button.getAttribute('data-division');
    const card = button.closest('.card');
    const dropdownContainer = card.querySelector('.remove-dropdown-container');

    // Toggle the form: Check if the form is already open (close it if it is)
    if (dropdownContainer.children.length > 0) {
        dropdownContainer.innerHTML = '';
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
                        data-division="${divisionName}" 
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
    card.querySelector('.apply-add-btn').addEventListener('click', confirmProgramAddition);

    // Attach event listener to the 'Cancel' button
    card.querySelector('.cancel-add-btn').addEventListener('click', () => {
        dropdownContainer.innerHTML = '';
    });
}

/**
    Adds the new program from the input to the data and updates the UI.
 */
function confirmProgramAddition(event) {
    const button = event.currentTarget;
    const divisionName = button.getAttribute('data-division');
    const card = button.closest('.card');
    const dropdownContainer = card.querySelector('.remove-dropdown-container');
    const inputElement = card.querySelector('.program-input-to-add');
    const programToAdd = inputElement ? inputElement.value.trim() : null;

    // Reset input style from previous errors
    inputElement.style.borderColor = "#ccc";

    // Validate the input
    if (!programToAdd) {
        // Show an error message briefly if the input is empty
        inputElement.style.borderColor = "red";
        inputElement.placeholder = "Please enter a name";
        return;
    }

    // Add to the 'academicDivisions' data structure
    const division = academicDivisions.find(d => d.divisionName === divisionName);
    if (division) {
        // Case-insensitive check for existing program
        const programExists = division.programs.some(
            existingProgram => existingProgram.toLowerCase() === programToAdd.toLowerCase()
        );

        if (programExists) {
            // Show an error message
            inputElement.style.borderColor = "red";
            inputElement.value = ""; // Clear the invalid input
            inputElement.placeholder = `'${programToAdd}' already exists.`;
            return;
        }

        // Add the new program to the array
        division.programs.push(programToAdd);

        // Update the UI list: Always re-render the *full* list with the new program
        const programListUL = card.querySelector('.program-list');
        // Re-render the full list with the required class
        programListUL.innerHTML = division.programs.map(p => `<li class="review-list-items">${p}</li>`).join('');

        // Apply the current global filter state (ON/OFF) to ALL programs on the page
        applyFilterToAllPrograms();

        // Close the form after addition
        dropdownContainer.innerHTML = `<p style="color: green; padding: 5px;">'${programToAdd}' added!</p>`;
        setTimeout(() => dropdownContainer.innerHTML = '', 2000); // Clear message after 2s

        // NOTE: In a real application, you would send an AJAX (fetch) request here 
        // to save the updated 'academicDivisions' data back to the server.
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
        card.querySelector('.remove-dropdown-container').innerHTML = '';

        // Logic is now based on the *new* state
        if (toggleState) { // If toggle is ON (show review only)
            // Use currentYear, and check that the year data exists
            if (currentYear && programsUnderReview[currentYear] && programsUnderReview[currentYear].includes(program)) {
                item.style.display = "list-item";
            } else {
                item.style.display = "none";
                const visibleItems = card.querySelectorAll(".review-list-items:not([style*='display: none'])");
                if (visibleItems.length === 0) {
                    card.style.display = "none";
                }
            }
        } else { // If toggle is OFF (show all)
            item.style.display = "list-item";
            card.style.display = "flex";
        }
    });

    toggle.classList.toggle("active");
})


const yearSelect = document.getElementById("year");

// Set the initial value for the global currentYear on load
currentYear = yearSelect.value;

yearSelect.addEventListener("change", () => {
    // This now updates the global currentYear variable
    currentYear = yearSelect.value;
    console.log(programsUnderReview[currentYear]);

    // NOTE: You may want to trigger a re-render or list filter here
    // if the user changes the year while the toggle is active.
});