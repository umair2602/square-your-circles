'use client';

import { useMarkControl } from '@/hooks/useMarkControl';
import { ReactNode } from 'react';

interface ScaffoldPageLayoutProps {
    children: ReactNode;
    title: string;
    subtitle?: string;
}

export default function ScaffoldPageLayout({
    children,
    title,
    subtitle
}: ScaffoldPageLayoutProps) {
    // Use background variant for all scaffold pages
    useMarkControl({ variant: 'background' });

    return (
        <div className="container mx-auto px-4 py-8 min-h-screen">
            <header className="mb-16 mt-8 text-center relative z-10">
                <h1 className="text-5xl font-bold mb-4">{title}</h1>
                {subtitle && (
                    <h2 className="text-2xl font-medium text-gray-600 dark:text-gray-300">{subtitle}</h2>
                )}
            </header>

            <main className="relative z-10">
                {children}
            </main>
        </div>
    );
} 