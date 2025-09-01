const express = require("express");

const app = express();

app.get("/user/:userId", (req, res) => {
  console.log(req.params);
  res.send(`user is here ${req.params.userId}`);
});

app.listen(3000, () => {
  console.log("====================================");
  console.log("listening on port 3000...");
  console.log("====================================");
});
