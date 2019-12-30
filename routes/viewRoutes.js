const express = require('express');

const viewsContoller = require('./../controllers/viewsController');
const authController = require('./../controllers/authController');
const bookingController = require('./../controllers/bookingController');

const router = express.Router();

router.get('/me', authController.protect, viewsContoller.getAccount);
router.post(
  '/submit-user-data',
  authController.protect,
  viewsContoller.updateUserData
);

router.get(
  '/',
  bookingController.createBookingCheckout,
  authController.isLoggedIn,
  viewsContoller.getOverview
);
router.use(authController.isLoggedIn);

router.get('/tour/:slug', viewsContoller.getTour);
router.get('/login', viewsContoller.getLoginForm);
router.get('/my-tours', authController.protect, viewsContoller.getMyTours);

module.exports = router;
