/**
 * Ultra Premium Cinematic Wedding Invitation Script
 * Built with Vanilla JS & Canvas Physics
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- 1. Global Setup & State ---
  const CONFIG = {
    // Event Date: 2026-07-23T15:00:00 (Kazakhstan time / UTC standard)
    eventDate: new Date('2026-07-23T15:00:00').getTime(),
    whatsappPhoneKey: 'quda_whatsapp_phone',
    defaultPhone: '77011234567' // Admin/Host phone number
  };

  // State
  let isAudioPlaying = false;
  let savedPhone = localStorage.getItem(CONFIG.whatsappPhoneKey) || CONFIG.defaultPhone;

  // Cache DOM Elements
  const loadingScreen = document.getElementById('loading-screen');
  const navbar = document.getElementById('navbar');
  const musicBtn = document.getElementById('music-btn');
  const bgAudio = document.getElementById('bg-audio');
  const audioWaveVisual = document.getElementById('audio-wave-visual');
  const phoneInput = document.getElementById('whatsapp-phone');
  const savePhoneBtn = document.getElementById('save-phone-btn');
  const rsvpBtnYes = document.getElementById('rsvp-btn-yes');
  const rsvpBtnNo = document.getElementById('rsvp-btn-no');
  const revealElements = document.querySelectorAll('.reveal');
  
  // Lightbox
  const lightbox = document.getElementById('gallery-lightbox');
  const lightboxImg = document.getElementById('lightbox-target-img');
  const lightboxClose = document.getElementById('lightbox-close-btn');
  const galleryCards = document.querySelectorAll('.gallery-card');

  // Set Phone Input default value
  if (phoneInput) {
    phoneInput.value = savedPhone;
  }

  // --- 2. Loading Screen Logic ---
  // Ensure the intro loading animation lasts at least 2.5 seconds for cinematic effect,
  // then fade out smoothly.
  window.addEventListener('load', () => {
    setTimeout(() => {
      if (loadingScreen) {
        loadingScreen.classList.add('fade-out');
      }
      // Proactively trigger the first reveal check
      handleScrollReveal();
    }, 2500);
  });

  // Fallback in case window load doesn't trigger swiftly
  setTimeout(() => {
    if (loadingScreen && !loadingScreen.classList.contains('fade-out')) {
      loadingScreen.classList.add('fade-out');
      handleScrollReveal();
    }
  }, 4500);

  // --- 3. Interactive Luxury 3D Canvas Background ---
  const canvas = document.getElementById('particles-bg');
  const ctx = canvas.getContext('2d');

  let particles = [];
  const particleCount = window.innerWidth < 768 ? 40 : 90;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  class GoldParticle {
    constructor() {
      this.reset();
      this.y = Math.random() * canvas.height; // Spread initially
    }

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = -10;
      this.size = Math.random() * 2.8 + 0.6;
      this.speedY = Math.random() * 0.8 + 0.3;
      this.speedX = Math.random() * 0.4 - 0.2;
      this.density = Math.random() * 20 + 10;
      this.opacity = Math.random() * 0.5 + 0.2;
      this.rotation = Math.random() * 360;
      this.rotationSpeed = Math.random() * 2 - 1;
    }

    update(time) {
      this.y += this.speedY;
      // Gentle horizontal swaying using sine waves
      this.x += this.speedX + Math.sin(time / this.density) * 0.25;
      this.rotation += this.rotationSpeed;

      // Reset particle if it drifts off screen bottom or sides
      if (this.y > canvas.height + 10 || this.x < -10 || this.x > canvas.width + 10) {
        this.reset();
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate((this.rotation * Math.PI) / 180);
      
      // Creating a beautiful luxury gold Radial Gradient for each particle
      const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.size);
      gradient.addColorStop(0, 'rgba(243, 229, 171, ' + this.opacity + ')'); // Soft champagne gold
      gradient.addColorStop(0.5, 'rgba(197, 160, 89, ' + this.opacity * 0.8 + ')'); // Mid gold
      gradient.addColorStop(1, 'rgba(153, 101, 21, 0)'); // Fades to transparency
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(0, 0, this.size * 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  // Populate particles
  for (let i = 0; i < particleCount; i++) {
    particles.push(new GoldParticle());
  }

  let lastTime = 0;
  function animateParticles(timestamp) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw gentle glowing light rays/vibe
    const time = timestamp || 0;
    
    particles.forEach(p => {
      p.update(time);
      p.draw();
    });

    requestAnimationFrame(animateParticles);
  }
  requestAnimationFrame(animateParticles);


  // --- 4. Premium Cinema Audio Toggle Handling ---
  function toggleMusic() {
    if (!bgAudio) return;

    if (isAudioPlaying) {
      bgAudio.pause();
      isAudioPlaying = false;
      if (musicBtn) {
        musicBtn.classList.remove('active');
        // Render mute state icon
        musicBtn.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M11 5L6 9H2v6h4l5 4V5z"></path>
            <path d="M23 9l-6 6M17 9l6 6" class="mute-lines"></path>
          </svg>`;
      }
      if (audioWaveVisual) {
        audioWaveVisual.classList.remove('playing');
      }
    } else {
      bgAudio.play()
        .then(() => {
          isAudioPlaying = true;
          if (musicBtn) {
            musicBtn.classList.add('active');
            // Render playing state icon
            musicBtn.innerHTML = `
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M11 5L6 9H2v6h4l5 4V5z"></path>
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
              </svg>`;
          }
          if (audioWaveVisual) {
            audioWaveVisual.classList.add('playing');
          }
        })
        .catch(err => {
          console.log('Autoplay request deferred until user gesture.', err);
          // Gently let the user know they can click sound icon
        });
    }
  }

  if (musicBtn) {
    musicBtn.addEventListener('click', toggleMusic);
  }

  // Attempt to play on first user interaction with body anywhere to satisfy browser guidelines
  document.body.addEventListener('click', () => {
    if (!isAudioPlaying && bgAudio) {
      // Auto trigger gentle audio start on first click if silent
      toggleMusic();
    }
  }, { once: true });


  // --- 5. Countdown Clock Algorithm ---
  function updateCountdown() {
    const now = new Date().getTime();
    const distance = CONFIG.eventDate - now;

    if (distance < 0) {
      // Event passed/is happening
      document.getElementById('days').innerText = '00';
      document.getElementById('hours').innerText = '00';
      document.getElementById('minutes').innerText = '00';
      document.getElementById('seconds').innerText = '00';
      return;
    }

    // Time calculations
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Render with leading zero format
    document.getElementById('days').innerText = days < 10 ? '0' + days : days;
    document.getElementById('hours').innerText = hours < 10 ? '0' + hours : hours;
    document.getElementById('minutes').innerText = minutes < 10 ? '0' + minutes : minutes;
    document.getElementById('seconds').innerText = seconds < 10 ? '0' + seconds : seconds;
  }

  // Run instantly and repeat every second
  updateCountdown();
  setInterval(updateCountdown, 1000);


  // --- 6. Phone Configurator & RSVP Redirection ---
  if (savePhoneBtn && phoneInput) {
    savePhoneBtn.addEventListener('click', () => {
      const cleanPhone = phoneInput.value.replace(/[^0-9]/g, '');
      if (cleanPhone.length >= 10) {
        savedPhone = cleanPhone;
        localStorage.setItem(CONFIG.whatsappPhoneKey, cleanPhone);
        
        // Show interactive click microfeedback
        savePhoneBtn.innerText = 'Сақталды! ✓';
        savePhoneBtn.style.background = '#8c601c';
        setTimeout(() => {
          savePhoneBtn.innerText = 'Сақтау';
          savePhoneBtn.style.background = '';
        }, 1500);
      } else {
        alert('Пожалуйста, введите корректный номер (минимум 10 цифр)!');
      }
    });
  }

  // Action RSVP Yes
  if (rsvpBtnYes) {
    rsvpBtnYes.addEventListener('click', (e) => {
      createRippleFeedback(e, rsvpBtnYes);
      
      const message = `Сәлеметсіздер ме!\nҚұдалық тойға қуана барамын ❤️`;
      const encodedMsg = encodeURIComponent(message);
      const url = `https://wa.me/${savedPhone}?text=${encodedMsg}`;
      
      setTimeout(() => {
        window.open(url, '_blank');
      }, 350);
    });
  }

  // Action RSVP No
  if (rsvpBtnNo) {
    rsvpBtnNo.addEventListener('click', (e) => {
      createRippleFeedback(e, rsvpBtnNo);
      
      const message = `Сәлеметсіздер ме!\nӨкінішке орай келе алмаймын.`;
      const encodedMsg = encodeURIComponent(message);
      const url = `https://wa.me/${savedPhone}?text=${encodedMsg}`;
      
      setTimeout(() => {
        window.open(url, '_blank');
      }, 350);
    });
  }

  // Micro interaction - button ripple wave creation
  function createRippleFeedback(event, element) {
    const rect = element.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const span = document.createElement('span');
    span.style.position = 'absolute';
    span.style.width = '100px';
    span.style.height = '100px';
    span.style.background = 'rgba(255, 255, 255, 0.4)';
    span.style.borderRadius = '50%';
    span.style.left = `${x - 50}px`;
    span.style.top = `${y - 50}px`;
    span.style.transform = 'scale(0)';
    span.style.transition = 'transform 0.4s ease, opacity 0.4s ease';
    span.style.pointerEvents = 'none';
    span.style.opacity = '1';

    element.style.overflow = 'hidden';
    element.appendChild(span);

    // Trigger reflow
    span.offsetWidth;
    span.style.transform = 'scale(4.5)';
    span.style.opacity = '0';

    setTimeout(() => {
      span.remove();
    }, 450);
  }


  // --- 7. Modern Sticky Elements & Scroll Reveal Transitions ---
  function handleScrollReveal() {
    const triggerBottom = window.innerHeight * 0.88;

    revealElements.forEach(elem => {
      const elemTop = elem.getBoundingClientRect().top;
      if (elemTop < triggerBottom) {
        elem.classList.add('active');
      }
    });

    // Sticky blurred Navbar styling on scroll
    if (window.scrollY > 50) {
      if (navbar && !navbar.classList.contains('scrolled')) {
        navbar.classList.add('scrolled');
      }
    } else {
      if (navbar && navbar.classList.contains('scrolled')) {
        navbar.classList.remove('scrolled');
      }
    }
  }

  window.addEventListener('scroll', handleScrollReveal);
  // Initial check
  handleScrollReveal();


  // --- 8. Lightbox Gallery Modal Overlay ---
  galleryCards.forEach(card => {
    card.addEventListener('click', () => {
      const largeImgUrl = card.getAttribute('data-img');
      if (lightbox && lightboxImg && largeImgUrl) {
        lightboxImg.src = largeImgUrl;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // stop scroll on body
      }
    });
  });

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });
  }

  // ESC key to close lightbox
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });

  function closeLightbox() {
    if (lightbox) {
      lightbox.classList.remove('active');
      document.body.style.overflow = ''; // restore scrolling
    }
  }
});
