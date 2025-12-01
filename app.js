import express from "express";
// import { programsUnderReview } from "./public/data/yearData.js";
import { mergeRecordsWithPayees } from "./public/js/summary.js";
import methodOverride from "method-override";
import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(express.static("public"));

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
const pool = mysql
  .createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
  })
  .promise();

const PORT = 3007;

// const reports = [];

let username = "";

async function fetchProgramsUnderReviewByYear() {
  const [reviews] = await pool.query(`
    SELECT 
      pr.program_name, 
      sch.review_year
    FROM PAI_Schedule AS sch
    JOIN Programs AS pr ON sch.program_id = pr.program_id
    ORDER BY sch.review_year, pr.program_name
  `);

  const programsUnderReviewByYear = {};
  for (const row of reviews) {
    if (!programsUnderReviewByYear[row.review_year]) {
      programsUnderReviewByYear[row.review_year] = [];
    }
    programsUnderReviewByYear[row.review_year].push(row.program_name);
  }
  return programsUnderReviewByYear;
}

async function fetchHomeDivisionsData() {
  const [divisions] = await pool.query(
    "SELECT division_id, division_name, img FROM Divisions ORDER BY division_id"
  );
  const [programs] = await pool.query(
    "SELECT program_name, division_id FROM Programs ORDER BY program_name"
  );

  // Group programs by division_id
  const programsByDivision = programs.reduce((acc, program) => {
    if (!acc[program.division_id]) {
      acc[program.division_id] = [];
    }
    acc[program.division_id].push(program.program_name);
    return acc;
  }, {});

  // Combine divisions with their programs
  return divisions.map(division => ({
    divisionName: division.division_name,
    img: division.img,
    programs: programsByDivision[division.division_id] || [],
  }));
}

// define a default "route" ('/')
// req: contains information about the incoming request
// res: allows us to send back a response to the client
app.get("/", async (req, res) => {
  const academicDivisions = await fetchHomeDivisionsData();
  const programsUnderReview = await fetchProgramsUnderReviewByYear();

  res.render("home", { academicDivisions, username, programsUnderReview });
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/confirm", (req, res) => {
  res.render("confirm", { username });
});

app.get("/summary", async (req, res) => {
  const [records] = await pool.query(
    "SELECT * FROM Divisions AS d JOIN Programs AS p ON d.division_id = p.division_id JOIN Program_Assessment AS a ON p.program_id = a.program_id JOIN Assessment_Payments AS ap ON ap.assessment_id = a.assessment_id"
  );

  const [payees] = await pool.query(`SELECT * FROM Payees`);
  const newRecords = mergeRecordsWithPayees(records, payees);
  console.log(newRecords);
  res.render("summary", { newRecords, payees, username });
});

app.get("/form", async (req, res) => {
  const [programFields] = await pool.query(
    "SELECT division_id, p.program_id, program_name, assessment_id, academic_year, is_scheduled, has_been_paid, report_submitted, notes FROM Programs AS p JOIN Program_Assessment AS pa ON p.program_id = pa.program_id"
  );
  const [divisionFields] = await pool.query(
    "SELECT DISTINCT d.division_id, division_name, dean, pen_contact, loc_rep, chair FROM Divisions AS d JOIN Programs AS p ON p.division_id = d.division_id;"
  );

  const [payees] = await pool.query(
    "SELECT assessment_id, p.payee_id, payee_name, amount  FROM Payees AS p JOIN Assessment_Payments AS ap ON p.payee_id = ap.payee_id"
  );

  const [reviewYear] = await pool.query(
    "SELECT p.program_id, review_year FROM PAI_Schedule AS p JOIN Programs AS pr ON p.program_id = pr.program_id"
  );

  console.log(reviewYear);
  res.render("form", {
    divisionFields,
    programFields: programsWithReviewYear,
    payees,
    reviewYear: reviewYearData,
    username,
  });
});

app.post("/submit_login", (req, res) => {
  username = req.body.username;
  res.redirect("/");
});

app.post("/submit_edit", (req, res) => {
  const report = req.body;
  // add time stamp of submission
  report.timestamp = new Date().toISOString();

  reports.push(report);
  console.log(reports);
  res.render("confirm", { username });
});

app.get("/db_test", async (req, res) => {
  try {
    // SQL query to select all records in Programs
    const sql = "SELECT * FROM Programs";

    // Execute the query
    const [records] = await pool.query(sql);

    // Send data retrieved from the database
    res.send(records);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).send("Database error: ", err.message);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
