/*eslint-disable */
import { login, deleterequest } from './login';
import { updatepassword } from './updatesettings';
import { makingtour } from './makeingtour';
import axios from 'axios';
import { showAlert } from './alerts';
import { booktour } from './stripe';

const loginform = document.querySelector('.form--login');
const updatedfrorm = document.querySelector('.form-user-data');
const updatedpass = document.querySelector('.form-user-settings');
const maketour = document.querySelector('.form-user-mange');
// const book_tour = document.getElementById('book_id');
const book_tour = document.getElementById('checkout-form');
const delete_btn = document.getElementById('delete-btn');

if (maketour) {
  maketour.addEventListener('submit', async e => {
    e.preventDefault();

    const form = new FormData();
    form.append('name', document.getElementById('name').value);

    //form.append('duration', document.getElementById('Duration').value);
    //form.append('maxGroupSize', document.getElementById('maxGroupSize').value);
    //form.append('difficulty', document.getElementById('difficulty').value);
    form.append(
      'ratingsAverage',
      document.getElementById('ratingsAverage').value
    );
    form.append(
      'ratingsQuantity',
      document.getElementById('ratingsQuantity').value
    );
    form.append('price', document.getElementById('price').value);
    form.append('description', document.getElementById('description').value);
    form.append('summary', document.getElementById('summary').value);
    form.append('stoke', document.getElementById('stoke').value);
    form.append('imageCover', document.getElementById('imageCover').files[0]);
    form.append('images', document.getElementById('images1').files[0]);
    form.append('images', document.getElementById('images2').files[0]);
    form.append('images', document.getElementById('images3').files[0]);

    console.log(form);
    // const form = document.getElementById('maketour');

    // const name = document.getElementById('name').value;
    // const duration = document.getElementById('Duration').value;
    // const maxGroupSize = document.getElementById('maxGroupSize').value;
    // const difficulty = document.getElementById('difficulty').value;
    // const ratingsAverage = document.getElementById('ratingsAverage').value;
    // const ratingsQuantity = document.getElementById('ratingsQuantity').value;
    // const price = document.getElementById('price').value;
    // const description = document.getElementById('description').value;
    // const summary = document.getElementById('summary').value;
    // const imageCover = document.getElementById('imageCover').files[0];

    // // Create FormData object
    // const formData = {
    //   name: name,
    //   duration: duration,
    //   maxGroupSize: maxGroupSize,
    //   difficulty: difficulty,
    //   ratingsAverage: ratingsAverage,
    //   ratingsQuantity: ratingsQuantity,
    //   price: price,
    //   description: description,
    //   summary: summary,
    //   imageCover: imageCover,
    //   images: ['tour-1-1.jpg', 'tour-1-2.jpg', 'tour-1-3.jpg']
    // };

    try {
      // Send POST request with FormData
      const response = await axios.post('/api/v1/tours/', form);

      // Handle success
      showAlert('success', 'YOUR PRODUCT WAS CREATED SUCCESSFULLY ✔');

      setTimeout(() => {
        window.location.assign('/');
      }, 1500);
    } catch (error) {
      // Handle error
      showAlert('error', error);
      console.log(error);
    }
  });
}

if (loginform)
  loginform.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });

if (updatedfrorm)
  updatedfrorm.addEventListener('submit', e => {
    e.preventDefault();
    const form = new FormData();

    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);
    // const name = document.getElementById('name').value;
    // const email = document.getElementById('email').value;
    updatepassword(form, 'data');
  });

if (updatedpass)
  updatedpass.addEventListener('submit', async e => {
    e.preventDefault();
    document.querySelector('.btn--small.btn--pass').textContent =
      'updating....';

    const CurrentPassword = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    await updatepassword(
      { CurrentPassword, password, passwordConfirm },
      'password'
    );
    document.querySelector('.btn--small.btn--pass').textContent =
      'save password';

    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  });

if (book_tour)
  book_tour.addEventListener('submit', async function(e) {
    e.preventDefault();

    document.querySelector('.btn.btn--green.btn--small--by').textContent =
      'LOADING .....';

    // const tourId = this.dataset.tourId;
    // const { tourId } = e.target.dataset;
    const type = String(document.getElementById('currency').value);
    // const quantity = document.getElementById('quantity').value;
    // const phone = document.getElementById('phone').value;
    // const address = document.getElementById('address').value;
    await booktour(type);
    document.querySelector('.btn.btn--green.btn--small--by').textContent =
      'BUY NOW !';
  });

// if (delete_btn)
//   delete_btn.addEventListener('click', async function(e) {
//     e.preventDefault();
//     const { id } = e.target.dataset;
//     deleterequest(id);
//   });

for (let i = 0; i < 400; i++) {
  const buttonId = `delete-btn-${i}`;
  const button = document.getElementById(buttonId);

  if (button) {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      const { id } = e.target.dataset;
      deleterequest(id);
      // Add your delete functionality here
    });
  }
}

document.addEventListener('DOMContentLoaded', function() {
  const quantityInputs = document.querySelectorAll('.card__quantity');

  quantityInputs.forEach(input => {
    input.addEventListener('change', function(event) {
      event.preventDefault();
      const id = event.target.dataset.id;
      const newQuantity = event.target.value;
      console.log(id);

      // Send a request to update the booking's quantity in the backend
      updateBookingQuantity(id, newQuantity);
    });
  });
});

function updateBookingQuantity(id, newQuantity) {
  // Make an AJAX request to update the booking's quantity
  // You can use fetch or XMLHttpRequest to send the request
  // Example using fetch:
  axios(`/api/v1/booking/cart-update/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    // body: JSON.stringify({ quantity: newQuantity })
    data: {
      quantity: newQuantity
    }
  })
    .then(response => {
      if (!response) {
        throw new Error('Failed to update quantity');
      }
      // Handle successful response
    })
    .catch(error => {
      console.log('Error updating quantity:', error);
    });
}
