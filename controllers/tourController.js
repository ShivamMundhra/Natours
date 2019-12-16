//const fs = require('fs');

const Tour = require('./../models/tourModel');
const APIFeaturs = require('./../utils/apiFeatures');

// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

exports.aliasTopTour = (req, res, next) => {
  req.query.limit = 5;
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,duration,ratingsAverage';
  next();
};

exports.getTourStats = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error
    });
  }
};

exports.getAllTours = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error
    });
  }
};

exports.getTourById = async (req, res) => {
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
  try {
    const tour = await Tour.findById(req.params.id);
    // Tour.findOne({ _id : req.params.id })
    res.status(200).json({
      status: 'success',
      data: {
        tour
      }
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error
    });
  }
};

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

exports.createTour = async (req, res) => {
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

  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error
    });
  }
};

exports.updateTourById = async (req, res) => {
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

  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    res.status(200).json({
      status: 'Success',
      data: {
        tour
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'fal',
      message: error
    });
  }
};

exports.deleteTourById = async (req, res) => {
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
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'Success',
      data: null
    });
  } catch (error) {
    res.status(400).json({
      status: 'fal',
      message: error
    });
  }
};
