const express = require('express')
const router = express.Router()

const {
  getAllGoals,
  getGoal,
  createGoal,
  updateGoal,
  deleteGoal,
} = require("../controllers/goals");

router.route("/").post(createGoal).get(getAllGoals);
router.route("/:id").get(getGoal).delete(deleteGoal).patch(updateGoal);

module.exports = router