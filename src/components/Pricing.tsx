import { useState, useCallback, useEffect, useRef } from 'react';
import CarouselControls, { getCardWidth } from './CarouselControls';
import './Pricing.css';

const Pricing = () => {
  const [isAnnual, setIsAnnual] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const gridRef = useRef<HTMLDivElement>(null);

  const plans = [
    {
      name: 'Starter',
      monthlyPrice: '999',
      annualPrice: '699',
      description: 'Perfect for beginners starting their fitness journey.',
      features: [
        'Gym Floor Access (6 AM – 10 PM)',
        'Locker Room & Changing Room',
        'All Basic Equipment',
        '2 Group Classes / Week',
        'Mobile App Access',
        'Parking Included',
      ],
      excluded: [
        'Personal Training Sessions',
        'Diet Consultation',
        'Steam & Sauna',
      ],
      popular: false,
    },
    {
      name: 'Pro',
      monthlyPrice: '1,999',
      annualPrice: '1,499',
      description: 'For dedicated athletes who want serious results.',
      features: [
        'Full Gym Access (5 AM – 11 PM)',
        'Unlimited Group Classes',
        'Personal Training (4x/month)',
        'Indian Diet Consultation (Veg & Non-Veg)',
        'Steam & Sauna Access',
        'Towel & Locker Service',
        'Guest Pass (2/month)',
        'Protein Shake Post-Workout',
      ],
      excluded: [
        'Unlimited PT Sessions',
      ],
      popular: true,
    },
    {
      name: 'Elite',
      monthlyPrice: '3,499',
      annualPrice: '2,599',
      description: 'The ultimate package for total lifestyle transformation.',
      features: [
        'Everything in Pro',
        'Unlimited Personal Training',
        'Custom Indian Diet Plan',
        'Recovery Zone & Physiotherapy',
        'Priority Class Booking',
        'Exclusive Member Events',
        'Unlimited Guest Passes',
        '20% Off Supplements Store',
        'Body Composition Analysis',
      ],
      excluded: [],
      popular: false,
    },
  ];

  const total = plans.length;

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
    <section className="pricing" id="pricing">
      <div className="pricing__container container">
        <div className="pricing__header">
          <span className="section-tag">Pricing Plans</span>
          <h2 className="section-title">Invest In <span className="highlight">Yourself</span></h2>
          <p className="section-subtitle">Choose the plan that fits your goals. No hidden fees, no contracts — just results.</p>

          <div className="pricing__toggle">
            <span className={!isAnnual ? 'pricing__toggle-active' : ''}>Monthly</span>
            <button
              className={`pricing__toggle-switch ${isAnnual ? 'pricing__toggle-switch--annual' : ''}`}
              onClick={() => setIsAnnual(!isAnnual)}
              aria-label="Toggle annual pricing"
              id="pricing-toggle"
            >
              <span className="pricing__toggle-knob"></span>
            </button>
            <span className={isAnnual ? 'pricing__toggle-active' : ''}>
              Annual <span className="pricing__toggle-badge">Save 20%</span>
            </span>
          </div>
        </div>

        <div className="pricing__grid" ref={gridRef}>
          {plans.map((plan, index) => (
            <div className={`pricing__card ${plan.popular ? 'pricing__card--popular' : ''}`} key={index}>
              {plan.popular && <div className="pricing__card-badge">Most Popular</div>}
              <h3 className="pricing__card-name">{plan.name}</h3>
              <p className="pricing__card-desc">{plan.description}</p>
              <div className="pricing__card-price">
                <span className="pricing__card-currency">₹</span>
                <span className="pricing__card-amount">{isAnnual ? plan.annualPrice : plan.monthlyPrice}</span>
                <span className="pricing__card-period">/month</span>
              </div>
              <a href="#contact" className={`pricing__card-btn ${plan.popular ? 'btn-primary' : 'btn-secondary'}`}>Get Started</a>
              <ul className="pricing__card-features">
                {plan.features.map((feature, i) => (
                  <li key={i} className="pricing__card-feature pricing__card-feature--included">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                    {feature}
                  </li>
                ))}
                {plan.excluded.map((feature, i) => (
                  <li key={`ex-${i}`} className="pricing__card-feature pricing__card-feature--excluded">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
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
      </div>
    </section>
  );
};

export default Pricing;
