const express = require('express');
const viewcontroller = require('./../controllers/viewcontroller');
const authController = require('./../controllers/authController');

const Router = express.Router();

Router.get('/', authController.islogined, viewcontroller.getoverview);
Router.get('/tour/:slug', authController.islogined, viewcontroller.gettour);
Router.get('/login', viewcontroller.getlogin);
Router.get('/me', authController.protect, viewcontroller.acountsetting);
Router.get('/mange', authController.protect, viewcontroller.maketour);

module.exports = Router;
