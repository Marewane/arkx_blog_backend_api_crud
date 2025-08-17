
const fileStore = require('../utils/file-store');

async function getAllPosts() {
  return await fileStore.findAll();
}

async function getPostById(id) {
  return await fileStore.findById(id);
}

async function createPost(data) {
  return await fileStore.create(data);
}

async function updatePost(id, data) {
  return await fileStore.update(id, data);
}

async function deletePost(id) {
  return await fileStore.remove(id);
}

async function queryPosts(filters) {
  return await fileStore.query(filters);
}

// ✅ Export all functions
module.exports = {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  queryPosts
};