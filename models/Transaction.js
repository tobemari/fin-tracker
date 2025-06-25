const mongoose = require('mongoose')

const TransactionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide transaction name"],
      maxlength: 50,
      trim: true,
    },
    amount: {
      type: Number,
      required: [true, "Please provide transaction amount"],
      max: 10000000,
    },
    type: {
      type: String,
      required: [true, "Please provide transaction type"],
      enum: ["income", "expense"],
    },
    incomeCategory: {
      type: String,
      enum: [
        "salary",
        "bonus",
        "freelance",
        "investment return",
        "gift",
        "refund",
        "other",
      ],
      required: function () {
        return this.type === "income";
      },
    },

    expenseCategory: {
      type: String,
      enum: [
        "rent",
        "groceries",
        "utilities",
        "transportation",
        "dining out",
        "entertainment",
        "health",
        "insurance",
        "education",
        "shopping",
        "subscriptions",
        "travel",
        "debt",
        "personal care",
        "childcare",
        "savings",
        "charity",
        "other",
      ],
      required: function () {
        return this.type === "expense";
      },
    },
    goalId: {
      type: mongoose.Types.ObjectId,
      ref: "Goal",
    },
    date: { type: Date, default: Date.now },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide a user"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", TransactionSchema);