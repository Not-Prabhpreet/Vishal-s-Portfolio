document.addEventListener('DOMContentLoaded', () => {
    const menuBtn = document.querySelector('.menu-btn');
    const navList = document.querySelector('nav ul');
    
    // Ensure menuBtn and navList exist before adding event listeners
    if (menuBtn && navList) {
      // Add click event listener to menu button
      menuBtn.addEventListener('click', (e) => {
        // Prevent event from propagating
        e.stopPropagation();
        
        // Toggle show class on nav list
        navList.classList.toggle('show');
        
        // Toggle aria-expanded for accessibility
        const isExpanded = navList.classList.contains('show');
        menuBtn.setAttribute('aria-expanded', isExpanded);
      });
  
      // Close mobile menu when clicking outside
      document.addEventListener('click', (e) => {
        // Check if menu is open and click is outside nav
        if (navList.classList.contains('show') && !e.target.closest('nav')) {
          navList.classList.remove('show');
          menuBtn.setAttribute('aria-expanded', 'false');
        }
      });
  
      // Prevent menu from closing when clicking inside nav
      navList.addEventListener('click', (e) => {
        e.stopPropagation();
      });
    }
    
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