/*eslint-disable */
import '@babel/polyfill';
import axios from 'axios';
import { login, deleterequest, LOGOUT } from './login';
import { updatepassword } from './updatesettings';
import { makingtour } from './makeingtour';
import { showAlert } from './alerts';
import { booktour } from './stripe';

const loginform = document.querySelector('.form--login');
const signupform = document.querySelector('.form--signup');
const logout = document.querySelector('.nav__el--logout');
const updatedfrorm = document.querySelector('.form-user-data');
const updatedpass = document.querySelector('.form-user-settings');
const maketour = document.querySelector('.form-user-mange');
// const book_tour = document.getElementById('book_id');
const book_tour = document.getElementById('checkout-form');
const delete_btn = document.getElementById('delete-btn');
const searchbox = document.querySelector('.search-box');
const searchQuery = document.getElementById('search-input').value;
const searchbtn = document.getElementById('search-btn');
const loadbtn = document.querySelector('load_button');
const load_btn = document.getElementById('load-more-btn');

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
if (logout)
  logout.addEventListener('click', async () => {
    try {
      const res = await axios({
        method: 'GET',
        url: '/api/v1/users/logout'
      });
      if (res.data.status === 'success') location.reload(true);
    } catch (err) {
      console.log(err);
      showAlert('error', 'Error logging out! Try again.');
    }
  });

if (loginform)
  loginform.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });

if (signupform) {
  signupform.addEventListener('submit', async e => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;

    try {
      const response = await axios.post('/api/v1/users/signup', {
        name,
        email,
        password,
        passwordConfirm
      });

      // Check if the response indicates success

      // Handle success
      showAlert('success', 'You have successfully signed up! Redirecting...');
      setTimeout(() => {
        window.location.assign('/');
      }, 1500);
    } catch (error) {
      // Handle error
      showAlert(
        'error',
        'An error occurred while signing up. Please try again later.'
      );
      console.log(error); // Log the error for debugging
    }
  });
}

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
/////////////////////////////////////////////////////////////////
//search box
if (searchbtn)
  searchbtn.addEventListener('click', async () => {
    const searchQuery = document.getElementById('search-input').value;

    try {
      // Make an API call to fetch tours with the specified name
      // const response = await axios.get(`/api/v1/tours?name=${searchQuery}`);
      // const response = await axios({
      //   method: 'GET',
      //   url: `/api/v1/tours?name=${searchQuery}`
      // });
      window.location.href = `/api/v1/tours?name=${searchQuery}`;
      // Handle the response data, update the UI, etc.
      console.log(response.data.tours); // This will be an array of tours matching the search query
    } catch (error) {
      console.error('Error fetching tours:', error);
    }
  });
/////////////////////////////////////////////////////////////////////
// // remder tours
// function renderTours(tours) {
//   const cardContainer = document.querySelector('.card-container');
//   cardContainer.innerHTML = ''; // Clear existing content

//   // Iterate through the fetched tours and create card elements
//   tours.forEach(tour => {
//     const card = document.createElement('div');
//     card.classList.add('card');
//     // Create and append card content based on your existing structure
//     card.innerHTML = `
//           // Your card content goes here
//       `;
//     cardContainer.appendChild(card);
//   });
//}
/////////////////////////////////////////////////////////////////////////////////
var page = parseInt(localStorage.getItem('currentPage')) || 1;
var page = page || 1;
if (load_btn || loadbtn) {
  console.log(load_btn, page);
  load_btn.addEventListener('click', async () => {
    const limit = 9;

    page += 1;
    console.log(page);
    try {
      // const response = await axios.get(
      //   `/api/v1/tours?page=${page}&limit=${limit}`
      // );
      localStorage.setItem('currentPage', page);

      window.location.href = `/api/v1/tours?page=${page}&limit=${limit}`;
      //console.log(response.data.tours); // This will be an array of tours matching the search query
      // renderTours(response.data.tours);
    } catch (err) {
      console.error('Error fetching tours:', err);
    }
  });
}
