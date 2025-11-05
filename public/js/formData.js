// helper function to handle arrays, nulls, and undefined values cleanly
function formatValue(value) {
    if (Array.isArray(value)) {
        return value.join('; ') || 'N/A';
    }
    return value === null || value === undefined ? 'N/A' : value;
}

// Grab the dropdown
const divisionDropdown = document.getElementById("division");
const programDropdown = document.getElementById('program');

// Update fields whenever dropdown changes
divisionDropdown.addEventListener("change", setFormFields);
programDropdown.addEventListener("change", updateProgramDetails);


//Returns the value using URLSearchParams
function getDivisionFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('division'); // would return Humanites etc.
}

const urlDivision = getDivisionFromUrl(); // Humanites would be stored here.

//If the division exists, then.
if(urlDivision){
    //Loop through the divisions dropdown until you find the matching one.
    for(let i = 0; i < divisionDropdown.options.length; i++){
        if(divisionDropdown.options[i].text === urlDivision){
            //Set the drop down to this option.
            divisionDropdown.selectedIndex = i;
            break;
        }
    }   
    setFormFields(); 
} else {
    setFormFields();
}


// initialize form fields on load
setFormFields();

// updates fields and populates program dropdown on Division change
function setFormFields() {
    clearErrors();
    
    // Get the selected option text
    const selectedText = divisionDropdown.options[divisionDropdown.selectedIndex].text;
    
    // Gets the id of the option
    const deptKey = optionMap.get(selectedText);

    // assign new object to the object in the map
    const myObject = departmentMap.get(deptKey);
    
    // reset Program Dropdown and clear fields if "Select Division" is chosen
    programDropdown.innerHTML = '<option value="none">-- Select Program --</option>';
    if (!myObject) {
        clearDetailFields();
        return;
    }
    
    document.getElementById("dean").value = formatValue(myObject.dean);
    document.getElementById("pen").value = formatValue(myObject.pen);
    document.getElementById("locRep").value = formatValue(myObject.locRep);
    document.getElementById("chair").value = formatValue(myObject.chair);
    document.getElementById("payee").value = formatValue(myObject.payees);
    if(document.getElementById("paid").value != null) {
      document.getElementById("paid").checked = true;
    }
    document.getElementById("report").value = formatValue(myObject.reportSubmitted);
    document.getElementById("notes").value = formatValue(myObject.notes);

    // populate the Program dropdown
    const programs = divisionToProgramsMap[selectedText];
    if (programs) {
        programs.forEach(program => {
            const option = document.createElement('option');
            option.value = program;
            option.textContent = program;
            programDropdown.appendChild(option);
        });
    }
}


// updates fields with program-specific data on program change
function updateProgramDetails() {
    const selectedProgramName = programDropdown.value;

    if (selectedProgramName) {
        // lookup the program-specific data
        const progObject = programDetailsMap[selectedProgramName];
        
        document.getElementById("dean").value = formatValue(progObject.dean);
        document.getElementById("locRep").value = formatValue(progObject.locRep);
        document.getElementById("pen").value = formatValue(progObject.pen);
        document.getElementById("chair").value = formatValue(progObject.chair);

        document.getElementById("payee").value = formatValue(progObject.payees);
        if(progObject.hasBeenPaid != null) {
          document.getElementById("paid").checked = true;
        }
        document.getElementById("report").value = formatValue(progObject.reportSubmitted);
        document.getElementById("notes").value = formatValue(progObject.notes);
    } else {
        setFormFields(); 
    }
}

// helper function to clear all detail fields to "N/A"
function clearDetailFields() {
    const NA = 'N/A';
    document.getElementById("dean").value = NA;
    document.getElementById("locRep").value = NA;
    document.getElementById("pen").value = NA;
    document.getElementById("chair").value = NA;
    document.getElementById("payee").value = NA;
    document.getElementById("paid").checked = false;
    document.getElementById("report").value = NA;
    document.getElementById("notes").value = NA;
}