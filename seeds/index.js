const mongoose = require('mongoose');
const Campground = require('../models/campground')
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    //useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error:"));
db.once("open", () => {
    console.log("Database Connected");
});

const randomSample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random = Math.floor(Math.random() * 1000);
        const camp = new Campground({
            title: `${randomSample(descriptors)} ${randomSample(places)}`,
            location: `${cities[random].city}, ${cities[random].state}`,
            image: "https://source.unsplash.com/collection/483251",
            price: Math.floor(Math.random() * 20 + 15),
            description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Assumenda, perspiciatis nemo? Perspiciatis quos delectus debitis illo nisi, eius voluptates obcaecati labore placeat ipsam recusandae sequi, accusantium eos blanditiis voluptas at.'
        })
        await camp.save();
    }
}

seedDB().then(() => {
    db.close();
})