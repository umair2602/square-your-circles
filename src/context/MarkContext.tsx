'use client';

import { createContext, ReactNode, useContext, useState } from 'react';

type MarkVariant = 'background' | 'corner';

interface MarkContextType {
    variant: MarkVariant;
    setVariant: (variant: MarkVariant) => void;
    threshold: number;
    setThreshold: (threshold: number) => void;
}

const MarkContext = createContext<MarkContextType | undefined>(undefined);

interface MarkProviderProps {
    children: ReactNode;
    initialVariant?: MarkVariant;
    initialThreshold?: number;
}

export function MarkProvider({
    children,
    initialVariant = 'background',
    initialThreshold = 10,
}: MarkProviderProps) {
    const [variant, setVariant] = useState<MarkVariant>(initialVariant);
    const [threshold, setThreshold] = useState<number>(initialThreshold);

    const value = {
        variant,
        setVariant,
        threshold,
        setThreshold,
    };

    return <MarkContext.Provider value={value}>{children}</MarkContext.Provider>;
}

export function useMark() {
    const context = useContext(MarkContext);
    if (context === undefined) {
        throw new Error('useMark must be used within a MarkProvider');
    }
    return context;
} 