// add middlewares here related to projects
// middleware.js
const Projects = require("./projects-model");

async function checkProject_id(req, res, next) {
  try {
    const { id } = req.params;
    const project = await Projects.get(id);
    if (project) {
      req.project = project;
      next();
    } else {
      next({ status: 404, message: `project ${id} Not found` });
    }
  } catch (error) {
    next(error);
  }
}

async function checkProjectExists(req, res, next) {
  const { id, name, description, completed } = req.body;
  if (!name || typeof name !== "string") {
    return res.status(400).json({ message: "Name is required" });
  }
  if (!description || typeof description !== "string") {
    return res.status(400).json({ message: "Description required" });
  }
  if (!completed || typeof completed !== "boolean") {
    return res
      .status(400)
      .json({ message: "The completed status should be a boolean" });
  }

  try {
    const project = await Projects.get(id);
    if (!project) {
      return res.status(404).json({ message: " ID does not exist" });
    }
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = {
  checkProjectExists,
  checkProject_id,
};
