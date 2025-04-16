'use client';
import CarbonCount from '@/components/common/CarbonCount';

const page = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center">
        <CarbonCount />
      </div>
    </div>
  );
};

export default page;
