// src/models/post-model.js
const Post = require('./Post'); // Mongoose model

async function getAllPosts() {
  return await Post.find({});
}

async function getPostById(id) {
  return await Post.findById(id);
}

async function createPost(data) {
  const post = new Post(data);
  return await post.save();
}

async function updatePost(id, data) {
  return await Post.findByIdAndUpdate(
    id,
    { ...data, updatedAt: new Date() },
    { new: true, runValidators: true } // return updated doc + validate new fields that will be insert in place of old ones
  );
}

async function deletePost(id) {
  const result = await Post.deleteOne({ _id: id });
  return result.deletedCount > 0;
}

//  Advanced query with search, sort, paginate
async function queryPosts({ q, sort = 'createdAt', order = 'desc', page = 1, limit = 10 }) {
  let filter = {};
  // filter it will look like {$or:[{title:{$regex:q,$options:"i"}}]}

  // Search using text index
  if (q) {
    filter.$or = [
      {title:{$regex:q,$options:"i"}},
      {content:{$regex:q,$options:"i"}}
    ]; 
  }


  const sortOrder = order === 'asc' ? 1 : -1;
  const sortOptions = { [sort]: sortOrder }; // it will be like {"createdAt":1} like  sort based on filed createdAt

  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    Post.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .exec(),
    Post.countDocuments(filter) // this will return how many documents match the filter
  ]);

  return {
    items,
    total,
    page: Number(page),
    limit: Number(limit)
  };
}

module.exports = {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  queryPosts
};