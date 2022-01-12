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
            author: "61dd41b3f605a6557c65f104",
            location: `${cities[random].city}, ${cities[random].state}`,
            geometry: {
                type: "Point",
                coordinates: [-113, 47]
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/dwa8ln1gv/image/upload/v1641953533/YelpCamp/nrer6ujawhnshyghgw8n.jpg',
                    filename: 'YelpCamp/nrer6ujawhnshyghgw8n',
                },
                {
                    url: 'https://res.cloudinary.com/dwa8ln1gv/image/upload/v1641943963/YelpCamp/tfw18ts4vqllgyzjtxro.jpg',
                    filename: 'YelpCamp/tfw18ts4vqllgyzjtxro'
                }
            ],
            price: Math.floor(Math.random() * 20 + 15),
            description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Assumenda, perspiciatis nemo? Perspiciatis quos delectus debitis illo nisi, eius voluptates obcaecati labore placeat ipsam recusandae sequi, accusantium eos blanditiis voluptas at.'
        })
        await camp.save();
    }
}

seedDB().then(() => {
    db.close();
})