// dark-mode.js - Handles dark mode toggle functionality

// Apply dark mode immediately before page load if needed
(function() {
  // Check for saved user preference
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark-mode');
      document.body.classList.add('dark-mode');
  }
})();

document.addEventListener('DOMContentLoaded', () => {
  const darkModeToggle = document.getElementById('darkModeToggle');
  const body = document.body;
  const html = document.documentElement;
  
  // Update button appearance based on current mode
  if (body.classList.contains('dark-mode')) {
      updateButtonStyle(true);
  }
  
  // Toggle dark mode on click
  if (darkModeToggle) {
      darkModeToggle.addEventListener('click', () => {
          body.classList.toggle('dark-mode');
          html.classList.toggle('dark-mode'); // Add/remove from html element too
          
          const isDarkMode = body.classList.contains('dark-mode');
          
          // Save user preference
          localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
          
          // Update button style
          updateButtonStyle(isDarkMode);
      });
  }
  
  function updateButtonStyle(isDarkMode) {
      if (!darkModeToggle) return;
      
      const iconElement = darkModeToggle.querySelector('i');
      
      if (isDarkMode) {
          darkModeToggle.style.backgroundColor = '#333';
          darkModeToggle.style.color = '#FFF';
          darkModeToggle.style.borderColor = '#444';
          iconElement.className = 'fas fa-sun';
      } else {
          darkModeToggle.style.backgroundColor = 'transparent';
          darkModeToggle.style.color = '#800020';
          darkModeToggle.style.borderColor = '#800020';
          iconElement.className = 'fas fa-moon';
      }
  }
});