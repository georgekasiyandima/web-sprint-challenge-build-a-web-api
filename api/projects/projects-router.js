// api/projects/projects-router.js

const express = require('express');
const Projects = require('./projects-model');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const projects = await Projects.get();
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving projects' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Projects.get(id);

    if (project) {
      res.status(200).json(project);
    } else {
      res.status(404).json({ message: 'Project not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving project' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, description, completed } = req.body;

    if (!name || !description || name.trim() === '' || description.trim() === '') {
      res.status(400).json({ message: 'Name and description are required' });
      return;
    }

    const newProject = await Projects.insert({ name, description, completed });
    res.status(201).json(newProject);
  } catch (error) {
    res.status(500).json({ message: 'Error creating project' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, completed } = req.body;

    if (!name || !description || name.trim() === '' || description.trim() === '') {
      res.status(400).json({ message: 'Name and description are required' });
      return;
    }

    const updatedProject = await Projects.update(id, {
      name,
      description,
      completed,
    });

    if (updatedProject) {
      res.status(200).json(updatedProject);
    } else {
      res.status(404).json({ message: 'Project not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating project' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCount = await Projects.remove(id);

    if (deletedCount > 0) {
      res.status(204).end();
    } else {
      res.status(404).json({ message: 'Project not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting project' });
  }
});

router.get('/:id/actions', async (req, res) => {
  try {
    const { id } = req.params;
    const actions = await Projects.getProjectActions(id);

    if (actions) {
      res.status(200).json(actions);
    } else {
      res.status(404).json({ message: 'Project not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving actions' });
  }
});

module.exports = router;