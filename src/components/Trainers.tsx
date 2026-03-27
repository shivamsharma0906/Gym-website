import { useCallback, useEffect, useRef, useState } from 'react';
import Card3D from './Card3D';
import CarouselControls, { getCardWidth } from './CarouselControls';
import './Trainers.css';

const Trainers = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const trainers = [
    { name: 'Vikram Rathore', role: 'Head Strength Coach', specialty: 'Powerlifting & Hypertrophy', experience: '14+ Years', emoji: '💪🏽', color: '#e63946', socials: { instagram: '#', twitter: '#' } },
    { name: 'Neha Sharma', role: 'HIIT & Conditioning', specialty: 'Fat Loss & Endurance', experience: '8+ Years', emoji: '🔥', color: '#f77f00', socials: { instagram: '#', twitter: '#' } },
    { name: 'Arjun Kapoor', role: 'Combat Trainer', specialty: 'MMA & Kickboxing', experience: '12+ Years', emoji: '🥊', color: '#2ec4b6', socials: { instagram: '#', twitter: '#' } },
    { name: 'Priya Patel', role: 'Yoga Master', specialty: 'Flexibility & Core', experience: '10+ Years', emoji: '🧘🏽‍♀️', color: '#a855f7', socials: { instagram: '#', twitter: '#' } },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setIsVisible(true); }, { threshold: 0.1 });
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Sync dot from scroll position
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
  const onNext = useCallback(() => scrollTo(Math.min(trainers.length - 1, activeIdx + 1)), [activeIdx, scrollTo]);

  return (
    <section className="tr" id="trainers" ref={sectionRef}>
      <div className="tr__glow" />
      <div className={`tr__container container${isVisible ? ' tr__container--visible' : ''}`}>
        <div className="tr__header">
          <div className="tr__eyebrow"><span className="tr__eyebrow-dot" />Elite Indian Coaching</div>
          <h2 className="tr__title">Meet Your <span className="tr__title-accent">Trainers</span></h2>
          <p className="tr__subtitle">Our certified Indian professionals bring fierce passion, elite expertise, and years of relentless experience to forge your ultimate transformation.</p>
        </div>

        <div className="tr__grid" ref={gridRef}>
          {trainers.map((trainer, index) => (
            <Card3D key={index} intensity={15}>
              <div className="tr__card" style={{ '--tc-color': trainer.color } as React.CSSProperties}>
                <div className="tr__avatar">
                  <div className="tr__ring-2" />
                  <div className="tr__ring-1" />
                  <span className="tr__avatar-emoji">{trainer.emoji}</span>
                </div>
                <div className="tr__info">
                  <h3 className="tr__name">{trainer.name}</h3>
                  <div className="tr__role">{trainer.role}</div>
                  <div className="tr__stats">
                    <div className="tr__stat"><span className="tr__stat-lbl">Specialty</span><span className="tr__stat-val">{trainer.specialty}</span></div>
                    <div className="tr__stat"><span className="tr__stat-lbl">Experience</span><span className="tr__stat-val">{trainer.experience}</span></div>
                  </div>
                  <div className="tr__socials">
                    <a href={trainer.socials.instagram} className="tr__social" aria-label="Instagram">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>
                    </a>
                    <a href={trainer.socials.twitter} className="tr__social" aria-label="Twitter">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" /></svg>
                    </a>
                  </div>
                </div>
              </div>
            </Card3D>
          ))}
        </div>

        <CarouselControls
          scrollRef={gridRef}
          total={trainers.length}
          active={activeIdx}
          onPrev={onPrev}
          onNext={onNext}
          onDot={scrollTo}
          accentColor="#e63946"
        />
      </div>
    </section>
  );
};

export default Trainers;
