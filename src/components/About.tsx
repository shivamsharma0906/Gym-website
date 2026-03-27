import Card3D from './Card3D';
import { useCallback, useEffect, useRef, useState } from 'react';
import CarouselControls, { getCardWidth } from './CarouselControls';
import './About.css';

const About = () => {
  const [activeIdx, setActiveIdx] = useState(0);
  const gridRef = useRef<HTMLDivElement>(null);

  const features = [
    { icon: '🎯', title: 'Goal-Oriented Training', description: 'Personalized programs designed to meet your specific fitness goals and aspirations.' },
    { icon: '🏆', title: 'Award-Winning Facility', description: 'State-of-the-art equipment and amenities in a premium, motivating environment.' },
    { icon: '🧬', title: 'Science-Based Approach', description: 'Evidence-backed training methodologies for maximum results and injury prevention.' },
    { icon: '🤝', title: 'Community Driven', description: 'Join a supportive community of like-minded individuals pushing each other forward.' },
  ];

  // Number of dots = number of cards (scroll by 1 at a time)
  const total = features.length;

  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;
    const onScroll = () => {
      const cardW = getCardWidth(el);
      setActiveIdx(Math.round(el.scrollLeft / cardW));
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = useCallback((idx: number) => {
    const el = gridRef.current;
    if (!el) return;
    const cardW = getCardWidth(el);
    el.scrollTo({ left: cardW * idx, behavior: 'smooth' });
    setActiveIdx(idx);
  }, []);

  const onPrev = useCallback(() => scrollTo(Math.max(0, activeIdx - 1)), [activeIdx, scrollTo]);
  const onNext = useCallback(() => scrollTo(Math.min(total - 1, activeIdx + 1)), [activeIdx, total, scrollTo]);

  return (
    <section className="about" id="about">
      <div className="about__container container">
        <div className="about__header">
          <span className="section-tag">About Us</span>
          <h2 className="section-title">More Than Just A <span className="highlight">Gym</span></h2>
          <p className="section-subtitle">
            We're a movement. A community of warriors committed to pushing beyond
            limits, breaking barriers, and redefining what's possible.
          </p>
        </div>

        <div className="about__grid" ref={gridRef}>
          {features.map((feature, index) => (
            <Card3D key={index} intensity={12}>
              <div className="about__card" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="about__card-icon">{feature.icon}</div>
                <h3 className="about__card-title">{feature.title}</h3>
                <p className="about__card-text">{feature.description}</p>
                <div className="about__card-glow"></div>
              </div>
            </Card3D>
          ))}
        </div>

        <CarouselControls
          scrollRef={gridRef}
          total={total}
          active={activeIdx}
          onPrev={onPrev}
          onNext={onNext}
          onDot={scrollTo}
          accentColor="#e63946"
        />

        <div className="about__metrics">
          <div className="about__metric"><span className="about__metric-number">10+</span><span className="about__metric-label">Years of Excellence</span></div>
          <div className="about__metric"><span className="about__metric-number">98%</span><span className="about__metric-label">Client Satisfaction</span></div>
          <div className="about__metric"><span className="about__metric-number">24/7</span><span className="about__metric-label">Facility Access</span></div>
          <div className="about__metric"><span className="about__metric-number">5★</span><span className="about__metric-label">Average Rating</span></div>
        </div>
      </div>
    </section>
  );
};

export default About;
