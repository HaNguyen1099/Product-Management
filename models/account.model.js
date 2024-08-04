const mongoose = require("mongoose")
const generateHelper = require("../helpers/generate")

const accountSchema = new mongoose.Schema(
    { 
        fullName: String, 
        email: String, 
        password: String,
        token: {
            type: String, 
            default: generateHelper.generateRandomString(20)
        },
        phone: String,
        avatar: String, 
        role_id: String, 
        status: String, 
        createdBy: {
            account_id: String,
            createdAt: {
                type: Date,
                default: Date.now
            }
        },
        deleted: {
            type: Boolean,
            default: false
        },
        deletedAt: Date
    }, {
        timestamps: true
    });

const Account = mongoose.model('Account', accountSchema, "accounts");

module.exports = Account
