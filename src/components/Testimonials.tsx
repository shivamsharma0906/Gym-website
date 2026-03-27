import { useState } from 'react';
import './Testimonials.css';

const Testimonials = () => {
  const testimonials = [
    {
      name: 'Shivam Sharma',
      role: 'Fitness Enthusiast',
      text: 'LIFT & FIT completely transformed my life. I lost 15 kgs in 6 months and gained confidence I never knew I had. The trainers are incredible!',
      rating: 5,
      avatar: '👨‍💼',
    },
    {
      name: 'Nandini Gupta',
      role: 'Marathon Runner',
      text: 'The HIIT programs here are next level. My endurance improved dramatically, and I finally broke my marathon personal record. Best gym I\'ve ever been to.',
      rating: 5,
      avatar: '👩‍💻',
    },
    {
      name: 'Bibek Thapa',
      role: 'Bodybuilder',
      text: 'The equipment quality is unmatched. From Olympic platforms to competition-grade machines — they have everything. The community pushes you to be your best.',
      rating: 5,
      avatar: '🧔',
    },
    {
      name: 'Anjali Singh',
      role: 'Yoga Practitioner',
      text: 'I came for the gym and stayed for the yoga. Elena\'s classes are a spiritual experience. The studio is gorgeous, and the atmosphere is so welcoming.',
      rating: 5,
      avatar: '👩',
    },
    {
      name: 'Rajesh Kumar',
      role: 'CrossFit Athlete',
      text: 'After trying 5 different gyms, I finally found my home. The functional fitness program here is world-class. Results speak for themselves!',
      rating: 5,
      avatar: '👨‍🦰',
    },
    {
      name: 'Nina Patel',
      role: 'Beginner',
      text: 'As someone completely new to fitness, I was intimidated. But the staff made me feel so welcome. My personal trainer designed a perfect beginner plan.',
      rating: 5,
      avatar: '👧',
    },
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const visibleCount = 3;

  const next = () => {
    setActiveIndex((prev) => (prev + 1) % (testimonials.length - visibleCount + 1));
  };

  const prev = () => {
    setActiveIndex((prev) =>
      prev === 0 ? testimonials.length - visibleCount : prev - 1
    );
  };

  return (
    <section className="testimonials" id="testimonials">
      <div className="testimonials__container container">
        <div className="testimonials__header">
          <span className="section-tag">Testimonials</span>
          <h2 className="section-title">
            What Our Members <span className="highlight">Say</span>
          </h2>
          <p className="section-subtitle">
            Real stories from real people who transformed their lives with us.
          </p>
        </div>

        <div className="testimonials__carousel">
          <div
            className="testimonials__track"
            style={{ transform: `translateX(-${activeIndex * (100 / visibleCount)}%)` }}
          >
            {testimonials.map((t, index) => (
              <div className="testimonials__card" key={index}>
                <div className="testimonials__card-stars">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <span key={i} className="testimonials__card-star">⭐</span>
                  ))}
                </div>
                <p className="testimonials__card-text">"{t.text}"</p>
                <div className="testimonials__card-author">
                  <span className="testimonials__card-avatar">{t.avatar}</span>
                  <div>
                    <div className="testimonials__card-name">{t.name}</div>
                    <div className="testimonials__card-role">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="testimonials__controls">
          <button className="testimonials__btn" onClick={prev} aria-label="Previous testimonial" id="testimonial-prev">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="testimonials__dots">
            {Array.from({ length: testimonials.length - visibleCount + 1 }).map((_, i) => (
              <button
                key={i}
                className={`testimonials__dot ${i === activeIndex ? 'testimonials__dot--active' : ''}`}
                onClick={() => setActiveIndex(i)}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
          <button className="testimonials__btn" onClick={next} aria-label="Next testimonial" id="testimonial-next">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
