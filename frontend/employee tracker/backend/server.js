const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const employeeRoutes = require("./routes/employees");
const path = require("path");

const app = express();
const PORT = 5020;

app.use(cors());
app.use(express.json());


app.get("/", (req, res) => {
  res.send("Employee Experience Tracker API is running");
});


app.use("/employees", employeeRoutes); 

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


mongoose
  .connect("mongodb://127.0.0.1:27017/employee_tracker", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => console.error("DB connection failed:", err));
