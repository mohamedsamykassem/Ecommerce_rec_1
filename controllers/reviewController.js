const Review = require('../models/ReviewModel');
// const catchAsync = require('../utils/catchAsync');
const factory = require('./factory');

exports.getallreview = factory.getAll(Review);
exports.getreview = factory.getone(Review);

exports.createmiddleware = (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.createreview = factory.createone(Review);
exports.deletereview = factory.deletone(Review);
exports.updatereview = factory.Updateone(Review);
