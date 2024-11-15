const mongoose = require("mongoose")
const slug = require("mongoose-slug-updater")

mongoose.plugin(slug)

const productSchema = new mongoose.Schema(
    { 
        title: String, 
        product_category_id: String, 
        description: String,
        price: Number,
        discountPercentage: Number,
        stock: Number,
        thumbnail: String,
        status: String,
        featured: String,
        position: Number,
        slug: {
            type: String,
            slug: "title",
            unique: true
        },
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
        deletedBy: {
            account_id: String,
            deletedAt: Date
        },
        updatedBy: [
            {
                account_id: String,
                updatedAt: Date
            }
        ],
        ratings: [{
            account_id: String,
            rating: {
                type: Number,
                min: 1,
                max: 5
            },
            createdAt: {
                type: Date,
                default: Date.now
            }
        }],
        averageRating: {
            type: Number,
            default: 0
        },
        totalRatings: {
            type: Number,
            default: 0
        },
        comments: [{
            account_id: String,
            text: String,
            createdAt: {
                type: Date,
                default: Date.now
            }
        }]
    });

// Add method to calculate average rating
productSchema.methods.calculateAverageRating = function() {
    if (this.ratings.length === 0) {
        this.averageRating = 0;
        this.totalRatings = 0;
    } else {
        const sum = this.ratings.reduce((acc, rating) => acc + rating.rating, 0);
        this.averageRating = (sum / this.ratings.length).toFixed(1);
        this.totalRatings = this.ratings.length;
    }
};

const Product = mongoose.model('Product', productSchema, "products");

module.exports = Product
