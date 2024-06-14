const mongoose = require('mongoose');

const companyProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    unique: [true, 'User ID should be unique'],
  },
  name: {
    type: String,
    //required: [true, "name is required"],
  },
  profileImage: {
    type: String,
  },
  companyEmail: {
    type: String,
    minlength: [0, 'Email should be at least 5 characters long'],
    maxlength: [255, 'Email should have less than 255 characters'],
    //unique:[false,"the email already exist"],
    //email: true,
  },
  description: {
    type: String,
    minlength: [8, 'Description should be at least 8 characters long']
    //required: [true, "description is required"],
  },
  website: {
    type: String,
    //required: [true, "website is required"],
  },
},{ timestamps: true });

const CompanyProfile = mongoose.model('CompanyProfile', companyProfileSchema);
module.exports = CompanyProfile;
