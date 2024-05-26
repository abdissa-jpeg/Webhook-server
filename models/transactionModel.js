const { string } = require("joi");
const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  invoiceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Invoice",
    required: true,
  },
  withdrawalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Withdrawal",
  },
  companyId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CompanyProfile',
    required: true
  },
  talentId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TalentProfile',
    required: true
  },
  paymentMethod:{
    type:String,
    enum:['Paypal','Wise',"FlutterWave"],
    required:true
  },
  transactionDetails: {
    type:Object,
    required:true
  },
  withdrawalStatus: {
    type: String,
    enum:['Not Withdrawn','Withdrawn'],
    default: 'Not Withdrawn',
    required:true
  }
},{ timestamps: true });

const Transaction = mongoose.model('Transaction', transactionSchema);


module.exports = Transaction;