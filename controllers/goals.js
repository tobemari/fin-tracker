const Goal = require("../models/Goal");
const {StatusCodes} = require('http-status-codes')
const {BadRequestError, NotFoundError} = require('../errors')


const getAllGoals = async (req, res) => {
  const goals = await Goal.find({
    createdBy: req.user.userId,
  }).sort("createdAt");
  res.status(StatusCodes.OK).json({ goals, count: goals.length });
};

const getGoal= async (req, res) => {
  const {
    user: { userId },
    params: { id: goalID },
  } = req;
  const goal = await Goal.findOne({
    _id: goalID,
    createdBy: userId,
  });
  if (!goal) {
    throw new NotFoundError(`No goal with id ${goalID}`);
  }
  res.status(StatusCodes.OK).json({ goal });
};

const createGoal = async (req, res) => {
  req.body.createdBy = req.user.userId;
  const goal = await Goal.create(req.body);
  res.status(StatusCodes.CREATED).json({ goal });
};

const updateGoal = async (req, res) => {
  const {
    body: { title, targetAmount, monthlyContribution, targetDate },
    user: { userId },
    params: { id: goalId },
  } = req;
  
  if (!title || !targetAmount || !monthlyContribution || !targetDate) {
    throw new BadRequestError("All fields are required");
  }

  const goal = await Goal.findOneAndUpdate(
    { _id: goalId, createdBy: userId },
    req.body,
    { new: true, runValidators: true }
  );
  if (!goal) {
    throw new NotFoundError(`No goal with id ${goalId}`);
  }
  res.status(StatusCodes.OK).json({ goal });
};


const deleteGoal = async (req, res) => {
  const {
    user: { userId },
    params: { id: goalId },
  } = req;

  const goal = await Goal.findOneAndDelete({
    _id: goalId,
    createdBy: userId,
  });

  if (!goal) {
    throw new NotFoundError(`No goal with id ${goalId}`);
  }

  res.status(StatusCodes.OK).json({ msg: "Goal was deleted." });
};

module.exports = {
  getAllGoals,
  getGoal,
  createGoal,
  updateGoal,
  deleteGoal,
};