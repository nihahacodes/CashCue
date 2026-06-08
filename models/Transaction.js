const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: "",
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    category: {
      type: String,
      default: "",
    },

    canteen: {
      type: String,
      default: "",
    },

    // timestamp in ms (frontend uses `ts`)
    ts: {
      type: Number,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Transaction", transactionSchema);