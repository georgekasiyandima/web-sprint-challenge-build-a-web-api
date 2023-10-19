// add middlewares here related to actions
// middleware.js

function logger(req, res, next) {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
  }
  
  function errorHandler(err, req, res, next) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
    next();
  }
  
  module.exports = {
    logger,
    errorHandler,
  };
