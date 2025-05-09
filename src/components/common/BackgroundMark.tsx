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
        // Corner variant - small version in the corner
        return (
            <div className="fixed top-20 right-4 w-20 h-20 z-10 pointer-events-none">
                <Image
                    src="/squareyourcircles.svg"
                    alt="squareyourcircles"
                    width={100}
                    height={100}
                    className="opacity-70"
                />
            </div>
        );
    }

    // Background variant - large version as background
    return (
        <div className="fixed inset-0 w-full h-full pointer-events-none z-0 flex items-center justify-center">
            <div className="relative w-screen h-screen max-w-[150vw] max-h-[150vh]">
                <Image
                    src="/squareyourcircles.svg"
                    alt="squareyourcircles"
                    fill
                    className="opacity-10"
                    style={{ objectFit: 'contain' }}
                    priority
                />
            </div>
        </div>
    );
} 