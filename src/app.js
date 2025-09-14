const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");

app.use(express.json());

app.post("/signup", async (req, res) => {
  const userObj = new User(req.body);

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
