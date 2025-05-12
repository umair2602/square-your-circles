'use client';
import Image from 'next/image';
import { useEffect, useState } from 'react';

type BrandWatermarkProps = {
    opacity?: number;
    size?: string;
    blur?: number;
    offsetX?: number;
    offsetY?: number;
};

export default function BrandWatermark({
    opacity = 0.07,
    size = '90vh',
    blur = 1.2,
    offsetX = 0,
    offsetY = 0
}: BrandWatermarkProps) {
    const [responsiveSize, setResponsiveSize] = useState(size);

    // Handle responsive sizing
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setResponsiveSize('90vw');
            } else {
                setResponsiveSize(size);
            }
        };

        handleResize(); // Initial check
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [size]);

    return (
        <div className="fixed inset-0 w-full h-full pointer-events-none z-0 flex items-center justify-center overflow-hidden">
            <div
                className="relative"
                style={{
                    width: responsiveSize,
                    height: responsiveSize,
                    transform: `translate(${offsetX}px, ${offsetY}px)`,
                    maxWidth: '100%',
                    maxHeight: '100%'
                }}
            >
                <Image
                    src="/squareyourcircles.svg"
                    alt="Brand Watermark"
                    fill
                    className="select-none"
                    style={{
                        objectFit: 'contain',
                        opacity: opacity,
                        filter: `blur(${blur}px)`,
                    }}
                    priority
                />
            </div>
        </div>
    );
} 