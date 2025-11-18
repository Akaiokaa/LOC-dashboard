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

// maps division to a list of its academic programs (for populating the Program dropdown)
// map that conatins all programs under each division
const divisionToProgramsMap = {
  "Fine Arts": ["Music"],
  Humanities: ["Communication Studies"],
  "Social Science": [
    "Anthropology",
    "History",
    "Political Science",
    "Psychology",
  ],
  English: ["English"],
  Science: [
    "Anatomy and Physiology",
    "Biology/Environmental Science",
    "Geology/Oceanography",
  ],
  "Business, Law, and Education": [
    "Accounting",
    "Business Management",
    "Business Marketing/Entrepreneurship",
  ],
  Technology: [
    "Aviation",
    "CAD Design and Engineering Tech.",
    "Natural Resources",
  ],
  "Health Science": ["Practical Nursing", "Physical Therapist Assistant"],
  Trades: ["Automotive Technology", "Manufacturing"],
  "Transitional Studies": ["Health and Physical Education"],
};

// one more map that has programs only under review
const divisionToProgramsReviewMap = {
  Humanities: ["Communication Studies"],
  "Social Science": [
    "History",
    "Political Science",
  ],
  English: ["English"],
  Science: [
    "Biology/Environmental Science",
  ],
  "Business, Law, and Education": [
    "Business Management",
    "Business Marketing/Entrepreneurship",
  ],
  Technology: [
    "Natural Resources",
  ],
  Trades: ["Manufacturing"],
};
const divisionToProgramsReviewMap2025_2026 = {
  "Fine Arts": ["Music"],
  Humanities: ["Communication Studies"],
  "Social Science": [
    "Anthropology",
    "Political Science",
  ],
  Science: [
    "Chemistry",
  ],
  "Business, Law, and Education": [
    "Accounting",
  ],
  Technology: [
    "Aviation",
  ],
  Trades: ["Automotive Technology",],
  "Transitional Studies": ["Health and Physical Education"],
};

const programDetailsMap = {
  Music: {
    payees: [
      { name: "Sam", amount: 333.0 },
      { name: "Kelly", amount: 333.0 },
      { name: "Ruth", amount: 333.0 },
    ],
    hasBeenPaid: "Emails sent to Building Admins on 5/2/2025",
    reportSubmitted: "",
    notes:
      "Yes! Sam, Kelly, and Ruth all work on this together and divide the money three ways.",
  },
  "Communication Studies": {
    payees: [],
    hasBeenPaid: "Emails sent to Building Admins on 5/2/2025",
    reportSubmitted: "",
    notes: "No",
  },
  Anthropology: {
    payees: [
      { name: "Madeleine", amount: 500.0 },
      { name: "Joy Crawford", amount: 500.0 },
    ],
    hasBeenPaid: "Emails sent to Building Admins on 5/2/2025",
    reportSubmitted: "",
    notes: "Yes! Joy and Madeleine (Madeleine gets paid, Joy is a mentor)",
  },
  History: {
    payees: [],
    hasBeenPaid: "Emails sent to Building Admins on 5/2/2025",
    reportSubmitted: "",
    notes: "No for this round",
  },
  "Political Science": {
    payees: [
      { name: "Lindsey", amount: 500.0 },
      { name: "Yoav", amount: 500.0 },
    ],
    hasBeenPaid: "Emails sent to Building Admins on 5/2/2025",
    reportSubmitted: "Submitted 6/15",
    notes: "Yes! Lindsey Smith and Yoav will do a project",
  },
  Psychology: {
    payees: [
      { name: "Joy", amount: 500.0 },
      { name: "Jerry", amount: 500.0 },
    ],
    hasBeenPaid: "Emails sent to Building Admins on 5/2/2025",
    reportSubmitted: "Submitted 6/15",
    notes: "Yes! Joy and Jerry will do a project together",
  },
  English: {
    payees: [
      { name: "Aley Martin", amount: 175.0 },
      { name: "Claire Salcedo", amount: 175.0 },
      { name: "Ericka Nelson", amount: 175.0 },
      { name: "Jake", amount: 475.0 },
    ],
    hasBeenPaid: "Emails sent to Building Admins on 5/2/2025",
    reportSubmitted: "Report to be completed in year #2",
    notes:
      "Yes! See notes on adjuncts to pay. Will submit report next year 2025-2026",
  },
  "Anatomy and Physiology": {
    payees: [],
    hasBeenPaid: "Emails sent to Building Admins on 5/2/2025",
    reportSubmitted: "",
    notes: "Initial Invite Sent from Julie 9/26/24. Follow up on 10/21",
  },
  "Biology/Environmental Science": {
    payees: [
      { name: "Leo Studach", amount: 334.0 },
      { name: "Stephanie Hoffman", amount: 333.0 },
      { name: "Danny Najera", amount: 333.0 },
    ],
    hasBeenPaid: "Emails sent to Building Admins on 5/2/2025",
    reportSubmitted: "Report coming this summer",
    notes: "Yes, they are doing a 2-year project with majors level Bio classes",
  },
  "Geology/Oceanography": {
    payees: [],
    hasBeenPaid: "Emails sent to Building Admins on 5/2/2025",
    reportSubmitted: "",
    notes:
      "Initial Invite Sent from Julie 9/26/24. Follow up on 10/21 and 11/20",
  },
  Accounting: {
    payees: [],
    hasBeenPaid: "Emails sent to Building Admins on 5/2/2025",
    reportSubmitted: "",
    notes: "Initial Invite Sent from Julie 9/26/24. Follow up on 10/21",
  },
  "Business Management": {
    payees: [],
    hasBeenPaid: "Emails sent to Building Admins on 5/2/2025",
    reportSubmitted: "",
    notes: "Initial Invite Sent from Julie 9/26/24. Follow up on 10/21",
  },
  "Business Marketing/Entrepreneurship": {
    payees: [],
    hasBeenPaid: "Emails sent to Building Admins on 5/2/2025",
    reportSubmitted: "",
    notes: "Initial Invite Sent from Julie 9/26/24. Follow up on 10/21",
  },
  Aviation: {
    payees: [{ name: "Tad Henry", amount: 1000.0 }],
    hasBeenPaid: "Emails sent to Building Admins on 5/2/2025",
    reportSubmitted: "",
    notes: "Yes! Tad Henry is taking this on",
  },
  "CAD Design and Engineering Tech.": {
    payees: [{ name: "Seunghye Jang", amount: 1000.0 }],
    hasBeenPaid: "Emails sent to Building Admins on 5/2/2025",
    reportSubmitted: "Yes",
    notes: "Yes! Seunghye Jeng",
  },
  "Natural Resources": {
    payees: [],
    hasBeenPaid: "Emails sent to Building Admins on 5/2/2025",
    reportSubmitted: "",
    notes:
      "Can't this year due to so many faculty in their department in the tenure process.",
  },
  "Practical Nursing": {
    payees: [],
    hasBeenPaid: "Emails sent to Building Admins on 5/2/2025",
    reportSubmitted: "",
    notes: "Not this time around",
  },
  "Physical Therapist Assistant": {
    payees: [
      { name: "Pam Kikillus", amount: 500.0 },
      { name: "Anna Neil", amount: 500.0 },
    ],
    hasBeenPaid: "Emails sent to Building Admins on 5/2/2025",
    reportSubmitted: "Yes",
    notes: "Yes! Pam and Anna will do this",
  },
  "Automotive Technology": {
    payees: [],
    hasBeenPaid: "Emails sent to Building Admins on 5/2/2025",
    reportSubmitted: "",
    notes: "Initial Invite Sent from Julie 9/26/24. Follow up on 10/21",
  },
  Manufacturing: {
    payees: [],
    hasBeenPaid: "Emails sent to Building Admins on 5/2/2025",
    reportSubmitted: "",
    notes:
      "Yes! The Manufacturing program (Bradley Chin - lead) will participate in the Program Outcomes Assessment this year",
  },
  "Health and Physical Education": {
    payees: [],
    hasBeenPaid: "",
    reportSubmitted: "",
    notes: "Not this time around",
  },
};
