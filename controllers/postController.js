const postModel = require('../models/post');

async function listPosts(req, res) {
    const articles = await postModel.getAllPosts();
    res.json(articles);
}

async function showPost(req, res, next) {
    const result = await postModel.getPostById(req.params.id);
    if (!result) {
        const error = new Error(`Article with ID ${req.params.id} not found`);
        error.status = 404;
        return next(error);
    }
    res.json({ data: result });
}

async function createPost(req, res, next) {
    const { title, content, author, tags } = req.body;
    if (!title || !content || !author) {
        const error = new Error('Title, content, and author are required');
        error.status = 400;
        return next(error);
    }
    const newPost = await postModel.createPost({ title, content, author, tags });
    res.status(201).json({ data: newPost });
}

async function updatePost(req, res, next) {
    const updated = await postModel.updatePost(req.params.id, req.body);
    if (!updated) {
        const error = new Error(`Article with ID ${req.params.id} not found`);
        error.status = 404;
        return next(error);
    }
    res.json({ data: updated });
}

async function deletePost(req, res, next) {
    const deleted = await postModel.deletePost(req.params.id);
    if (!deleted) {
        const error = new Error(`Article with ID ${req.params.id} not found`);
        error.status = 404;
        return next(error);
    }
    res.json({ message: 'Article deleted successfully' });
}



module.exports = {
    listPosts,
    showPost,
    createPost,
    updatePost,
    deletePost
};
