const express = require('express');

const viewsContoller = require('./../controllers/viewsController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.get('/me', authController.protect, viewsContoller.getAccount);
router.post(
  '/submit-user-data',
  authController.protect,
  viewsContoller.updateUserData
);

router.use(authController.isLoggedIn);

router.get('/', viewsContoller.getOverview);
router.get('/tour/:slug', viewsContoller.getTour);
router.get('/login', viewsContoller.getLoginForm);

module.exports = router;
