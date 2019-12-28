const AppError = require('./../utils/appError');

const handleCastErrorDB = err => {
  const message = `Invalid ${err.path} : ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldDB = err => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Dupliate field value : ${value} Use another value`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = err => {
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `Invalid input data: ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJWTError = err => new AppError('Invalid token. Login Again', 401);

const handleExpiredJWT = err => new AppError('Token expired. Login Again', 401);

const sendErrorDev = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack
    });
  }
  console.error('Error', err);
  return res.status(err.statusCode).render('error', {
    title: 'Something is wrong',
    msg: err.message
  });
};

const sendErrorProd = (err, req, res) => {
  //API
  if (req.originalUrl.startsWith('/api')) {
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message
      });
    }
    //Log the error
    console.error('Error', err);

    //Send generic msg to client
    return res.status(500).json({
      status: 'error',
      message: 'something is wrong'
    });
  }
  //rendered  Website
  if (err.isOperational) {
    return res.status(err.statusCode).render('error', {
      title: 'Something is wrong',
      msg: err.message
    });
  }
  //Log the error
  console.error('Error', err);

  //Send generic msg to client
  return res.status(err.statusCode).render('error', {
    title: 'Something is wrong',
    msg: 'Please Try again later'
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    error.message = err.message;
    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldDB(error);
    if (error.name === 'ValidationError')
      error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError(error);
    if (error.name === 'TokenExpiredError') error = handleExpiredJWT(error);
    sendErrorProd(error, req, res);
  }
};
