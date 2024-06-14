require('dotenv').config();

const MONGO_URL = process.env.MONGO_URL
const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET
const PAYPAL_BASE = process.env.PAYPAL_BASE
const FLW_PUBLIC_KEY = process.env.FLW_PUBLIC_KEY
const FLW_SECRET_KEY = process.env.FLW_SECRET_KEY
const FLW_SECRET_HASH = process.env.FLW_SECRET_HASH
const FLW_BASE = process.env.FLW_BASE
const PAYSTACK_SECRET_HASH= process.env.PAYSTACK_SECRET_HASH


module.exports = {
    MONGO_URL,
    PAYPAL_CLIENT_ID,
    PAYPAL_CLIENT_SECRET,
    PAYPAL_BASE,
    FLW_PUBLIC_KEY,
    FLW_SECRET_KEY,
    FLW_SECRET_HASH,
    FLW_BASE
}