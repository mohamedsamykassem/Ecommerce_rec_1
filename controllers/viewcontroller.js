const Tour = require('./../models/tourModel');
const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');

exports.getoverview = async (req, res) => {
  const tours = await Tour.find();
  res.status(200).render('overview', {
    tittle: 'overview _page',
    tours
  });
};

exports.gettour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'review',
    fields: 'review rating user'
  });
  if (!tour) {
    return next(new AppError('No tour found with that slug', 404));
  }
  res.status(200).render('tour', {
    tittle: 'tour_details',
    tour
  });
});

exports.getlogin = (req, res) => {
  res.status(200).render('login', {
    tittle: 'login _page'
  });
};

exports.acountsetting = (req, res) => {
  res.status(200).render('account', {
    tittle: 'account setting _page'
  });
};

exports.maketour = (req, res) => {
  res.status(200).render('maketour', {
    tittle: 'maketour_page'
  });
};

exports.getsignup = (req, res) => {
  res.status(200).render('signup', {
    tittle: 'signup _page'
  });
};
