// add middlewares here related to projects
// middleware.js
const Projects = require("./projects-model");
  
  async function checkProject_id (req, res, next) {
    try {
      const { id } = req.params;
      const project = await Projects.get(id);
      if (project) {
        req.project = project;
        next();
      }
      else {
        next({status: 404, message: `project ${id} Not found`})}
    } catch(error) {
      next(error)

    }
  }

  async function checkProjectExists(req, res, next) {
    try {
      const { id } = req.params;
      const project = await Projects.get(id);
      if (project) {
        req.project = project;
        next();
      } else {
        res.status(404).json({ message: `Project ${id} not found` });
      }
    } catch (error) {
      next(error);
    }
  }
  
  function validateProjectData(req, res, next) {
    const { name, description, completed } = req.body;
    if (!name || !description || !completed) {
      res.status(400).json({ message: 'Name and description are required' });
    } else {
      next();
    }
  }
  
  module.exports = {
    checkProjectExists,
    validateProjectData,
    checkProject_id
  };

  