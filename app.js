const express = require('express');
const morgan = require('morgan');

const app = express();

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

//MIDDLEWARES

app.use(morgan('dev'));
app.use(express.json());
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// SYNCHROUNS CODE (TOP-LEVEL CODE)

//ROUTES HANDLERS

//ROUTERS

// app.get('/api/v1/tours',getAllTours );
// app.get('/api/v1/tours/:id', getTourById);
// app.post('/api/v1/tours',createTour);
// app.patch('/api/v1/tours/:id',updatedTourById);
// app.delete('/api/v1/tours/:id', deleteTourById);
//Routes

//MOUNTING THE ROUTER
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
//SERVER

module.exports = app;
