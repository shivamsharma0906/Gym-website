import React from 'react';
import './MotivationalQuotes.css';

const quotes = [
  "No Pain, No Gain.",
  "Push Harder Than Yesterday.",
  "Your Only Limit is You.",
  "Sweat is Magic.",
  "Wake Up. Work Out. Kick Ass. Repeat.",
  "Doubt Me? Watch Me.",
  "Train Insane or Remain The Same.",
  "Excuses Don't Burn Calories.",
  "Commit To Be Fit.",
  "Hustle For That Muscle."
];

const MotivationalQuotes: React.FC = () => {
  return (
    <div className="motivational-quotes-wrapper">
      <div className="quotes-marquee">
        <div className="quotes-track">
          {/* Double the array for seamless infinite scroll */}
          {[...quotes, ...quotes, ...quotes, ...quotes].map((quote, index) => (
            <span key={index} className="quote-item">
              <span className="quote-bullet">•</span>
              {quote}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MotivationalQuotes;
