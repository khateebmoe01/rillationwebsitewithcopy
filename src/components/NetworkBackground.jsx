import { useEffect, useState, useRef, useMemo, useCallback, memo } from 'react';
import { useReducedMotion, useAnimationFrame } from 'framer-motion';
import './NetworkBackground.css';

// Generate initial node data - memoized outside component
const generateNodes = (count, width, height) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * width,
    y: Math.random() * height,
    // Random velocity for organic movement
    vx: (Math.random() - 0.5) * 0.3,
    vy: (Math.random() - 0.5) * 0.3,
    // Random properties for visual variety
    size: Math.random() * 4 + 3, // 3-7px
    opacity: Math.random() * 0.3 + 0.2, // 0.2-0.5
    // Pulse phase offset for varied pulsing
    pulseOffset: Math.random() * Math.PI * 2,
    // Color variant (blue or green)
    colorVariant: Math.random() > 0.7 ? 'green' : 'blue',
  }));
};

// Calculate distance between two nodes
const getDistance = (node1, node2) => {
  const dx = node1.x - node2.x;
  const dy = node1.y - node2.y;
  return Math.sqrt(dx * dx + dy * dy);
};

// Get connections between nearby nodes
const getConnections = (nodes, maxDistance) => {
  const connections = [];
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const distance = getDistance(nodes[i], nodes[j]);
      if (distance < maxDistance) {
        // Opacity based on distance (closer = more visible)
        const opacity = Math.max(0, 1 - distance / maxDistance) * 0.25;
        connections.push({
          id: `${i}-${j}`,
          x1: nodes[i].x,
          y1: nodes[i].y,
          x2: nodes[j].x,
          y2: nodes[j].y,
          opacity,
          // Determine color based on connected nodes
          colorVariant: nodes[i].colorVariant === 'green' || nodes[j].colorVariant === 'green' ? 'green' : 'blue',
        });
      }
    }
  }
  return connections;
};

const NetworkBackground = memo(() => {
  const prefersReducedMotion = useReducedMotion();
  const containerRef = useRef(null);
  const nodesRef = useRef([]);
  const timeRef = useRef(0);
  const frameCountRef = useRef(0);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [renderState, setRenderState] = useState({ nodes: [], connections: [], time: 0 });
  
  // Configuration - memoized
  const nodeCount = useMemo(() => {
    if (dimensions.width < 480) return 15;
    if (dimensions.width < 768) return 25;
    if (dimensions.width < 1024) return 35;
    return 45;
  }, [dimensions.width]);
  
  const connectionDistance = useMemo(() => {
    if (dimensions.width < 768) return 100;
    return 140;
  }, [dimensions.width]);

  // Initialize dimensions with debounced resize handler
  useEffect(() => {
    let resizeTimeout;
    
    const updateDimensions = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        setDimensions({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      }, 100);
    };
    
    // Initial set without debounce
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    });
    
    window.addEventListener('resize', updateDimensions);
    return () => {
      window.removeEventListener('resize', updateDimensions);
      clearTimeout(resizeTimeout);
    };
  }, []);

  // Initialize nodes when dimensions change
  useEffect(() => {
    if (dimensions.width > 0 && dimensions.height > 0) {
      nodesRef.current = generateNodes(nodeCount, dimensions.width, dimensions.height);
      setRenderState({
        nodes: nodesRef.current,
        connections: getConnections(nodesRef.current, connectionDistance),
        time: 0,
      });
    }
  }, [dimensions.width, dimensions.height, nodeCount, connectionDistance]);

  // Animation frame for node movement - using refs for performance
  const updateNodes = useCallback(() => {
    if (prefersReducedMotion || nodesRef.current.length === 0) return;
    
    frameCountRef.current += 1;
    timeRef.current += 0.016; // ~60fps
    
    // Update node positions
    nodesRef.current = nodesRef.current.map(node => {
      let newX = node.x + node.vx;
      let newY = node.y + node.vy;
      let newVx = node.vx;
      let newVy = node.vy;
      
      // Bounce off edges with some padding
      const padding = 50;
      if (newX < padding || newX > dimensions.width - padding) {
        newVx = -newVx;
        newX = Math.max(padding, Math.min(dimensions.width - padding, newX));
      }
      if (newY < padding || newY > dimensions.height - padding) {
        newVy = -newVy;
        newY = Math.max(padding, Math.min(dimensions.height - padding, newY));
      }
      
      // Add slight random perturbation for organic movement (less frequent)
      if (frameCountRef.current % 10 === 0) {
        newVx += (Math.random() - 0.5) * 0.015;
        newVy += (Math.random() - 0.5) * 0.015;
      }
      
      // Limit velocity
      const maxVelocity = 0.35;
      newVx = Math.max(-maxVelocity, Math.min(maxVelocity, newVx));
      newVy = Math.max(-maxVelocity, Math.min(maxVelocity, newVy));
      
      return {
        ...node,
        x: newX,
        y: newY,
        vx: newVx,
        vy: newVy,
      };
    });
    
    // Only recalculate connections every 3rd frame for performance
    const newConnections = frameCountRef.current % 3 === 0
      ? getConnections(nodesRef.current, connectionDistance)
      : renderState.connections;
    
    setRenderState({
      nodes: [...nodesRef.current],
      connections: newConnections,
      time: timeRef.current,
    });
  }, [dimensions.width, dimensions.height, prefersReducedMotion, connectionDistance, renderState.connections]);

  // Animation loop
  useAnimationFrame(updateNodes);

  // Extract state for rendering
  const { nodes, connections, time } = renderState;

  // Don't render if dimensions not set
  if (dimensions.width === 0 || dimensions.height === 0) {
    return null;
  }

  return (
    <div ref={containerRef} className="network-background">
      <svg 
        className="network-svg"
        width={dimensions.width}
        height={dimensions.height}
        viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
        aria-hidden="true"
      >
        {/* Gradient definitions */}
        <defs>
          <radialGradient id="nodeGlowBlue" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(12, 36, 233, 0.8)" />
            <stop offset="100%" stopColor="rgba(12, 36, 233, 0)" />
          </radialGradient>
          <radialGradient id="nodeGlowGreen" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(45, 122, 94, 0.8)" />
            <stop offset="100%" stopColor="rgba(45, 122, 94, 0)" />
          </radialGradient>
          <filter id="networkGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Connection lines */}
        <g className="network-connections">
          {connections.map(conn => (
            <line
              key={conn.id}
              x1={conn.x1}
              y1={conn.y1}
              x2={conn.x2}
              y2={conn.y2}
              className={`network-line network-line-${conn.colorVariant}`}
              style={{ 
                opacity: conn.opacity,
              }}
            />
          ))}
        </g>
        
        {/* Nodes */}
        <g className="network-nodes">
          {nodes.map(node => {
            // Calculate pulse effect
            const pulseScale = prefersReducedMotion 
              ? 1 
              : 1 + Math.sin(time * 2 + node.pulseOffset) * 0.25;
            const pulseOpacity = node.opacity * (0.85 + Math.sin(time * 1.5 + node.pulseOffset) * 0.15);
            
            return (
              <g key={node.id}>
                {/* Glow effect */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={node.size * 3 * pulseScale}
                  className={`network-node-glow network-node-glow-${node.colorVariant}`}
                  style={{ opacity: pulseOpacity * 0.25 }}
                />
                {/* Main node */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={node.size * pulseScale}
                  className={`network-node network-node-${node.colorVariant}`}
                  style={{ opacity: pulseOpacity }}
                  filter="url(#networkGlow)"
                />
              </g>
            );
          })}
        </g>
      </svg>
      
      {/* Subtle gradient overlay for depth */}
      <div className="network-gradient-overlay" />
    </div>
  );
});

// Display name for debugging
NetworkBackground.displayName = 'NetworkBackground';

export default NetworkBackground;
