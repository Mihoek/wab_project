document.addEventListener('DOMContentLoaded', function() {
  // DOM Elements
  const loginBtn = document.getElementById('loginBtn');
  const registerBtn = document.getElementById('registerBtn');
  const authModal = document.getElementById('authModal');
  const loginForm = document.getElementById('loginForm');
  const registrationForm = document.getElementById('registrationForm');
  const closeBtns = document.querySelectorAll('.close-btn');
  const tabBtns = document.querySelectorAll('.tab-btn');
  const bookingForms = document.querySelectorAll('.booking-form');
  const tripTypeInputs = document.querySelectorAll('input[name="tripType"]');
  const returnDateGroup = document.getElementById('returnDateGroup');
  const paymentModal = document.getElementById('paymentModal');

  // Modal Handlers
  function openModal(modal, formToShow) {
      modal.classList.remove('hidden');
      modal.classList.add('active');
      
      // Hide both forms first
      loginForm.classList.add('hidden');
      registrationForm.classList.add('hidden');

      // Only show the selected form
      formToShow.classList.remove('hidden');
  }

  function closeModal(modal) {
      modal.classList.add('hidden');
      modal.classList.remove('active');
  }

  // Event Listeners for Login and Register
  loginBtn.addEventListener('click', () => openModal(authModal, loginForm));
  registerBtn.addEventListener('click', () => openModal(authModal, registrationForm));

  closeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
          closeModal(authModal);
          closeModal(paymentModal);
      });
  });

  // Tab Navigation - Show the corresponding booking form when a tab is clicked
  tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
          const tabId = btn.dataset.tab;
          
          // Update active tab button
          tabBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          
          // Show corresponding form
          bookingForms.forEach(form => {
              form.classList.remove('active');
              if (form.id === `${tabId}Booking`) {
                  form.classList.add('active');
              }
          });
      });
  });

  // Trip Type Handler (for return date visibility)
  tripTypeInputs.forEach(input => {
      input.addEventListener('change', (e) => {
          if (e.target.value === 'oneway') {
              returnDateGroup.style.display = 'none';
          } else {
              returnDateGroup.style.display = 'block';
          }
      });
  });

  // Form Submissions
  const forms = document.querySelectorAll('form');
  forms.forEach(form => {
      form.addEventListener('submit', (e) => {
          e.preventDefault();
          
          // If it's a booking form, show payment modal
          if (['flightForm', 'hotelForm', 'packageForm'].includes(form.id)) {
              openModal(paymentModal);
          } else if (form.id === 'paymentForm') {
              // Handle payment submission
              alert('Payment processed successfully!');
              closeModal(paymentModal);
          } else {
              // Handle login/registration
              alert('Form submitted successfully!');
              closeModal(authModal);
          }
      });
  });

  // Date Input Validation (ensure only future dates are valid)
  const dateInputs = document.querySelectorAll('input[type="date"]');
  dateInputs.forEach(input => {
      input.addEventListener('input', (e) => {
          const selectedDate = new Date(e.target.value);
          const today = new Date();
          
          if (selectedDate < today) {
              alert('Please select a future date');
              e.target.value = '';
          }
      });
  });

  // Payment Form Validation - formatting card details
  const cardNumber = document.getElementById('cardNumber');
  const cardExpiry = document.getElementById('cardExpiry');
  const cardCvv = document.getElementById('cardCvv');

  if (cardNumber) {
      cardNumber.addEventListener('input', (e) => {
          let value = e.target.value.replace(/\D/g, '');
          value = value.replace(/(\d{4})/g, '$1 ').trim();
          e.target.value = value;
      });
  }

  if (cardExpiry) {
      cardExpiry.addEventListener('input', (e) => {
          let value = e.target.value.replace(/\D/g, '');
          if (value.length >= 2) {
              value = value.slice(0, 2) + '/' + value.slice(2, 4);
          }
          e.target.value = value;
      });
  }

  if (cardCvv) {
      cardCvv.addEventListener('input', (e) => {
          e.target.value = e.target.value.replace(/\D/g, '').slice(0, 3);
      });
  }

  // Close modals when clicking outside
  window.addEventListener('click', (e) => {
      if (e.target === authModal) {
          closeModal(authModal);
      }
      if (e.target === paymentModal) {
          closeModal(paymentModal);
      }
  });
});
