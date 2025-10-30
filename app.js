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
  res.render("summary");
});

// --- 2. Route for the Math Department Page ---
app.get("/departments/math", (req, res) => {
  res.render("departments/math");
});

app.post("/departments/submit_report", (req, res) => {
  const report = req.body;
  reports.push(report);
  res.render("confirm", { report });
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
  console.log(
    `Access Math Page at: http://localhost:${PORT}/departments/math.html`
  );
});
