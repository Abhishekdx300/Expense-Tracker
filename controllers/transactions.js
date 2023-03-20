const Transaction = require("../models/Transaction");

// @desc   Get all transactions
// @route  GET  /api/v1/transactions
// @access  public
const getTransactions = async (req, res, next) => {
  try {
    const transactions = await Transaction.find();
    return res.status(200).json({
      success: true,
      count: transactions.length,
      data: transactions,
    });
  } catch (err) {
    return res.send(500).json({
      success: false,
      error: "Server Error",
    });
  }
};

// @desc   Add transactions
// @route  POST  /api/v1/transactions
// @access  public
const addTransactions = async (req, res, next) => {
  try {
    const { text, amount } = req.body;

    const transaction = await Transaction.create(req.body);

    return res.status(201).json({
      success: true,
      data: transaction,
    });
  } catch (err) {
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((val) => val.message);
      return res.status(400).json({
        success: false,
        error: messages,
      });
    }
  }
};

// @desc   Delete transactions
// @route  DELETE  /api/v1/transactions/:id
// @access  public
const deleteTransactions = async (req, res, next) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) {
      return res.status(404).json({
        success: false,
        error: " no transactions found",
      });
    }
    await Transaction.findByIdAndRemove(req.params.id)

    return res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: " server error",
      err
    });
  }
};

module.exports = {
  getTransactions,
  addTransactions,
  deleteTransactions,
};
