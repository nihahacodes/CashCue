const express = require("express");
const router = express.Router();

const Transaction = require("../models/Transaction");
console.log('Loaded Transaction model type:', typeof Transaction, Transaction && Transaction.modelName);


// GET ALL TRANSACTIONS

router.get("/", async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ ts: -1 });
    res.status(200).json(transactions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});


// ADD TRANSACTION

router.post("/", async (req, res) => {
  try {
    const { name, amount, category, canteen, ts } = req.body;

    console.log('POST /transactions - Transaction in-scope:', typeof Transaction, Transaction && Transaction.modelName);

    const transaction = new Transaction({
      name,
      amount,
      category,
      canteen,
      ts: ts || Date.now(),
    });

    const saved = await transaction.save();
    res.status(201).json(saved);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

// DELETE TRANSACTION
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const removed = await Transaction.findByIdAndDelete(id);
    if (!removed) return res.status(404).json({ message: "Not found" });
    res.status(200).json({ message: "Deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;