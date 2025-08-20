// src/app.js
const express = require('express');
const app = express();
const port = 5000;
const cors = require('cors');
const articleRouter = require('./routes/post-routes');
const errorHandlerMiddleware = require('./middleware/error-handler');
const notFoundMiddleware = require('./middleware/not-found');
const loggingMiddleware = require('./middleware/request-logger');
const connectDB = require('./config/db');


// Connect to DB first
async function startServer() {
  await connectDB();

  app.use(express.json());
  app.use(cors());

  // this is middleware for logging infos about each reaquest
  loggingMiddleware(app);

  // use routes
  app.use('/api', articleRouter); 

  // this is middleware for handling non route exists
  notFoundMiddleware(app);
  // this is middleware for handling errors
  errorHandlerMiddleware(app);

  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}

startServer().catch(console.error);