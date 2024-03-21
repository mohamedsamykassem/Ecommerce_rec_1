const express = require('express');
const reviewcontroller = require('./../controllers/reviewController');
const authController = require('./../controllers/authController');

const Router = express.Router({ mergeParams: true });

// Router.route('/:tourId/review').post(
//   authController.protect,
//   authController.restrictTo('user'),
//   reviewcontroller.createreview
// );

Router.use(authController.protect);

Router.route('/')
  .get(reviewcontroller.getallreview)
  .post(
    authController.restrictTo('user'),
    reviewcontroller.createmiddleware,
    reviewcontroller.createreview
  );

Router.route('/:id')
  .get(reviewcontroller.getreview)
  .patch(authController.restrictTo('admin'), reviewcontroller.updatereview)
  .delete(authController.restrictTo('admin'), reviewcontroller.deletereview);

module.exports = Router;
