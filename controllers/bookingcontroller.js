/*eslint-disable*/
const Booking = require('./../models/bookingModel');
const stripe = require('stripe')(process.env.STRIP_SECRT_KEY);

const AppError = require('../utils/appError');
const Tour = require('./../models/tourModel');
const catchasync = require('./../utils/catchAsync');
const factory = require('./factory');

// exports.getseccion = catchasync(async (req, res, next) => {
//   //1 find the tour by id

//   // Find all bookings of the user
//   const bookings = await Booking.find({ user: req.user.id });
//   // Extract quantity from each booking
//   const quantities = bookings.map(booking => booking.quantity);
//   const tourIds = bookings.map(booking => booking.tour);

//   // Fetch all tours based on the tourIds
//   const tour = await Tour.find({ _id: { $in: tourIds } });

//   if (!tour.length) {
//     return next(new AppError('There are no tours for this user.', 404));
//   }

//   //const currency = req.params.type;
//   //2 create seccion on server
//   try {
//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ['card'],
//       customer_email: req.user.email,
//       billing_address_collection: {
//         phone: req.body.phone
//       },
//       client_reference_id: req.params.tourId,
//       line_items: tour.map((tour, index) => ({
//         price_data: {
//           currency: 'SAR',
//           product_data: {
//             name: tour.name,
//             description: tour.description
//           },
//           unit_amount: tour.price * quantities[index]
//         },
//         quantity: quantities[index]
//       })),

//       mode: 'payment',
//       success_url: `${req.protocol}://${req.get('host')}/`,
//       cancel_url: `${req.protocol}://${req.get('host')}/api/v1/booking/cart`
//     });
//     res.status(200).json({
//       status: 'success',
//       session
//     });
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({
//       status: 'error',
//       error: err
//     });
//   }
//   //3make response to the clint side
// });
exports.getseccion = catchasync(async (req, res, next) => {
  // Find all bookings of the user
  const bookings = await Booking.find({ user: req.user.id });
  // Extract quantity from each booking
  const quantities = bookings.map(booking => booking.quantity);
  const tourIds = bookings.map(booking => booking.tour);

  // Fetch all tours based on the tourIds
  const tours = await Tour.find({ _id: { $in: tourIds } });

  if (!tours.length) {
    return next(new AppError('There are no tours for this user.', 404));
  }

  try {
    // Create a checkout session for each tour
    const sessions = await Promise.all(
      tours.map(async (tour, index) => {
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ['card'],
          customer_email: req.user.email,
          billing_address_collection: {
            phone: req.body.phone // Ensure req.body.phone contains the correct phone number
          },
          client_reference_id: tour.id, // Use tour ID as client reference ID
          line_items: [
            {
              price_data: {
                currency: 'SAR',
                product_data: {
                  name: tour.name,
                  description: tour.description
                },
                unit_amount: tour.price * quantities[index]
              },
              quantity: quantities[index]
            }
          ],
          mode: 'payment',
          success_url: `${req.protocol}://${req.get('host')}/`,
          cancel_url: `${req.protocol}://${req.get('host')}/api/v1/booking/cart`
        });
        return session;
      })
    );

    res.status(200).json({
      status: 'success',
      sessions
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: 'error',
      error: err.message // Send the error message to the client
    });
  }
});

exports.createbooking = catchasync(async (req, res, next) => {
  req.body.user = req.user.id;
  req.body.tour = req.params.tourId;
  const booking = await Booking.create(req.body);
  res.status(200).redirect('/');
});

exports.getbooking = async (req, res, next) => {
  try {
    const booking = await Booking.find({ user: req.user.id });
    const tourides = booking.map(el => el.tour); // with this line we get all tour id for this user
    const tours = await Tour.find({ _id: { $in: tourides } }); //  get all tour from tours data base

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

exports.deletebooking = factory.deletone(Booking);
exports.updatebooking = factory.Updateone(Booking);

// const createbookingcheckout = async session => {
//   try {
//     // Check if session is defined and has the expected structure
//     if (!session || !session.display_items) {
//       //throw new Error('Invalid session object');
//       console.log(error);
//     }

//     console.log('Received session object:', session);

//     // Extract relevant information from the session object
//     const lineItems = session.display_items;
//     const tourIds = lineItems.map(item => item.client_reference_id);
//     const quantities = lineItems.map(item => item.quantity);

//     console.log('Line items:', lineItems);
//     console.log('Tour IDs:', tourIds);
//     console.log('Quantities:', quantities);

//     // Update stock for each booked item
//     await Promise.all(
//       tourIds.map(async (tourId, index) => {
//         try {
//           await Tour.findByIdAndUpdate(
//             tourId,
//             { $inc: { stoke: -quantities[index] } }, // Decrement stock by quantities[index]
//             { new: true, runValidators: true }
//           );
//         } catch (error) {
//           console.error(`Error updating stock for tour ${tourId}:`, error);
//         }
//       })
//     );
//   } catch (error) {
//     console.error('Error processing session:', error);
//   }
// };

// Assume this is your webhook endpoint for handling successful payments
exports.webhook_checkout = async (req, res) => {
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
  if (event.type === 'checkout.session.completed') {
    await createbookingcheckout(event.data.object);
  }

  return res.status(200).json({ received: true });
};

////////////////////////////////////////////////////////////////////////////////////////
const createbookingcheckout = async session => {
  try {
    // Check if session is defined and has the expected structure
    if (!session || !session.display_items) {
      throw new Error('Invalid session object');
    }

    console.log('Received session object:', session);

    // Extract relevant information from the session object
    const lineItems = session.display_items;
    const tourIds = lineItems.map(item => item.client_reference_id);
    const quantities = lineItems.map(item => item.quantity);

    console.log('Line items:', lineItems);
    console.log('Tour IDs:', tourIds);
    console.log('Quantities:', quantities);

    // Update stock for each booked item
    await Promise.all(
      tourIds.map(async (tourId, index) => {
        try {
          await Tour.findByIdAndUpdate(
            tourId,
            { $inc: { stoke: -quantities[index] } }, // Decrement stock by quantities[index]
            { new: true, runValidators: true }
          );
        } catch (error) {
          console.error(`Error updating stock for tour ${tourId}:, error`);
          throw error; // Rethrow the error to ensure it's caught by the outer try-catch block
        }
      })
    );
  } catch (error) {
    console.error('Error processing session:', error);
  }
};
