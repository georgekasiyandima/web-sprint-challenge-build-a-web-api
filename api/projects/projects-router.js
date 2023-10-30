// api/projects/projects-router.js
const express = require("express");
const Projects = require("./projects-model");
const {
  checkProject_id,
  checkProjectExists,
  validateProjectData,
} = require("./projects-middleware");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const projects = await Projects.get();
    res.json(projects);
  } catch (error) {
    next(error);
  }
});

router.get(
  "/:id",
  [checkProject_id, checkProjectExists],
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const project = req.project; // Access the project data from the middleware
      if (project) {
        res.json(project);
      } else {
        res.status(404).json({ message: `Project ${id} not found` });
      }
    } catch (error) {
      next(error);
    }
  }
);

router.post("/", validateProjectData, async (req, res, next) => {
  try {
    const { name, description, completed } = req.body;
    if (!name || !description || completed === undefined) {
      res.status(400).json({ message: "Name and description are required" });
    } else {
      const newProject = await Projects.insert({
        name,
        description,
        completed,
        actions: [],
      });
      res.status(201).json(newProject[0])
    }
  } catch (error) {
    next(error);
  }
});

router.put(
  "/:id",
  [checkProjectExists, validateProjectData],
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const { name, description, completed } = req.body;
      if (!name || !description) {
        res.status(400).json({ message: "Name and description are required" });
      } else {
        const updatedProject = await Projects.update(id, {
          name,
          description,
          completed,
        });
        if (updatedProject) {
          res.json(updatedProject);
        } else {
          res.status(404).json({ message: `Project ${id} not found` });
        }
      }
    } catch (error) {
      next(error);
    }
  }
);

router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedProject = await Projects.remove(id);
    if (deletedProject) {
      res.status(204).end();
    } else {
      res.status(404).json({ message: `Project ${id} not found` });
    }
  } catch (error) {
    next(error);
  }
});

router.get("/:id/actions", async (req, res, next) => {
  try {
    const { id } = req.params;
    const actions = await Projects.getProjectActions(id);
    if (actions) {
      res.json(actions);
    } else {
      res.status(404).json({ message: `Project ${id} not found` });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
