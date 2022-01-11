const joi = require("joi");

module.exports.campgroundScehma = joi.object({
  campground: joi.object({
    title: joi.string().required(),
    price: joi.number().min(0).required(),
    description: joi.string().required(),
    location: joi.string().required(),
    image: joi.string().required(),
  }).required(),
});

module.exports.reviewSchema = joi.object({
  review: joi.object({
    rating: joi.number().required().min(1).max(5),
    text: joi.string().required(),
  }).required(),
});
