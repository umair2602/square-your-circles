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
        <div className="sticky bottom-0 z-40 backdrop-blur-md bg-white/80 border-t border-gray-200 py-3 px-4 flex items-center justify-between w-full">
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
                className="flex items-center gap-1"
            >
                Next
                <IoIosArrowForward className="h-4 w-4" />
            </Button>
        </div>
    );
} 