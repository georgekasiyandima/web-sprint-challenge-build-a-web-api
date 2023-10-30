// api/actions/actions-router.js
const express = require('express');
const Actions = require('./actions-model');
const { checkActionExists, validateActionData } = require('./actions-middleware');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const actions = await Actions.get();
    res.json(actions);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', checkActionExists, async (req, res, next) => {
  try {
    const { id } = req.params;
    const action = await Actions.get(id);
    if (action) {
      res.json(action);
    } else {
      res.status(404).json({ message: `Action ${id} not found` });
    }
  } catch (error) {
    next(error);
  }
});

router.post('/', validateActionData, async (req, res, next) => {
  try {
    const { project_id, description, notes, completed } = req.body;
    if (!project_id || !description || !notes || completed === undefined) {
      res.status(400).json({ message: 'Project ID, description, and notes are required' });
    } else {
      const newAction = await Actions.insert({ project_id, description, notes, completed });
      res.status(201).json(newAction)
    }
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { project_id, description, notes, completed } = req.body;
    if (!project_id || !description || !notes || completed === undefined) {
      res.status(400).json({ message: 'Project ID, description, and notes are required' });
    } else {
      const updatedAction = await Actions.update(id, { project_id, description, notes, completed });
      if (updatedAction) {
        res.json(updatedAction);
      } else {
        res.status(404).json({ message: `Action ${id} not found` });
      }
    }
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedAction = await Actions.remove(id);
    if (deletedAction) {
      res.status(204).end();
    } else {
      res.status(404).json({ message: `Action ${id} not found` });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;