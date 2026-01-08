import { motion, useInView, useMotionValue, useTransform, animate, useScroll, useSpring } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import Logo from './components/Logo';
import FloatingDots from './components/FloatingDots';
import './App.css';

// Animated Counter with spring animation
const AnimatedCounter = ({ value, suffix = '', duration = 2.5 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => {
    if (suffix === 'M') return latest.toFixed(1);
    return Math.round(latest);
  });
  const [displayValue, setDisplayValue] = useState('0');

  useEffect(() => {
    if (isInView) {
      const controls = animate(count, value, {
        duration,
        ease: [0.16, 1, 0.3, 1],
      });
      const unsubscribe = rounded.on('change', (v) => setDisplayValue(v.toString()));
      return () => {
        controls.stop();
        unsubscribe();
      };
    }
  }, [isInView, value, count, rounded, duration]);

  return <span ref={ref}>{displayValue}{suffix}</span>;
};

// Text reveal animation component
const TextReveal = ({ children, delay = 0 }) => {
  return (
    <motion.span
      className="hero-title-line"
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      transition={{ 
        duration: 1.2, 
        delay, 
        ease: [0.16, 1, 0.3, 1] 
      }}
      style={{ display: 'block' }}
    >
      {children}
    </motion.span>
  );
};

// Magnetic button effect
const MagneticButton = ({ children, className, onClick, href, ...props }) => {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const springX = useSpring(x, { stiffness: 150, damping: 15 });
  const springY = useSpring(y, { stiffness: 150, damping: 15 });

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) * 0.15);
    y.set((e.clientY - centerY) * 0.15);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  if (href) {
    return (
      <motion.a
        ref={ref}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        style={{ x: springX, y: springY }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        {children}
      </motion.a>
    );
  }

  return (
    <motion.button
      ref={ref}
      className={className}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      {...props}
    >
      {children}
    </motion.button>
  );
};

// Trusted By Section - Marquee
const TrustedBySection = () => {
  const companies = [
    'Company A',
    'Company B', 
    'Company C',
    'Company D',
    'Company E',
    'Company F',
    'Company G',
    'Company H',
  ];

  // Triple the items for seamless loop
  const allCompanies = [...companies, ...companies, ...companies];

  return (
    <section className="trusted-by-section">
      <p className="trusted-by-heading">
        TRUSTED BY VC BACKED STARTUPS & MID MARKET ORGANIZATIONS WORLDWIDE
      </p>
      <div className="trusted-by-marquee">
        <motion.div 
          className="trusted-by-track"
          animate={{ x: ['0%', '-33.333%'] }}
          transition={{ 
            duration: 25, 
            repeat: Infinity, 
            ease: 'linear',
            repeatType: 'loop'
          }}
        >
          {allCompanies.map((company, i) => (
            <span key={i} className="trusted-by-logo">
              {company}
              <span className="logo-dot">◆</span>
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

// Official Partners Section
const OfficialPartnersSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  const partners = [
    { name: 'Make', logo: '/make.png' },
    { name: 'Clay', logo: '/clay.png' },
    { name: 'Salesforce', logo: '/salesforce.png' },
    { name: 'Smartlead.ai', logo: '/smartlead.png' },
    { name: 'Instantly', logo: '/instantly.png' },
  ];

  return (
    <motion.section
      ref={ref}
      className="official-partners-section"
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <span className="section-eyebrow">Technology Stack</span>
      <h2 className="partners-title">Official Partners</h2>
      <p className="partners-subtitle">
        We leverage best-in-class tools to power your outbound engine
      </p>
      <div className="partners-grid">
        {partners.map((partner, i) => (
          <motion.div
            key={partner.name}
            className="partner-card"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 * i, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -8, scale: 1.02 }}
          >
            <div className="partner-logo-wrapper">
              <img src={partner.logo} alt={partner.name} className="partner-logo" />
            </div>
            <span className="partner-name">{partner.name}</span>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};

// Who We Are Section
const WhoWeAreSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 1, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <motion.section
      ref={ref}
      className="section who-we-are"
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
    >
      <div className="who-we-are-grid">
        <motion.div className="who-we-are-content" variants={itemVariants}>
          <span className="section-eyebrow">About Us</span>
          <h2 className="section-title">
            Who <span className="italic">We</span> Are
          </h2>
          <p className="who-we-are-description">
            Rillation Revenue is an <span className="highlight-blue">AI-first lead generation</span> company that combines{' '}
            <span className="highlight-blue">software, automation, and AI</span> to deliver booked meetings cheaper and more
            reliably than hiring a sales team.
          </p>
        </motion.div>
        
        <motion.div className="stats-stack" variants={itemVariants}>
          <motion.div 
            className="stat-card"
            whileHover={{ x: 8 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <div className="stat-value">
              <AnimatedCounter value={2.8} suffix="M" />
            </div>
            <div className="stat-label">Emails Sent This Year</div>
          </motion.div>
          
          <motion.div 
            className="stat-card"
            whileHover={{ x: 8 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <div className="stat-value">
              <AnimatedCounter value={1200} suffix="+" />
            </div>
            <div className="stat-label">Meetings Booked This Year</div>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
};

// More Than Vendor Section
const MoreThanVendorSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const cards = [
    {
      number: '01',
      title: 'An Extension of You',
      description: 'We operate as an add-on to your current operation—almost like another arm of your business.',
    },
    {
      number: '02',
      title: 'Aligned Incentives',
      description: 'Our success is tied to yours. We focus on metrics that matter: booked meetings and closed revenue.',
    },
    {
      number: '03',
      title: 'Brand Guardians',
      description: 'We protect your reputation as if it were our own. No spam, no aggressive tactics.',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 1, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <motion.section
      ref={ref}
      className="section more-than-vendor"
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
    >
      <motion.div className="section-header" variants={itemVariants}>
        <span className="section-eyebrow">Partnership</span>
        <h2 className="section-title">
          More Than A <span className="italic">Vendor</span>
        </h2>
        <p className="section-subtitle">
          We don't just send emails. We embed ourselves into your organization as a
          dedicated growth engine.
        </p>
      </motion.div>
      
      <motion.div className="bento-grid" variants={containerVariants}>
        {cards.map((card, index) => (
          <motion.div
            key={index}
            className="bento-card"
            variants={itemVariants}
            whileHover={{ y: -8 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <div className="bento-number">{card.number}</div>
            <h3>{card.title}</h3>
            <p>{card.description}</p>
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  );
};

// Why Happening Section
const WhyHappeningSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const reasons = [
    {
      number: 1,
      color: '#0C24E9',
      title: 'Inbox Saturation',
      description: 'Decision makers receive 100+ cold emails a day.',
    },
    {
      number: 2,
      color: '#0C24E9',
      title: 'Tech Barriers',
      description: 'Email providers have tightened spam filters.',
    },
    {
      number: 3,
      color: '#EB1A1A',
      title: 'Lack of Personalization',
      description: '"Spray and pray" doesn\'t work anymore.',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <motion.section
      ref={ref}
      className="section why-happening"
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
    >
      <div className="why-happening-wrapper">
        <motion.div className="why-happening-left" variants={itemVariants}>
          <span className="section-eyebrow">The Challenge</span>
          <h2 className="section-title">
            Why is this happening <span className="highlight">right now?</span>
          </h2>
          
          <div className="reasons-list">
            {reasons.map((reason, index) => (
              <motion.div
                key={index}
                className="reason-item"
                variants={itemVariants}
                whileHover={{ x: 8 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <motion.div 
                  className="reason-number"
                  style={{ backgroundColor: reason.color }}
                  whileHover={{ scale: 1.1 }}
                >
                  {reason.number}
                </motion.div>
                <div className="reason-text">
                  <h4>{reason.title}</h4>
                  <p>{reason.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
        
        <motion.div 
          className="why-happening-right"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
        >
          <div className="callout-box">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.6 }}
            >
              Only the relevant survive.
            </motion.p>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

// Old Way Broken Section
const OldWayBrokenSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const painPoints = [
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#EB1A1A" strokeWidth="2">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
          <line x1="12" y1="9" x2="12" y2="13"/>
          <line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
      ),
      title: 'Unpredictable Growth',
      description: 'Relying on referrals or "word of mouth" leaves your pipeline empty for weeks.',
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#EB1A1A" strokeWidth="2">
          <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>
        </svg>
      ),
      title: 'Ad Burnout',
      description: 'Paid ads are getting more expensive and less effective for B2B every single day.',
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#EB1A1A" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/>
          <line x1="15" y1="9" x2="9" y2="15"/>
          <line x1="9" y1="9" x2="15" y2="15"/>
        </svg>
      ),
      title: 'Manual Prospecting Hell',
      description: 'Wasting 20+ hours a week manually sending emails that land in spam.',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 1, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <motion.section
      ref={ref}
      className="section old-way-broken"
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
    >
      <motion.div className="section-header" variants={itemVariants}>
        <span className="section-eyebrow">The Problem</span>
        <h2 className="section-title">
          The "Old Way" is <span className="highlight-red">Broken</span>
        </h2>
      </motion.div>
      
      <motion.div className="pain-cards" variants={containerVariants}>
        {painPoints.map((point, index) => (
          <motion.div
            key={index}
            className="pain-card"
            variants={itemVariants}
            whileHover={{ y: -8 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <div className="pain-icon">{point.icon}</div>
            <h3>{point.title}</h3>
            <p>{point.description}</p>
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  );
};

// Future State Section
const FutureStateSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const outcomes = [
    {
      icon: '📈',
      title: 'Predictable Pipeline',
      description: 'Qualified opportunities flowing in every single month—not hoping for referrals.',
    },
    {
      icon: '🎯',
      title: 'AEs With Full Calendars',
      description: 'Your closers closing, not prospecting. SQLs ready to convert, not "more leads."',
    },
    {
      icon: '🔄',
      title: 'Compounding GTM Motion',
      description: 'Data, learning, and assets that build on each other—no quarterly resets.',
    },
    {
      icon: '📊',
      title: 'Clear Outbound Intelligence',
      description: 'Know exactly what copy, segments, and channels are driving results.',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 1, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <motion.section
      ref={ref}
      className="section future-state"
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
    >
      <motion.div className="section-header" variants={itemVariants}>
        <motion.div className="future-badge" variants={itemVariants}>
          The Way Out
        </motion.div>
        <h2 className="section-title">
          What <span className="highlight">Winners</span> Look Like
        </h2>
        <p className="section-subtitle">
          This is what the top 5–10% of operators have figured out.
          This is where you're headed.
        </p>
      </motion.div>
      
      <motion.div className="outcomes-grid" variants={containerVariants}>
        {outcomes.map((outcome, index) => (
          <motion.div
            key={index}
            className="outcome-card"
            variants={itemVariants}
            whileHover={{ y: -4 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <div className="outcome-icon">{outcome.icon}</div>
            <div className="outcome-content">
              <h3>{outcome.title}</h3>
              <p>{outcome.description}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  );
};

// How Winners Section
const HowWinnersSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const pillars = [
    {
      number: '01',
      title: 'Right Accounts & Signals',
      description: 'Sophisticated qualification and intent modeling. We find companies actually in-market, not just companies that "fit your ICP."',
    },
    {
      number: '02',
      title: 'Right People & Messaging',
      description: 'Persona-specific, outcome-focused copy. Every message speaks to what they actually care about—not generic pitches.',
    },
    {
      number: '03',
      title: 'Right Systems & Execution',
      description: 'Infrastructure built for experimentation and iteration. Continuous learning, not one-shot campaigns.',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 1, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <motion.section
      ref={ref}
      className="section how-winners"
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
    >
      <motion.div className="section-header" variants={itemVariants}>
        <span className="section-eyebrow">The Framework</span>
        <h2 className="section-title">
          How Winners <span className="highlight">Get There</span>
        </h2>
        <p className="section-subtitle">
          Whenever we see clients cross 50+ SQLs/month predictably, these 3 things are in place.
        </p>
      </motion.div>
      
      <motion.div className="pillars-timeline" variants={containerVariants}>
        {pillars.map((pillar, index) => (
          <motion.div
            key={index}
            className="pillar-card"
            variants={itemVariants}
          >
            <div className="pillar-number-wrapper">
              <motion.div 
                className="pillar-number"
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                {pillar.number}
              </motion.div>
            </div>
            <div className="pillar-content">
              <h3>{pillar.title}</h3>
              <p>{pillar.description}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  );
};

// Calendly Embed Section
const CalendlySection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  useEffect(() => {
    // Load Calendly widget when component mounts
    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    document.body.appendChild(script);
    
    return () => {
      // Cleanup if needed
    };
  }, []);

  return (
    <motion.section
      ref={ref}
      className="calendly-section"
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
      transition={{ duration: 1 }}
    >
      <div className="calendly-content">
        <motion.div 
          className="calendly-text"
          initial={{ opacity: 0, x: -40 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="calendly-eyebrow">Pilot Program</span>
          <h2>
            Ready to <span className="italic">scale?</span>
          </h2>
          <p className="calendly-subtitle">
            Book a call to see if you're a fit for our pilot program. Limited spots available.
          </p>
          <div className="calendly-features">
            <div className="calendly-feature">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              <span>15-minute intro call</span>
            </div>
            <div className="calendly-feature">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              <span>No commitment required</span>
            </div>
            <div className="calendly-feature">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              <span>Learn if we're a fit</span>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          className="calendly-embed-wrapper"
          initial={{ opacity: 0, x: 40 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <div 
            className="calendly-inline-widget" 
            data-url="https://calendly.com/ziad_khateeb/rillation-intro-call?hide_gdpr_banner=1&background_color=1a1a2e&text_color=ffffff&primary_color=0c24e9"
            style={{ minWidth: '320px', height: '700px', width: '100%' }}
          />
        </motion.div>
      </div>
    </motion.section>
  );
};

// Footer
const Footer = () => {
  return (
    <footer className="footer">
      <p>© {new Date().getFullYear()} Rillation Revenue. All rights reserved.</p>
    </footer>
  );
};

// Main App
function App() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  return (
    <>
      {/* Progress bar */}
      <motion.div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '2px',
          background: '#0C24E9',
          transformOrigin: '0%',
          scaleX,
          zIndex: 9999,
        }}
      />

      {/* Navigation */}
      <motion.nav
        className="nav"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      >
        <Logo size={45} />
        <ul className="nav-links">
          {['Services', 'Process', 'Results', 'About'].map((item, i) => (
            <motion.li
              key={item}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1, duration: 0.6 }}
            >
              <a href={`#${item.toLowerCase()}`}>{item}</a>
            </motion.li>
          ))}
        </ul>
        <motion.a
          href="https://calendly.com/ziad_khateeb/rillation-intro-call"
          target="_blank"
          rel="noopener noreferrer"
          className="nav-cta"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Launch Your Pilot Campaign
        </motion.a>
      </motion.nav>

      {/* First Page Container - Hero + Trusted By */}
      <div className="first-page-container">
        {/* Floating dots animation on both sides */}
        <FloatingDots side="left" />
        <FloatingDots side="right" />
        
        {/* Hero Section - Centered */}
        <section className="hero">
          <h1 className="hero-title">
            <div style={{ overflow: 'hidden' }}>
              <TextReveal delay={0.4}>
                Predictable Revenue <span className="italic">On Autopilot.</span>
              </TextReveal>
            </div>
          </h1>

          <motion.p 
            className="hero-subtitle"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            We build and manage <strong>AI-Driven Outbound Systems</strong> that deliver ready-to-close sales opportunities every single week.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <MagneticButton 
              className="hero-cta"
              href="https://calendly.com/ziad_khateeb/rillation-intro-call"
            >
              <span>Accepting New Partners for 2026</span>
              <svg className="arrow" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </MagneticButton>
          </motion.div>
        </section>

        {/* Trusted By Section */}
        <TrustedBySection />
      </div>

      {/* Content Sections */}
      <WhoWeAreSection />
      <OfficialPartnersSection />
      <MoreThanVendorSection />
      <WhyHappeningSection />
      <OldWayBrokenSection />
      <FutureStateSection />
      <HowWinnersSection />
      <CalendlySection />
      <Footer />
    </>
  );
}

export default App;
