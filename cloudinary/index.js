const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');


cloudinary.config({
    cloud_name: process.env.CloudinaryCloudName,
    api_key: process.env.CloudinaryAPIKEY,
    api_secret: process.env.CloudinarySecret
})

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'YelpCamp',
        allowedFormats: ['jpeg', 'jpg', 'png']
    }
})

module.exports = { cloudinary, storage }