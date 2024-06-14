const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  invoiceName: {
    type: String,
    required: true
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  talentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  contractId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contract',
    required: true
  },
  amount: {
    type: Number,
    required:true
  },
  status: {
    type: String,
    enum: ['Unpaid', 'Fully Paid', 'Partially Paid', 'Overdue'],
    default: 'Unpaid'
  },
  issueDate: {
    type: Date,
    
  },
  dueDate: {
    type: Date,
    
  }
}, { timestamps: true });

const Invoice = mongoose.model('Invoice', invoiceSchema);

module.exports = Invoice;
