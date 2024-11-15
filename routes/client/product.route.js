const express = require("express")
const router = express.Router()
const authMiddleware = require("../../middlewares/client/auth.middleware")
const controller = require("../../controllers/client/product.controller")

router.get("/", controller.index)

router.get("/:slugCategory", controller.category)

router.get("/detail/:slugProduct", controller.detail)

router.post("/rating/:id", 
  authMiddleware.requireAuth,
  controller.rating
);

router.post("/comment/:id",
  authMiddleware.requireAuth, 
  controller.comment
);

module.exports = router