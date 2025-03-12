import { useState, useEffect, useRef } from 'react';
import { assets } from '../../assets/frontend_assets/assets';
import './Banner.css';

const Banner = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const banners = [assets.banner, assets.banner2, assets.banner3, assets.banner4, assets.banner5];
  const intervalRef = useRef(null);

  const handleNext = () => setActiveIndex((prev) => (prev + 1) % banners.length);
  const handlePrev = () => setActiveIndex((prev) => (prev - 1 + banners.length) % banners.length);

  // Auto-slide functionality
  useEffect(() => {
    startAutoSlide();
    return () => stopAutoSlide();
  }, []);

  const startAutoSlide = () => {
    stopAutoSlide(); // Clear any existing intervals
    intervalRef.current = setInterval(handleNext, 5000); 
  };

  const stopAutoSlide = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  return (
    <div
      id="default-carousel"
      className="relative w-full"
      onMouseEnter={stopAutoSlide}
      onMouseLeave={startAutoSlide}
      aria-live="polite"
    >
      {/* Carousel wrapper */}
      <div className="relative h- overflow-hidden rounded-lg md:h-96">
        {banners.map((banner, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              index === activeIndex ? 'opacity-100 z-10' : 'opacity-0'
            }`}
          >
            <img
              src={banner}
              className="block w-full h-full object-cover"
              alt={`Slide ${index + 1}`}
            />
          </div>
        ))}
      </div>
      {/* Slider indicators */}
      <div className="absolute z-30 flex -translate-x-1/2 bottom-5 left-1/2 space-x-3">
        {banners.map((_, index) => (
          <button
            key={index}
            type="button"
            className={`w-3 h-3 rounded-full ${
              index === activeIndex ? 'bg-white' : 'bg-gray-400'
            }`}
            onClick={() => setActiveIndex(index)}
            aria-label={`Slide ${index + 1}`}
          ></button>
        ))}
      </div>
      {/* Slider controls */}
      <button
        type="button"
        className="absolute top-0 left-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
        onClick={handlePrev}
      >
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50">
          <svg
            className="w-4 h-4 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 6 10"
            aria-hidden="true"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 1 1 5l4 4"
            />
          </svg>
          <span className="sr-only">Previous</span>
        </span>
      </button>
      <button
        type="button"
        className="absolute top-0 right-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
        onClick={handleNext}
      >
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50">
          <svg
            className="w-4 h-4 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 6 10"
            aria-hidden="true"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m1 9 4-4-4-4"
            />
          </svg>
          <span className="sr-only">Next</span>
        </span>
      </button>
    </div>
  );
};

export default Banner;
