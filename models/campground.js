const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;

const CampgroundSchema = new Schema({
    title: String,
    price: Number,
    description: String,
    image: String,
    location: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});

CampgroundSchema.post('findOneAndDelete', async doc => {
    console.log("Some Camp got deleted")
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
        console.log("Review Deleted")
    }
})
module.exports = mongoose.model('Campground', CampgroundSchema);