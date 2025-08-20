const postModel = require('../models/post-model');
const { validatePostCreate, validatePostUpdate } = require('../utils/validate'); 


// list Posts with ability to filter and sort in query parameters
async function listPosts(req, res, next) {
  try {
    // Extract query params
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sort = req.query.sort || 'createdAt'; // choose to sort based on what ? createdAt here is default if user does not enter anything
    const order = req.query.order || 'desc'; // default it will be from the last to the old
    const q = req.query.q ? req.query.q.trim() : undefined; // ← pass as-is

    //  Use the query function — it handles search, sort, paginate
    const result = await postModel.queryPosts({ q, sort, order, page, limit });

    //  Send response
    res.status(200).json({
       data:{
        items: result.items,
        page: result.page,
        limit: result.limit,
        total: result.total
      },
      error: null,
    });

  } catch (err) {
    const error = new Error('Failed to fetch posts');
    error.status = 500;
    next(error);
  }
}


async function showPost(req, res, next) {
  const result = await postModel.getPostById(req.params.id);
  if (!result) {
    const error = new Error(`Post with ID ${req.params.id} not found`);
    error.status = 404;
    return next(error);
  }
  res.status(200).json({  result, error: null });
}

// createPost with details will be returned if any issues happened
async function createPost(req, res, next) {
  // we used validatePostCreate from utils/validate to check errors
  const { error, value } = validatePostCreate(req.body);

  if (error) {
    const err = new Error(error.message);
    err.status = 400;
    err.details = error.details; //  this is { field: "reason" }
    return next(err);
  }

  try {
    const newPost = await postModel.createPost(value); // use `value` (cleaned data)
    res.status(201).json({  newPost, error: null });
  } catch (err) {
    const error = new Error('Failed to create post');
    error.status = 500;
    next(error);
  }
}

// updatePost with details will be returned if there are any error which demonstrate the where the problem came from 
async function updatePost(req, res, next) {
  const { id } = req.params;

  // Check if any fields provided (still needed)
  const hasFields = Object.keys(req.body).length > 0;
  if (!hasFields) {
    const error = new Error('No fields provided for update');
    error.status = 400;
    return next(error);
  }

  //  Use validator from /utils/validate.js to check error when we want to update post
  // here we rename error to validationError to avoid conflict with other variables with the same name
  const { error: validationError, value } = validatePostUpdate(req.body);

  if (validationError) {
    const err = new Error(validationError.message);
    err.status = 400;
    err.details = validationError.details;
    return next(err);
  }

  try {
    const updated = await postModel.updatePost(id, value); //  use cleaned `value`
    if (!updated) {
      const error = new Error(`Post with ID ${id} not found`);
      error.status = 404;
      return next(error);
    }
    res.status(200).json({  updated, error: null });
  } catch (err) {
    const error = new Error('Failed to update post');
    error.status = 500;
    next(error);
  }
}

// deletePost 
async function deletePost(req, res, next) {
  const deleted = await postModel.deletePost(req.params.id);
  if (!deleted) {
    const error = new Error(`Post with ID ${req.params.id} not found`);
    error.status = 404;
    return next(error);
  }
  res.status(204).json({
    error:null,
    message:"the post has been deleted successfully"
  }); // 204 No Content
}

module.exports = {
  listPosts,
  showPost,
  createPost,
  updatePost,
  deletePost,
};