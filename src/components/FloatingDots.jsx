const FloatingDots = ({ side = 'left' }) => {
  const containerStyle = {
    position: 'absolute',
    top: 0,
    bottom: 0,
    [side]: 0,
    width: '300px',
    backgroundColor: 'rgba(255, 0, 0, 0.5)',
    pointerEvents: 'none',
    zIndex: 100,
  };

  return (
    <div style={containerStyle}>
      <div style={{
        position: 'absolute',
        top: '100px',
        left: '50px',
        width: '50px',
        height: '50px',
        backgroundColor: 'blue',
        borderRadius: '50%',
      }} />
    </div>
  );
};

export default FloatingDots;
