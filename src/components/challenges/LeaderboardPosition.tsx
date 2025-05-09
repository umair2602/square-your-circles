'use client';

import { RootState } from '@/store';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

interface LeaderboardPositionProps {
    variant?: 'Position' | 'Score';
}

export default function LeaderboardPosition({ variant = 'Position' }: LeaderboardPositionProps) {
    const currentScore = useSelector((state: RootState) => state.ideaCreation.score);
    const ideas = useSelector((state: RootState) => state.ideas.ideas);
    const [position, setPosition] = useState<number | null>(null);
    const [total, setTotal] = useState<number>(0);
    const [percentile, setPercentile] = useState<number | null>(null);
    const [prevScore, setPrevScore] = useState<number>(0);
    const [positionChanged, setPositionChanged] = useState<boolean>(false);

    // Calculate position based on current score and existing ideas
    useEffect(() => {
        if (!ideas.length) return;

        // Store previous score to detect changes
        if (prevScore !== currentScore) {
            setPrevScore(currentScore);
            if (prevScore !== 0) {
                setPositionChanged(true);
                // Reset the animation flag after a short delay
                setTimeout(() => setPositionChanged(false), 2000);
            }
        }

        // Sort ideas by carbon count/score in descending order
        const sortedIdeas = [...ideas].sort((a, b) => b.carbonCount - a.carbonCount);
        setTotal(sortedIdeas.length);

        // Find the position where current score would be inserted
        let insertPosition = sortedIdeas.length;
        for (let i = 0; i < sortedIdeas.length; i++) {
            if (currentScore >= sortedIdeas[i].carbonCount) {
                insertPosition = i;
                break;
            }
        }

        // Position is 1-indexed
        setPosition(insertPosition + 1);

        // Calculate percentile (higher is better)
        if (sortedIdeas.length > 0) {
            const calculatedPercentile = Math.round((1 - insertPosition / sortedIdeas.length) * 100);
            setPercentile(calculatedPercentile);
        }
    }, [currentScore, ideas, prevScore]);

    // Handle case when there's no data yet
    if (position === null || total === 0) {
        return (
            <div className="flex items-center justify-between gap-1 px-2.5 py-1 bg-white rounded-md shadow-md border min-w-[120px]">
                <span className="text-black font-medium">{variant}: </span>
                <span className="text-gray-500 font-medium">
                    <motion.div
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                    >
                        Calculating...
                    </motion.div>
                </span>
            </div>
        );
    }

    // Function to get color based on percentile
    const getPercentileColor = (percent: number) => {
        if (percent >= 90) return 'text-green-600';
        if (percent >= 70) return 'text-green-500';
        if (percent >= 50) return 'text-blue-500';
        if (percent >= 30) return 'text-yellow-500';
        if (percent >= 10) return 'text-orange-500';
        return 'text-red-500';
    };

    // Display different content based on the variant
    if (variant === 'Position') {
        return (
            <div className="flex items-center justify-between gap-1 px-2.5 py-1 bg-white rounded-md shadow-md border min-w-[130px]">
                <span className="text-black font-medium">Position: </span>
                <AnimatePresence mode="wait">
                    <motion.span
                        key={position}
                        initial={positionChanged ? { scale: 1.2, color: '#22c55e' } : {}}
                        animate={{ scale: 1, color: '#6b7280' }}
                        transition={{ duration: 0.5 }}
                        className="text-gray-500 font-medium flex items-center"
                    >
                        <span className={percentile && getPercentileColor(percentile)}>
                            {position}
                        </span>
                        <span className="mx-1">/</span>
                        <span>{total}</span>
                        {percentile !== null && (
                            <span className="ml-1 text-xs bg-gray-100 px-1 py-0.5 rounded-md">
                                Top {100 - percentile}%
                            </span>
                        )}
                    </motion.span>
                </AnimatePresence>
            </div>
        );
    }

    // "Score" variant that shows ranks and titles (renamed to reflect point system)
    return (
        <div className="flex items-center justify-between gap-1 px-2.5 py-1 bg-white rounded-md shadow-md border min-w-[130px]">
            <span className="text-black font-medium">Rank: </span>
            <AnimatePresence mode="wait">
                {percentile !== null ? (
                    <motion.span
                        key={`rank-${Math.floor(percentile / 10)}`}
                        initial={positionChanged ? { scale: 1.2, y: -5 } : {}}
                        animate={{ scale: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-gray-500 font-medium flex items-center"
                    >
                        <span className={getPercentileColor(percentile)}>
                            {percentile < 10 ? 'Beginner' :
                                percentile < 30 ? 'Contender' :
                                    percentile < 50 ? 'Challenger' :
                                        percentile < 70 ? 'Rising Star' :
                                            percentile < 90 ? 'Expert' : 'Champion'}
                        </span>
                        <span className="ml-1 text-xs bg-gray-100 px-1 py-0.5 rounded-md">
                            {position}/{total}
                        </span>
                    </motion.span>
                ) : (
                    <span className="text-gray-500 font-medium">Calculating...</span>
                )}
            </AnimatePresence>
        </div>
    );
} 