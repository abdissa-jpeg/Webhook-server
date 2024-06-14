// models/Guide.js
const mongoose = require('mongoose');

const guideSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
    minlength:[10,'description  should be greter than 10 characters ']
    
  },
  isActive: {
    type:Boolean,
    default:true
  }
},{ timestamps: true });

module.exports = mongoose.model('Guide', guideSchema);
