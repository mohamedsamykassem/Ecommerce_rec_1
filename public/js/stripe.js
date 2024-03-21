// /*eslint-disable */
// const stripe = Stripe(
//   'pk_test_51OrozaRoj4P6lRccNBJsB4btZJYggARLKM4GqzxCFdnmtzwPp0HRa9RIdMHhsbrHBvkfY9bg0fk0SHNpLaAtDa1U00YbsqLyAq'
// );
// const axios = require('axios');

// export const booktour = async tourid => {
//   const session = await axios.get(
//     `http://127.0.0.1:3000/api/v1/booking/checkoutseccion/${tourid}`
//   );

//   console.log(session);
// };

/* eslint-disable */
import axios from 'axios';

const stripePublicKey =
  'pk_test_51OrozaRoj4P6lRccNBJsB4btZJYggARLKM4GqzxCFdnmtzwPp0HRa9RIdMHhsbrHBvkfY9bg0fk0SHNpLaAtDa1U00YbsqLyAq';
const stripe = Stripe(stripePublicKey);
export const booktour = async (tourId, type, quantity, phone) => {
  try {
    // phone = phone.replace(/"/g, '');
    // const sanitizedPhone = phone.replace(/\D/g, '');

    // Send request to create Checkout session
    const response = await axios.post(
      `http://127.0.0.1:3000/api/v1/booking/checkoutseccion/${type}`
      // {
      //   headers: {
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify({ phone: sanitizedPhone.toString() })
      // }
    );

    console.log(response);

    await stripe.redirectToCheckout({
      sessionId: response.data.session.id
    });
  } catch (error) {
    console.error('Error fetching session:', error);
  }
};
