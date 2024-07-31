const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user"
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  video: String, // Video field ko String type se optional banaya
});

module.exports = mongoose.model('post', postSchema);















// const mongoose = require('mongoose');

// const postSchema = mongoose.Schema({
//   user: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "user"
//   },
//   title: String,
//   description: String,
//   image: String,
//   video: {
//     type: String, // Assuming you will store the video URL
//     required: true
//   },
// });

// module.exports = mongoose.model('post', postSchema);
