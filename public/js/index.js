import { academicDivisions } from '../data/divisionsData.js';

window.myNavBar = function() {
  let aside = document.getElementById("left-column");
  if (aside.style.display == "block") {
    document.getElementById("left-column").style.display = "none";
  } else {
    document.getElementById("left-column").style.display = "block";
  }
}

window.toggleNavBar = function() {
  const body = document.body;
  
  body.classList.toggle("nav-closed");
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

    // Generate the dropdown HTML
    let optionsHTML = division.programs.map(program => 
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
        
        // Update the UI list
        const programListUL = card.querySelector('.program-list');
        programListUL.innerHTML = division.programs.map(p => `<li>${p}</li>`).join('');

        // Close the dropdown after removal
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
        // Add the new program to the array
        division.programs.push(programToAdd);
        
        // Update the UI list
        const programListUL = card.querySelector('.program-list');
        // This is the same UI update logic from your remove function
        programListUL.innerHTML = division.programs.map(p => `<li>${p}</li>`).join('');

        // Close the form after addition
        dropdownContainer.innerHTML = `<p style="color: green; padding: 5px;">'${programToAdd}' added!</p>`;
        setTimeout(() => dropdownContainer.innerHTML = '', 2000); // Clear message after 2s
        
        // NOTE: In a real application, you would send an AJAX (fetch) request here 
        // to save the updated 'academicDivisions' data back to the server.
    }
}
//Toggle functionality
const toggle = document.getElementById("toggle");
toggle.addEventListener("click", () =>{
    toggle.classList.toggle("active");
})
const yearSelect = document.getElementById("year");
yearSelect.addEventListener("change", () => {
    alert(yearSelect.value);
});
// const burgerToggle = document.getElementById("hamburger-button");
// const footer = document.querySelector("footer");
// burgerToggle.addEventListener("click", () =>{
//     footer.classList.toggle("active");
// })

