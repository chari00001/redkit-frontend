"use client"

import React, { useState, useEffect } from 'react';
import styles from './HomeSlider.module.css';

const mockData = [
  {
    id: 1,
    title: 'Survivor Series: WarGames',
    subtitle: 'Card for Survivor Series: War Games - Tonight 8/7c',
    image: 'https://images.unsplash.com/photo-1544135761-3f0e01635a86?q=80&w=1200',
    community: 'r/SquaredCircle',
    additionalText: 'and more'
  },
  {
    id: 2,
    title: 'Marvel Rivals reveal',
    subtitle: 'The Final 5 characters have been revealed',
    image: 'https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?q=80&w=1200',
    community: 'r/marvelrivals',
    additionalText: 'and more'
  },
  {
    id: 3,
    title: 'S.T.A.L.K.E.R. 2 patch 1.0.2',
    subtitle: 'Patch 1.0.2',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1200',
    community: 'r/stalker',
    additionalText: 'and more'
  },
  {
    id: 4,
    title: 'Fantastic Four wraps filming',
    subtitle: "Marvel's The Fantastic Four: First Look",
    image: 'https://images.unsplash.com/photo-1635863138275-d9b33299680b?q=80&w=1200',
    community: 'r/marvelstudios',
    additionalText: 'and more'
  },
];

const HomeSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => 
        prevSlide === mockData.length - 1 ? 0 : prevSlide + 1
      );
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className={styles.sliderContainer}>
      <button 
        className={`${styles.navButton} ${styles.prevButton}`}
        onClick={() => setCurrentSlide(prev => prev === 0 ? mockData.length - 1 : prev - 1)}
      >
        ‹
      </button>

      <div className={styles.slider}>
        {mockData.map((slide, index) => (
          <div
            key={slide.id}
            className={styles.slide}
            style={{
              transform: `translateX(${100 * (index - currentSlide)}%)`,
              opacity: currentSlide === index ? 1 : 0.5
            }}
          >
            <img src={slide.image} alt={slide.title} />
            <div className={styles.content}>
              <h2>{slide.title}</h2>
              <p>{slide.subtitle}</p>
              <div className={styles.community}>
                {slide.community} <span>{slide.additionalText}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button 
        className={`${styles.navButton} ${styles.nextButton}`}
        onClick={() => setCurrentSlide(prev => prev === mockData.length - 1 ? 0 : prev + 1)}
      >
        ›
      </button>

      <div className={styles.dots}>
        {mockData.map((_, index) => (
          <button
            key={index}
            className={`${styles.dot} ${currentSlide === index ? styles.activeDot : ''}`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default HomeSlider;