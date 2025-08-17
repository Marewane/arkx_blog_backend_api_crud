// src/utils/file-store.js
const fs = require('fs').promises;
const path = require('path');

const DATA_FILE = path.join(process.cwd(), 'data', 'posts.json');
const TMP_FILE = path.join(process.cwd(), 'data', 'posts.tmp.json');

// Write queue: ensures writes happen one at a time
let writeQueue = Promise.resolve();

// Read the entire posts file
async function readPosts() {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    const parsed = JSON.parse(data);

    // Ensure it has { "posts": [...] }
    if (!Array.isArray(parsed.posts)) {
      console.warn('Invalid format: missing posts array. Resetting.');
      return { posts: [] };
    }
    return parsed;
  } catch (err) {
    if (err.code === 'ENOENT') {
      return { posts: [] }; // File doesn't exist → start fresh
    }
    throw new Error(`Failed to read posts: ${err.message}`);
  }
}

// Write posts atomically
async function writePosts(postsData) {
  // Chain to previous write
  writeQueue = writeQueue.then(async () => {
    // 1. Write to temp file
    await fs.writeFile(TMP_FILE, JSON.stringify(postsData, null, 2), 'utf-8');
    // 2. Atomic rename (this is the safe swap)
    await fs.rename(TMP_FILE, DATA_FILE);
  });

  // Wait for this write to complete
  return writeQueue;
}

//  Public API
async function findAll() {
  const result = await readPosts();
  return result.posts;
}

async function findById(id) {
  const posts = await findAll();
  return posts.find(p => p.id == id) || null;
}

async function create(data) {
  const posts = await findAll();
  const newId = posts.length > 0
    ? Math.max(...posts.map(p => p.id)) + 1
    : 1;

  const newPost = {
    id: newId,
    ...data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  posts.push(newPost);
  await writePosts({ posts });
  return newPost;
}

async function update(id, data) {
  const posts = await findAll();
  const index = posts.findIndex(p => p.id == id);
  if (index === -1) return null;

  posts[index] = {
    ...posts[index],
    ...data,
    updatedAt: new Date().toISOString()
  };

  await writePosts({ posts });
  return posts[index];
}

async function remove(id) {
  const posts = await findAll();
  const index = posts.findIndex(p => p.id == id);
  if (index === -1) return false;

  posts.splice(index, 1);
  await writePosts({ posts });
  return true;
}

// query: supports search, sort, paginate
async function query({ q, sort = 'createdAt', order = 'desc', page = 1, limit = 10 }) {
  let posts = await findAll();

  // Search in title/content
  if (q) {
    const term = q.toLowerCase();
    posts = posts.filter(p =>
      p.title.toLowerCase().includes(term) ||
      p.content.toLowerCase().includes(term)
    );
  }

  // Sort
  posts.sort((a, b) => {
    let valA = a[sort];
    let valB = b[sort];

    if (typeof valA === 'string') valA = valA.toLowerCase();
    if (typeof valB === 'string') valB = valB.toLowerCase();

    if (order === 'asc') {
      return valA < valB ? -1 : valA > valB ? 1 : 0;
    } else {
      return valA > valB ? -1 : valA < valB ? 1 : 0;
    }
  });

  // Paginate
  const start = (page - 1) * limit;
  const end = start + limit;
  const items = posts.slice(start, end);

  return {
    items,
    total: posts.length,
    page: Number(page),
    limit: Number(limit)
  };
}

// Export all functions
module.exports = {
  findAll,
  findById,
  create,
  update,
  remove,
  query
};