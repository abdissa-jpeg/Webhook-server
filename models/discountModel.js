const mongoose = require('mongoose');

const discountSchema = new mongoose.Schema({
    packageId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Package',
        required: true,
    },
    originalPrice: {
        type: Number,
        required:0
    },
    discountPercentage: {
        type: Number,
        required:0
    },
    startDate: {
        type: Date,
        required: true,
        default: Date.now 
    },    
    endDate: {
        type: Date,
        required: true
    },
},{ timestamps: true })
const Discount=mongoose.model('Discount', discountSchema);
module.exports = Discount;