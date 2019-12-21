//const fs = require('fs');

const Tour = require('./../models/tourModel');
const APIFeaturs = require('./../utils/apiFeatures');

const catchAsync = require('./../utils/catchAsync');

const AppError = require('./../utils/appError');
// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

exports.aliasTopTour = (req, res, next) => {
  req.query.limit = 5;
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,duration,ratingsAverage';
  next();
};

exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } }
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        numTours: { $sum: 1 },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        maxPrice: { $max: '$price' },
        minPrice: { $min: '$price' }
      }
    },
    {
      $sort: { avgPrice: 1 }
    }
  ]);
  res.status(200).json({
    status: 'success',
    requestTime: req.requestTime,
    data: {
      stats
    }
  });
});

exports.getAllTours = catchAsync(async (req, res, next) => {
  const features = new APIFeaturs(Tour.find(), req.query)
    .sort()
    .filter()
    .limitFields()
    .paginate();
  const tours = await features.query;

  //SEND THE RESPONSE
  res.status(200).json({
    status: 'success',
    requestTime: req.requestTime,
    results: tours.length,
    data: {
      tours
    }
  });
});

exports.getTourById = catchAsync(async (req, res, next) => {
  // const id = req.params.id * 1;
  // const tour = tours.find(el => el.id === id);
  // // if (id > tours.length)
  // if (!tour) {
  //   return res.status(404).json({
  //     status: 'fail',
  //     message: 'Invalid Id'
  //   });
  // }
  // res.status(200).json({
  //   status: 'success',
  //   data: {
  //     tour
  //   }
  // });
  const tour = await Tour.findById(req.params.id);
  // Tour.findOne({ _id : req.params.id })

  if (!tour) {
    return next(new AppError('No Tour found with the given Id', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour
    }
  });
});

// no longer needed
//exports.checkBody = (req, res, next) => {
//   if (!req.body.name || !req.body.price) {
//     return res.status(400).json({
//       status: 'err',
//       message: 'Name or price missing'
//     });
//   }
//   next();
// };

exports.createTour = catchAsync(async (req, res, next) => {
  // const newId = tours[tours.length - 1].id + 1;
  // const newTour = Object.assign({ id: newId }, req.body);
  // tours.push(newTour);
  // fs.writeFile(
  //   `${__dirname}/../dev-data/data/tours-simple.json`,
  //   JSON.stringify(tours),
  //   err => {
  //     res.status(201).json({
  //       status: 'success',
  //       data: {
  //         tour: newTour
  //       }
  //     });
  //   }

  const newTour = await Tour.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      tour: newTour
    }
  });
});

exports.updateTourById = catchAsync(async (req, res, next) => {
  // const id = req.params.id * 1;
  // if (id > tours.length) {
  //   return res.status(404).json({
  //     status: 'fail',
  //     message: 'Invalid Id'
  //   });
  // }
  // const updatedTours = [];
  // tours.map(tour => {
  //   let oldTour = tour;
  //   if (tour.id === id) {
  //     oldTour = {
  //       ...tour,
  //       ...req.body
  //     };
  //   }
  //   updatedTours.push(oldTour);
  // });
  // fs.writeFile(
  //   `${__dirname}/../dev-data/data/tours-simple.json`,
  //   JSON.stringify(updatedTours),
  //   err => {
  //     res.status(200).json({
  //       status: 'Success',
  //       data: {
  //         updatedTours
  //       }
  //     });
  //   }
  // );

  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if (!tour) {
    return next(new AppError('No Tour found with the given Id', 404));
  }
  res.status(200).json({
    status: 'Success',
    data: {
      tour
    }
  });
});

exports.deleteTourById = catchAsync(async (req, res, next) => {
  // const id = req.params.id * 1;
  // const updatedTours = [];
  // tours.map(tour => {
  //   if (tour.id !== id) {
  //     updatedTours.push(tour);
  //   }
  // });
  // if (!updatedTours) {
  //   return res.status(404).json({
  //     status: 'fail',
  //     message: 'Invalid Id'
  //   });
  // }
  // fs.writeFile(
  //   `${__dirname}/../dev-data/data/tours-simple.json`,
  //   JSON.stringify(updatedTours),
  //   err => {
  //     res.status(204).json({
  //       status: 'Success',
  //       data: {
  //         updatedTours
  //       }
  //     });
  //   }
  // );
  const tour = await Tour.findByIdAndDelete(req.params.id);
  if (!tour) {
    return next(new AppError('No Tour found with the given Id', 404));
  }
  res.status(204).json({
    status: 'Success',
    data: null
  });
});

exports.getMontlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;

  console.log(year);
  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates'
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`)
        }
      }
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTourStarts: { $sum: 1 },
        tours: { $push: '$name' }
      }
    },
    { $addFields: { month: '$_id' } },
    {
      $project: {
        _id: 0
      }
    },
    {
      $sort: { numTourStarts: -1 }
    },
    {
      $limit: 6
    }
  ]);
  res.status(200).json({
    status: 'Success',
    data: {
      plan
    }
  });
});
