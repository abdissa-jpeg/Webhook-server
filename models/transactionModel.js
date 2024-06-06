const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  invoiceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Invoice"
  },
  withdrawalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Withdrawal",
  },
  companyId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CompanyProfile'
  },
  talentId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TalentProfile',
    required: true
  },
  transactionType:{
    type:String,
    enum:['Withdrawal','Payment'],
    required:true
  },
  transactionMethod:{
    type:String,
    enum:['Paypal','Wise',"FlutterWave"],
    required:true
  },
  transactionDetails: {
    type:Object,
    required:true
  }
},{ timestamps: true });

const Transaction = mongoose.model('Transaction', transactionSchema);


module.exports = Transaction;