'use client';
import { useSelector } from 'react-redux';

interface CarbonCountProps {
  className?: string;
}

const CarbonCount = ({ className }: CarbonCountProps) => {
  const currentPpm = useSelector((state: any) => state.carbonCount.currentPpm);

  if(!currentPpm) {
    return null;
  }

  return (
    <div className={`flex items-center justify-between gap-1 px-2.5 py-1 bg-white rounded-md shadow-md border shrink-0 ${className}`}>
      <span className="text-gray-600 font-medium">Carbon Clock:</span>
      <span className="text-green-600 font-medium">{`${currentPpm.toFixed(8)} ppm`}</span>
    </div>
  );
};

export default CarbonCount;
