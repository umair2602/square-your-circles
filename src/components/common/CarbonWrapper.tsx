'use client';

import { useEffect } from 'react';
import { fetchCarbonCount, updateCurrentPpm } from '../../store/slices/carbonCountSlice';
import { useAppDispatch } from '../../store/hooks';
import { useSelector } from 'react-redux';

interface CarbonWrapperProps {
  children: React.ReactNode;
}

export default function CarbonWrapper({ children }: CarbonWrapperProps) {
  const dispatch = useAppDispatch();

  const baseTimestamp = useSelector((state: any) => state.carbonCount.baseTimestamp);

  useEffect(() => {
    // First fetch the initial data
    dispatch(fetchCarbonCount());
  }, [dispatch]);

  useEffect(() => {
    // Only start the interval after we have the base timestamp
    if (!baseTimestamp) return;

    const interval = setInterval(() => {
      dispatch(updateCurrentPpm());
    }, 1000);

    return () => clearInterval(interval);
  }, [dispatch, baseTimestamp]);
  
  return (
    <>
      {children}
    </>
  );
}
