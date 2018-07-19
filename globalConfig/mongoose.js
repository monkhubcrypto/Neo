const mongoose = require("mongoose");

// Map global promises
mongoose.Promise = global.Promise;
// Mongoose Connect

let mongoURI = "mongodb://localhost:27017/Neo";

mongoose
  .connect(
    mongoURI,
    { useNewUrlParser: true }
  )
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

module.exports = mongoose;
