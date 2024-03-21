const mongoose = require('mongoose');
const Tour = require('./tourModel');

const ReviewSchema = new mongoose.Schema({
  review: {
    type: String,
    require: [true, 'you should make an review ']
  },
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  createAt: {
    type: Date,
    default: Date.now
  },
  tour: {
    type: mongoose.Schema.ObjectId,
    ref: 'Tour',
    required: [true, 'you should but tour id for refrance ']
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, ' you should put user refrance id ']
  }
});

ReviewSchema.pre(/^find/, function(next) {
  this.populate('user');
  next();
});

//calculate average rating

// will make static function on schema

ReviewSchema.statics.calculateAverage = async function(tourId) {
  const statics = await this.aggregate([
    {
      $match: { tour: tourId }
    },
    {
      $group: {
        _id: '$tour',
        numorating: { $sum: 1 },
        avgRating: { $avg: '$rating' }
      }
    }
  ]);
  if (statics.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsAverage: statics[0].avgRating,
      ratingsQuantity: statics[0].numorating
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsAverage: 4.5,
      ratingsQuantity: 0
    });
  }
};
ReviewSchema.pre(/^findOneAnd/, async function(next) {
  this.currentdoc = await this.findOne();
  next();
});
ReviewSchema.post(/^findOneAnd/, function() {
  this.currentdoc.constructor.calculateAverage(this.currentdoc.tour);
});
ReviewSchema.post('save', function() {
  this.constructor.calculateAverage(this.tour);
});

const Review = mongoose.model('Review', ReviewSchema);

module.exports = Review;
