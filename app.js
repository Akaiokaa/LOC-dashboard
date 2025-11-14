import express from "express";
import { academicDivisions } from "./public/data/divisionsData.js";
import { programsUnderReview } from "./public/data/yearData.js";

const app = express();

app.use(express.static("public"));

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));

const PORT = 3007;

const reports = [];

let username = "";

// define a default "route" ('/')
// req: contains information about the incoming request
// res: allows us to send back a response to the client
app.get("/", (req, res) => {
  res.render("home", { academicDivisions, username, programsUnderReview});
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/form", (req, res) => {
  res.render("form", { username });
});

app.post("/submit_login", (req, res) => {
  username = req.body.username;
  res.render("home", { academicDivisions, username });
});

app.post("/departments/submit_report", (req, res) => {
  const report = req.body;
  if (!report.paid) {
    report.paid = "No";
  } else {
    report.paid = "Yes";
  }
  // add time stamp of submission
  report.timestamp = new Date().toISOString();

  reports.push(report);
  console.log(reports);
  res.render("confirm");
  // res.json(report);
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});