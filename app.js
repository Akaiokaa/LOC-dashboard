import express from "express";
// import { programsUnderReview } from "./public/data/yearData.js";
import { mergeRecordsWithPayees } from "./public/js/summary.js";
import methodOverride from "method-override";
import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(express.static("public"));
app.use(express.json());


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
  return divisions.map((division) => ({
    division_id: division.division_id,
    divisionName: division.division_name,
    img: division.img,
    programs: programsByDivision[division.division_id] || [],
  }));
}

// ROUTE TO ADD A PROGRAM, ASSESSMENT, AND SCHEDULE ENTRY
app.post("/add-program", async (req, res) => {
  const { programName, divisionId, selectedYear } = req.body;
  let connection;

  console.log(`[ADD] Received request to add program: ${programName} (Division ID: ${divisionId})`);

  if (!programName || !divisionId) {
    console.error("[ADD] Missing program name or division ID.");
    return res.status(400).json({ success: false, message: "Missing data." });
  }

  try {
    // 1. Get a connection and start a transaction for atomic operation
    connection = await pool.getConnection();
    await connection.beginTransaction();
    console.log("[ADD] Transaction started.");

    // --- STEP 1: INSERT into Programs table ---
    const programSql = "INSERT INTO Programs (program_name, division_id) VALUES (?, ?)";
    const [programResult] = await connection.query(programSql, [programName, divisionId]);
    const newProgramId = programResult.insertId;
    console.log(`[ADD] Program inserted. New Program ID: ${newProgramId}`);

    // --- STEP 2: INSERT into Program_Assessment table ---
    // Use default values for a brand new program
    // NOTE: adjust academic_year (e.g., '2024', or use a variable)
    const assessmentSql = `
        INSERT INTO Program_Assessment 
        (program_id, academic_year, report_submitted, notes) 
        VALUES (?, ?, ?, ?)
    `;
    const [assessmentResult] = await connection.query(assessmentSql, [newProgramId, selectedYear, 'No', '']);
    console.log(`[ADD] Program_Assessment inserted. New Assessment ID: ${assessmentResult.insertId}`);

    // --- STEP 3: INSERT into PAI_Schedule table ---
    // Set the first review year (e.g., 5 years from now)
    // You may need to adjust the review_year (e.g., '2028', or use a calculation)
    const scheduleSql = `
        INSERT INTO PAI_Schedule 
        (program_id, review_year) 
        VALUES (?, ?)
    `;
    // Use selectedYear for PAI_Schedule
    await connection.query(scheduleSql, [newProgramId, selectedYear]);
    console.log("[ADD] PAI_Schedule inserted.");


    // 4. Commit the transaction if all INSERTS succeeded
    await connection.commit();
    console.log("[ADD] Transaction committed successfully.");

    res.json({ success: true, message: "Program, assessment, and schedule created!" });

  } catch (err) {
    // If any error occurred, rollback the transaction
    if (connection) {
      await connection.rollback();
      console.log("[ADD] Transaction rolled back due to error.");
    }

    console.error("[ADD] Database error adding program:", err);
    // Note: The `ER_DUP_ENTRY` error (1062) means a program with that name already exists.
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ success: false, message: `Program '${programName}' already exists.` });
    }

    res.status(500).json({ success: false, message: "Database error during program creation." });

  } finally {
    // Always release the connection
    if (connection) {
      connection.release();
      console.log("[ADD] Database connection released.");
    }
  }
});

// ROUTE TO REMOVE A PROGRAM, ASSESSMENT, AND SCHEDULE ENTRY
app.post("/remove-program", async (req, res) => {
  const { programName, divisionId } = req.body;
  let connection;

  console.log(`[REMOVE] Request to remove program: ${programName} (Division ID: ${divisionId})`);

  if (!programName || !divisionId) {
    console.error("[REMOVE] Missing program name or division ID.");
    return res.status(400).json({ success: false, message: "Missing data." });
  }

  try {
    // 1. Get a connection and start a transaction for atomic operation
    connection = await pool.getConnection();
    await connection.beginTransaction();
    console.log("[REMOVE] Transaction started.");

    // --- STEP 2: Find the program_id ---
    // This MUST be the first step after transaction start
    const [programRows] = await connection.query(
      "SELECT program_id FROM Programs WHERE program_name = ? AND division_id = ?",
      [programName, divisionId]
    );

    if (programRows.length === 0) {
      // Program not found, likely already deleted. Commit and exit.
      await connection.commit();
      console.log("[REMOVE] Program not found, committing empty transaction.");
      return res.json({ success: true, message: "Program not found (already removed)." });
    }
    
    // Assign programId here, BEFORE it's used
    const programId = programRows[0].program_id; 
    console.log(`[REMOVE] Program ID found: ${programId}`);


    // --- STEP 3: DELETE FROM Assessment_Payments (Child of Program_Assessment) ---
    // We need to find the assessment_ids associated with this program first
    const [assessments] = await connection.query(
      "SELECT assessment_id FROM Program_Assessment WHERE program_id = ?",
      [programId] // <--- programId is now defined
    );

    if (assessments.length > 0) {
      const assessmentIds = assessments.map(a => a.assessment_id);
      // Delete payments for these assessments
      const [deletePaymentsResult] = await connection.query(
        `DELETE FROM Assessment_Payments WHERE assessment_id IN (?)`,
        [assessmentIds]
      );
      console.log(`[REMOVE] Deleted ${deletePaymentsResult.affectedRows} records from Assessment_Payments.`);
    }


    // --- STEP 4: DELETE from Program_Assessment table (Child of Programs) ---
    // Must be done BEFORE deleting from Programs due to Foreign Key Constraint
    const [deleteAssessmentResult] = await connection.query(
      "DELETE FROM Program_Assessment WHERE program_id = ?",
      [programId]
    );
    console.log(`[REMOVE] Deleted ${deleteAssessmentResult.affectedRows} related records from Program_Assessment.`);


    // --- STEP 5: DELETE from PAI_Schedule table (Child of Programs) ---
    // Must also be done BEFORE deleting from Programs
    const [deleteScheduleResult] = await connection.query(
      "DELETE FROM PAI_Schedule WHERE program_id = ?",
      [programId]
    );
    console.log(`[REMOVE] Deleted ${deleteScheduleResult.affectedRows} related records from PAI_Schedule.`);

    // --- STEP 6: DELETE from Programs table (the parent record) ---
    const [deleteProgramResult] = await connection.query(
      "DELETE FROM Programs WHERE program_id = ?",
      [programId]
    );
    console.log(`[REMOVE] Deleted ${deleteProgramResult.affectedRows} program '${programName}' from Programs.`);


    // 7. Commit the transaction if all DELETES succeeded
    await connection.commit();
    console.log("[REMOVE] Transaction committed successfully.");

    res.json({ success: true, message: "Program and all related records removed!" });
  } catch (err) {
    // If any error occurred, rollback the transaction
    if (connection) {
      await connection.rollback();
      console.log("[REMOVE] Transaction rolled back due to error.");
    }

    console.error("[REMOVE] Database error removing program:", err);
    res.status(500).json({ success: false, message: "Database error." });

  } finally {
    // Always release the connection
    if (connection) {
      connection.release();
      console.log("[REMOVE] Database connection released.");
    }
  }
});

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
    "SELECT division_id, p.program_id, program_name, assessment_id, academic_year, is_scheduled, has_been_paid, report_submitted, notes FROM Programs AS p LEFT JOIN Program_Assessment AS pa ON p.program_id = pa.program_id"
  );
  const [divisionFields] = await pool.query(
    "SELECT DISTINCT d.division_id, division_name, dean, pen_contact, loc_rep, chair FROM Divisions AS d LEFT JOIN Programs AS p ON p.division_id = d.division_id;"
  );

  const [payees] = await pool.query(
    "SELECT assessment_id, p.payee_id, payee_name, amount  FROM Payees AS p JOIN Assessment_Payments AS ap ON p.payee_id = ap.payee_id"
  );

  // Fetch Review Schedule (for review year data)
  const [reviewYearData] = await pool.query(
    "SELECT program_id, review_year FROM PAI_Schedule"
  );

  // Merge reviewYear into programFields for filtering purposes on the client side
  const reviewYearMap = reviewYearData.reduce((map, item) => {
    map[item.program_id] = item.review_year;
    return map;
  }, {});

  // Use the PAI_Schedule review_year as the 'academic_year' for the /form view.
  // This is the property formData.js is now filtering on.
  const programsWithReviewYear = programFields.map(program => ({
    ...program,
    academic_year: reviewYearMap[program.program_id] || program.academic_year,
  }));

  res.render("form", {
    divisionFields,
    programFields: programsWithReviewYear,
    payees,
    reviewYear: reviewYearData,
    username,
  });
});

// update divisions table
app.put("/divisions/:id", async (req, res) => {
  const { dean, pen_contact, loc_rep, chair } = req.body;
  const division_id = req.params.id;
  await pool.query(
    `UPDATE Divisions SET dean = ?, pen_contact = ?, loc_rep = ? WHERE division_id = ?`,
    [dean, pen_contact, loc_rep, division_id]
  );

  await pool.query(`UPDATE Programs SET chair = ? WHERE division_id = ?`, [
    chair,
    division_id,
  ]);

  res.redirect("/form");
});

app.post("/submit_program/:id", async (req, res) => {
  const connection = await pool.getConnection();
  await connection.beginTransaction();

  const { report_submitted, notes, academic_year, payee_name, amount } =
    req.body;
  const assessment_id = req.params.id;

  try {
    // 1. Update Assessment Metadata
    await connection.query(
      `UPDATE Program_Assessment 
         SET report_submitted = ?, notes = ?, academic_year = ? 
         WHERE assessment_id = ?`,
      [report_submitted, notes, academic_year, assessment_id]
    );

    // 2. CLEAR existing payments for this assessment
    await connection.query(
      `DELETE FROM Assessment_Payments WHERE assessment_id = ?`,
      [assessment_id]
    );

    // 3. Re-insert the Payees
    const names = [].concat(payee_name || []);
    const amounts = [].concat(amount || []);

    for (let i = 0; i < names.length; i++) {
      const name = names[i];
      const currentAmount = amounts[i];

      if (!name || !currentAmount) continue; // Skip if name or amount is missing

      // Find or Create Payee (Requires payee_name to have a UNIQUE index)
      const [payeeResult] = await connection.query(
        `INSERT INTO Payees (payee_name) VALUES (?) 
             ON DUPLICATE KEY UPDATE payee_id = LAST_INSERT_ID(payee_id)`,
        [name]
      );
      
      let payee_id = payeeResult.insertId;

      // FIX: If the payee already exists, insertId will be 0. 
      // We need to manually SELECT the ID in that case.
      if (payee_id === 0) {
        const [existingPayee] = await connection.query(
          `SELECT payee_id FROM Payees WHERE payee_name = ?`,
          [name]
        );
        if (existingPayee.length > 0) {
            payee_id = existingPayee[0].payee_id;
        } else {
            // Should not happen, but as a safeguard
            throw new Error(`Could not find or create payee: ${name}`);
        }
      }

      // Insert Link
      await connection.query(
        `INSERT INTO Assessment_Payments (assessment_id, payee_id, amount) VALUES (?, ?, ?)`,
        [assessment_id, payee_id, currentAmount]
      );
    }

    await connection.commit();
    res.redirect("/form");

  } catch (err) {
    await connection.rollback();
    console.error(err);
    res.status(500).send("Error saving program");
  } finally {
    connection.release();
  }
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

app.get("/schedule", async (req, res) => {
  try {
    const [assessments] = await pool.query(`
      SELECT 
      Programs.program_name, review_year
      FROM PAI_Schedule
      JOIN Programs ON PAI_Schedule.program_id = Programs.program_id
    `);

    // Render EJS and pass the data
    res.render("schedule", { username, assessments });
    console.log(assessments);

  } catch (err) {
    console.error(err);
    res.status(500).send("Database error");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
