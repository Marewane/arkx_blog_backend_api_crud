const fs = require('fs').promises;
const path = require('path');

const filePath = path.join(__dirname, '../data/articles.json');

async function readFile() {
    try {
        const data = await fs.readFile(filePath, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error('Error occurred during reading file:', err);
        throw err; // ✅ rethrow so caller knows something went wrong
    }
}

async function getAllPosts() {
    const articles = await readFile(); // ✅ will throw if readFile fails
    return articles.posts;
}

async function getPostById(id) {
    const articles = await readFile();
    return articles.posts.find(article => article.id == id) || null;
}

async function createPost(newPost) {
    const articles = await readFile();
    const post = {
        id: articles.posts.length > 0 ? articles.posts[articles.posts.length - 1].id + 1 : 1,
        title: newPost.title,
        content: newPost.content,
        author: newPost.author,
        tags: newPost.tags || [],
        comments: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    articles.posts.push(post);
    await fs.writeFile(filePath, JSON.stringify(articles, null, 2), 'utf8');
    return post;
}

async function updatePost(id, updatedFields) {
    const articles = await readFile();
    const index = articles.posts.findIndex(post => post.id == id);
    if (index === -1) return null;
    articles.posts[index] = {
        ...articles.posts[index],
        ...updatedFields,
        updatedAt: new Date().toISOString()
    };
    await fs.writeFile(filePath, JSON.stringify(articles, null, 2), 'utf8');
    return articles.posts[index];
}

async function deletePost(id) {
    const articles = await readFile();
    const index = articles.posts.findIndex(p => p.id == id);
    if (index === -1) return false;
    articles.posts.splice(index, 1);
    await fs.writeFile(filePath, JSON.stringify(articles, null, 2), 'utf8');
    return true;
}

module.exports = {
    getAllPosts,
    getPostById,
    createPost,
    updatePost,
    deletePost
};
