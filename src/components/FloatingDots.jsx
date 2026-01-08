import { useMemo } from 'react';
import './FloatingDots.css';

const FloatingDots = ({ side = 'left' }) => {
  // Generate random dots with varying properties for depth and movement
  const dots = useMemo(() => {
    const dotCount = 25;
    return Array.from({ length: dotCount }, (_, i) => {
      const size = Math.random() * 6 + 2; // 2-8px
      const x = Math.random() * 100; // 0-100%
      const y = Math.random() * 100; // Start position 0-100%
      const duration = Math.random() * 15 + 10; // 10-25s for slow, ethereal movement
      const delay = Math.random() * duration; // Random start point in animation
      const opacity = Math.random() * 0.4 + 0.15; // 0.15-0.55 opacity
      const direction = i % 2 === 0 ? 'up' : 'down'; // Alternate directions
      
      return {
        id: i,
        size,
        x,
        y,
        duration,
        delay,
        opacity,
        direction,
      };
    });
  }, []);

  return (
    <div className={`floating-dots-container floating-dots-${side}`}>
      {dots.map((dot) => (
        <div
          key={dot.id}
          className={`floating-dot floating-dot-${dot.direction}`}
          style={{
            '--x': `${dot.x}%`,
            '--y': `${dot.y}%`,
            '--size': `${dot.size}px`,
            '--duration': `${dot.duration}s`,
            '--delay': `${dot.delay}s`,
            '--opacity': dot.opacity,
          }}
        />
      ))}
      {/* Grid overlay for tech/CIA feel */}
      <div className="floating-dots-grid" />
    </div>
  );
};

export default FloatingDots;
