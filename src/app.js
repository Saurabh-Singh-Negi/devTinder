const express = require("express");

const app = express();

app.use("/test", (req, res) => {
  res.send("test");
});

app.use("/", (req, res) => {
  res.send("hello from port 3000...");
});

app.listen(3000, () => {
  console.log("====================================");
  console.log("listening on port 3000...");
  console.log("====================================");
});
