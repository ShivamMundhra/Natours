const fs = require('fs');

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    requestTime: req.requestTime,
    results: tours.length,
    data: {
      tours
    }
  });
};

exports.getTourById = (req, res) => {
  const id = req.params.id * 1;
  const tour = tours.find(el => el.id === id);

  // if (id > tours.length)
  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid Id'
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour
    }
  });
};

exports.checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: 'err',
      message: 'Name or price missing'
    });
  }
  next();
};

exports.createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/../dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    err => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour
        }
      });
    }
  );
};

exports.updateTourById = (req, res) => {
  const id = req.params.id * 1;
  if (id > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid Id'
    });
  }
  const updatedTours = [];
  tours.map(tour => {
    let oldTour = tour;
    if (tour.id === id) {
      oldTour = {
        ...tour,
        ...req.body
      };
    }
    updatedTours.push(oldTour);
  });
  fs.writeFile(
    `${__dirname}/../dev-data/data/tours-simple.json`,
    JSON.stringify(updatedTours),
    err => {
      res.status(200).json({
        status: 'Success',
        data: {
          updatedTours
        }
      });
    }
  );
};

exports.deleteTourById = (req, res) => {
  const id = req.params.id * 1;
  const updatedTours = [];
  tours.map(tour => {
    if (tour.id !== id) {
      updatedTours.push(tour);
    }
  });
  if (!updatedTours) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid Id'
    });
  }
  fs.writeFile(
    `${__dirname}/../dev-data/data/tours-simple.json`,
    JSON.stringify(updatedTours),
    err => {
      res.status(204).json({
        status: 'Success',
        data: {
          updatedTours
        }
      });
    }
  );
};
