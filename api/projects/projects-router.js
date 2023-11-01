// api/projects/projects-router.js
const express = require("express");
const Projects = require("./projects-model");
const {
  checkProject_id,
  checkProjectExists,
} = require("./projects-middleware");

const router = express.Router();

router.get("/:id?", checkProject_id, (req, res,) => {
  res.json(req.project)
});

/*router.get(
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
);*/

router.post("/",  checkProjectExists, (req, res, next) => {
  Projects.insert(req.body).then((project) => {
    res.status(201).json(project);
  }).catch(next);
});

router.put("/:id", checkProject_id, checkProjectExists, (req, res, next) => {
  const { completed } = req.body;
  if (!completed && typeof completed !== "boolean") {
    res.status(400).json({ message: "No completed boolean" });
  } else {
    Projects.update(req.params.id, req.body)
      .then((project) => {
        console.log(project)
        res.status(200).json(project);
      })
      .catch(next);
  }
});

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
