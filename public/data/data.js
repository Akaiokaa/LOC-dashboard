let artDepartment = {
  division: "Fine Arts",
  dean: "Christie Gilliland",
  pen: "Liz Peterson",
  locRep: "Monica Bowen",
  chair: "Paul Metevier",
};

let humanitiesDepartment = {
  division: "Humanities",
  dean: "Jamie Fitzgerald",
  pen: "Liz Peterson",
  locRep: "Lisa Luengo",
  chair: "Katie Cunnion",
};

let socialScienceDepartment = {
  division: "Social Science",
  dean: "Christie Gilliland",
  pen: "Liz Peterson",
  locRep: "Joy Crawford",
  chair: "Mark Thomason",
};

let englishDepartment = {
  division: "English",
  dean: "Jamie Fitzgerald",
  pen: "Liz Peterson",
  locRep: "Jake Frye",
  chair: "Ian Sherman",
};

let scienceDepartment = {
  division: "Science",
  dean: "Miebeth Bustillo-Booth",
  pen: "Heather Lambert",
  locRep: "Nicole Feider",
  chair: "Katy Shaw and Danny Najera",
};

let technologyDepartment = {
  division: "Technology",
  dean: "Lea Ann Simpson",
  pen: "Angie Brenner",
  locRep: "Josh Archer",
  chair: "Michael Wood",
};

let healthDepartment = {
  division: "Health Science",
  dean: "Lionel Candido Flores",
  pen: null,
  locRep: "Thom Jackson",
  chair: "Leslie Kessler",
};

let tradesDepartment = {
  division: "Trades",
  dean: "Lea Ann Simpson",
  pen: "Mary Singer",
  locRep: "Ben Orr",
  chair: "David Lewis",
};

let businessLawEducationDepartment = {
  division: "Business, Law, and Education",
  dean: "Lea Ann Simpson",
  pen: "Mary Singer",
  locRep: "Jane Swenson",
  chair: "Lea Ann Simpson",
};

let transitionalStudiesDepartment = {
  division: "Transitional Studies",
  dean: "Lionel Candido Flores",
  pen: null,
  locRep: "Thom Jackson",
  chair: null,
};


// maps shorthand keys to department objects
const departmentMap = new Map([
  ["art", artDepartment],
  ["humanities", humanitiesDepartment],
  ["social", socialScienceDepartment],
  ["english", englishDepartment],
  ["technology", technologyDepartment],
  ["science", scienceDepartment],
  ["health", healthDepartment],
  ["trades", tradesDepartment],
  ["business", businessLawEducationDepartment], 
  ["transitional", transitionalStudiesDepartment], 
]);

// maps full division names to shorthand keys for dropdown options
const optionMap = new Map([
  ["Fine Arts", "art"],
  ["Humanities", "humanities"],
  ["Social Science", "social"],
  ["English", "english"],
  ["Technology", "technology"],
  ["Science", "science"],
  ["Health Science", "health"], 
  ["Trades", "trades"], 
  ["Business, Law, and Education", "business"],
  ["Transitional Studies", "transitional"],
]);

// maps division to a list of its academic programs (for populating the Program dropdown)
const divisionToProgramsMap = {
  "Fine Arts": ["Music"],
  "Humanities": ["Communication Studies"],
  "Social Science": ["Anthropology", "History", "Political Science", "Psychology"],
  "English": ["English"],
  "Science": ["Anatomy and Physiology", "Biology/Environmental Science", "Geology/Oceanography"],
  "Business, Law, and Education": ["Accounting", "Business Management", "Business Marketing/Entrepreneurship"],
  "Technology": ["Aviation", "CAD Design and Engineering Tech.", "Natural Resources"],
  "Health Science": ["Practical Nursing", "Physical Therapist Assistant"],
  "Trades": ["Automotive Technology", "Manufacturing"],
  "Transitional Studies": ["Health and Physical Education"],
};


const programDetailsMap = {
  "Music": {
    "division": "Fine Arts",
    "dean": "Christie Gilliland",
    "pen": "Liz Peterson",
    "locRep": "Monica Bowen",
    "chair": "Paul Metevier",
    "payees": "Sam = $333, Kelly =  = $333, Ruth = $333",
    "hasBeenPaid": "Emails sent to Building Admins on 5/2/2025",
    "reportSubmitted": null,
    "notes": "Yes! Sam, Kelly, and Ruth all work on this together and divide the money three ways."
  },
  "Communication Studies": {
    "division": "Humanities",
    "dean": "Jamie Fitzgerald",
    "pen": "Liz Peterson",
    "locRep": "Lisa Luengo",
    "chair": "Katie Cunnion",
    "payees": null,
    "hasBeenPaid": "Emails sent to Building Admins on 5/2/2025",
    "reportSubmitted": null,
    "notes": "No"
  },
  "Anthropology": {
    "division": "Social Science",
    "dean": "Christie Gilliland",
    "pen": "Liz Peterson",
    "locRep": "Joy Crawford",
    "chair": "Mark Thomason",
    "payees": "Madeleine = $500, Joy Crawford = $500",
    "hasBeenPaid": "Emails sent to Building Admins on 5/2/2025",
    "reportSubmitted": null,
    "notes": "Yes! Joy and Madeleine (Madeleine gets paid, Joy is a mentor)"
  },
  "History": {
    "division": "Social Science",
    "dean": "Christie Gilliland",
    "pen": "Liz Peterson",
    "locRep": "Joy Crawford",
    "chair": "Mark Thomason",
    "payees": null,
    "hasBeenPaid": "Emails sent to Building Admins on 5/2/2025",
    "reportSubmitted": null,
    "notes": "No for this round"
  },
  "Political Science": {
    "division": "Social Science",
    "dean": "Christie Gilliland",
    "pen": "Liz Peterson",
    "locRep": "Joy Crawford",
    "chair": "Mark Thomason",
    "payees": "Lindsey = $500, Yoav = $500",
    "hasBeenPaid": "Emails sent to Building Admins on 5/2/2025",
    "reportSubmitted": "Submitted 6/15",
    "notes": "Yes! Lindsey Smith and Yoav will do a project"
  },
  "Psychology": {
    "division": "Social Science",
    "dean": "Christie Gilliland",
    "pen": "Liz Peterson",
    "locRep": "Joy Crawford",
    "chair": "Mark Thomason",
    "payees": "Joy = $500, Jerry = $500",
    "hasBeenPaid": "Emails sent to Building Admins on 5/2/2025",
    "reportSubmitted": "Submitted 6/15",
    "notes": "Yes! Joy and Jerry will do a project together"
  },
  "English": {
    "division": "English",
    "dean": "Jamie Fitzgerald",
    "pen": "Liz Peterson",
    "locRep": "Jake Frye",
    "chair": "Ian Sherman",
    "payees": "Aley Martin: $175, Claire Salcedo: $175, Ericka Nelson: $175, Jake: $475",
    "hasBeenPaid": "Emails sent to Building Admins on 5/2/2025",
    "reportSubmitted": "Report to be completed in year #2",
    "notes": "Yes! See notes on adjuncts to pay. Will submit report next year 2025-2026"
  },
  "Anatomy and Physiology": {
    "division": "Science",
    "dean": "Miebeth Bustillo-Booth",
    "pen": "Heather Lambert",
    "locRep": "Nicole Feider",
    "chair": "Katy Shaw and Danny Najera",
    "payees": null,
    "hasBeenPaid": "Emails sent to Building Admins on 5/2/2025",
    "reportSubmitted": null,
    "notes": "Initial Invite Sent from Julie 9/26/24. Follow up on 10/21"
  },
  "Biology/Environmental Science": {
    "division": "Science",
    "dean": "Miebeth Bustillo-Booth",
    "pen": "Heather Lambert",
    "locRep": "Nicole Feider",
    "chair": "Katy Shaw and Danny Najera",
    "payees": "$334.00 - Leo Studach\n$333.00 - Stephanie Hoffman\n$333.00 - Danny Najera",
    "hasBeenPaid": "Emails sent to Building Admins on 5/2/2025",
    "reportSubmitted": "Report coming this summer",
    "notes": "Yes, they are doing a 2-year project with majors level Bio classes"
  },
  "Geology/Oceanography": {
    "division": "Science",
    "dean": "Miebeth Bustillo-Booth",
    "pen": "Heather Lambert",
    "locRep": "Nicole Feider",
    "chair": "Katy Shaw and Danny Najera",
    "payees": null,
    "hasBeenPaid": "Emails sent to Building Admins on 5/2/2025",
    "reportSubmitted": null,
    "notes": "Initial Invite Sent from Julie 9/26/24. Follow up on 10/21 and 11/20"
  },
  "Accounting": {
    "division": "Business, Law, and Education",
    "dean": "Lea Ann Simpson",
    "pen": "Mary Singer",
    "locRep": "Jane Swenson",
    "chair": "Lea Ann Simpson",
    "payees": null,
    "hasBeenPaid": "Emails sent to Building Admins on 5/2/2025",
    "reportSubmitted": null,
    "notes": "Initial Invite Sent from Julie 9/26/24. Follow up on 10/21"
  },
  "Business Management": {
    "division": "Business, Law, and Education",
    "dean": "Lea Ann Simpson",
    "pen": "Mary Singer",
    "locRep": "Jane Swenson",
    "chair": "Lea Ann Simpson",
    "payees": null,
    "hasBeenPaid": "Emails sent to Building Admins on 5/2/2025",
    "reportSubmitted": null,
    "notes": "Initial Invite Sent from Julie 9/26/24. Follow up on 10/21"
  },
  "Business Marketing/Entrepreneurship": {
    "division": "Business, Law, and Education",
    "dean": "Lea Ann Simpson",
    "pen": "Mary Singer",
    "locRep": "Jane Swenson",
    "chair": "Lea Ann Simpson",
    "payees": null,
    "hasBeenPaid": "Emails sent to Building Admins on 5/2/2025",
    "reportSubmitted": null,
    "notes": "Initial Invite Sent from Julie 9/26/24. Follow up on 10/21"
  },
  "Aviation": {
    "division": "Technology",
    "dean": "Lea Ann Simpson",
    "pen": "Angie Brenner",
    "locRep": "Josh Archer",
    "chair": "Michael Wood",
    "payees": "Tad Henry = $1000",
    "hasBeenPaid": "Emails sent to Building Admins on 5/2/2025",
    "reportSubmitted": null,
    "notes": "Yes! Tad Henry is taking this on"
  },
  "CAD Design and Engineering Tech.": {
    "division": "Technology",
    "dean": "Lea Ann Simpson",
    "pen": "Angie Brenner",
    "locRep": "Josh Archer",
    "chair": "Michael Wood",
    "payees": "Seunghye Jang = $1000",
    "hasBeenPaid": "Emails sent to Building Admins on 5/2/2025",
    "reportSubmitted": "Yes",
    "notes": "Yes! Seunghye Jeng"
  },
  "Natural Resources": {
    "division": "Technology",
    "dean": "Lea Ann Simpson",
    "pen": "Angie Brenner",
    "locRep": "Josh Archer",
    "chair": "Michael Wood",
    "payees": null,
    "hasBeenPaid": "Emails sent to Building Admins on 5/2/2025",
    "reportSubmitted": null,
    "notes": "Can't this year due to so many faculty in their department in the tenure process."
  },
  "Practical Nursing": {
    "division": "Health Science",
    "dean": "Lionel Candido Flores",
    "pen": null,
    "locRep": "Thom Jackson",
    "chair": "Leslie Kessler",
    "payees": null,
    "hasBeenPaid": "Emails sent to Building Admins on 5/2/2025",
    "reportSubmitted": null,
    "notes": "Not this time around"
  },
  "Physical Therapist Assistant": {
    "division": "Health Science",
    "dean": "Lionel Candido Flores",
    "pen": null,
    "locRep": "Thom Jackson",
    "chair": "Leslie Kessler",
    "payees": "Pam Kikillus = $500, Anna Neil = $500",
    "hasBeenPaid": "Emails sent to Building Admins on 5/2/2025",
    "reportSubmitted": "Yes",
    "notes": "Yes! Pam and Anna will do this"
  },
  "Automotive Technology": {
    "division": "Trades",
    "dean": "Lea Ann Simpson",
    "pen": "Mary Singer",
    "locRep": "Ben Orr",
    "chair": "David Lewis",
    "payees": null,
    "hasBeenPaid": "Emails sent to Building Admins on 5/2/2025",
    "reportSubmitted": null,
    "notes": "Initial Invite Sent from Julie 9/26/24. Follow up on 10/21"
  },
  "Manufacturing": {
    "division": "Trades",
    "dean": "Lea Ann Simpson",
    "pen": "Mary Singer",
    "locRep": "Ben Orr",
    "chair": "David Lewis",
    "payees": null,
    "hasBeenPaid": "Emails sent to Building Admins on 5/2/2025",
    "reportSubmitted": null,
    "notes": "Yes! The Manufacturing program (Bradley Chin - lead) will participate in the Program Outcomes Assessment this year"
  },
  "Health and Physical Education": {
    "division": "Transitional Studies",
    "dean": "Lionel Candido Flores",
    "pen": null,
    "locRep": "Thom Jackson",
    "chair": null,
    "payees": null,
    "hasBeenPaid": null,
    "reportSubmitted": null,
    "notes": "Not this time around"
  }
};