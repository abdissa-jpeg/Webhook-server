const mongoose = require("mongoose");

const withdrawalSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  method: {
    type: String,
    required:true,
    enum: ["Paypal", "Wise","FlutterWave"],
  },
  accountDetails: {
    type:Object,
    required:true
  }
},{ timestamps: true });

const Withdrawal = mongoose.model('Withdrawal', withdrawalSchema);


module.exports = Withdrawal;