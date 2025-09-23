import React from 'react';
import { motion } from 'framer-motion';

const MotionWrapper = ({ children }) => (
  <motion.div
    variants={{
      hidden: { opacity: 0 },
      show: {
        opacity: 1,
        transition: {
          staggerChildren: 0.25,
        },
      },
    }}
    initial="hidden"
    animate="show"
    className="mr-5 grid grid-cols-1 overflow-y-auto hide-scrollbar"
  >
    {children}
  </motion.div>
);

export default MotionWrapper;
