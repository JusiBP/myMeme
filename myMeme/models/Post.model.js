const { Schema, model } = require("mongoose");

const postSchema = new Schema({
  // username: { type: Schema.Types.ObjectId, ref: "User" },
  memeUrl: {
    type: String,
    require: true,
  },
  date: {
    type: Date,
    default: new Date,
  },
  description: {
    type: String,
    require: false,
  },
  category: {
    type: String,
    enum: [
      "Random",
      "Animals",
      "WTF",
      "Sports",
      "Gaming",
      "Politics",
      "News",
      "Anime&Manga",
      "Classics",
      "TV"
    ],
  },
  // this second object adds extra properties: `createdAt` and `updatedAt`
  // timestamps: true,
});

const Post = model("Post", postSchema);

module.exports = Post;
