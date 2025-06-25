const express = require('express')
const router = express.Router()

const {
  getAllTransactions,
  getTransaction,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} = require("../controllers/transactions");

router.route("/").post(createTransaction).get(getAllTransactions);
router
  .route("/:id")
  .get(getTransaction)
  .delete(deleteTransaction)
  .patch(updateTransaction);

module.exports = router