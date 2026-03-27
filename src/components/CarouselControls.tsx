import { useEffect } from 'react';
import './CarouselControls.css';

interface CarouselControlsProps {
  scrollRef: React.RefObject<HTMLElement | null>;
  total: number;
  active: number;
  onPrev: () => void;
  onNext: () => void;
  onDot: (i: number) => void;
  accentColor?: string;
}

const CarouselControls = ({
  scrollRef,
  total,
  active,
  onPrev,
  onNext,
  onDot,
  accentColor = '#e63946',
}: CarouselControlsProps) => {
  // Keep active index in sync when user manually swipes
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const handleScroll = () => {
      // Handled by parent via onScroll prop — no-op here
    };
    el.addEventListener('scroll', handleScroll, { passive: true });
    return () => el.removeEventListener('scroll', handleScroll);
  }, [scrollRef]);

  return (
    <div className="carousel-nav" role="navigation" aria-label="Carousel navigation">
      <button
        className="carousel-nav__btn"
        onClick={onPrev}
        disabled={active === 0}
        aria-label="Previous"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>

      <div className="carousel-nav__dots">
        {Array.from({ length: total }).map((_, i) => (
          <button
            key={i}
            className={`carousel-nav__dot${i === active ? ' carousel-nav__dot--active' : ''}`}
            style={i === active ? { background: accentColor, boxShadow: `0 0 8px ${accentColor}99` } : {}}
            onClick={() => onDot(i)}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      <button
        className="carousel-nav__btn"
        onClick={onNext}
        disabled={active === total - 1}
        aria-label="Next"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>
    </div>
  );
};

export default CarouselControls;

/** Utility: get card width from first child of a scroll container */
export function getCardWidth(el: HTMLElement): number {
  const firstChild = el.firstElementChild as HTMLElement | null;
  if (!firstChild) return el.clientWidth;
  const style = getComputedStyle(el);
  const gap = parseFloat(style.gap || style.columnGap || '14');
  return firstChild.offsetWidth + gap;
}
