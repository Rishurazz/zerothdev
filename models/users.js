const mongoose = require("mongoose");
const plm = require("passport-local-mongoose")

mongoose.connect("mongodb://localhost:27017/zeroth")

const userSchema = new mongoose.Schema({
  googleId: {
      type: String,
      required: true,
      unique: true
  },
  displayName: {
      type: String,
      required: true
  },
  email:{
      type: String
  },
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
    },
  ],
  ideas: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Idea',
    },
  ]
  // Add other fields you want to save
  // Example: email, avatar, etc.
});

userSchema.plugin(plm);

module.exports = mongoose.model("User", userSchema);