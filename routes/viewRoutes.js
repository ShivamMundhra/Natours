const express = require('express');

const viewsContoller = require('./../controllers/viewsController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.get('/', viewsContoller.getOverview);
router.get('/tour/:slug', authController.protect, viewsContoller.getTour);
router.get('/login', viewsContoller.getLoginForm);

module.exports = router;
