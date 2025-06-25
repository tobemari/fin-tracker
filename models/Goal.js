const mongoose = require('mongoose')

const GoalSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a goal name"],
      maxlength: 50,
      trim: true,
    },
    targetAmount: {
      type: Number,
      required: [true, "Please provide a target amount"],
      min: 0,
    },
    currentAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    monthlyContribution: {
      type: Number,
      required: [true, "Please provide a monthly contribution amount"],
      min: 0,
    },
    targetDate: {
      type: Date,
      required: [true, "Please provide a target date"],
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide a user"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Goal", GoalSchema);