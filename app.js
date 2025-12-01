import express from "express";
import { programsUnderReview } from "./public/data/yearData.js";
import { academicDivisions } from "./public/data/divisionsData.js";
import { mergeRecordsWithPayees } from "./public/js/summary.js";
import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(express.static("public"));

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));

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

const reports = [];

let username = "";

// define a default "route" ('/')
// req: contains information about the incoming request
// res: allows us to send back a response to the client
app.get("/", async (req, res) => {
  const [divisions] = await pool.query(
    "SELECT division_id, division_name, img FROM Divisions"
  );
  const [programs] = await pool.query(
    "SELECT program_id, program_name, division_id FROM Programs"
  );
  const academicDivisions1 = divisions.map((div) => ({
    ...div,
    programs: programs.filter(
      (p) => Number(p.division_id) === Number(div.division_id)
    ),
  }));
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
    programFields,
    payees,
    reviewYear,
    username,
  });
});

app.post("/submit_login", (req, res) => {
  username = req.body.username;
  res.render("home", { academicDivisions, username });
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
