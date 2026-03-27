import { useState } from 'react';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    interest: 'general',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Thank you for reaching out! We\'ll get back to you within 24 hours.');
    setFormData({ name: '', email: '', phone: '', message: '', interest: 'general' });
  };

  const contactInfo = [
    {
      icon: '📍',
      title: 'Visit Us',
      details: ['Plot 42, Fitness Hub, MG Road', 'Mumbai, Maharashtra 400001'],
    },
    {
      icon: '📞',
      title: 'Call Us',
      details: ['+91 98765 43210', 'Mon-Sun: 5AM - 11PM'],
    },
    {
      icon: '✉️',
      title: 'Email Us',
      details: ['hello@liftandfit.in', 'support@liftandfit.in'],
    },
  ];

  return (
    <section className="contact" id="contact">
      <div className="contact__container container">
        <div className="contact__header">
          <span className="section-tag">Get In Touch</span>
          <h2 className="section-title">
            Ready To <span className="highlight">Begin?</span>
          </h2>
          <p className="section-subtitle">
            Drop us a message and our team will reach out to help you get started
            on your fitness journey.
          </p>
        </div>

        <div className="contact__grid">
          <form className="contact__form" onSubmit={handleSubmit} id="contact-form">
            <div className="contact__form-row">
              <div className="contact__form-group">
                <label htmlFor="contact-name" className="contact__label">Full Name</label>
                <input
                  type="text"
                  id="contact-name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Rahul Sharma"
                  required
                  className="contact__input"
                />
              </div>
              <div className="contact__form-group">
                <label htmlFor="contact-email" className="contact__label">Email Address</label>
                <input
                  type="email"
                  id="contact-email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="rahul@example.com"
                  required
                  className="contact__input"
                />
              </div>
            </div>

            <div className="contact__form-row">
              <div className="contact__form-group">
                <label htmlFor="contact-phone" className="contact__label">Phone Number</label>
                <input
                  type="tel"
                  id="contact-phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  className="contact__input"
                />
              </div>
              <div className="contact__form-group">
                <label htmlFor="contact-interest" className="contact__label">I'm Interested In</label>
                <select
                  id="contact-interest"
                  name="interest"
                  value={formData.interest}
                  onChange={handleChange}
                  className="contact__input contact__select"
                >
                  <option value="general">General Inquiry</option>
                  <option value="membership">Membership Plans</option>
                  <option value="personal-training">Personal Training</option>
                  <option value="group-classes">Group Classes</option>
                  <option value="nutrition">Nutrition Coaching</option>
                </select>
              </div>
            </div>

            <div className="contact__form-group">
              <label htmlFor="contact-message" className="contact__label">Your Message</label>
              <textarea
                id="contact-message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us about your fitness goals..."
                rows={5}
                className="contact__input contact__textarea"
              ></textarea>
            </div>

            <button type="submit" className="btn-primary contact__submit" id="contact-submit">
              Send Message
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </form>

          <div className="contact__info">
            {contactInfo.map((info, index) => (
              <div className="contact__info-card" key={index}>
                <span className="contact__info-icon">{info.icon}</span>
                <div>
                  <h4 className="contact__info-title">{info.title}</h4>
                  {info.details.map((detail, i) => (
                    <p className="contact__info-detail" key={i}>{detail}</p>
                  ))}
                </div>
              </div>
            ))}

            <div className="contact__info-hours">
              <h4 className="contact__info-title">⏰ Operating Hours</h4>
              <div className="contact__hours-grid">
                <div className="contact__hours-row">
                  <span>Mon - Fri</span>
                  <span>5:00 AM - 11:00 PM</span>
                </div>
                <div className="contact__hours-row">
                  <span>Saturday</span>
                  <span>6:00 AM - 10:00 PM</span>
                </div>
                <div className="contact__hours-row">
                  <span>Sunday</span>
                  <span>7:00 AM - 9:00 PM</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
