const express = require("express");
const cors = require("cors");
const scenarios = require("./scenarios");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Trust or Trap backend is running");
});

app.get("/api/scenarios", (req, res) => {
  res.json(scenarios);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
