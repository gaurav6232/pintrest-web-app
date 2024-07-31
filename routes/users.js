const mongoose = require('mongoose');
const plm = require('passport-local-mongoose');

// Replace with your actual MongoDB Atlas URI
const atlasUri = 'mongodb+srv://gauravchu2:YCQDuRzLrEjlSx28@cluster0.zce0z1q.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

// Connect to MongoDB Atlas
mongoose.connect(atlasUri, {
  useNewUrlParser: true,
  // `useUnifiedTopology` is removed
}).then(() => {
  console.log('Connected to MongoDB Atlas!');
}).catch((err) => {
  console.error('Failed to connect to MongoDB Atlas:', err);
});

// Define User Schema
const userSchema = mongoose.Schema({
  username: String,
  name: String,
  email: String,
  password: String,
  profileImage: String,
  contact: Number,
  boards: {
    type: Array,
    default: []
  },
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'post'
    }
  ]
});

// Apply passport-local-mongoose plugin
userSchema.plugin(plm);

// Export User model
module.exports = mongoose.model('user', userSchema);
