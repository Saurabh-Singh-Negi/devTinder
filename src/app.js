const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");

app.post("/signup", async (req, res) => {
  const userObj = new User({
    fistName: "Saurabh",
    lastName: "email",
    password: "1234",
    age: "27",
    gender: "male",
  });

  try {
    await userObj.save();
    res.send("user created successfully");
  } catch (err) {
    res.status(400).send("failed to save", err.message);
  }
});

app.use("/", (req, res) => {
  res.send("welcome");
});

connectDB()
  .then(() => {
    app.listen(3000, () => {
      console.log("listening on port 3000...");
    });
  })
  .catch(() => {
    console.log("failed to connect");
  });
