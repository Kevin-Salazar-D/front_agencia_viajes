import React, { useState, useEffect } from 'react';
import '@/styles/SliderImages.css';

import icons from "@/constants/icons";
const SliderImages = ({ gallery = [] }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);


  useEffect(() => {
    setSelectedIndex(0);
  }, [gallery]);

  if (!gallery || gallery.length === 0) {
    return (
      <section className="gallery-section">
        <div className="main-image-container">
          <img 
            src="https://via.placeholder.com/1200x600?text=Imagen+No+Disponible" 
            alt="Sin imagen" 
            className="main-image"
          />
        </div>
      </section>
    );
  }

  const currentImage = gallery[selectedIndex]?.url;

  // Funciones para las flechas
  const handlePrev = () => {
    setSelectedIndex((prev) => (prev === 0 ? gallery.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setSelectedIndex((prev) => (prev === gallery.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="gallery-section">
      
      <div className="main-image-container" style={{ position: 'relative' }}>
        <img 
          src={currentImage || 'https://via.placeholder.com/1200x600?text=Imagen+No+Disponible'} 
          alt={`Vista principal ${selectedIndex + 1}`} 
          className="main-image"
          onError={(e) => e.target.src = 'https://via.placeholder.com/1200x600?text=No+Image'}
        />
        
       
        {gallery.length > 1 && (
          <>
            <button className="slider-arrow prev" onClick={handlePrev}>
             {icons.chevronLeft}
            </button>
            <button className="slider-arrow next" onClick={handleNext}>
              {icons.ChevronRight}
            </button>
          </>
        )}
      </div>

      {/* MINIATURAS (THUMBNAILS) */}
      {gallery.length > 1 && (
        <div className="thumbnails">
          {gallery.map((img, idx) => (
            <button 
              key={idx} 
              className={`thumb-btn ${selectedIndex === idx ? 'active' : ''}`}
              onClick={() => setSelectedIndex(idx)}
            >
              <img src={img.url} alt={`Vista miniatura ${idx + 1}`} />
            </button>
          ))}
        </div>
      )}
      
    </section>
  );
};

export default SliderImages;