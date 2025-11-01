import express from "express";

const app = express();

app.use(express.static("public"));

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));

const PORT = 3007;

const reports = [];

// define a default "route" ('/')
// req: contains information about the incoming request
// res: allows us to send back a response to the client
app.get("/", (req, res) => {
  res.render("home");
});

app.get("/summary", (req, res) => {
  res.render("summary", { reports });
});

app.get("/departments/form", (req, res) => {
  res.render("departments/form");
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
  console.log(
    `Access Form Page at: http://localhost:${PORT}/departments/edit_form.html`
  );
});
