// add middlewares here related to actions
// middleware.js
const Actions = require("./actions-model");

async function checkActionExists(req, res, next) {
  try {
    const { id } = req.params;
    const action = await Actions.get(id);
    if (action) {
      req.action = action;
      next();
    } else {
      res.status(404).json({ message: `Action ${id} not found` });
    }
  } catch (error) {
    next(error);
  }
}

function validateActionData(req, res, next) {
  const { project_id, description, notes } = req.body;
  if (!project_id || !description || !notes) {
    res
      .status(400)
      .json({ message: "Project ID, description, and notes are required" });
  } else {
    next();
  }
}

module.exports = {
  checkActionExists,
  validateActionData,
};
