import { motion } from 'framer-motion';

const Logo = ({ size = 45, className = '' }) => {
  return (
    <motion.div
      className={`logo-container ${className}`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
      whileHover={{ scale: 1.02 }}
    >
      <motion.img
        src="/rrlogo.png"
        alt="Rillation Revenue"
        style={{
          height: `${size}px`,
          width: 'auto',
          objectFit: 'contain',
        }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      />
    </motion.div>
  );
};

export default Logo;
