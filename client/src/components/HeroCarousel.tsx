import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const API_URL = "https://api.xlr8aerospace.com";

interface CarouselSlide {
  id: number;
  title: string;
  description?: string;
  imgMobile: string;
  imgDesktop: string;
  link?: string;
}

const HeroCarousel = () => {
  const [slides, setSlides] = useState<CarouselSlide[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  /* ================= FETCH CAROUSEL ================= */
  useEffect(() => {
    fetch(`${API_URL}/api/carousel`)
      .then((res) => res.json())
      .then((data) => {
        if (!Array.isArray(data)) return;

        const formatted: CarouselSlide[] = data.map((slide: any) => ({
          id: slide.id,
          title: slide.title,
          description: slide.description,
          imgMobile: slide.mobile_image,     // ✅ S3 URL
          imgDesktop: slide.desktop_image,   // ✅ S3 URL
          link: slide.product_link || undefined,
        }));

        setSlides(formatted.slice(0, 3));
      })
      .catch((err) => {
        console.error("Failed to load carousel", err);
      });
  }, []);

  /* ================= AUTO SLIDE ================= */
  useEffect(() => {
    if (!slides.length) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [slides]);

  if (!slides.length) return null;

  const slide = slides[currentSlide];

  return (
    <div className="pt-[70px] relative">
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          className="h-[85vh] relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <picture>
            <source
              media="(max-width: 768px)"
              srcSet={slide.imgMobile}
            />
            <source
              media="(min-width: 769px)"
              srcSet={slide.imgDesktop}
            />
            <img
              src={slide.imgDesktop}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
          </picture>

          <div className="absolute bottom-12 left-12 text-white max-w-xl">
            <h1 className="text-6xl font-bold">{slide.title}</h1>
            {slide.description && (
              <p className="text-2xl mt-2">{slide.description}</p>
            )}
          </div>

          <ChevronDown className="absolute bottom-8 right-8 text-white animate-bounce" />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default HeroCarousel;
