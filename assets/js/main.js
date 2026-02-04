/* ============================================
   GRUPO L2S - JavaScript Principal
   Animações, Interações e Funcionalidades
============================================ */

document.addEventListener('DOMContentLoaded', function() {
  
  // ============ HEADER SCROLL ============
  const header = document.querySelector('.header');
  let lastScroll = 0;
  
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Add/remove scrolled class
    if (currentScroll > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
  });
  
  // ============ MOBILE MENU ============
  const menuToggle = document.querySelector('.menu-toggle');
  const navMobile = document.querySelector('.nav-mobile');
  const navOverlay = document.querySelector('.nav-overlay');
  const navLinks = document.querySelectorAll('.nav-mobile a');
  
  function toggleMenu() {
    menuToggle.classList.toggle('active');
    navMobile.classList.toggle('active');
    navOverlay.classList.toggle('active');
    document.body.style.overflow = navMobile.classList.contains('active') ? 'hidden' : '';
  }
  
  if (menuToggle) {
    menuToggle.addEventListener('click', toggleMenu);
  }
  
  if (navOverlay) {
    navOverlay.addEventListener('click', toggleMenu);
  }
  
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navMobile.classList.contains('active')) {
        toggleMenu();
      }
    });
  });
  
  // ============ SCROLL REVEAL ANIMATION ============
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  
  const revealOnScroll = () => {
    const windowHeight = window.innerHeight;
    
    revealElements.forEach(element => {
      const elementTop = element.getBoundingClientRect().top;
      const revealPoint = 100;
      
      if (elementTop < windowHeight - revealPoint) {
        element.classList.add('active');
      }
    });
  };
  
  // Initial check
  revealOnScroll();
  
  // On scroll
  window.addEventListener('scroll', revealOnScroll);
  
  // ============ SMOOTH SCROLL ============
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      
      if (target) {
        const headerHeight = header.offsetHeight;
        const targetPosition = target.offsetTop - headerHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
  
  // ============ TYPING EFFECT ============
  function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
      if (i < text.length) {
        element.innerHTML += text.charAt(i);
        i++;
        setTimeout(type, speed);
      }
    }
    
    type();
  }
  
  // Apply typing effect to hero subtitle if exists
  const heroSubtitle = document.querySelector('.hero-subtitle[data-typing]');
  if (heroSubtitle) {
    const text = heroSubtitle.getAttribute('data-typing');
    setTimeout(() => {
      typeWriter(heroSubtitle, text, 40);
    }, 1000);
  }
  
  // ============ COUNTER ANIMATION ============
  function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    function updateCounter() {
      start += increment;
      if (start < target) {
        element.textContent = Math.floor(start);
        requestAnimationFrame(updateCounter);
      } else {
        element.textContent = target;
      }
    }
    
    updateCounter();
  }
  
  // Observe counters
  const counters = document.querySelectorAll('[data-counter]');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = parseInt(entry.target.getAttribute('data-counter'));
        animateCounter(entry.target, target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  
  counters.forEach(counter => counterObserver.observe(counter));
  
  // ============ SERVICE CARDS HOVER EFFECT ============
  const serviceCards = document.querySelectorAll('.service-card');
  
  serviceCards.forEach(card => {
    card.addEventListener('mouseenter', function(e) {
      this.style.transform = 'translateY(-10px)';
    });
    
    card.addEventListener('mouseleave', function(e) {
      this.style.transform = 'translateY(0)';
    });
  });
  
  // ============ PARALLAX EFFECT ============
  const parallaxElements = document.querySelectorAll('[data-parallax]');
  
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    
    parallaxElements.forEach(element => {
      const speed = element.getAttribute('data-parallax') || 0.5;
      element.style.transform = `translateY(${scrolled * speed}px)`;
    });
  });
  
  // ============ ACTIVE NAV LINK ============
  const sections = document.querySelectorAll('section[id]');
  const navDesktopLinks = document.querySelectorAll('.nav-desktop a[href^="#"]');
  
  function setActiveNavLink() {
    const scrollPosition = window.scrollY + 100;
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        navDesktopLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }
  
  window.addEventListener('scroll', setActiveNavLink);
  
  // ============ FORM VALIDATION ============
  const forms = document.querySelectorAll('form');
  
  forms.forEach(form => {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Basic validation
      let isValid = true;
      const inputs = form.querySelectorAll('input[required], textarea[required]');
      
      inputs.forEach(input => {
        if (!input.value.trim()) {
          isValid = false;
          input.classList.add('error');
        } else {
          input.classList.remove('error');
        }
      });
      
      if (isValid) {
        // Here you would typically send the form data
        showNotification('Mensagem enviada com sucesso!', 'success');
        form.reset();
      } else {
        showNotification('Por favor, preencha todos os campos obrigatórios.', 'error');
      }
    });
  });
  
  // ============ NOTIFICATION SYSTEM ============
  function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <span>${message}</span>
      <button onclick="this.parentElement.remove()">×</button>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => notification.classList.add('show'), 10);
    
    // Auto remove
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, 5000);
  }
  
  // Make notification function global
  window.showNotification = showNotification;
  
  // ============ LAZY LOADING IMAGES ============
  const lazyImages = document.querySelectorAll('img[data-src]');
  
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.getAttribute('data-src');
        img.removeAttribute('data-src');
        imageObserver.unobserve(img);
      }
    });
  });
  
  lazyImages.forEach(img => imageObserver.observe(img));
  
  // ============ BRAND CAROUSEL (for Quem Somos page) ============
  const carousel = document.querySelector('.brands-carousel');
  
  if (carousel) {
    const track = carousel.querySelector('.carousel-track');
    const slides = carousel.querySelectorAll('.carousel-slide');
    
    if (track && slides.length > 0) {
      // Clone slides for infinite effect
      slides.forEach(slide => {
        const clone = slide.cloneNode(true);
        track.appendChild(clone);
      });
      
      // Auto scroll
      let scrollAmount = 0;
      const scrollSpeed = 1;
      
      function autoScroll() {
        scrollAmount += scrollSpeed;
        
        if (scrollAmount >= track.scrollWidth / 2) {
          scrollAmount = 0;
        }
        
        track.style.transform = `translateX(-${scrollAmount}px)`;
        requestAnimationFrame(autoScroll);
      }
      
      autoScroll();
      
      // Pause on hover
      carousel.addEventListener('mouseenter', () => {
        track.style.animationPlayState = 'paused';
      });
      
      carousel.addEventListener('mouseleave', () => {
        track.style.animationPlayState = 'running';
      });
    }
  }
  
  // ============ CURRENT YEAR ============
  const yearElements = document.querySelectorAll('.current-year');
  const currentYear = new Date().getFullYear();
  
  yearElements.forEach(el => {
    el.textContent = currentYear;
  });
  
  // ============ WHATSAPP MESSAGE ============
  const whatsappLinks = document.querySelectorAll('a[href*="wa.me"]');
  
  whatsappLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      // Track click (for analytics)
      console.log('WhatsApp click tracked');
    });
  });
  
  // ============ PRELOADER ============
  const preloader = document.querySelector('.preloader');
  
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.classList.add('fade-out');
      setTimeout(() => preloader.remove(), 500);
    });
  }
  
  // ============ BACK TO TOP ============
  const backToTop = document.querySelector('.back-to-top');
  
  if (backToTop) {
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 500) {
        backToTop.classList.add('show');
      } else {
        backToTop.classList.remove('show');
      }
    });
    
    backToTop.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
  
  console.log('Grupo L2S - Site carregado com sucesso! 🛡️');
});