module.exports.priceNewProducts = (products) => {
    const newProducts = products.map((i) => {
        i.priceNew = (i.price * (100 - i.discountPercentage) / 100).toFixed(0)
        return i
    })

    return newProducts
}

module.exports.priceNewProduct = (product) => {
    const priceNew = (product.price * (100 - product.discountPercentage) / 100).toFixed(0)

    return priceNew
}