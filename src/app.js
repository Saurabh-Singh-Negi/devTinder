const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");
const bcrypt = require("bcrypt");
const { validateSignUpData } = require("./utils/validation");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth");

app.use(express.json());
app.use(cookieParser());

// get all users
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(400).send("something went wrong ", err.message);
  }
});

// find user by emailId
app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;
  try {
    const usersDetail = await User.find({ emailId: userEmail });
    if (usersDetail.length === 0) {
      res.status(400).send("No matching user found");
    }
  } catch (err) {
    res.status(400).send("somthing went wrong ", err.message);
  }
});

// create a user
app.post("/signup", async (req, res) => {
  try {
    validateSignUpData(req);

    const { firstName, lastName, emailId, password } = req.body;
    const encryptedPassword = await bcrypt.hash(password, 10);

    const userObj = new User({
      firstName,
      lastName,
      emailId,
      password: encryptedPassword,
    });

    await userObj.save();
    res.send("user created successfully");
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId: emailId });

    if (!user) {
      throw new Error("Invalid Credentials");
    }
    const isPasswordValid = await user.validatePassword(password);

    if (isPasswordValid) {
      const token = await user.getJWT();

      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
      });
      res.send("logged in successfully");
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

app.post("/sendConnectionRequest", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user.firstName + " sent the request");
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

//delete a user
app.delete("/delete", async (req, res) => {
  const userId = req.body.userId;
  try {
    await User.findOneAndDelete(userId);
    res.send("successfully deleted the user");
  } catch (err) {
    res.status(400).send("failed to delete");
  }
});

//update a user
app.patch("/update", async (req, res) => {
  const userId = req.body.userId;
  const data = req.body;
  try {
    const ALLOWED_UPDATE = ["gender", "about", "skills"];
    const isAllowed = Object.keys(data).every((k) =>
      ALLOWED_UPDATE.includes(k)
    );

    if (!isAllowed) {
      throw new Error("Update not allowed");
    }

    if (data?.skills.length > 0) {
      throw new Error("max 10 skills can be added");
    }
    const op = await User.findByIdAndUpdate(userId, data, {
      returnDocument: "after",
      runValidators: true,
    });
    console.log("res", op);
    res.send("user updated");
  } catch (err) {
    console.log(err.message);

    res.status(400).send("Failed to update the user " + err);
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
