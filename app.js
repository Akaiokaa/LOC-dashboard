import express from "express";

const app = express();

app.use(express.static("public"));

const PORT = 3007;

// define a default "route" ('/')
// req: contains information about the incoming request
// res: allows us to send back a response to the client
app.get("/", (req, res) => {
  res.sendFile(`${import.meta.dirname}/views/home.html`);
});

// --- 2. Route for the Math Department Page ---
app.get("/departments/math.html", (req, res) => {
  res.sendFile(`${import.meta.dirname}/views/departments/math.html`);
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
  console.log(
    `Access Math Page at: http://localhost:${PORT}/departments/math.html`
  );
});
