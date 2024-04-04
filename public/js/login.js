/* eslint-disable */

import { showAlert } from './alerts';
import axios from 'axios';
export const login = async (email, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/login',
      data: {
        email: email,
        password: password
      }
    });
    showAlert('success', 'you are login successfly ✔');
    window.setTimeout(() => {
      window.location.assign('/');
    }, 1500);

    if (res.data.status === 'success') {
      window.setTimeout(() => {
        window.location.assign('/');
      }, 1);
    }
  } catch (err) {
    console.log(err.response.data);
    showAlert('error', err.response.data.message);
  }
};
export const deleterequest = async id => {
  try {
    const res = await axios({
      method: 'DELETE',
      url: `/api/v1/booking/cart-delete/${id}`
    });

    if (!res.data) {
      showAlert('success', ' success deleted ✔');
      window.setTimeout(() => {
        window.location.assign('/api/v1/booking/cart');
      }, 1);
    }
  } catch (err) {
    console.log(err.response.data);
    showAlert('error', err.response.data.message);
  }
};

// export const LOGOUT = async () => {
//   try {
//     const res = await axios({
//       method: 'GET',
//       url: '/api/v1/users/logout'
//     });
//     if (res.data.status === 'success') location.reload(true);
//   } catch (err) {
//     console.log(err);
//     showAlert('error', 'Error logging out! Try again.');
//   }
// };

// export const signup = async data => {
//   console.log(data);
//   try {
//     const res = await axios({
//       method: 'POST',
//       url: '/api/v1/users/signup',
//       data
//     });

//     if (res.data.status === 'success') {
//       showAlert('success', 'you are login successfly ✔');
//       window.setTimeout(() => {
//         window.location.assign('/');
//       }, 1500);
//     }
//   } catch (err) {
//     //console.log(err.response.data);
//     console.log(err);
//     showAlert('error', err);
//   }
// };
// export const signup = async data => {
//   console.log(data);
//   try {
//     const res = await axios({
//       method: 'POST',
//       url: '/api/v1/users/signup',
//       data
//     });
//     if (res.status === 200) {
//       // Successful signup
//       showAlert('success', 'You have successfully signed up! Redirecting...');
//       window.setTimeout(() => {
//         window.location.assign('/');
//       }, 1500);
//     } else {
//       // Handle unexpected response status
//       showAlert('error', 'Unexpected response status: ' + res.status);
//     }
//   } catch (err) {
//     // Error occurred
//     let errorMessage = 'An error occurred while signing up';
//     if (err.response && err.response.data && err.response.data.message) {
//       // Extract error message from response
//       errorMessage = err.response.data.message;
//     } else if (err.message) {
//       // Use error message from Axios error object
//       errorMessage = err.message;
//     }
//     console.error('Signup error:', err); // Log the full error for debugging
//     showAlert('error', errorMessage);
//   }
// };
