'use client';

import { useMark } from '@/context/MarkContext';
import { useEffect } from 'react';

interface UseMarkControlOptions {
  variant?: 'background' | 'corner';
  threshold?: number;
}

/**
 * Hook for pages to control how the squareyourcircles mark is displayed
 */
export function useMarkControl({ 
  variant, 
  threshold 
}: UseMarkControlOptions = {}) {
  const context = useMark();
  
  useEffect(() => {
    // Only update if values are provided
    if (variant !== undefined) {
      context.setVariant(variant);
    }
    
    if (threshold !== undefined) {
      context.setThreshold(threshold);
    }
    
    // Restore initial values when component unmounts
    return () => {
      if (variant !== undefined) {
        context.setVariant('background');
      }
      
      if (threshold !== undefined) {
        context.setThreshold(10);
      }
    };
  }, [variant, threshold, context]);
  
  return context;
} 