const express = require('express');

const bokkingcontroller = require('./../controllers/bookingcontroller');
const authController = require('./../controllers/authController');

const Router = express.Router();
// Router.route('/cart-delete/:id').all(
//   authController.protect,
//   bokkingcontroller.deletebooking
// );
Router.post(
  '/checkoutseccion/:type',
  authController.protect,
  bokkingcontroller.getseccion
);
Router.all(
  '/to-cart/:tourId',
  authController.protect,
  bokkingcontroller.createbooking
);
Router.get('/cart', authController.protect, bokkingcontroller.getbooking);
Router.delete(
  '/cart-delete/:id',
  authController.protect,
  bokkingcontroller.deletebooking
);
Router.patch(
  '/cart-update/:id',
  authController.protect,
  bokkingcontroller.updatebooking
);

module.exports = Router;
// Router.post(
//   '/checkoutseccion/:tourId/:type/:quantity',
//   authController.protect,
//   bokkingcontroller.getseccion
// );
