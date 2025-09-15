import React, { useState, useEffect } from 'react';
import './Hero.css';

const Hero: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [previousSlide, setPreviousSlide] = useState(0);
  const [isManualTransition, setIsManualTransition] = useState(false);
  const [transitionDirection, setTransitionDirection] = useState('next'); // 'next' ou 'prev'
  
  const slides = [
    {
      image: '/assets/images/img1.JPG',
      title: ['Chauffage & Climatisation', 'de Qualité Professionnelle'],
      subtitle: 'SARL Jérémie Arrivé - Votre expert en solutions thermiques et sanitaires',
      buttons: [
        { text: 'Demander un devis', href: '#contact', primary: true },
        { text: 'Nos services', href: '#services', primary: false }
      ]
    },
    {
      image: '/assets/images/img2.JPG',
      title: ['Plomberie & Sanitaire', 'Installation & Réparation'],
      subtitle: 'Des interventions rapides et efficaces pour tous vos besoins',
      buttons: [
        { text: 'Demander un devis', href: '#contact', primary: true },
        { text: 'En savoir plus', href: '#about', primary: false }
      ]
    },
    {
      image: '/assets/images/img3.JPG',
      title: ['Expertise & Savoir-faire', 'depuis 2012'],
      subtitle: 'Une équipe qualifiée pour tous vos projets de rénovation',
      buttons: [
        { text: 'Voir nos réalisations', href: '#gallery', primary: true },
        { text: 'Nous contacter', href: '#contact', primary: false }
      ]
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setIsManualTransition(false);
      setTransitionDirection('next');
      setPreviousSlide(currentSlide);
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 8000); // 8 secondes - rythme dynamique et agréable

    return () => {
      clearInterval(interval);
    };
  }, [currentSlide, slides.length]);

  const goToSlide = (index: number) => {
    setIsManualTransition(true);
    setTransitionDirection(index > currentSlide ? 'next' : 'prev');
    setPreviousSlide(currentSlide);
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setIsManualTransition(true);
    setTransitionDirection('next');
    setPreviousSlide(currentSlide);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setIsManualTransition(true);
    setTransitionDirection('prev');
    setPreviousSlide(currentSlide);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId.replace('#', ''));
    if (element) {
      const headerHeight = 60; // Hauteur du header fixe (réduite)
      const elementPosition = element.offsetTop - headerHeight;
      
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section id="home" className="hero">
      <div className={`hero-slider ${isManualTransition ? 'manual-transition' : 'auto-transition'} ${transitionDirection}`}>
        {slides.map((slide, index) => {
          let slideClass = 'slide';
          if (index === currentSlide) {
            slideClass += ' active';
          } else if (index === previousSlide) {
            slideClass += ' prev';
          }
          
          return (
            <div
              key={index}
              className={slideClass}
              style={{ backgroundImage: `url(${slide.image})` }}
            >
            <div className="slide-content">
              <div className="container">
                <div className="hero-logo animate-on-scroll parallax-mobile" data-speed="0.1">
                  <img src="/assets/images/Logo.PNG" alt="Ets ROUSEZ - SARL Jérémie Arrivé" />
                </div>
                <h1 className="hero-title animate-on-scroll">
                  {slide.title.map((line, lineIndex) => (
                    <span key={lineIndex} className="title-line">{line}</span>
                  ))}
                </h1>
                <p className="hero-subtitle animate-on-scroll">
                  {slide.subtitle}
                </p>
                <div className="hero-buttons animate-on-scroll">
                  {slide.buttons.map((button, buttonIndex) => (
                    <button
                      key={buttonIndex}
                      className={`btn ${button.primary ? 'btn-primary' : 'btn-outline'}`}
                      onClick={() => scrollToSection(button.href)}
                    >
                      {button.text}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          );
        })}
      </div>
      
      {/* Navigation Arrows (Hidden on mobile) */}
      <div className="slider-nav">
        <button className="slider-btn prev" onClick={prevSlide}>
          <i className="fas fa-chevron-left"></i>
        </button>
        <button className="slider-btn next" onClick={nextSlide}>
          <i className="fas fa-chevron-right"></i>
        </button>
      </div>
      
      {/* Slider Indicators (Hidden on mobile) */}
      <div className="slider-indicators">
        {slides.map((_, index) => (
          <span
            key={index}
            className={`indicator ${index === currentSlide ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>
      
      {/* Scroll Indicator */}
      <div className="scroll-indicator">
        <span>Faire défiler</span>
        <i className="fas fa-chevron-down"></i>
      </div>
    </section>
  );
};

export default Hero;
