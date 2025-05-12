'use client';

import { useMark } from '@/context/MarkContext';
import { usePageCrowding } from '@/hooks/usePageCrowding';
import Image from 'next/image';

export default function BackgroundMark() {
    const { variant: contextVariant, threshold } = useMark();
    const computedVariant = usePageCrowding({
        initialVariant: contextVariant,
        threshold
    });

    if (computedVariant === 'corner') {
        // Corner variant - balanced visibility
        return (
            <div className="fixed top-20 right-4 w-16 h-16 z-10 pointer-events-none">
                <Image
                    src="/squareyourcircles.svg"
                    alt="squareyourcircles"
                    width={80}
                    height={80}
                    className="opacity-45"
                    style={{ filter: 'blur(1px)' }}
                />
            </div>
        );
    }

    // Background variant - more visible but still subtle
    return (
        <div className="fixed inset-0 w-full h-full pointer-events-none z-0 flex items-center justify-center">
            <div className="relative w-[80vw] h-[80vh] max-w-[120vw] max-h-[120vh]">
                <Image
                    src="/squareyourcircles.svg"
                    alt="squareyourcircles"
                    fill
                    className="opacity-8"
                    style={{
                        objectFit: 'contain',
                        filter: 'blur(2.5px)'
                    }}
                    priority
                />
            </div>
        </div>
    );
} 