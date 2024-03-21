/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const makingtour = async data => {
  console.log(data);
  try {
    const res = await axios.post('/api/v1/tours/', {});
    if (res.data.status === 'success') {
      showAlert('success', 'YOUR PRODECT  MAKED SUCCESSFLY  ✔');
      window.setTimeout(() => {
        window.location.assign('/');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err);
    console.log(err);
  }
};
