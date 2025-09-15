// Utility pour les animations au scroll
export const initScrollAnimations = () => {
  // Configuration différente pour mobile et desktop
  const isMobile = window.innerWidth <= 768;
  
  const observerOptions = {
    threshold: isMobile ? 0.05 : 0.1,
    rootMargin: isMobile ? '0px 0px -20px 0px' : '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-visible');
        
        // Pour les animations en cascade dans les grilles
        const parent = entry.target.closest('.services-grid, .about-features, .gallery-grid');
        if (parent) {
          const children = parent.querySelectorAll('.animate-on-scroll');
          children.forEach((child, index) => {
            setTimeout(() => {
              child.classList.add('animate-visible');
            }, index * 100);
          });
        }
      }
    });
  }, observerOptions);

  // Observer tous les éléments avec animate-on-scroll
  const animatedElements = document.querySelectorAll('.animate-on-scroll');
  animatedElements.forEach(el => observer.observe(el));

  return observer;
};

// Smooth scroll pour les liens de navigation
export const smoothScrollTo = (elementId: string) => {
  const element = document.getElementById(elementId);
  if (element) {
    const headerHeight = 80; // Hauteur du header fixe
    const elementPosition = element.offsetTop - headerHeight;
    
    window.scrollTo({
      top: elementPosition,
      behavior: 'smooth'
    });
  }
};

// Animations spécifiques pour mobile
export const initMobileScrollEffects = () => {
  const isMobile = window.innerWidth <= 768;
  
  if (!isMobile) return null;

  // Effet de parallax léger pour mobile
  let ticking = false;
  
  const updateParallax = () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.parallax-mobile');
    
    parallaxElements.forEach((el) => {
      const element = el as HTMLElement;
      const speed = parseFloat(element.dataset.speed || '0.2'); // Vitesse réduite par défaut
      const elementRect = element.getBoundingClientRect();
      const elementTop = elementRect.top + scrolled;
      
      // Ne appliquer l'effet que si l'élément est visible à l'écran
      if (elementRect.top < window.innerHeight && elementRect.bottom > 0) {
        const relativePos = scrolled - elementTop;
        const yPos = relativePos * speed;
        element.style.transform = `translate3d(0, ${yPos}px, 0)`;
      }
    });
    
    ticking = false;
  };

  const requestTick = () => {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  };

  window.addEventListener('scroll', requestTick, { passive: true });
  
  return () => {
    window.removeEventListener('scroll', requestTick);
  };
};

// Animation progressive pour les éléments en grille sur mobile
export const animateGridItems = (gridSelector: string, delay: number = 100) => {
  const isMobile = window.innerWidth <= 768;
  
  if (!isMobile) return;
  
  const grid = document.querySelector(gridSelector);
  if (!grid) return;
  
  const items = grid.querySelectorAll('.animate-on-scroll');
  
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -20px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const index = Array.from(items).indexOf(entry.target);
        setTimeout(() => {
          entry.target.classList.add('animate-visible');
        }, index * delay);
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  items.forEach(item => observer.observe(item));
};

// Effet de rebond mobile pour les boutons
export const initMobileButtonEffects = () => {
  const isMobile = window.innerWidth <= 768;
  
  if (!isMobile) return;
  
  const buttons = document.querySelectorAll('.btn, .service-card, .gallery-item');
  
  buttons.forEach(button => {
    button.addEventListener('touchstart', () => {
      button.classList.add('mobile-pressed');
    });
    
    button.addEventListener('touchend', () => {
      setTimeout(() => {
        button.classList.remove('mobile-pressed');
      }, 150);
    });
  });
};