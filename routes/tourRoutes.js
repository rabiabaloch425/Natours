const express = require('express');
 const tourController = require('./../controllers/tourController');
const {getAllTours, createTour, getTour, deleteTour, updateTour  } = require('./../controllers/tourController');
const router = express.Router();

// Create a checkBody Middleware
// Check if Body contains the name and price property
// If not send back 400 (bad request)
// Add it to the post handler check

// router.param('id', tourController.checkID)

//Filter Api
router.route('/tour-stats').get(tourController.getTourStats)
router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan)
router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);
router.route('/').get(getAllTours).post(createTour)
router.route('/:id').get(getTour).delete(deleteTour).patch(updateTour)

module.exports = router;