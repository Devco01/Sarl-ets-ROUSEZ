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
