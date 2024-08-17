const mongoose = require("mongoose");

const settingGeneralSchema = new mongoose.Schema(
    {
        websiteName: String,
        logo: String,
        phone: String,
        email: String,
        address: String,
        copyright: String,
        map: String
    }, {
        timestamps: true
    }
)

const SettingGeneral = mongoose.model('SettingGeneral', settingGeneralSchema, 'settings-general')

module.exports = SettingGeneral