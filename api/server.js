const express = require('express');
const morgan = require('morgan');
const server = express();

function customMorgan(req, res, next) {
  console.log(`you made a ${req.method} request`);
  next();
}

const projectsRouter = require('./projects/projects-router.js');
const actionRouter = require('./actions/actions-router.js');
const { checkProjectExists } = require('./projects/projects-middleware.js');

server.use('/api/projects', projectsRouter);
server.use('/api/actions', actionRouter);
server.use(morgan('dev'));
server.use(customMorgan);
server.use(checkProjectExists);





// Configure your server here
// Build your actions router in /api/actions/actions-router.js
// Build your projects router in /api/projects/projects-router.js
// Do NOT `server.listen()` inside this file!

module.exports = server;
