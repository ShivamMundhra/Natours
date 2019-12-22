const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  //SEND THE RESPONSE
  res.status(200).json({
    status: 'success',
    requestTime: req.requestTime,
    results: users.length,
    data: {
      users
    }
  });
});

exports.getUserById = (req, res) => {
  res.status(500).json({
    status: 'err',
    message: 'this route is not yet handles'
  });
};
exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'err',
    message: 'this route is not yet handles'
  });
};
exports.deleteUserById = (req, res) => {
  res.status(500).json({
    status: 'err',
    message: 'this route is not yet handles'
  });
};
exports.updateUserById = (req, res) => {
  res.status(500).json({
    status: 'err',
    message: 'this route is not yet handles'
  });
};
