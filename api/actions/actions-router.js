// api/actions/actions-router.js

const express = require("express");
const router = express.Router();

const Actions = require("../actions/actions-model");
const { logger, errorHandler } = require("../actions/actions-middleware");

// Apply logger middleware to all routes in the router
router.use(logger);

// GET /api/actions
router.get("/", getAllActions);
// GET /api/actions/:id
router.get("/:id", getActionById);
// POST /api/actions
router.post("/", createAction);
// PUT /api/actions/:id
router.put("/:id", updateAction);
// DELETE /api/actions/:id
router.delete("/:id", deleteAction);

async function getAllActions(req, res, next) {
try {
const actions = await Actions.get();
res.status(200).json(actions);
next();
} catch (error) {
next(error);
}
}

async function getActionById(req, res, next) {
try {
const { id } = req.params;
const action = await Actions.get(id);

if (!action) {
  return res.status(404).json({ message: "Action not found" });
}
res.status(200).json(action);
next();
} catch (error) {
next(error);
}
}

async function createAction(req, res, next) {
try {
const { project_id, description, notes, completed } = req.body;

if (!project_id || !description || !notes) {
  return res.status(400).json({ message: "Missing required fields" });
}

const newAction = await Actions.insert({
  project_id,
  description,
  notes,
  completed: completed || false,
});
res.status(201).json(newAction);
next();
} catch (error) {
next(error);
}
}

async function updateAction(req, res, next) {
try {
const { id } = req.params;
const { project_id, description, notes, completed } = req.body;

if (!project_id || !description || !notes) {
  return res.status(400).json({ message: "Missing required fields" });
}

const action = await Actions.get(id);

if (!action) {
  return res.status(404).json({ message: "Action not found" });
}

const updatedAction = await Actions.update(id, {
  project_id,
  description,
  notes,
  completed: completed || false,
});

res.status(200).json(updatedAction);
next();
} catch (error) {
next(error);
}
}

async function deleteAction(req, res, next) {
try {
const { id } = req.params;
const action = await Actions.get(id);

if (!action) {
  return res.status(404).json({ message: "Action not found" });
}

await Actions.remove(id);

res.status(204).end();
next();
} catch (error) {
next(error);
}
}

router.use(errorHandler);

module.exports = router;