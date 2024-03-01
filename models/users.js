const mongoose = require("mongoose");
// const { MongoClient } = require("mongodb");
const plm = require("passport-local-mongoose")

// mongoose.connect("mongodb://localhost:27017/zeroth")
const atlasConnectionUri = "mongodb+srv://username:password@cluster0.0juuckz.mongodb.net/zeroth?retryWrites=true&w=majority&appName=Cluster0";
mongoose.connect(atlasConnectionUri, { useNewUrlParser: true, useUnifiedTopology: true });

const dbConnection = mongoose.connection;

dbConnection.on('connected', () => {
  console.log('Connected to MongoDB');
});

dbConnection.on('error', (error) => {
  console.error('MongoDB connection error:', error);
});


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
  ],
  ideasJoined: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
    },
  ]
  // Add other fields you want to save
  // Example: email, avatar, etc.
});

userSchema.plugin(plm);

module.exports = mongoose.model("User", userSchema);
