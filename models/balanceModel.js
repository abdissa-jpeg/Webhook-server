const mongoose = require("mongoose");

const balanceSchema = new mongoose.Schema(
  {
    talentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
      unique: [true, "User ID should be unique"],
    },
    balance: {
      USD: {
        type: Number,
        default: 0,
      },
      EUR: {
        type: Number,
        default: 0,
      },
      JPY: {
        type: Number,
        default: 0,
      },
      GBP: {
        type: Number,
        default: 0,
      },
      AUD: {
        type: Number,
        default: 0,
      },
      CAD: {
        type: Number,
        default: 0,
      },
      BIRR: {
        type: Number,
        default: 0,
      },
    },
  },
  { timestamps: true }
);

const Balance = mongoose.model("Balance", balanceSchema);

module.exports = Balance;
