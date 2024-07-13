const Product = require("../../models/product.model")

module.exports.index = async (req, res) => {
    const products = await Product.find({
        status: "active",
        deleted: false
    })

    const newProducts = products.map(i => {
        i.priceNew = (i.price * (100 - i.discountPercentage) / 100).toFixed(0)
        return i
    })

    console.log(products)

    res.render("client/pages/products/index", {
        pageTitle: "Trang danh sách sản phẩm",
        products: newProducts
    })
}