const mongoose = require('mongoose');

const ContractSchema = new mongoose.Schema({
  contractType: {
    type: String,
    required: [true, 'contract type is required'],
    enum: ['Fixed', 'Pay As You Go']
  },
  contractName:{
    type: String,
    required: true
  },
  companyId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CompanyProfile',
    required: true
  },
  talentId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TalentProfile',
  },
  responsibilities:{
      type:String,
      required: true
  },
  companyName:{
      type:String,
      required: true
  },
  registrationAddress:{
    type: String,
    required: true,
  },
  contractStartDate:{
    type: Date,
    required: true
  },
  contractEndDate:{
    type: Date,
  },
  workStartDate:{
    type: Date,
    required: true
  },
  paymentCurrency:{
    type: String,
    enum: ['USD', 'EUR', 'JPY', 'GBP', 'AUD', 'CAD', 'BIRR'],
    required: true
  },
  paymentDue:{
    type: Number,
    required: true
  },
  paymentDetail:{
    fixed:{
      paymentFrequency:{
        type: String,
        enum:['Monthly', 'Weekly'],
        
      },
      payment:{
        type: Number,
        
      }
    },
    payAsYouGo:{
      hourlyRate:{
        type: Number
        
      },
      minimumHourForPayment:{
        type: Number,
      }
    }
  },
  additionalDocuments:{
    type: String,
  },
  complianceDocuments:{
    type: String
  },
  specialClause:{
    type: String
  },
  noticePeriod:{
    value:{
      type: Number,
      default: 0
    },
    unit:{
      type: String,
      enum:['Days','Weeks','Months'],
      default: 'Days'
    },
  },
  status: {
    type: String,
    enum: ['Unsigned', 'OnProgress', 'Terminated'],
    default: 'Unsigned',
    required:true
  },
  signature: {
    company: {
      name: String,
      date: Date,
      location: String,
    },
    talent: {
      name: String,
      date: Date,
      location: String,
    }
  },isDeleted:{
    type:Boolean,
    default:false,
 },
}, 
 { timestamps: true });

const Contract = mongoose.model('Contract', ContractSchema);
module.exports = Contract;
