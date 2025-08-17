function loggingMiddleware(app) {
  app.use((req, res, next) => {
    const start = Date.now();

    // Continue to next middleware/route
    next();

    // This runs AFTER the response is sent
    res.on('finish', () => {
      const duration = Date.now() - start; // in milliseconds
      const method = req.method;
      const path = req.path; // better than req.url (excludes query string)
      const status = res.statusCode;

      console.log(`${method} ${path} → ${status} (${duration}ms)`);
    });
  });
}

module.exports = loggingMiddleware;