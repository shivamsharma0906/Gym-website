import { useEffect, useRef, useState } from 'react';
import './ScrollStory.css';

interface StorySection {
  tag: string;
  title: string;
  subtitle: string;
  description: string;
  emoji: string;
  stats: { label: string; value: string }[];
  bgGradient: string;
}

const sections: StorySection[] = [
  {
    tag: 'Step 01',
    title: 'FORGE YOUR BODY',
    subtitle: 'Begin the Transformation',
    description:
      'Every champion was once a contender that refused to give up. Step into the arena, feel the iron in your hands, and begin the journey that will redefine who you are.',
    emoji: '🔥',
    stats: [
      { label: 'Exercises', value: '500+' },
      { label: 'Equipment', value: '150+' },
      { label: 'Sqft Space', value: '20K' },
    ],
    bgGradient: 'radial-gradient(ellipse at 50% 50%, rgba(230, 57, 70, 0.12) 0%, transparent 70%)',
  },
  {
    tag: 'Step 02',
    title: 'BUILD STRENGTH',
    subtitle: 'Push Beyond Limits',
    description:
      'Strength isn\'t just about muscles — it\'s about mental fortitude. Our world-class programs are designed to push you past every plateau and unlock power you never knew existed.',
    emoji: '💪',
    stats: [
      { label: 'Programs', value: '200+' },
      { label: 'Trainers', value: '50+' },
      { label: 'Success Rate', value: '98%' },
    ],
    bgGradient: 'radial-gradient(ellipse at 50% 50%, rgba(247, 127, 0, 0.12) 0%, transparent 70%)',
  },
  {
    tag: 'Step 03',
    title: 'SEE RESULTS',
    subtitle: 'Witness the Change',
    description:
      'The mirror doesn\'t lie, the scale doesn\'t lie, and your reflection will tell a story of discipline, dedication, and transformation. This is where every drop of sweat pays off.',
    emoji: '🏆',
    stats: [
      { label: 'Transformations', value: '15K+' },
      { label: 'Avg. Results', value: '12 wk' },
      { label: 'Rating', value: '4.9★' },
    ],
    bgGradient: 'radial-gradient(ellipse at 50% 50%, rgba(46, 196, 182, 0.12) 0%, transparent 70%)',
  },
];

const ScrollStory = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const containerHeight = containerRef.current.offsetHeight;
      const viewportHeight = window.innerHeight;

      // How far we've scrolled through the container
      const scrolled = -rect.top;
      const totalScrollable = containerHeight - viewportHeight;
      const scrollProgress = Math.max(0, Math.min(1, scrolled / totalScrollable));

      setProgress(scrollProgress);

      // Determine active section
      const sectionProgress = scrollProgress * sections.length;
      const index = Math.min(Math.floor(sectionProgress), sections.length - 1);
      setActiveIndex(index);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getSectionOpacity = (index: number) => {
    const sectionSize = 1 / sections.length;
    const sectionStart = index * sectionSize;
    const sectionEnd = (index + 1) * sectionSize;
    const fadeInEnd = sectionStart + sectionSize * 0.3;
    const fadeOutStart = sectionEnd - sectionSize * 0.3;

    if (progress < sectionStart) return 0;
    if (progress < fadeInEnd) return (progress - sectionStart) / (fadeInEnd - sectionStart);
    if (progress < fadeOutStart) return 1;
    if (progress < sectionEnd && index < sections.length - 1) return 1 - (progress - fadeOutStart) / (sectionEnd - fadeOutStart);
    if (index === sections.length - 1 && progress >= fadeOutStart) return 1;
    return 0;
  };

  const getSectionTranslateY = (index: number) => {
    const sectionSize = 1 / sections.length;
    const sectionStart = index * sectionSize;
    const fadeInEnd = sectionStart + sectionSize * 0.3;

    if (progress < sectionStart) return 60;
    if (progress < fadeInEnd) {
      const p = (progress - sectionStart) / (fadeInEnd - sectionStart);
      return 60 * (1 - p);
    }
    return 0;
  };

  return (
    <section className="scroll-story" ref={containerRef} id="scroll-story">
      <div className="scroll-story__sticky">
        {/* Progress bar */}
        <div className="scroll-story__progress">
          <div
            className="scroll-story__progress-fill"
            style={{ height: `${progress * 100}%` }}
          />
          {sections.map((_, i) => (
            <div
              key={i}
              className={`scroll-story__progress-dot ${i <= activeIndex ? 'scroll-story__progress-dot--active' : ''}`}
              style={{ top: `${(i / (sections.length - 1)) * 100}%` }}
            />
          ))}
        </div>

        {/* Step indicators */}
        <div className="scroll-story__steps">
          {sections.map((s, i) => (
            <span
              key={i}
              className={`scroll-story__step ${i === activeIndex ? 'scroll-story__step--active' : ''}`}
            >
              {s.tag}
            </span>
          ))}
        </div>

        {/* Background glow */}
        <div
          className="scroll-story__bg"
          style={{ background: sections[activeIndex].bgGradient }}
        />

        {/* Content panels */}
        {sections.map((section, index) => (
          <div
            key={index}
            className="scroll-story__panel"
            style={{
              opacity: getSectionOpacity(index),
              transform: `translateY(${getSectionTranslateY(index)}px)`,
              pointerEvents: index === activeIndex ? 'auto' : 'none',
            }}
          >
            <div className="scroll-story__panel-content">
              <div className="scroll-story__panel-left">
                <span className="scroll-story__panel-tag">{section.tag}</span>
                <h2 className="scroll-story__panel-title">
                  {section.title}
                </h2>
                <p className="scroll-story__panel-subtitle">{section.subtitle}</p>
                <p className="scroll-story__panel-desc">{section.description}</p>
                <div className="scroll-story__panel-stats">
                  {section.stats.map((stat, i) => (
                    <div key={i} className="scroll-story__panel-stat">
                      <span className="scroll-story__panel-stat-value">{stat.value}</span>
                      <span className="scroll-story__panel-stat-label">{stat.label}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="scroll-story__panel-right">
                <div className="scroll-story__panel-visual">
                  <span className="scroll-story__panel-emoji">{section.emoji}</span>
                  <div className="scroll-story__panel-ring scroll-story__panel-ring--1"></div>
                  <div className="scroll-story__panel-ring scroll-story__panel-ring--2"></div>
                  <div className="scroll-story__panel-ring scroll-story__panel-ring--3"></div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Scroll hint at bottom */}
        <div className="scroll-story__hint" style={{ opacity: progress > 0.9 ? 0 : 1 }}>
          <div className="scroll-story__hint-line"></div>
          <span>Keep Scrolling</span>
        </div>
      </div>
    </section>
  );
};

export default ScrollStory;
