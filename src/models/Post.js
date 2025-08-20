// src/models/Post.js
const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
      validate: {
        validator: (v) => /^\d+$/.test(v) || typeof v === 'string',
        message: 'ID must be a string'
      }
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      minlength: [3, 'Title must be at least 3 characters'],
      trim: true
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
      minlength: [10, 'Content must be at least 10 characters'],
      trim: true
    },
    author: {
      type: String,
      required: [true, 'Author is required'],
      minlength: [2, 'Author must be at least 2 characters'],
      trim: true
    },
    tags: {
      type: [String],
      default: [],
      validate: {
        validator: (tags) => tags.length <= 20,
        message: 'Tags cannot exceed 20 items'
      },
      // You can add more validation for empty strings if needed
    },
    comments: {
      type: Array,
      default: []
    },
    createdAt: {
      type: Date,
      default: () => new Date()
    },
    updatedAt: {
      type: Date,
      default: () => new Date()
    }
  },
  { 
    timestamps: false // we handle updatedAt manually
  }
);


// Middleware: update `updatedAt` on save
// postSchema.pre('save', function (next) {
//   this.updatedAt = new Date();
//   next();
// });

// Index for search
postSchema.index({ title: 'text'});
postSchema.index({content:"content"});
const Post = mongoose.model('Post', postSchema);

module.exports = Post;