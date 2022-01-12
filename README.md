# YelpCamp
YelpCamp is a web app that helps users find campgrounds around the world and review them.

Link : https://mos3adcamp.herokuapp.com/

### Features:

- User can look up a campground
- User can review a campground and give it a certain rating
- User can login/register using username and password
- User can make a new campground online
- User can edit his/her campground
- User can delete his/her campground 
- All images are uploaded and saved using cloudinary
- Maps and Locations are displayed using Mapbox

## Used For Implemention:

Technologies that are used : 
* NodeJS 
* ExpressJS
* MongoDB

Node Modules:

* @mapbox/mapbox-sdk
* cloudinary
* connect-flash
* connect-mongo
* cookie-parser
* dotenv
* ejs
* ejs-mate
* express
* express-mongo-sanitize
* express-session
* helmet
* joi
* method-override
* mongoose
* morgan
* multer
* multer-storage-cloudinary
* nodemon
* passport
* passport-local
* passport-local-mongoose
* sanitize-html


### Active Environments

* Application is running and hosted using heroku: https://mos3adcamp.herokuapp.com/
* Database is hosted using MongoDB Atlas
* Images are uploaded to cloud using cloudinary.

## Testing the App

Feel free to test the functionality of this website by signing up and creating/editing/deleting campgrounds, creating/deleting reviews.
The app has full RESTful CRUD functionality when it comes to campgrounds, I have validated it server side and client side.
client side validations were done using bootstrap, server side validations were done using several express middlewares that I wrote.

