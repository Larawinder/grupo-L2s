// Loading Screen
window.addEventListener('load', function () {
  setTimeout(function () {
    const loading = document.getElementById('loadingScreen');
    if (loading) loading.classList.add('hidden');
  }, 500);
});

// Initialize Lucide icons
if (typeof lucide !== 'undefined') {
  lucide.createIcons();
}

// Scroll Animations
function handleScrollAnimations() {
  const elements = document.querySelectorAll('.animate-on-scroll');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, index * 100);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
    }
  );

  elements.forEach((el) => observer.observe(el));
}

handleScrollAnimations();

// FAQ Accordion
document.querySelectorAll('.faq-question').forEach((button) => {
  button.addEventListener('click', () => {
    const faqItem = button.parentElement;
    const isActive = faqItem.classList.contains('active');

    document.querySelectorAll('.faq-item').forEach((item) => {
      item.classList.remove('active');
    });

    if (!isActive) {
      faqItem.classList.add('active');
    }
  });
});

// Countdown Timer com localStorage para persistir a data
function updateCountdown() {
  let endDate;
  const storedEndDate = localStorage.getItem('promoEndDate');

  if (storedEndDate) {
    endDate = new Date(storedEndDate);
    // Se a data já passou, cria uma nova
    if (endDate <= new Date()) {
      endDate = new Date();
      endDate.setDate(endDate.getDate() + 3);
      endDate.setHours(23, 59, 59, 0);
      localStorage.setItem('promoEndDate', endDate.toISOString());
    }
  } else {
    endDate = new Date();
    endDate.setDate(endDate.getDate() + 3);
    endDate.setHours(23, 59, 59, 0);
    localStorage.setItem('promoEndDate', endDate.toISOString());
  }

  function update() {
    const now = new Date();
    const diff = endDate - now;

    if (diff <= 0) {
      document.getElementById('days').textContent = '00';
      document.getElementById('hours').textContent = '00';
      document.getElementById('minutes').textContent = '00';
      document.getElementById('seconds').textContent = '00';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById('days').textContent = String(days).padStart(2, '0');
    document.getElementById('hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
  }

  update();
  setInterval(update, 1000);
}

updateCountdown();

// Rastreamento de Conversões
function trackConversion(buttonId) {
  // Google Analytics 4
  if (typeof gtag !== 'undefined') {
    gtag('event', 'conversion', {
      event_category: 'CTA',
      event_label: buttonId,
      value: 1,
    });

    gtag('event', 'generate_lead', {
      event_category: 'engagement',
      event_label: buttonId,
    });
  }

  // Meta Pixel (Facebook)
  if (typeof fbq !== 'undefined') {
    fbq('track', 'Lead', {
      content_name: 'Promoção 20% OFF',
      content_category: 'Segurança Eletrônica',
      button_id: buttonId,
    });
  }

  console.log('Conversão rastreada:', buttonId);
}

// Rastrear scroll depth
let scrollDepthTracked = { 25: false, 50: false, 75: false, 100: false };

window.addEventListener('scroll', function () {
  const scrollPercent = Math.round(
    (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
  );

  [25, 50, 75, 100].forEach((depth) => {
    if (scrollPercent >= depth && !scrollDepthTracked[depth]) {
      scrollDepthTracked[depth] = true;

      if (typeof gtag !== 'undefined') {
        gtag('event', 'scroll_depth', {
          event_category: 'engagement',
          event_label: depth + '%',
          value: depth,
        });
      }
    }
  });
});

// Rastrear tempo na página
let timeOnPage = 0;
setInterval(function () {
  timeOnPage += 30;

  if (timeOnPage === 30 || timeOnPage === 60 || timeOnPage === 180) {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'time_on_page', {
        event_category: 'engagement',
        event_label: timeOnPage + ' segundos',
        value: timeOnPage,
      });
    }
  }
}, 30000);

// Detectar intenção de saída (exit intent)
let exitIntentShown = false;
document.addEventListener('mouseout', function (e) {
  if (e.clientY < 10 && !exitIntentShown) {
    exitIntentShown = true;

    if (typeof gtag !== 'undefined') {
      gtag('event', 'exit_intent', {
        event_category: 'engagement',
        event_label: 'Tentativa de saída',
      });
    }

    // Você pode adicionar um popup de retenção aqui
    console.log('Exit intent detectado');
  }
});
