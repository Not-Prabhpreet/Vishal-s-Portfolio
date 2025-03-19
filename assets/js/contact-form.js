// contact-form.js - Handles contact form submission and validation

document.addEventListener('DOMContentLoaded', function() {
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');
  const formError = document.getElementById('formError');
  
  // Backend API URL - Change this to your actual backend URL when deployed
  const API_URL = 'http://localhost:3000/api/contact';
  
  if (contactForm) {
      contactForm.addEventListener('submit', async function(e) {
          e.preventDefault();
          
          // Get form data
          const name = document.getElementById('name').value.trim();
          const email = document.getElementById('email').value.trim();
          const subject = document.getElementById('subject').value.trim();
          const message = document.getElementById('message').value.trim();
          
          // Validate form data (client-side validation)
          if (!name || !email || !subject || !message) {
              showError('Please fill in all required fields.');
              return;
          }
          
          if (!isValidEmail(email)) {
              showError('Please enter a valid email address.');
              return;
          }
          
          // Prepare form data for submission
          const formData = {
              name,
              email,
              subject,
              message
          };
          
          // Update UI to show that form is being submitted
          const submitButton = contactForm.querySelector('button[type="submit"]');
          submitButton.disabled = true;
          submitButton.textContent = 'Sending...';
          
          try {
              // Send data to backend
              const response = await fetch(API_URL, {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json'
                  },
                  body: JSON.stringify(formData)
              });
              
              const data = await response.json();
              
              if (response.ok) {
                  // Show success message
                  formSuccess.innerHTML = `<p>${data.message || 'Thank you for your message! I will get back to you as soon as possible.'}</p>`;
                  formSuccess.style.display = 'block';
                  formError.style.display = 'none';
                  
                  // Reset form
                  contactForm.reset();
              } else {
                  // Show error message from server
                  showError(data.message || 'There was an error sending your message. Please try again or contact me directly via email.');
              }
          } catch (error) {
              // Show generic error message for network/connection issues
              showError('Unable to connect to the server. Please check your internet connection or try again later.');
              console.error('Form submission error:', error);
          } finally {
              // Reset button state
              submitButton.disabled = false;
              submitButton.textContent = 'Send Message';
          }
      });
  }
  
  function showError(message) {
      formError.innerHTML = `<p>${message}</p>`;
      formError.style.display = 'block';
      formSuccess.style.display = 'none';
      
      // Scroll to error message
      formError.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
  
  function isValidEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
  }
});