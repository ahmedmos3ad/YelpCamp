const mongoose=require('mongoose');
const Review=require('./review');
const Schema=mongoose.Schema;

//by default moongose doesn't include virtuals when you conver a document to JSON
const opts={ toJSON: { virtuals: true } };

const ImageSchema=new Schema(
    {
        url: String,
        filename: String
    }
)
//create a  virtual property from the database to provide a thumbnail of the image from cloudinary
ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
})

const CampgroundSchema=new Schema({
    title: String,
    price: Number,
    description: String,
    images: [ImageSchema],
    location: String,
    //GeoJSON
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
}, opts);

CampgroundSchema.post('findOneAndDelete', async doc => {
    //console.log("Some Camp got deleted")
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
        //console.log("Review Deleted")
    }
})

CampgroundSchema.virtual('properties.popUpMarkup').get(function () {
    return `<strong><a href="/campgrounds/${this._id}">${this.title}</a></strong>
    <p>${this.location}</p>`
});

module.exports=mongoose.model('Campground', CampgroundSchema);