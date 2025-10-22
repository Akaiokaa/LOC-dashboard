import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url'; // NEW: Import utility for converting file URLs

// UPDATED __dirname CALCULATION
// This handles converting the 'file://' URL from import.meta.url into a proper
// OS-specific path,     resolving the 'C:\C:\' error on Windows.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Set up the static directory. Files in 'public' are served directly.
app.use(express.static(path.join(__dirname, 'public')));

const PORT = 3007;

// --- 1. Route for the Home Page ---
// This serves the home page from the views folder for both the root URL (/)
// and the explicit link path (/home.html).
app.get(['/', '/home.html'], (req, res) => {
    // We use path.join to create a clean, OS-independent path to the file.
    res.sendFile(path.join(__dirname, 'views', 'home.html'));
});

// --- 2. Route for the Math Department Page ---
// Define a route that listens for the exact URL path the user is requesting.
// Since the browser requests /Departments/Math.html, this is the route path.
app.get('/departments/math.html', (req, res) => {
    // Send the correct internal file path: views/departments/math.html
    res.sendFile(path.join(__dirname, 'views', 'departments', 'math.html'));
});


app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
    console.log(`Access Home Page at: http://localhost:${PORT}/ or http://localhost:${PORT}/home.html`);
    console.log(`Access Math Page at: http://localhost:${PORT}/departments/math.html`);
});
