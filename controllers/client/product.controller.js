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

// [GET] /products/detail/:slugProduct
module.exports.detail = async (req, res) => {
    try {
        const find = {
            deleted: false,
            slug: req.params.slugProduct,
            status: "active"
        }
    
        const product = await Product.findOne(find)

        if (product.product_category_id) {
            const category = await ProductCategory.findOne({
                _id: product.product_category_id,
                status: "active",
                deleted: false
            })

            product.category = category
        }

        product.priceNew = productHelper.priceNewProduct(product)

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

// [POST] /products/rating/:id
module.exports.rating = async (req, res) => {
  try {
    const id = req.params.id;
    const rating = parseInt(req.body.rating);
    const userId = res.locals.user.id;

    const product = await Product.findById(id);
    
    // Check if user already rated
    const existingRating = product.ratings.find(item => 
      item.account_id.toString() === userId.toString()
    );

    if (existingRating) {
      existingRating.rating = rating;
      existingRating.createdAt = new Date();
    } else {
      product.ratings.push({
        account_id: userId,
        rating: rating
      });
    }

    product.calculateAverageRating();
    await product.save();

    req.flash("success", "Cảm ơn bạn đã đánh giá sản phẩm!");
    res.redirect("back");
  } catch (error) {
    req.flash("error", "Đánh giá không thành công!");
    res.redirect("back");
  }
};

// [POST] /products/comment/:id
module.exports.comment = async (req, res) => {
  try {
    const id = req.params.id;
    const comment = req.body.comment;
    const userId = res.locals.user.id;

    const product = await Product.findById(id);
    
    product.comments.push({
      account_id: userId,
      text: comment
    });

    await product.save();

    req.flash("success", "Bình luận đã được thêm!");
    res.redirect("back");
  } catch (error) {
    req.flash("error", "Thêm bình luận không thành công!");
    res.redirect("back");
  }
};