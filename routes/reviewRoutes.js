const express = require('express');
const router = express.Router({mergeParams: true});
const authController = require('../controllers/authController');
const reviewController = require('../controllers/reviewController');


// Due to mergeParams: true in the router, we can now access params from parent routes
// like POST /tours/:tourId/reviews will have access to :tourId here
// GET /tours/:tourId/reviews will also work similarly
// And simple GET /reviews will also work

router.route('/')
    .get(authController.protect, reviewController.allowNestedGetReviews, reviewController.getAllReviews)
    .post(authController.protect, authController.restrictTo('user'), reviewController.setTourUserIds, reviewController.createReview);

router.route('/:id')
    .get(authController.protect, reviewController.getReview)
    .patch(authController.protect, authController.restrictTo('user', 'admin'), reviewController.updateReview)
    .delete(authController.protect, authController.restrictTo('user', 'admin'), reviewController.deleteReview);

module.exports = router;