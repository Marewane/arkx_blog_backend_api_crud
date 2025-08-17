const express = require('express');
const app = express();
const port = 5000;
const cors = require('cors');
const articleRouter = require('./routes/post-routes');
const errorHandlerMiddleware = require('./middleware/error-handler');
const notFoundMiddleware = require('./middleware/not-found');
const loggingMiddleware = require('./middleware/request-logger');

// global middleware
app.use(express.json());
app.use(cors());

// this is for logging info for each request
loggingMiddleware(app);




// This is for routes
app.use('/api',articleRouter);

// not found middleware 
notFoundMiddleware(app);

// error handling middleware
errorHandlerMiddleware(app);

app.listen(port,()=>{
    console.log('server has been successfully connect on port 5000');
});
