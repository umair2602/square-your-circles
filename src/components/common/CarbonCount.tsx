'use client';
import { useSelector } from 'react-redux';

const CarbonCount = () => {
  const currentPpm = useSelector((state: any) => state.carbonCount.currentPpm);

  return (
    <div className="flex items-center justify-between gap-1 px-2.5 py-1 bg-white rounded-md shadow-md border">
      <span className="text-gray-600 font-medium">Carbon:</span>
      <span className="text-green-600 font-medium">{`${currentPpm.toFixed(7)} ppm`}</span>
    </div>
  );
};

export default CarbonCount;
