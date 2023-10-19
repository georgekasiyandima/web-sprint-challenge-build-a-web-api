const express = require("express");
const Projects = require("./projects-model");

const router = express.Router();

const { logger, errorHandler } = require("./projects-middleware.js");

// Apply logger middleware to all routes in the router
router.use(logger);

async function getAllProjects(req, res, next) {
try {
const projects = await Projects.get();
res.status(200).json(projects);
} catch (error) {
next(error);
}
}

async function getProjectById(req, res, next) {
try {
const { id } = req.params;
const project = await Projects.get(id);

if (project) {
  res.status(200).json(project);
} else {
  res.status(404).json({ message: "Project not found" });
}
} catch (error) {
next(error);
}
}

async function createProject(req, res, next) {
try {
const { name, description, completed } = req.body;


if (!name || !description || name.trim() === "" || description.trim() === "") {
  res.status(400).json({ message: "Name and description are required" });

}

const newProject = await Projects.insert({ name, description, completed });
const project = await Projects.get(newProject.id);
res.status(200).json(project);
} catch (error) {
next(error);
}
}

async function updateProject(req, res, next) {
try {
const { id } = req.params;
const { name, description, completed } = req.body;

if (!name || !description || name.trim() === "" || description.trim() === "") {
  res.status(400).json({ message: "Name and description are required" });
  return;
}

const updatedProject = await Projects.update(id, { name, description, completed });

if (updatedProject) {
  res.status(200).json(updatedProject);
} else {
  res.status(404).json({ message: "Project not found" });
}
} catch (error) {
next(error);
}
}

async function deleteProject(req, res, next) {
try {
const { id } = req.params;
const deletedCount = await Projects.remove(id);

if (deletedCount > 0) {
  res.status(204).end();
} else {
  res.status(404).json({ message: "Project not found" });
}
} catch (error) {
next(error);
}
}

async function getProjectActions(req, res, next) {
try {
const { id } = req.params;
const actions = await Projects.getProjectActions(id);

if (actions) {
  res.status(200).json(actions);
} else {
  res.status(404).json({ message: "Project not found" });
}
} catch (error) {
next(error);
}
}

router.get("/", getAllProjects);
router.get("/:id", getProjectById);
router.post("/", createProject);
router.put("/:id", updateProject);
router.delete("/:id", deleteProject);
router.get("/:id/actions", getProjectActions);

router.use(errorHandler);

module.exports = router;