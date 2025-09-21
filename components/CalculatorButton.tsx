import React from 'react';
import { motion } from 'framer-motion';
import { ButtonType } from '../types';

interface CalculatorButtonProps {
  label: string;
  type: ButtonType;
  gridSpan?: number;
  onClick: (label: string, type: ButtonType) => void;
}

const CalculatorButton: React.FC<CalculatorButtonProps> = ({ label, type, gridSpan = 1, onClick }) => {
  const getButtonClasses = (): string => {
    const baseClasses = "flex items-center justify-center h-20 text-3xl font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white/50";

    if (type === ButtonType.EQUAL) {
        return `${baseClasses} col-span-${gridSpan} rounded-full bg-[--equal-bg] text-[--equal-color] font-bold text-4xl hover:bg-[--equal-bg-hover] active:bg-[--equal-bg-active]`;
    }

    const glassmorphismBase = "bg-black/20 hover:bg-black/40 active:bg-black/50 ring-1 ring-inset ring-white/10";
    
    let typeClasses = '';
    switch (type) {
      case ButtonType.NUMBER:
        typeClasses = 'text-[--number-color]';
        break;
      case ButtonType.SPECIAL:
        typeClasses = 'text-[--special-color]';
        break;
      case ButtonType.OPERATOR:
        typeClasses = 'text-[--operator-color]';
        break;
    }
    
    const shapeClasses = gridSpan === 2 ? "col-span-2 rounded-full justify-start pl-8" : "rounded-full aspect-square";

    return `${baseClasses} ${glassmorphismBase} ${typeClasses} ${shapeClasses}`;
  };

  return (
    <motion.button 
      className={getButtonClasses()} 
      onClick={() => onClick(label, type)}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
    >
      {label}
    </motion.button>
  );
};

export default CalculatorButton;