import { useState, useEffect, useRef, useCallback } from 'react';
import CarouselControls, { getCardWidth } from './CarouselControls';
import './Programs.css';

const Programs = () => {
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());
  const [visibleCards, setVisibleCards] = useState<Set<number>>(new Set());
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [activeIdx, setActiveIdx] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const toggleFlip = (index: number) => {
    setFlippedCards((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  // Scroll-triggered staggered reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number(entry.target.getAttribute('data-index'));
            setTimeout(() => {
              setVisibleCards((prev) => new Set(prev).add(idx));
            }, idx * 120);
          }
        });
      },
      { threshold: 0.15 }
    );

    const cards = document.querySelectorAll('.programs__flip-container');
    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, []);

  // Track mouse for spotlight effect
  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };
    const section = sectionRef.current;
    section?.addEventListener('mousemove', handleMove);
    return () => section?.removeEventListener('mousemove', handleMove);
  }, []);

  // Sync dot from scroll
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

  const totalPrograms = 6; // programs array length
  const onPrev = useCallback(() => scrollTo(Math.max(0, activeIdx - 1)), [activeIdx, scrollTo]);
  const onNext = useCallback(() => scrollTo(Math.min(totalPrograms - 1, activeIdx + 1)), [activeIdx, scrollTo]);

  const programs = [
    {
      icon: '💪',
      title: 'Strength Training',
      description: 'Build raw power and muscle mass with progressive overload techniques and compound movements.',
      features: ['Free Weights', 'Machine Training', 'Powerlifting'],
      color: '#e63946',
      gradient: 'linear-gradient(135deg, #e63946, #ff6b6b)',
      backInfo: {
        schedule: 'Mon / Wed / Fri',
        duration: '60 min session',
        level: 'All Levels',
        trainer: 'Marcus Johnson',
        details: 'Progressive overload with periodized programming. Includes bench press, squats, deadlifts, overhead press and accessories.',
        equipment: ['Barbells', 'Dumbbells', 'Cable Machines', 'Power Rack'],
      },
    },
    {
      icon: '🔥',
      title: 'HIIT Cardio',
      description: 'Torch calories and boost metabolism with high-intensity interval training sessions.',
      features: ['Fat Burning', 'Endurance', 'Circuit Training'],
      color: '#f77f00',
      gradient: 'linear-gradient(135deg, #f77f00, #ffa94d)',
      backInfo: {
        schedule: 'Tue / Thu / Sat',
        duration: '45 min session',
        level: 'Intermediate+',
        trainer: 'Sarah Chen',
        details: 'High-intensity intervals with 20s work / 10s rest. Burns up to 600 calories. Includes sprints, burpees and battle ropes.',
        equipment: ['Battle Ropes', 'Kettlebells', 'Box Jumps', 'Treadmills'],
      },
    },
    {
      icon: '🧘',
      title: 'Yoga & Flexibility',
      description: 'Improve mobility, reduce stress, and enhance mind-body connection through guided yoga.',
      features: ['Hot Yoga', 'Vinyasa Flow', 'Meditation'],
      color: '#2ec4b6',
      gradient: 'linear-gradient(135deg, #2ec4b6, #6ee7b7)',
      backInfo: {
        schedule: 'Daily',
        duration: '50 min session',
        level: 'All Levels',
        trainer: 'Elena Rodriguez',
        details: 'Gentle Hatha to power Vinyasa. Improves flexibility, balance and mental clarity. Hot studio at 38°C.',
        equipment: ['Yoga Mats', 'Blocks', 'Straps', 'Bolsters'],
      },
    },
    {
      icon: '🥊',
      title: 'Combat Training',
      description: 'Learn striking, self-defense, and build unshakable confidence through martial arts.',
      features: ['Boxing', 'Kickboxing', 'MMA Basics'],
      color: '#e63946',
      gradient: 'linear-gradient(135deg, #e63946, #ff6b6b)',
      backInfo: {
        schedule: 'Mon / Wed / Fri',
        duration: '60 min session',
        level: 'Beginner to Advanced',
        trainer: 'David Park',
        details: 'Proper boxing technique, footwork and combos. Heavy bag work, pad work and sparring for advanced members.',
        equipment: ['Heavy Bags', 'Speed Bags', 'Boxing Ring', 'Gloves'],
      },
    },
    {
      icon: '🏃',
      title: 'Functional Fitness',
      description: 'Train movements, not muscles. Improve everyday performance with functional exercises.',
      features: ['CrossFit Style', 'Kettlebells', 'TRX'],
      color: '#f77f00',
      gradient: 'linear-gradient(135deg, #f77f00, #ffa94d)',
      backInfo: {
        schedule: 'Tue / Thu / Sat',
        duration: '50 min session',
        level: 'Intermediate',
        trainer: 'Marcus Johnson',
        details: 'Full-body workouts focused on real-world movement patterns. Strength, cardio and flexibility combined.',
        equipment: ['TRX', 'Kettlebells', 'Medicine Balls', 'Bands'],
      },
    },
    {
      icon: '🥗',
      title: 'Nutrition Coaching',
      description: 'Fuel your body right with personalized meal plans and expert nutritional guidance.',
      features: ['Meal Plans', 'Macro Tracking', 'Supplements'],
      color: '#2ec4b6',
      gradient: 'linear-gradient(135deg, #2ec4b6, #6ee7b7)',
      backInfo: {
        schedule: 'Flexible Booking',
        duration: '30 min consult',
        level: 'All Levels',
        trainer: 'Certified Nutritionist',
        details: 'Personalized veg & non-veg Indian diet plans. Weekly check-ins, macro tracking and supplement recommendations.',
        equipment: ['Body Scanner', 'Meal Guides', 'App Setup', 'Tracking'],
      },
    },
  ];

  return (
    <section className="programs" id="programs" ref={sectionRef}>
      {/* Animated background elements */}
      <div className="programs__bg-effects">
        <div className="programs__orb programs__orb--1"></div>
        <div className="programs__orb programs__orb--2"></div>
        <div className="programs__orb programs__orb--3"></div>
        <div className="programs__grid-lines"></div>
        <div
          className="programs__spotlight"
          style={{
            left: `${mousePos.x}px`,
            top: `${mousePos.y}px`,
          }}
        ></div>
      </div>

      <div className="programs__container container">
        <div className="programs__header">
          <div className="programs__header-tag">
            <span className="programs__header-line"></span>
            <span className="section-tag">Our Programs</span>
            <span className="programs__header-line"></span>
          </div>
          <h2 className="programs__title">
            <span className="programs__title-line">Train Like A</span>
            <span className="programs__title-highlight">Champion</span>
          </h2>
          <p className="programs__subtitle">
            From strength and cardio to yoga and combat — we offer diverse programs
            tailored to every fitness level and goal.
          </p>
          <div className="programs__subtitle-bar">
            <span></span><span></span><span></span>
          </div>
        </div>

        <div className="programs__grid" ref={gridRef}>
          {programs.map((program, index) => (
            <div
              className={`programs__flip-container ${flippedCards.has(index) ? 'programs__flip-container--flipped' : ''} ${visibleCards.has(index) ? 'programs__flip-container--visible' : ''}`}
              key={index}
              data-index={index}
              onMouseLeave={() => {
                setFlippedCards((prev) => {
                  const next = new Set(prev);
                  next.delete(index);
                  return next;
                });
              }}
            >
              <div className="programs__flip-inner">
                {/* === Front Face === */}
                <div className="programs__card programs__card--front">
                  {/* Animated gradient border */}
                  <div className="programs__card-border" style={{ '--card-gradient': program.gradient } as React.CSSProperties}></div>
                  
                  <div className="programs__card-glow" style={{ background: `radial-gradient(circle at 50% 0%, ${program.color}15, transparent 70%)` }}></div>

                  <div className="programs__card-number">{String(index + 1).padStart(2, '0')}</div>

                  <div className="programs__card-icon-wrap">
                    <span className="programs__card-icon">{program.icon}</span>
                    <div className="programs__card-icon-ring" style={{ borderColor: program.color + '33' }}></div>
                    <div className="programs__card-icon-pulse" style={{ background: program.color + '11' }}></div>
                  </div>

                  <h3 className="programs__card-title">{program.title}</h3>
                  <p className="programs__card-text">{program.description}</p>

                  <div className="programs__card-divider" style={{ background: program.gradient }}></div>

                  <ul className="programs__card-features">
                    {program.features.map((feature, i) => (
                      <li key={i} className="programs__card-feature">
                        <span className="programs__card-feature-dot" style={{ background: program.color }}></span>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <button
                    className="programs__card-btn"
                    onClick={() => toggleFlip(index)}
                    style={{ '--btn-color': program.color, '--btn-gradient': program.gradient } as React.CSSProperties}
                  >
                    <span>Explore Program</span>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>

                {/* === Back Face === */}
                <div className="programs__card programs__card--back">
                  <div className="programs__card-border" style={{ '--card-gradient': program.gradient } as React.CSSProperties}></div>
                  <div className="programs__card-glow" style={{ background: `radial-gradient(circle at 50% 0%, ${program.color}20, transparent 70%)` }}></div>

                  <div className="programs__back-top">
                    <span className="programs__back-emoji">{program.icon}</span>
                    <div>
                      <h3 className="programs__back-title">{program.title}</h3>
                      <span className="programs__back-badge" style={{ color: program.color, borderColor: program.color + '44' }}>Full Details</span>
                    </div>
                  </div>

                  <div className="programs__back-grid">
                    <div className="programs__back-stat">
                      <span className="programs__back-stat-icon">📅</span>
                      <div>
                        <span className="programs__back-stat-label">Schedule</span>
                        <span className="programs__back-stat-value">{program.backInfo.schedule}</span>
                      </div>
                    </div>
                    <div className="programs__back-stat">
                      <span className="programs__back-stat-icon">⏱️</span>
                      <div>
                        <span className="programs__back-stat-label">Duration</span>
                        <span className="programs__back-stat-value">{program.backInfo.duration}</span>
                      </div>
                    </div>
                    <div className="programs__back-stat">
                      <span className="programs__back-stat-icon">📊</span>
                      <div>
                        <span className="programs__back-stat-label">Level</span>
                        <span className="programs__back-stat-value">{program.backInfo.level}</span>
                      </div>
                    </div>
                    <div className="programs__back-stat">
                      <span className="programs__back-stat-icon">👤</span>
                      <div>
                        <span className="programs__back-stat-label">Trainer</span>
                        <span className="programs__back-stat-value">{program.backInfo.trainer}</span>
                      </div>
                    </div>
                  </div>

                  <p className="programs__back-desc">{program.backInfo.details}</p>

                  <div className="programs__back-tags">
                    {program.backInfo.equipment.map((eq, i) => (
                      <span key={i} className="programs__back-tag" style={{ borderColor: program.color + '33', color: program.color }}>{eq}</span>
                    ))}
                  </div>

                  <button
                    className="programs__card-btn programs__card-btn--back"
                    onClick={() => toggleFlip(index)}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                    <span>Go Back</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <CarouselControls
          scrollRef={gridRef}
          total={totalPrograms}
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

export default Programs;
