'use client';

import { Button } from '@/components/ui/button';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';

interface StickyFooterProps {
    onNext: () => void;
    onPrev: () => void;
    isFirstStep: boolean;
    isLastStep: boolean;
}

export function StickyFooter({ onNext, onPrev, isFirstStep, isLastStep }: StickyFooterProps) {
    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 backdrop-blur-md bg-white/90 border-t border-gray-200 py-2 px-4 flex items-center justify-between w-full shadow-[0_-2px_4px_rgba(0,0,0,0.05)] h-14">
            <Button
                onClick={onPrev}
                disabled={isFirstStep}
                className="flex items-center gap-1"
                variant="outline"
            >
                <IoIosArrowBack className="h-4 w-4" />
                Previous
            </Button>
            <Button
                onClick={onNext}
                disabled={isLastStep}
                className="flex items-center gap-1 bg-gray-800 hover:bg-gray-900"
            >
                Next
                <IoIosArrowForward className="h-4 w-4" />
            </Button>
        </div>
    );
} 