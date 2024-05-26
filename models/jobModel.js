// models/jobmodel.js
const { boolean } = require('joi');
const mongoose = require('mongoose');

const jobPostingSchema = new mongoose.Schema({
  company_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CompanyProfile',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
    minlength:[10,'description  should be greater than 10 characters ']
  },
  payment: {
    type: String,
    required: true,
  },
  skills: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Skill',
    },
  ],
  isActive: {
    type:Boolean,
    default:true
  },
  violating_policies:{
    type:Boolean,
    default:false
  }

},{ timestamps: true });


const JobPosting = mongoose.model('JobPosting', jobPostingSchema);


module.exports = JobPosting;