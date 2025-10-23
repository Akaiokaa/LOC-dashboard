//  <option value="art">Fine Arts</option>
//           <option value="humanities">Humanities</option>
//           <option value="social">Social Science</option>
//           <option value="english">English</option>
//           <option value="science">Science</option>
//           <option value="technology">Technology</option>
//           <option value="health">Health Science</option>
//           <option value="trades">Trades</option>
let socialScienceDepartment ={
  division: "social science",
  dean: "social science",
  pen: "social science",
  locRep: "social science",
  chair: "social science",
}
let scienceDepartment ={
  division: "science",
  dean: "science",
  pen: "science",
  locRep: "science",
  chair: "science",
}
let englishDepartment ={
  division: "english",
  dean: "english",
  pen: "english",
  locRep: "english",
  chair: "english",
}
let artDepartment = {
  division: "art",
  dean: "art",
  pen: "art",
  locRep: "art",
  chair: "art",
};

let humanitiesDepartment = {
  division: "humanities",
  dean: "humanities",
  pen: "humanities",
  locRep: "humanities",
  chair: "humanities",
};

let technologyDepartment = {
  division: "Technology",
  dean: "Miebeth Castillo-Booth",
  pen: "Angie Brenner",
  locRep: "Josh Archer",
  chair: "Michael Wood",
};

const departmentMap = new Map([
  ["art", artDepartment],
  ["humanities", humanitiesDepartment],
  ["technology", technologyDepartment],
  ["english", englishDepartment],
  ["social", socialScienceDepartment],
  ["science", scienceDepartment],
]);

const optionMap = new Map([
  ["Fine Arts", "art"],
  ["Humanities", "humanities"],
  ["Technology", "technology"],
  ["English","english"],
  ["Social Science","social"],
  ["Science","science"],
]);
