const express = require("express")
const router = express.Router()
const multer  = require('multer')
const upload = multer()

const controller = require("../../controllers/admin/product-category.controller")

const validate = require("../../validates/admin/product-category.validate")

const uploadCloud = require("../../middleware/admin/uploadCloud.middleware")

router.get("/", controller.index)

router.get("/create", controller.create)

router.post(
    "/create", 
    upload.single("thumbnail"),
    uploadCloud.upload,
    validate.createPost,
    controller.createPost)

router.patch("/change-status/:status/:id", controller.changeStatus)

router.patch("/change-multi", controller.changeMulti)

module.exports = router