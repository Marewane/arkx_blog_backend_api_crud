# CRUD Blog API

A simple CRUD (Create, Read, Update, Delete) blog API built with Node.js and Express.

## Features
- Create, read, update, and delete blog posts
- JSON-based API
- Example data structure with author info and tags

---

## Installation

Clone the repository:
```bash
git clone https://github.com/Marewane/arkx_blog_backend_api_crud.git
cd https://github.com/Marewane/arkx_blog_backend_api_crud.git

## Install dependencies:
- npm install

## Usage
To start the server type in terminal:
npm run dev
By default, the server runs on http://localhost:5000.

## API Endpoints

| Method | Endpoint               | Description            |
|--------|------------------------|------------------------|
| GET    | `/api/posts`        | Get all articles       |
| GET    | `/api/posts/:id`    | Get an article by ID   |
| POST   | `/api/posts`        | Create a new article   |
| PUT    | `/api/posts/:id`    | Update an article by ID|
| DELETE | `/api/posts/:id`    | Delete an article by ID|
