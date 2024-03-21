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

    if (res.data.status === 'success') {
      showAlert('success', 'you are login successfly ✔');
      window.setTimeout(() => {
        window.location.assign('/');
      }, 1500);
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
