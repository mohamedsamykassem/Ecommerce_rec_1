/*eslint-disable*/
const Booking = require('./../models/bookingModel');
const stripe = require('stripe')(process.env.STRIP_SECRT_KEY);

const AppError = require('../utils/appError');
const Tour = require('./../models/tourModel');
const catchasync = require('./../utils/catchAsync');
const factory = require('./factory');

exports.getseccion = catchasync(async (req, res, next) => {
  //1 find the tour by id

  // Find all bookings of the user
  const bookings = await Booking.find({ user: req.user.id });
  // Extract quantity from each booking
  const quantities = bookings.map(booking => booking.quantity);
  const tourIds = bookings.map(booking => booking.tour);

  // Fetch all tours based on the tourIds
  const tour = await Tour.find({ _id: { $in: tourIds } });

  if (!tour.length) {
    return next(new AppError('There are no tours for this user.', 404));
  }

  //const currency = req.params.type;
  //2 create seccion on server
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: req.user.email,
      billing_address_collection: {
        phone: req.body.phone
      },
      client_reference_id: req.params.tourId,
      line_items: tour.map((tour, index) => ({
        price_data: {
          currency: 'SAR',
          product_data: {
            name: tour.name,
            description: tour.description
          },
          unit_amount: tour.price * quantities[index]
        },
        quantity: quantities[index]
      })),

      mode: 'payment',
      success_url: `${req.protocol}://${req.get('host')}/`,
      cancel_url: `${req.protocol}://${req.get('host')}/api/v1/booking/cart`
    });
    res.status(200).json({
      status: 'success',
      session
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: 'error',
      error: err
    });
  }

  //3make response to the clint side
});

exports.createbooking = catchasync(async (req, res, next) => {
  req.body.user = req.user.id;
  req.body.tour = req.params.tourId;
  const booking = await Booking.create(req.body);
  res.status(200).redirect('/');
});
// exports.createbooking = catchasync(async (req, res, next) => {
//   req.body.user = req.user.id;
//   req.body.tour = req.params.tourId;
//   const booking = await Booking.create(req.body);

//   // Decrease stock for each item booked
//   const bookedTourIds = booking.map(booking => booking.tour);
//   const bookedQuantities = booking.map(booking => booking.quantity);

//   // Update stock for each booked item
//   await Promise.all(
//     bookedTourIds.map(async (tourId, index) => {
//       const tour = await Tour.findById(tourId);
//       if (!tour) {
//         // Handle if tour not found
//         return next(new AppError('Tour not found', 404));
//       }
//       // Decrease the stock by the booked quantity
//       tour.stock -= bookedQuantities[index];
//       await tour.save();
//     })
//   );

//   res.status(200).redirect('/');
// });

exports.getbooking = async (req, res, next) => {
  try {
    const booking = await Booking.find({ user: req.user.id });
    const tourides = booking.map(el => el.tour); // with this line we get all tour id for this user
    const tours = await Tour.find({ _id: { $in: tourides } }); //  get all tour from tours data base
    //the we should render them in cart page
    // if (tours.length === 0) {
    //   return res.status(200).render('empty-cart', {
    //     tittle: 'Empty cart'
    //   });
    // } else {
    //   return res.status(200).render('cart-page', {
    //     tittle: 'cart page ',
    //     tours,
    //     booking
    //   });
    // }
    if (tours) {
      res.status(200).render('testpage', {
        tittle: 'cart page',
        tours,
        booking
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: 'error',
      error: err
    });
  }
};

// // Fetch all tours from the database based on tourIds
// const tourPromises = tours.map(async tour => {
//   const tourId = typeof tour === 'object' ? tour.id : tour;
//   return await Tour.findById(tourId);
// });

// const fetchedTours = await Promise.all(tourPromises);

exports.deletebooking = factory.deletone(Booking);
exports.updatebooking = factory.Updateone(Booking);

const createbookingcheckout = async session => {
  // Extract relevant information from the session object
  const lineItems = session.display_items;
  const tourIds = lineItems.map(item => item.client_reference_id);
  const quantities = lineItems.map(item => item.quantity);

  // Update stock for each booked item
  await Promise.all(
    tourIds.map(async (tourId, index) => {
      try {
        const tour = await Tour.findByIdAndUpdate(
          tourId,
          { $inc: { stoke: -quantities[index] } }, // Decrement stock by quantities[index]
          { new: true, runValidators: true }
        );
      } catch (error) {
        console.error(`Error updating stock for tour ${tourId}:`, error);
      }
    })
  );
};

// Assume this is your webhook endpoint for handling successful payments
exports.webhook_checkout = async (req, res, next) => {
  const payload = req.body;

  // Verify the webhook signature
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      payload,
      sig,
      process.env.WBE_HOOKSEC
    );
  } catch (err) {
    console.error('Webhook signature verification failed.', err);
    return res.sendStatus(400);
  }
  // Handle the event
  if (event.type === 'checkout.session.completed')
    createbookingcheckout(event.data.object);

  return res.status(200).json({ received: true });
};
