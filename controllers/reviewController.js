const Review = require('../models/reviewModel');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/userModel');
const Tour = require('../models/tourModel');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

exports.allowNestedGetReviews = (req, res, next) => {
    let filter = {};
    if (req.params.tourId) {
        filter = { tour: req.params.tourId };
    }
    next();
};
exports.getAllReviews = factory.getAll(Review);
// exports.getAllReviews = catchAsync(async (req, res, next) => {
    // let filter = {};
    // if (req.params.tourId) {
    //     filter = { tour: req.params.tourId };
    // }
//     const reviews = await Review.find(filter).populate('tour').populate('user').lean();
//     res.status(200).json({
//         status: 'success',
//         results: reviews.length,
//         data: {
//             reviews
//         }
//     });
// });

exports.setTourUserIds = (req, res, next) => {
    // Allow nested routes
    if (!req.body.tour) {
        req.body.tour = req.params.tourId;
    }

    if (!req.body.user) {
        req.body.user = req.user.id;
    }
    //// End Allow nested routes logic
    next();
};

exports.createReview = factory.createOne(Review);
// exports.createReview = catchAsync(async (req, res, next) => {
    // Allow nested routes
    // if (!req.body.tour) {
    //     req.body.tour = req.params.tourId;
    // }

    // if (!req.body.user) {
    //     req.body.user = req.user.id;
    // }
    //// End Allow nested routes logic
//     const newReview = await Review.create(req.body);
//     res.status(201).json({
//         status: 'success',
//         data: {
//             review: newReview
//         }
//     });
// });

exports.deleteReview = factory.deleteOne(Review);

exports.updateReview = factory.updateOne(Review);

exports.getReview = factory.getOne(Review);