let artDepartment = {
  division: "Fine Arts",
  dean: "Christie Gilliland",
  pen: "Liz Peterson",
  locRep: "Monica Bowen",
  chair: "Paul Metevier",
  payees: ["Sam = $333, Kelly =  = $333, Ruth = $333"],
  hasBeenPaid: ["Emails sent to Building Admins on 5/2/2025"],
  reportSubmitted: [],
  notes: ["Yes! Sam, Kelly, and Ruth all work on this together and divide the money three ways."],
};

let humanitiesDepartment = {
  division: "Humanities",
  dean: "Jamie Fitzgerald",
  pen: "Liz Peterson",
  locRep: "Lisa Luengo",
  chair: "Katie Cunnion",
  payees: [],
  hasBeenPaid: ["Emails sent to Building Admins on 5/2/2025"],
  reportSubmitted: [],
  notes: ["No"],
};

let socialScienceDepartment = {
  division: "Social Science",
  dean: "Christie Gilliland",
  pen: "Liz Peterson",
  locRep: "Joy Crawford",
  chair: "Mark Thomason",
  payees: ["Madeleine = $500, Joy Crawford = $500", "Lindsey = $500, Yoav = $500", "Joy = $500, Jerry = $500"],
  hasBeenPaid: ["Emails sent to Building Admins on 5/2/2025"],
  reportSubmitted: ["Submitted 6/15"],
  notes: ["Yes! Joy and Madeleine (Madeleine gets paid, Joy is a mentor)", "No for this round", "Yes! Lindsey Smith and Yoav will do a project", "Yes! Joy and Jerry will do a project together"],
};

let englishDepartment = {
  division: "English",
  dean: "Jamie Fitzgerald",
  pen: "Liz Peterson",
  locRep: "Jake Frye",
  chair: "Ian Sherman",
  payees: ["Aley Martin: $175, Claire Salcedo: $175, Ericka Nelson: $175, Jake: $475"],
  hasBeenPaid: ["Emails sent to Building Admins on 5/2/2025"],
  reportSubmitted: ["Report to be completed in year #2"],
  notes: ["Yes! See notes on adjuncts to pay. Will submit report next year 2025-2026"],
};

let scienceDepartment = {
  division: "Science",
  dean: "Miebeth Bustillo-Booth",
  pen: "Heather Lambert",
  locRep: "Nicole Feider",
  chair: "Katy Shaw and Danny Najera",
  payees: ["$334.00 - Leo Studach\n$333.00 - Stephanie Hoffman\n$333.00 - Danny Najera"],
  hasBeenPaid: ["Emails sent to Building Admins on 5/2/2025"],
  reportSubmitted: ["Report coming this summer"],
  notes: ["Initial Invite Sent from Julie 9/26/24. Follow up on 10/21", "Yes, they are doing a 2-year project with majors level Bio classes", "Initial Invite Sent from Julie 9/26/24. Follow up on 10/21 and 11/20"],
};

let technologyDepartment = {
  division: "Technology",
  dean: "Lea Ann Simpson",
  pen: "Angie Brenner",
  locRep: "Josh Archer",
  chair: "Michael Wood",
  payees: ["Tad Henry = $1000", "Seunghye Jang = $1000"],
  hasBeenPaid: ["Emails sent to Building Admins on 5/2/2025"],
  reportSubmitted: ["Yes"],
  notes: ["Yes! Tad Henry is taking this on", "Yes! Seunghye Jeng", "Can't this year due to so many faculty in their department in the tenure process."],
};

let healthDepartment = {
  division: "Health Science",
  dean: "Lionel Candido Flores",
  pen: null,
  locRep: "Thom Jackson",
  chair: "Leslie Kessler",
  payees: ["Pam Kikillus = $500, Anna Neil = $500"],
  hasBeenPaid: ["Emails sent to Building Admins on 5/2/2025"],
  reportSubmitted: ["Yes"],
  notes: ["Not this time around", "Yes! Pam and Anna will do this"],
};

let tradesDepartment = {
  division: "Trades",
  dean: "Lea Ann Simpson",
  pen: "Mary Singer",
  locRep: "Ben Orr",
  chair: "David Lewis",
  payees: [],
  hasBeenPaid: ["Emails sent to Building Admins on 5/2/2025"],
  reportSubmitted: [],
  notes: ["Initial Invite Sent from Julie 9/26/24. Follow up on 10/21", "Yes! The Manufacturing program (Bradley Chin - lead) will participate in the Program Outcomes Assessment this year"],
};

let businessLawEducationDepartment = {
  division: "Business, Law, and Education",
  dean: "Lea Ann Simpson",
  pen: "Mary Singer",
  locRep: "Jane Swenson",
  chair: "Lea Ann Simpson",
  payees: [],
  hasBeenPaid: ["Emails sent to Building Admins on 5/2/2025"],
  reportSubmitted: [],
  notes: ["Initial Invite Sent from Julie 9/26/24. Follow up on 10/21"],
};

let transitionalStudiesDepartment = {
  division: "Transitional Studies",
  dean: "Lionel Candido Flores",
  pen: null,
  locRep: "Thom Jackson",
  chair: null,
  payees: [],
  hasBeenPaid: [],
  reportSubmitted: [],
  notes: ["Not this time around"],
};

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

const divisionToProgramsMap = {
  "Business, Law, and Education": [
    "Accounting",
    "Business Management",
    "Business Marketing/Entrepreneurship"
  ],
  "English": [
    "English"
  ],
  "Fine Arts": [
    "Music"
  ],
  "Health Science": [
    "Practical Nursing",
    "Physical Therapist Assistant"
  ],
  "Humanities": [
    "Communication Studies"
  ],
  "Science": [
    "Anatomy and Physiology",
    "Biology/Environmental Science",
    "Geology/Oceanography"
  ],
  "Social Science": [
    "Anthropology",
    "History",
    "Political Science",
    "Psychology"
  ],
  "Technology": [
    "Aviation",
    "CAD Design and Engineering Tech.",
    "Natural Resources"
  ],
  "Trades": [
    "Automotive Technology",
    "Manufacturing"
  ],
  "Transitional Studies": [
    "Health and Physical Education"
  ]
};