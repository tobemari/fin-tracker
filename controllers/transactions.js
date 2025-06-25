const Transaction = require("../models/Transaction");
const Goal = require("../models/Goal");
const {StatusCodes} = require('http-status-codes')
const {BadRequestError, NotFoundError} = require('../errors')


const getAllTransactions = async (req, res) => {
  const transactions = await Transaction.find({
    createdBy: req.user.userId,
  }).sort("createdAt");
  res.status(StatusCodes.OK).json({ transactions, count: transactions.length });
};

const getTransaction = async (req, res) => {
  const {
    user: { userId },
    params: { id: transactionID },
  } = req;
  const transaction = await Transaction.findOne({
    _id: transactionID,
    createdBy: userId,
  });
  if (!transaction) {
    throw new NotFoundError(`No transaction with id ${transactionID}`);
  }
  res.status(StatusCodes.OK).json({ transaction });
};

const createTransaction = async (req, res) => {
  req.body.createdBy = req.user.userId;
  const transaction = await Transaction.create(req.body);

  if (
    transaction.type === "expense" &&
    transaction.expenseCategory === "savings" &&
    req.body.goalId
  ) {
    const goal = await Goal.findOne({
      _id: req.body.goalId,
      createdBy: req.user.userId,
    });

    if (goal) {
      goal.currentAmount += transaction.amount;
      await goal.save();
    }
  }

  res.status(StatusCodes.CREATED).json({ transaction });
};

const updateTransaction = async (req, res) => {
  const {
    body: { title, amount, type, incomeCategory, expenseCategory, goalId },
    user: { userId },
    params: { id: transactionId },
  } = req;

  if (!title || !amount || !type) {
    throw new BadRequestError("Title, amount, and type are required");
  }

  if (type === "income" && !incomeCategory) {
    throw new BadRequestError("Income category is required for income type");
  }

  if (type === "expense" && !expenseCategory) {
    throw new BadRequestError("Expense category is required for expense type");
  }

  const existingTx = await Transaction.findOne({
    _id: transactionId,
    createdBy: userId,
  });
  if (!existingTx) {
    throw new NotFoundError(`No transaction with id ${transactionId}`);
  }

  if (
    existingTx.type === "expense" &&
    existingTx.expenseCategory === "savings" &&
    existingTx.goalId
  ) {
    const oldGoal = await Goal.findOne({
      _id: existingTx.goalId,
      createdBy: userId,
    });
    if (oldGoal) {
      oldGoal.currentAmount -= existingTx.amount;
      await oldGoal.save();
    }
  }

  const updatedTransaction = await Transaction.findOneAndUpdate(
    { _id: transactionId, createdBy: userId },
    req.body,
    { new: true, runValidators: true }
  );

  if (
    updatedTransaction.type === "expense" &&
    updatedTransaction.expenseCategory === "savings" &&
    goalId
  ) {
    const newGoal = await Goal.findOne({
      _id: goalId,
      createdBy: userId,
    });
    if (newGoal) {
      newGoal.currentAmount += updatedTransaction.amount;
      await newGoal.save();
    }
  }

  res.status(StatusCodes.OK).json({ transaction: updatedTransaction });
};

const deleteTransaction = async (req, res) => {
  const {
    user: { userId },
    params: { id: transactionId },
  } = req;

  const transaction = await Transaction.findOne({
    _id: transactionId,
    createdBy: userId,
  });

  if (!transaction) {
    throw new NotFoundError(`No transaction with id ${transactionId}`);
  }

  if (
    transaction.type === "expense" &&
    transaction.expenseCategory === "savings" &&
    transaction.goalId
  ) {
    const goal = await Goal.findOne({
      _id: transaction.goalId,
      createdBy: userId,
    });

    if (goal) {
      goal.currentAmount -= transaction.amount;
      await goal.save();
    }
  }

  await transaction.deleteOne();

  res.status(StatusCodes.OK).json({ msg: "The transaction was deleted." });
};


module.exports = {
  getAllTransactions,
  getTransaction,
  createTransaction,
  updateTransaction,
  deleteTransaction,
};