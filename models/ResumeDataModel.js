const mongoose = require('mongoose');

const resumeDataSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: false,
    },
  text:String , // Assuming you want to store the extracted text from the PDF resume
  // You can add more fields here if needed
},{ timestamps: true });

const ResumeData = mongoose.model('ResumeData', resumeDataSchema);

module.exports = ResumeData;
