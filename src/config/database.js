const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://saurabhnegi458:qwerty123@namaste-nodejs.ygizcw.mongodb.net/devTinder"
  );
};

module.exports = connectDB;
