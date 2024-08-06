const Product = require("../../models/product.model")
const ProductCategory = require("../../models/product-category.model")

const productHelper = require("../../helpers/product")
const productCategoryHelper = require("../../helpers/productCategory")

// [GET] /products
module.exports.index = async (req, res) => {
    const products = await Product.find({
        status: "active",
        deleted: false
    }).sort({position : "desc"})

    const newProducts = productHelper.priceNewProducts(products)

    // console.log(products)

    res.render("client/pages/products/index", {
        pageTitle: "Danh sách sản phẩm",
        products: newProducts
    })
}

// [GET] /products/:slug
module.exports.detail = async (req, res) => {
    try {
        const find = {
            deleted: false,
            slug: req.params.slug,
            status: "active"
        }
    
        const product = await Product.findOne(find)
    
        res.render("client/pages/products/detail", {
            pageTitle: product.title,
            product: product
        })
    } catch (error) {
        res.redirect(`/products`)
    }
}

// [GET] /products/:slugCategory
module.exports.category = async (req, res) => {
    try {
        const category = await ProductCategory.findOne({
            slug: req.params.slugCategory,
            deleted: false
        })

        const listSubCategory = await productCategoryHelper.getSubCategory(category.id)

        const listSubCategoryId = listSubCategory.map(item => item.id)

        const products = await Product.find({
            product_category_id: { $in : [category.id, ...listSubCategoryId] }, 
            deleted: false 
        }).sort({ position: "desc" })

        const newProducts = productHelper.priceNewProducts(products)

        res.render("client/pages/products/index", {
            pageTitle: category.title,
            products: newProducts
        });
    } catch (error) {
        res.redirect(`/`)
    }
}