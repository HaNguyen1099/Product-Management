const Product = require("../../models/product.model")

const productHelper = require("../../helpers/product")

// [GET] /
module.exports.index = async (req, res) => {
    // Lấy ra sản phẩm nổi bật
    const productsFeatured = await Product.find({
        featured: "1",
        deleted: false,
        status: "active"
    }).limit(6)

    const newProductsFeatured = productHelper.priceNewProducts(productsFeatured)

    res.render("client/pages/home/index", {
        pageTitle: "Trang chủ",
        productsFeatured: newProductsFeatured
    })
}