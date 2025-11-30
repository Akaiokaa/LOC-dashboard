// maps division to a list of its academic programs (for populating the Program dropdown)
const divisionToProgramsMap = {
  "Fine Arts": [
    "Music",
    "Dance",
    "Drama",
    "Journalism",
    "Visual Arts (Photography/Art)", // Corrected name
  ],
  Humanities: [
    "Foreign Languages",
    "Humanities",
    "Philosophy",
    "Communication Studies",
    "Information Literacy",
    "Counseling Services",
  ],
  "Social Science": [
    "American Ethnic & Minority Studies",
    "Anthropology",
    "History",
    "Political Science",
    "Psychology",
    "Economics",
    "Geography",
    "Sociology", // Added Sociology
  ],
  English: ["English"],
  Science: [
    "Anatomy & Physiology", // Corrected name
    "Biology/Environmental Science",
    "Geology/Oceanography",
    "Chemistry",
    "Physics/Astronomy",
    "Engineering/Computer Science", // Added
  ],
  Mathematics: ["Math"], // Added Math Division
  "Business, Law, and Education": [
    "Accounting",
    "Business Technologies & Administrative Careers",
    "Business Management",
    "Business Marketing/Entrepreneurship (BAS)", // Corrected name
    "Court Reporting & Captioning",
    "Criminal Justice",
    "Early Childhood Education",
  ],
  Technology: [
    "Aviation (AAS/BAS)", // Corrected name
    "CAD-Design and Engineering Technology", // Corrected name
    "Information Technology", // Added
    "Natural Resources",
    "Water/Wastewater Technology", // Added
  ],
  "Health Science": [
    "Practical Nursing*", // Corrected name (matches master list)
    "Physical Therapist Assistant*", // Corrected name (matches master list)
    "Occupational Therapy Assistant*", // Added
    "Emergency Medical Technician/Phlebotomy", // Added
  ],
  Trades: [
    "Automotive Technology",
    "Manufacturing",
    "Carpentry", // Added
    "Mechatronics", // Added
    "Welding Technology", // Added
  ],
  "Transitional Studies": ["Health and Physical Education"],
  "Continuing Education": ["CE"], // Added
};

// Map containing all programs under review, grouped by year and division (Corrected to match PAI Schedule)
const programsUnderReviewByYear = {
  year_23_24: {
    "Fine Arts": ["Journalism"],
    Humanities: ["Communication Studies"],
    "Social Science": ["Geography", "History", "Psychology"],
    English: ["English"],
    Science: ["Biology/Environmental Science"],
    Mathematics: [],
    "Business, Law, and Education": [
      "Business Management",
      "Business Marketing/Entrepreneurship (BAS)",
      "Criminal Justice",
    ],
    Technology: ["Natural Resources"],
    "Health Science": [],
    Trades: ["Manufacturing"],
    "Transitional Studies": [],
    "Continuing Education": [],
  },
  year_24_25: {
    "Fine Arts": ["Drama", "Music", "Visual Arts (Photography/Art)"],
    Humanities: ["Foreign Languages", "Humanities"],
    "Social Science": ["History"],
    English: [],
    Science: ["Chemistry", "Physics/Astronomy"],
    Mathematics: [],
    "Business, Law, and Education": [],
    Technology: [],
    "Health Science": ["Physical Therapist Assistant*"],
    Trades: [],
    "Transitional Studies": [],
    "Continuing Education": [],
  },
  year_25_26: {
    "Fine Arts": [],
    Humanities: ["Philosophy", "Information Literacy"],
    "Social Science": [
      "American Ethnic & Minority Studies",
      "Economics",
      "Sociology",
    ],
    English: [],
    Science: [],
    Mathematics: [],
    "Business, Law, and Education": [
      "Business Technologies & Administrative Careers",
    ],
    Technology: [],
    "Health Science": ["Occupational Therapy Assistant*"],
    Trades: ["Carpentry", "Welding Technology"],
    "Transitional Studies": [],
    "Continuing Education": [],
  },
  year_26_27: {
    "Fine Arts": ["Visual Arts (Photography/Art)"],
    Humanities: ["Counseling Services"],
    "Social Science": ["Anthropology", "Political Science"],
    English: [],
    Science: ["Geology/Oceanography"],
    Mathematics: [],
    "Business, Law, and Education": [
      "Accounting",
      "Court Reporting & Captioning",
      "Early Childhood Education",
    ],
    Technology: ["Aviation (AAS/BAS)", "CAD-Design and Engineering Technology"],
    "Health Science": ["Practical Nursing*"],
    Trades: ["Automotive Technology"],
    "Transitional Studies": [],
    "Continuing Education": [],
  },
  year_27_28: {
    "Fine Arts": ["Dance", "Music", "Journalism"],
    Humanities: ["Foreign Languages", "Humanities"],
    "Social Science": ["Criminal Justice"],
    English: [],
    Science: ["Anatomy & Physiology"],
    Mathematics: ["Math"],
    "Business, Law, and Education": ["Criminal Justice"], // Criminal Justice listed in both 2023-24 and 2027-28
    Technology: ["Information Technology", "Water/Wastewater Technology"],
    "Health Science": [],
    Trades: ["Mechatronics"],
    "Transitional Studies": ["Health and Physical Education"],
    "Continuing Education": ["CE"],
  },
};

// Removed obsolete divisionToProgramsReviewMap2025_2026

const programDetailsMap = {
  // 2024-2025 Assessment Data (Cleaned and Corrected)
  Music: {
    payees: [
      { name: "Sam", amount: 333.0 },
      { name: "Kelly", amount: 333.0 },
      { name: "Ruth Mueller", amount: 333.0 }, // Corrected name
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
      { name: "Joy Crawford", amount: 500.0 }, // Corrected name
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
  "Anatomy & Physiology": {
    // Corrected name
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
  "Business Marketing/Entrepreneurship (BAS)": {
    // Corrected name
    payees: [],
    hasBeenPaid: "Emails sent to Building Admins on 5/2/2025",
    reportSubmitted: "",
    notes: "Initial Invite Sent from Julie 9/26/24. Follow up on 10/21",
  },
  "Aviation (AAS/BAS)": {
    // Corrected name
    payees: [{ name: "Tad Henry", amount: 1000.0 }],
    hasBeenPaid: "Emails sent to Building Admins on 5/2/2025",
    reportSubmitted: "",
    notes: "Yes! Tad Henry is taking this on",
  },
  "CAD-Design and Engineering Technology": {
    // Corrected name
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
  "Practical Nursing*": {
    // Corrected name
    payees: [],
    hasBeenPaid: "Emails sent to Building Admins on 5/2/2025",
    reportSubmitted: "",
    notes: "Not this time around",
  },
  "Physical Therapist Assistant*": {
    // Corrected name
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

  // Remaining programs set to default blank values
  Dance: { payees: [], hasBeenPaid: "", reportSubmitted: "", notes: "" },
  Drama: { payees: [], hasBeenPaid: "", reportSubmitted: "", notes: "" },
  Journalism: { payees: [], hasBeenPaid: "", reportSubmitted: "", notes: "" },
  Music: { payees: [], hasBeenPaid: "", reportSubmitted: "", notes: "" },
  "Visual Arts (Photography/Art)": {
    payees: [],
    hasBeenPaid: "",
    reportSubmitted: "",
    notes: "",
  },
  "Foreign Languages": {
    payees: [],
    hasBeenPaid: "",
    reportSubmitted: "",
    notes: "",
  },
  Humanities: { payees: [], hasBeenPaid: "", reportSubmitted: "", notes: "" },
  Philosophy: { payees: [], hasBeenPaid: "", reportSubmitted: "", notes: "" },
  "Information Literacy": {
    payees: [],
    hasBeenPaid: "",
    reportSubmitted: "",
    notes: "",
  },
  "Counseling Services": {
    payees: [],
    hasBeenPaid: "",
    reportSubmitted: "",
    notes: "",
  },
  "American Ethnic & Minority Studies": {
    payees: [],
    hasBeenPaid: "",
    reportSubmitted: "",
    notes: "",
  },
  Economics: { payees: [], hasBeenPaid: "", reportSubmitted: "", notes: "" },
  Geography: { payees: [], hasBeenPaid: "", reportSubmitted: "", notes: "" },
  Sociology: { payees: [], hasBeenPaid: "", reportSubmitted: "", notes: "" },
  Chemistry: { payees: [], hasBeenPaid: "", reportSubmitted: "", notes: "" },
  "Physics/Astronomy": {
    payees: [],
    hasBeenPaid: "",
    reportSubmitted: "",
    notes: "",
  },
  "Engineering/Computer Science": {
    payees: [],
    hasBeenPaid: "",
    reportSubmitted: "",
    notes: "",
  },
  Math: { payees: [], hasBeenPaid: "", reportSubmitted: "", notes: "" },
  "Business Technologies & Administrative Careers": {
    payees: [],
    hasBeenPaid: "",
    reportSubmitted: "",
    notes: "",
  },
  "Court Reporting & Captioning": {
    payees: [],
    hasBeenPaid: "",
    reportSubmitted: "",
    notes: "",
  },
  "Criminal Justice": {
    payees: [],
    hasBeenPaid: "",
    reportSubmitted: "",
    notes: "",
  },
  "Early Childhood Education": {
    payees: [],
    hasBeenPaid: "",
    reportSubmitted: "",
    notes: "",
  },
  "Information Technology": {
    payees: [],
    hasBeenPaid: "",
    reportSubmitted: "",
    notes: "",
  },
  "Water/Wastewater Technology": {
    payees: [],
    hasBeenPaid: "",
    reportSubmitted: "",
    notes: "",
  },
  "Occupational Therapy Assistant*": {
    payees: [],
    hasBeenPaid: "",
    reportSubmitted: "",
    notes: "",
  },
  "Emergency Medical Technician/Phlebotomy": {
    payees: [],
    hasBeenPaid: "",
    reportSubmitted: "",
    notes: "",
  },
  Carpentry: { payees: [], hasBeenPaid: "", reportSubmitted: "", notes: "" },
  Mechatronics: { payees: [], hasBeenPaid: "", reportSubmitted: "", notes: "" },
  "Welding Technology": {
    payees: [],
    hasBeenPaid: "",
    reportSubmitted: "",
    notes: "",
  },
  CE: { payees: [], hasBeenPaid: "", reportSubmitted: "", notes: "" },
};
