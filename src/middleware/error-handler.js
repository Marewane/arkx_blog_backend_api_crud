function errorHandlerMiddleware(app) {
  app.use((error, req, res, next) => {
    const statusCode = error.status || 500;
    const message = error.message || 'Something went wrong';
    const details = error.details || null; //  only present for validation errors

    res.status(statusCode).json({
        data:null,
        error: {
            message,
            details
        }
    });
  });
}

module.exports = errorHandlerMiddleware;