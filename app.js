const express = require('express');
const path = require('path');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieparser = require('cookie-parser');
const compression = require('compression');
const bodyparser = require('body-parser');
const cors = require('cors');
const winston = require('winston');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRouts');
const viewRouter = require('./routes/viewRoutes');
const bookingRouter = require('./routes/bookingRouts');
const bookingcontroller = require('./controllers/bookingcontroller');

const app = express();
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
// 1) GLOBAL MIDDLEWARES
// Set security HTTP headers
app.use(cors());
app.options('*', cors());
app.use(helmet());
// app.post(
//   '/webhook_checkout',
//   bodyparser.raw({ type: 'application/json' }),
//   //express.json(),
//   bookingcontroller.webhook_checkout
// );
// Configure Winston logger
const logger = winston.createLogger({
  transports: [new winston.transports.File({ filename: 'server.log' })]
});
app.post(
  '/webhook_checkout',
  bodyparser.raw({ type: 'application/json' }),
  (req, res, next) => {
    // Set a custom timeout value for this route handler
    const TIMEOUT_VALUE = 60000; // 60 seconds in milliseconds
    logger.info(`i am i web_route`);
    req.setTimeout(TIMEOUT_VALUE, () => {
      const error = new Error('Request Timeout');
      error.status = 408; // Request Timeout
      next(error);
    });
    next();
  },
  bookingcontroller.webhook_checkout
);

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);

// Body parser, reading data from body into req.body
// { limit: '10kb' }
app.use(express.json());
app.use(cookieparser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price'
    ]
  })
);

// Serving static files
app.use(express.static(`${__dirname}/public`));

app.use(compression());
// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.cookies);
  // console.log(req.headers);
  next();
});

// 3) ROUTES
app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/booking', bookingRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
