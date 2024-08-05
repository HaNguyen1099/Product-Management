const express = require("express")
const multer  = require('multer')
const router = express.Router()
const upload = multer()

const uploadCloud = require("../../middleware/admin/uploadCloud.middleware")

const validate = require("../../validates/admin/account.validate")

const controller = require("../../controllers/admin/my-account.controller")

router.get("/", controller.index)

router.get("/edit", controller.edit)

router.patch(
    "/edit", 
    upload.single("avatar"),
    uploadCloud.upload,
    validate.editPatch,
    controller.editPatch)

module.exports = router