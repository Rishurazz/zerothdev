// var express = require('express');
// var router = express.Router();

// /* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

// module.exports = router;


const mongoose = require("mongoose");
const plm = require("passport-local-mongoose")

mongoose.connect("mongodb://localhost:27017/zeroth")

const userSchema = new mongoose.Schema({
  googleId: {
      type: String,
      required: true,
      unique: true,
  },
  displayName: {
      type: String,
      required: true,
  },
  // Add other fields you want to save
  // Example: email, avatar, etc.
});

userSchema.plugin(plm);

module.exports = mongoose.model("user", userSchema);