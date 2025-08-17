const express = require('express');
const router = express.Router();
const postController = require('../controllers/post-controller');

router.get('/posts', postController.listPosts);
router.get('/posts/:id', postController.showPost);
router.post('/posts', postController.createPost);
router.put('/posts/:id', postController.updatePost);
router.delete('/posts/:id', postController.deletePost);

module.exports = router;
