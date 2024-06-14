const mongoose = require('mongoose');

// Define the talentProfileSchema
const talentProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  name: {
    type:String,
  },
  country: {
    type:String,
  },
  city: {
    type:String,
  },
  description: {
    type:String,
  },
  availability: {
    type: Boolean,
  },
  resume: {
    type: String,
  },
  profileImage: {
    type: String,
  },
  bookableCalendarLink: {
    type: String,
  },

  idNo:{
    type:String,
  },
  idFile:{
    type:String,
  },
  attachment:{
    type:String,
  },
  skills: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Skill',
  }],
},{ timestamps: true });

// Create the 'Talent' model using the talentProfileSchema
const TalentProfile = mongoose.model('TalentProfile', talentProfileSchema);

// Export the Talent model
module.exports = TalentProfile;
