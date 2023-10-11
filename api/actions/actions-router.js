// Write your "actions" router here!
const express = require('express');
const router = express.Router();

const Actions = require('../actions/actions-model');

//GET /api/actions
router.get('/', async (req, res) => {
    try {
        const actions = await Actions.get();
        res.status(200).json(actions);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving actions'});
    }

});

//GET /api/actions/:id
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const action = await Actions.get(id);

        if (!action) {
            return res.status(404).json({ message: 'Action not found' });
        }
        res.status(200).json(action);
    }catch (error) {
        res.status(500).json({ message: 'Error retrieving action' });
    }

});

//POST /api/actions
router.post('/', async (req, res) => {
    try {
        const { project_id, description, notes, completed } = req.body;
          
        if (!project_id || !description || !notes) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const newAction = await Actions.insert({
            project_id,
            description,
            notes,
            completed: completed || false,
        });
        res.status(201).json(newAction);
    } catch (error) {
        res.status(500).json({ message: 'Error creating action' });
    }

});

//PUT /api/actions/:id
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { project_id, description, notes, completed } = req.body;

        if  (!project_id || !description || !notes) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const action = await Actions.get(id);

        if (!action) {
            return res.status(404).json({ message: "Actions not found"});
        }

        const updatedAction = await Actions.update(id, {
            project_id,
            description,
            notes,
            completed: completed || false,
        });

        res.status(200).json(updatedAction);
    } catch (error) {
        res.status(500).json({ message: "Error updating action" });
    }

});

//DELETE /api/actions/:id
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const action = await Actions.get(id);

        if (!action) {
            return res.status(404).json({ message: "Action not found"});
        }

        await Actions.remove(id);

        res.status(204).end();
    }   catch (error) {
        res.status(500).json({ message: "Error deleting action" });
    }

});

module.exports = router;
