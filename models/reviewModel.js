const moongoose = require('mongoose');

const reviewSchema = new moongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Empty Review is not allowed']
    },
    rating: {
      type: Number,
      // required:[true,'A review must have a rating'],
      min: 1,
      max: 5
    },
    createdAt: {
      type: Date,
      // required:[true,'review must a have createdAt timestamp'],
      default: Date.now()
    },
    tour: {
      type: moongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour']
    },
    user: {
      type: moongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a User']
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

reviewSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'user',
    select: 'name photo'
  });
  //   .populate({
  //     path: 'tour',
  //     select: 'name'
  //   });
  next();
});

const Review = moongoose.model('Review', reviewSchema);

module.exports = Review;
