/* eslint-disable */

import axios from 'axios';
import { showAlert } from './alerts';

export const update = async (name, email) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: 'http://127.0.0.1:3000/api/v1/users/updateMe',
      data: {
        name,
        email
      }
    });
    if (res.data.status === 'success') {
      showAlert('success', 'you are updated successfly ✔');
      window.setTimeout(() => {
        window.location.assign('/me');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const updatepassword = async (data, type) => {
  console.log(data);
  try {
    const url =
      type === 'password'
        ? 'http://127.0.0.1:3000/api/v1/users/updatePassword'
        : 'http://127.0.0.1:3000/api/v1/users/updateMe';
    const res = await axios({
      method: 'PATCH',
      url,
      data
    });
    if (res.data.status === 'success') {
      showAlert('success', 'you are updated successfly ✔');
      window.setTimeout(() => {
        window.location.assign('/me');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
