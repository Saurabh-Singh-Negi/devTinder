const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      throw new Error("Invalid user");
    }

    const decodedUserObj = await jwt.verify(token, "Jwt@keytokeepsecure");
    const { _id } = decodedUserObj;
    const user = await User.findById(_id);

    if (!user) {
      throw new Error("invalid user");
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
};

module.exports = {
  userAuth,
};
