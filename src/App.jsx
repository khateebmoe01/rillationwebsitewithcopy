import { motion, useInView, useMotionValue, useTransform, animate, useScroll, useSpring } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import Logo from './components/Logo';
import FloatingDots from './components/FloatingDots';
import NetworkBackground from './components/NetworkBackground';
import './App.css';

// ============================================
// REUSABLE ANIMATION VARIANTS
// ============================================

// Fade in + slide up animation
const fadeInUp = {
  hidden: { 
    opacity: 0, 
    y: 40 
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.8, 
      ease: [0.16, 1, 0.3, 1] 
    }
  }
};

// Fade in + scale animation
const fadeInScale = {
  hidden: { 
    opacity: 0, 
    scale: 0.9 
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { 
      duration: 0.6, 
      ease: [0.16, 1, 0.3, 1] 
    }
  }
};

// Slide in from left
const slideInLeft = {
  hidden: { 
    opacity: 0, 
    x: -60 
  },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { 
      duration: 0.8, 
      ease: [0.16, 1, 0.3, 1] 
    }
  }
};

// Slide in from right
const slideInRight = {
  hidden: { 
    opacity: 0, 
    x: 60 
  },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { 
      duration: 0.8, 
      ease: [0.16, 1, 0.3, 1] 
    }
  }
};

// Stagger container for children animations
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

// Stagger container with faster stagger
const staggerContainerFast = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.05
    }
  }
};

// Scale + rotate animation for cards
const scaleRotate = {
  hidden: { 
    opacity: 0, 
    scale: 0.8,
    rotate: -5
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    rotate: 0,
    transition: { 
      type: 'spring',
      stiffness: 100,
      damping: 15
    }
  }
};

// Bounce in animation
const bounceIn = {
  hidden: { 
    opacity: 0, 
    scale: 0.3 
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { 
      type: 'spring',
      stiffness: 300,
      damping: 20
    }
  }
};

// Slide up with fade
const slideUpFade = {
  hidden: { 
    opacity: 0, 
    y: 80 
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 1, 
      ease: [0.16, 1, 0.3, 1] 
    }
  }
};

// ============================================
// ANIMATED COMPONENTS
// ============================================

// Parallax Section Wrapper
const ParallaxSection = ({ children, className = '', offset = 50 }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [offset, -offset]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.8, 1, 1, 0.8]);

  return (
    <motion.div 
      ref={ref} 
      className={`section-wrapper ${className}`}
      style={{ y, opacity }}
    >
      {children}
    </motion.div>
  );
};

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
    const handleClick = (e) => {
      if (href.startsWith('#')) {
        e.preventDefault();
        const element = document.querySelector(href);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
      if (onClick) {
        onClick(e);
      }
    };

    return (
      <motion.a
        ref={ref}
        href={href}
        target={href.startsWith('#') ? undefined : '_blank'}
        rel={href.startsWith('#') ? undefined : 'noopener noreferrer'}
        className={className}
        style={{ x: springX, y: springY }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
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

// Official Partners Section
const OfficialPartnersSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-30px' });

  const partners = [
    { name: 'Make', logo: '/make.png' },
    { name: 'Clay', logo: '/clay.png' },
    { name: 'Salesforce', logo: '/salesforce.png' },
    { name: 'Smartlead.ai', logo: '/smartlead.png' },
    { name: 'Instantly', logo: '/instantly.png' },
  ];

  // Container animation variants with stagger
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  // Individual card animation variants - scale + rotate effect
  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.8,
      rotate: -3,
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      rotate: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 12,
      },
    },
  };

  return (
    <motion.section
      ref={ref}
      className="official-partners-section"
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.h2 
        className="partners-title"
        initial={{ opacity: 0, y: 25, scale: 0.95 }}
        animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
        transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
      >
        Official Partners
      </motion.h2>
      <motion.div 
        className="partners-grid"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
      >
        {partners.map((partner, index) => (
          <motion.div
            key={partner.name}
            className="partner-card"
            variants={cardVariants}
          >
            <div className="partner-logo-wrapper">
              <img 
                src={partner.logo} 
                alt={partner.name} 
                className={`partner-logo ${partner.name === 'Make' ? 'partner-logo-make' : ''}`}
              />
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  );
};

// Who We Are Section
const WhoWeAreSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  // Content slides in from left
  const contentVariants = {
    hidden: { opacity: 0, x: -60 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
    },
  };

  // Stats container with stagger
  const statsContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { 
        staggerChildren: 0.2,
        delayChildren: 0.3
      },
    },
  };

  // Individual stat card animations
  const statCardVariants = {
    hidden: { opacity: 0, x: 40, scale: 0.95 },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: { 
        type: 'spring',
        stiffness: 100,
        damping: 15
      },
    },
  };

  return (
    <motion.section
      ref={ref}
      className="section who-we-are"
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
      transition={{ duration: 0.6 }}
    >
      <div className="who-we-are-grid">
        <motion.div 
          className="who-we-are-content" 
          variants={contentVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          <motion.h2 
            className="section-title"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            Who <span className="italic">We</span> Are
          </motion.h2>
          <motion.p 
            className="who-we-are-description"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            Rillation Revenue is an <span className="highlight-blue">AI-first lead generation</span> company that combines{' '}
            <span className="highlight-blue">software, automation, and AI</span> to deliver booked meetings cheaper and more
            reliably than hiring a sales team.
          </motion.p>
        </motion.div>
        
        <motion.div 
          className="stats-stack" 
          variants={statsContainerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          <motion.div 
            className="stat-card"
            variants={statCardVariants}
            whileHover={{ 
              x: 12, 
              scale: 1.02,
              transition: { type: 'spring', stiffness: 400, damping: 20 }
            }}
          >
            <div className="stat-value">
              <AnimatedCounter value={2.8} suffix="M" />
            </div>
            <div className="stat-label">Emails Sent This Year</div>
          </motion.div>
          
          <motion.div 
            className="stat-card"
            variants={statCardVariants}
            whileHover={{ 
              x: 12, 
              scale: 1.02,
              transition: { type: 'spring', stiffness: 400, damping: 20 }
            }}
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
      description: 'We operate as an add-on to your current operation - almost like another arm of your business.',
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

  // Header slides in from right
  const headerVariants = {
    hidden: { opacity: 0, x: 40 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    },
  };

  // Bento grid container with stagger
  const gridContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { 
        staggerChildren: 0.15,
        delayChildren: 0.2
      },
    },
  };

  // Bento card with scale + 3D effect
  const bentoCardVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.9,
      rotateX: 10
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      rotateX: 0,
      transition: { 
        type: 'spring',
        stiffness: 100,
        damping: 15
      },
    },
  };

  return (
    <motion.section
      ref={ref}
      className="section more-than-vendor"
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
      transition={{ duration: 0.6 }}
      style={{ perspective: '1000px' }}
    >
      <motion.div 
        className="section-header" 
        variants={headerVariants}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
      >
        <motion.span 
          className="section-eyebrow section-eyebrow-partnership"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Partnership
        </motion.span>
        <motion.h2 
          className="section-title"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          More Than A <span className="italic">Vendor</span>
        </motion.h2>
        <motion.p 
          className="section-subtitle"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          We don't just send emails. We embed ourselves into your organization as a
          dedicated growth engine.
        </motion.p>
      </motion.div>
      
      <motion.div 
        className="bento-grid" 
        variants={gridContainerVariants}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
      >
        {cards.map((card, index) => (
          <motion.div
            key={index}
            className="bento-card"
            variants={bentoCardVariants}
            whileHover={{ 
              y: -12, 
              scale: 1.03,
              rotateY: 3,
              rotateX: -3,
              transition: { type: 'spring', stiffness: 400, damping: 20 }
            }}
            style={{ transformStyle: 'preserve-3d' }}
          >
            <motion.div 
              className="bento-number"
              initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
              animate={isInView ? { opacity: 1, scale: 1, rotate: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.4 + index * 0.1, type: 'spring' }}
            >
              {card.number}
            </motion.div>
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
      color: '#EB1A1A',
      title: 'Inbox Saturation',
      description: 'Decision makers receive 100+ cold emails a day.',
    },
    {
      number: 2,
      color: '#EB1A1A',
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

  // Left side slides in from left
  const leftSideVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    },
  };

  // Reason items with stagger
  const reasonsContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { 
        staggerChildren: 0.12,
        delayChildren: 0.3
      },
    },
  };

  // Individual reason items slide in from left
  const reasonItemVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { 
        type: 'spring',
        stiffness: 100,
        damping: 15
      },
    },
  };

  // Number bounce in
  const numberVariants = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { 
        type: 'spring',
        stiffness: 300,
        damping: 15
      },
    },
  };

  return (
    <motion.section
      ref={ref}
      className="section why-happening"
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
      transition={{ duration: 0.6 }}
    >
      <div className="why-happening-wrapper">
        <motion.div 
          className="why-happening-left" 
          variants={leftSideVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          <motion.span 
            className="section-eyebrow"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            The Challenge
          </motion.span>
          <motion.h2 
            className="section-title"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            Why is this happening <span className="highlight">right now?</span>
          </motion.h2>
          
          <motion.div 
            className="reasons-list"
            variants={reasonsContainerVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
          >
            {reasons.map((reason, index) => (
              <motion.div
                key={index}
                className="reason-item"
                variants={reasonItemVariants}
                whileHover={{ 
                  x: 12,
                  transition: { type: 'spring', stiffness: 400, damping: 20 }
                }}
              >
                <motion.div 
                  className="reason-number"
                  variants={numberVariants}
                  whileHover={{ 
                    scale: 1.15,
                    rotate: 5,
                    transition: { type: 'spring', stiffness: 400 }
                  }}
                >
                  {reason.number}
                </motion.div>
                <div className="reason-text">
                  <h4>{reason.title}</h4>
                  <p>{reason.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="why-happening-right"
          initial={{ opacity: 0, x: 60, scale: 0.9 }}
          animate={isInView ? { opacity: 1, x: 0, scale: 1 } : {}}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
        >
          <motion.div 
            className="callout-box"
            whileHover={{ 
              scale: 1.02,
              transition: { type: 'spring', stiffness: 300 }
            }}
          >
            <motion.p
              initial={{ opacity: 0, y: 25 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              Only the relevant survive.
            </motion.p>
          </motion.div>
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

  // Pain cards container with stagger
  const painCardsContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { 
        staggerChildren: 0.15,
        delayChildren: 0.3
      },
    },
  };

  // Pain card slide up with scale
  const painCardVariants = {
    hidden: { 
      opacity: 0, 
      y: 80,
      scale: 0.9
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { 
        type: 'spring',
        stiffness: 100,
        damping: 15
      },
    },
  };

  // Icon animation with rotation
  const iconVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0,
      rotate: -180
    },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: { 
        type: 'spring',
        stiffness: 200,
        damping: 15,
        delay: 0.2
      },
    },
  };

  return (
    <motion.section
      ref={ref}
      className="section old-way-broken"
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
      transition={{ duration: 0.6 }}
    >
      <motion.div 
        className="section-header"
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.span 
          className="section-eyebrow"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          The Problem
        </motion.span>
        <motion.h2 
          className="section-title"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          The "Old Way" is <span className="highlight-red">Broken</span>
        </motion.h2>
      </motion.div>
      
      <motion.div 
        className="pain-cards" 
        variants={painCardsContainerVariants}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
      >
        {painPoints.map((point, index) => (
          <motion.div
            key={index}
            className="pain-card"
            variants={painCardVariants}
            whileHover={{ 
              y: -12, 
              scale: 1.03,
              transition: { type: 'spring', stiffness: 400, damping: 20 }
            }}
          >
            <motion.div 
              className="pain-icon"
              variants={iconVariants}
              whileHover={{ 
                rotate: 10, 
                scale: 1.2,
                transition: { type: 'spring', stiffness: 400 }
              }}
            >
              {point.icon}
            </motion.div>
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
      description: 'Qualified opportunities flowing in every single month - not hoping for referrals.',
    },
    {
      icon: '🎯',
      title: 'AEs With Full Calendars',
      description: 'Your closers closing, not prospecting. SQLs ready to convert, not "more leads."',
    },
    {
      icon: '🔄',
      title: 'Compounding GTM Motion',
      description: 'Data, learning, and assets that build on each other - no quarterly resets.',
    },
    {
      icon: '📊',
      title: 'Clear Outbound Intelligence',
      description: 'Know exactly what copy, segments, and channels are driving results.',
    },
  ];

  // Outcomes grid with stagger cascade
  const outcomeGridVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.3
      },
    },
  };

  // Outcome card with scale + bounce
  const outcomeCardVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.85
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { 
        type: 'spring',
        stiffness: 150,
        damping: 15
      },
    },
  };

  // Icon bounce in
  const iconBounceVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.3
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { 
        type: 'spring',
        stiffness: 400,
        damping: 15
      },
    },
  };

  return (
    <motion.section
      ref={ref}
      className="section future-state"
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
      transition={{ duration: 0.6 }}
    >
      <motion.div 
        className="section-header"
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.div 
          className="future-badge"
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1, type: 'spring', stiffness: 200 }}
        >
          The Way Out
        </motion.div>
        <motion.h2 
          className="section-title"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          What <span className="highlight">Winners</span> Look Like
        </motion.h2>
        <motion.p 
          className="section-subtitle"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          This is what the top 5–10% of operators have figured out.
          This is where you're headed.
        </motion.p>
      </motion.div>
      
      <motion.div 
        className="outcomes-grid" 
        variants={outcomeGridVariants}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
      >
        {outcomes.map((outcome, index) => (
          <motion.div
            key={index}
            className="outcome-card"
            variants={outcomeCardVariants}
            whileHover={{ 
              y: -8, 
              scale: 1.03,
              transition: { type: 'spring', stiffness: 400, damping: 20 }
            }}
          >
            <motion.div 
              className="outcome-icon"
              variants={iconBounceVariants}
              whileHover={{ 
                scale: 1.2,
                rotate: 10,
                transition: { type: 'spring', stiffness: 400 }
              }}
            >
              {outcome.icon}
            </motion.div>
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
      description: 'Persona-specific, outcome-focused copy. Every message speaks to what they actually care about - not generic pitches.',
    },
    {
      number: '03',
      title: 'Right Systems & Execution',
      description: 'Infrastructure built for experimentation and iteration. Continuous learning, not one-shot campaigns.',
    },
  ];

  // Pillars timeline container with stagger
  const pillarsContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { 
        staggerChildren: 0.25,
        delayChildren: 0.3
      },
    },
  };

  // Pillar card slides in from left
  const pillarCardVariants = {
    hidden: { 
      opacity: 0, 
      x: -60
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: { 
        type: 'spring',
        stiffness: 100,
        damping: 15
      },
    },
  };

  // Number with scale + rotation animation
  const numberVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.5,
      rotate: -20
    },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: { 
        type: 'spring',
        stiffness: 200,
        damping: 15
      },
    },
  };

  return (
    <motion.section
      ref={ref}
      className="section how-winners"
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
      transition={{ duration: 0.6 }}
    >
      <motion.div 
        className="section-header"
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.span 
          className="section-eyebrow"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          The Framework
        </motion.span>
        <motion.h2 
          className="section-title"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          How Winners <span className="highlight">Get There</span>
        </motion.h2>
        <motion.p 
          className="section-subtitle"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          Whenever we see clients cross 50+ SQLs/month predictably, these 3 things are in place.
        </motion.p>
      </motion.div>
      
      <motion.div 
        className="pillars-timeline" 
        variants={pillarsContainerVariants}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
      >
        {pillars.map((pillar, index) => (
          <motion.div
            key={index}
            className="pillar-card"
            variants={pillarCardVariants}
            whileHover={{ 
              x: 10,
              transition: { type: 'spring', stiffness: 400, damping: 20 }
            }}
          >
            <div className="pillar-number-wrapper">
              <motion.div 
                className="pillar-number"
                variants={numberVariants}
                whileHover={{ 
                  scale: 1.1,
                  rotate: 5,
                  transition: { type: 'spring', stiffness: 400 }
                }}
              >
                {pillar.number}
              </motion.div>
            </div>
            <motion.div 
              className="pillar-content"
              initial={{ opacity: 0, x: 20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 + index * 0.15 }}
            >
              <h3>{pillar.title}</h3>
              <p>{pillar.description}</p>
            </motion.div>
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  );
};

// Magnetic Booking Section - Creative and practical booking interface
const RealmDoorSection = () => {
  const ref = useRef(null);
  const containerRef = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [isHovered, setIsHovered] = useState(false);

  // Generate floating particles/elements
  const particles = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    size: Math.random() * 8 + 4,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 2,
    duration: Math.random() * 3 + 2,
  }));

  const handleClick = (e) => {
    e.preventDefault();
    const calendlySection = document.getElementById('calendly');
    if (calendlySection) {
      calendlySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <motion.section
      ref={ref}
      id="calendly"
      className="booking-section"
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="booking-container" ref={containerRef}>
        {/* Background gradient circles - creating depth */}
        <motion.div 
          className="booking-background"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={isInView ? { scale: 1, opacity: 1 } : {}}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Large outer ring */}
          <motion.div
            className="booking-ring booking-ring-1"
            animate={isInView ? { rotate: 360 } : { rotate: 0 }}
            transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
            style={{ scale: isHovered ? 1.1 : 1 }}
          />
          <motion.div
            className="booking-ring booking-ring-2"
            animate={isInView ? { rotate: -360 } : { rotate: 0 }}
            transition={{ duration: 35, repeat: Infinity, ease: 'linear' }}
            style={{ scale: isHovered ? 1.15 : 1 }}
          />
          <motion.div
            className="booking-ring booking-ring-3"
            animate={isInView ? { rotate: 360 } : { rotate: 0 }}
            transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
            style={{ scale: isHovered ? 1.2 : 1 }}
          />
        </motion.div>

        {/* Floating particles */}
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="booking-particle"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: particle.size,
              height: particle.size,
            }}
            animate={isInView ? {
              y: [0, -30, 0],
              x: [0, Math.random() * 40 - 20, 0],
              opacity: [0.3, 0.6, 0.3],
              scale: [1, 1.2, 1],
            } : {}}
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}

        {/* Central booking button - magnetic effect */}
        <motion.div
          className="booking-button-wrapper"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={handleClick}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Glow effect */}
          <motion.div
            className="booking-glow"
            animate={{
              scale: isHovered ? [1, 1.2, 1] : [1, 1.1, 1],
              opacity: isHovered ? [0.4, 0.6, 0.4] : [0.2, 0.3, 0.2],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />

          {/* Main button */}
          <motion.button
            className="booking-button"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={isInView ? { scale: 1, opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.span
              className="booking-button-text"
              animate={isHovered ? { x: [0, 3, 0] } : {}}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              Book Your Call
            </motion.span>
            <motion.svg
              className="booking-arrow"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              animate={isHovered ? { x: [0, 5, 0] } : { x: 0 }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </motion.svg>
          </motion.button>

          {/* Orbiting elements */}
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="booking-orbit"
              style={{
                '--rotation': `${i * 120}deg`,
              }}
              animate={isInView ? { rotate: 360 } : { rotate: 0 }}
              transition={{
                duration: 15 + i * 3,
                repeat: Infinity,
                ease: 'linear',
              }}
            >
              <motion.div
                className="booking-orbit-dot"
                animate={isHovered ? { scale: [1, 1.3, 1] } : { scale: 1 }}
                transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Supporting text */}
        <motion.div
          className="booking-text"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.h2
            className="booking-headline"
            animate={isHovered ? { scale: 1.02 } : { scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            Ready to scale?
          </motion.h2>
          <motion.p
            className="booking-subtitle"
            animate={isHovered ? { opacity: 0.8 } : { opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            Let's have a quick chat about how we can help you generate 10+ ready-to-close sales opportunities per week.
          </motion.p>
        </motion.div>
      </div>
    </motion.section>
  );
};

// Footer
const Footer = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-20px' });

  return (
    <motion.footer 
      ref={ref}
      className="footer"
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.p
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        © {new Date().getFullYear()} Rillation Revenue. All rights reserved.
      </motion.p>
    </motion.footer>
  );
};

// Main App
function App() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  return (
    <>
      {/* Network Background Animation */}
      <NetworkBackground />
      
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
        <div className="nav-container">
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
            href="#calendly"
            className="nav-cta"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('calendly')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Launch Your Pilot Campaign
          </motion.a>
        </div>
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
            AI-Driven Outbound Systems that deliver ready-to-close sales opportunities every single week.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <MagneticButton 
              className="hero-cta"
              href="#calendly"
            >
              <span className="hero-cta-text">Accepting New Partners for 2026</span>
              <svg className="arrow" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </MagneticButton>
          </motion.div>
        </section>

        {/* Official Partners - Visible on page load */}
        <OfficialPartnersSection />
      </div>

      {/* Content Sections with Parallax */}
      <ParallaxSection offset={30}>
        <WhoWeAreSection />
      </ParallaxSection>
      <ParallaxSection offset={25}>
        <MoreThanVendorSection />
      </ParallaxSection>
      <ParallaxSection offset={35}>
        <WhyHappeningSection />
      </ParallaxSection>
      <ParallaxSection offset={30}>
        <OldWayBrokenSection />
      </ParallaxSection>
      <ParallaxSection offset={25}>
        <FutureStateSection />
      </ParallaxSection>
      <ParallaxSection offset={30}>
        <HowWinnersSection />
      </ParallaxSection>
      <ParallaxSection offset={20}>
        <RealmDoorSection />
      </ParallaxSection>
      <Footer />
    </>
  );
}

export default App;
