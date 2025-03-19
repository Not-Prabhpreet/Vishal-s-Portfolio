// main.js - Main JavaScript for Vishal Yadav's academic website

document.addEventListener('DOMContentLoaded', () => {
  // Mobile menu toggle
  const menuBtn = document.querySelector('.menu-btn');
  const navList = document.querySelector('nav ul');
  
  if (menuBtn) {
      menuBtn.addEventListener('click', () => {
          navList.classList.toggle('show');
      });
  }
  
  // Close mobile menu when clicking outside
  document.addEventListener('click', (e) => {
      if (navList && navList.classList.contains('show') && !e.target.closest('nav')) {
          navList.classList.remove('show');
      }
  });
  
  // Active nav link highlighting
  const currentLocation = window.location.pathname;
  const navLinks = document.querySelectorAll('nav a');
  
  navLinks.forEach(link => {
      const linkPath = link.getAttribute('href');
      
      // Check if current page matches the nav link
      if (currentLocation === linkPath || 
          (linkPath === '/index.html' && (currentLocation === '/' || currentLocation === '/index.html'))) {
          link.classList.add('active');
      }
  });
});