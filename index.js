/*
play this: https://www.youtube.com/watch?v=d-diB65scQU

Sing along:

here's a little code I wrote, please read the README word for word, don't worry, you got this
in every task there may be trouble, but if you worry you make it double, don't worry, you got this
ain't got no sense of what is REST? just concentrate on learning Express, don't worry, you got this
your file is getting way too big, bring a Router and make it thin, don't worry, be crafty
there is no data on that route, just write some code, you'll sort it out… don't worry, just hack it…
I need this code, but don't know where, perhaps should make some middleware, don't worry, just hack it

Pull your server into this file and start it!
*/
// index.js (or server.js)

const express = require('express');
const morgan = require('morgan');
const { logger, errorHandler } = require('./api/projects/projects-middleware.js');
const projectsRouter = require('./api/projects/projects-router.js');
const actionsRouter = require('./api/actions/actions-router');

const server = express();

// Middleware
server.use(express.json()); // Parse JSON request bodies
server.use(logger); // Use the logger middleware for all requests

// Routers
server.use('/api/projects', projectsRouter);
server.use('/api/actions', actionsRouter);
server.use(morgan('dev'));

// Error handling middleware
server.use(errorHandler);

// Start the server
const port = process.env.PORT || 9000;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Configure your server here
// Build your actions router in /api/actions/actions-router.js
// Build your projects router in /api/projects/projects-router.js
// Do NOT `server.listen()` inside this file!

module.exports = server;