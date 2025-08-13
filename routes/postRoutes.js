const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');

router.get('/articles', postController.listPosts);
router.get('/articles/:id', postController.showPost);
router.post('/articles', postController.createPost);
router.put('/articles/:id', postController.updatePost);
router.delete('/articles/:id', postController.deletePost);

module.exports = router;
