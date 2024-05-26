const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    discount: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Discount',
    },
},{ timestamps: true });
const Package=mongoose.model('Package', packageSchema);
module.exports = Package;
