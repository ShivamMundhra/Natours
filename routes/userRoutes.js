const express = require('express');

const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');
const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

router.patch(
  '/updatePassword',
  authController.protect,
  authController.updatePassword
);

router.patch(
  '/updateCurrentUser',
  authController.protect,
  userController.currentUserUpdate
);

router.delete(
  '/deleteCurrentUser',
  authController.protect,
  userController.deleteCurrentUser
);

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route('/:id')
  .get(userController.getUserById)
  .patch(userController.updateUserById)
  .delete(userController.deleteUserById);

module.exports = router;
