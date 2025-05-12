'use client';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

interface CarbonCountProps {
  className?: string;
}

function AnimatedDigit({ value, index }: { value: string; index: number }) {
  // Special case for the decimal point
  if (value === '.') {
    return (
      <div className="inline-block w-[0.4em] relative overflow-hidden text-center">
        <span className="text-gray-600">{value}</span>
      </div>
    );
  }

  // Determine if this is the last digit (for faster animation)
  const isLastDigit = index === 8; // The 8th index is the last digit (0-based)

  return (
    <div className="inline-block w-[0.7em] h-[1.4em] relative overflow-hidden text-center">
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={value}
          className="absolute inset-0 flex items-center justify-center"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          transition={{
            duration: isLastDigit ? 0.05 : 0.2,
            ease: isLastDigit ? "linear" : "easeOut",
            delay: isLastDigit ? 0 : index * 0.02
          }}
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

const CarbonCount = ({ className }: CarbonCountProps) => {
  const currentPpm = useSelector((state: any) => state.carbonCount.currentPpm);
  const [formattedPpm, setFormattedPpm] = useState<string>('');

  useEffect(() => {
    if (currentPpm) {
      setFormattedPpm(currentPpm.toFixed(8));
    }
  }, [currentPpm]);

  if (!currentPpm) {
    return null;
  }

  return (
    <div className={`flex items-center justify-between gap-3 px-3.5 py-2 bg-white rounded-md shadow-mdtransition-all duration-300 ${className}`}>
      <div className="bg-gray-50 px-2.5 py-1 rounded-md border-l border-gray-300">
        <span className="text-gray-900 font-semibold whitespace-nowrap text-base tracking-wide">
          {formattedPpm.split('').map((digit, index) => (
            <AnimatedDigit key={index} value={digit} index={index} />
          ))}
          <span className="ml-1.5 text-xs text-gray-500 font-normal">ppm</span>
        </span>
      </div>
    </div>
  );
};

export default CarbonCount;
