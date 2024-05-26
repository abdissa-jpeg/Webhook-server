const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'skill is required'],
    unique: [true, 'skill already exists'],
  },
},{ timestamps: true });

const Skill = mongoose.model('Skill', skillSchema);
module.exports = Skill;
