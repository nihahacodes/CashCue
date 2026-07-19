const express     = require("express");
const router      = express.Router();
const Transaction = require("../models/Transaction");
const verifyToken = require("../middleware/auth");



// ─── GET all transactions for this user ───────────────────────────────────────
router.get("/", verifyToken, async (req, res) => {
  try {
    const transactions = await Transaction
      .find({ userId: req.uid })
      .sort({ ts: -1 });
    res.status(200).json(transactions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});


router.post("/", verifyToken, async (req, res) => {
  try {
    const { name, amount, category, canteen, ts } = req.body;

    const transaction = new Transaction({
      userId:   req.uid, // always from verified token, never from body
      name,
      amount,
      category,
      canteen,
      ts: ts || Date.now(),
    });

    const saved = await transaction.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});


router.delete("/:id", verifyToken, async (req, res) => {
  try {
    // findOneAndDelete with both _id AND userId prevents users
    // from deleting each other's transactions by guessing an ID.
    const removed = await Transaction.findOneAndDelete({
      _id:    req.params.id,
      userId: req.uid,
    });

    if (!removed) {
      return res.status(404).json({ message: "Not found or not yours" });
    }

    res.status(200).json({ message: "Deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
