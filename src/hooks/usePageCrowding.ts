'use client';

import { useEffect, useState } from 'react';

type MarkVariant = 'background' | 'corner';

interface UsePageCrowdingOptions {
  initialVariant?: MarkVariant;
  threshold?: number;
}

export function usePageCrowding({
  initialVariant = 'background',
  threshold = 10
}: UsePageCrowdingOptions = {}): MarkVariant {
  const [variant, setVariant] = useState<MarkVariant>(initialVariant);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkPageCrowding = () => {
      if (initialVariant === 'corner') {
        setVariant('corner');
        return;
      }
      
      // Check if page is crowded based on:
      // 1. Element count - more elements usually means more content
      // 2. Content height - if content is taller than viewport, it may be crowded
      // 3. Window width - on smaller screens, we may want to use corner variant
      
      const contentElements = document.querySelectorAll('main > *').length;
      const contentHeight = document.body.scrollHeight;
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;
      
      const isCrowded = (
        contentElements > threshold || 
        contentHeight > viewportHeight * 1.5 ||
        viewportWidth < 768
      );
      
      setVariant(isCrowded ? 'corner' : 'background');
    };
    
    checkPageCrowding();
    window.addEventListener('resize', checkPageCrowding);
    
    // Also check when content might change
    const observer = new MutationObserver(checkPageCrowding);
    observer.observe(document.body, { childList: true, subtree: true });
    
    return () => {
      window.removeEventListener('resize', checkPageCrowding);
      observer.disconnect();
    };
  }, [initialVariant, threshold]);
  
  return variant;
} 