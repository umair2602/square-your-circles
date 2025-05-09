'use client';

import CarbonCount from '@/components/common/CarbonCount';
import { RootState } from '@/store';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import LeaderboardPosition from './LeaderboardPosition';

export function StickyHeader() {
    const score = useSelector((state: RootState) => state.ideaCreation.score);
    const [prevScore, setPrevScore] = useState(0);
    const [scoreChange, setScoreChange] = useState(0);
    const [showScoreChange, setShowScoreChange] = useState(false);

    useEffect(() => {
        if (prevScore !== 0 && prevScore !== score) {
            setScoreChange(score - prevScore);
            setShowScoreChange(true);

            // Hide the score change indicator after 2 seconds
            const timer = setTimeout(() => {
                setShowScoreChange(false);
            }, 2000);

            return () => clearTimeout(timer);
        }

        setPrevScore(score);
    }, [score, prevScore]);

    return (
        <div className="sticky top-0 z-40 backdrop-blur-md bg-white/80 border-b border-gray-200 py-3 px-4 flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                    <span className="font-medium text-sm text-gray-700">Points:</span>
                    <div className="relative">
                        <motion.span
                            className="text-lg font-bold text-blue-600"
                            initial={{ scale: 1 }}
                            animate={{
                                scale: score !== prevScore ? [1, 1.1, 1] : 1,
                                transition: { duration: 0.5, ease: "easeInOut" }
                            }}
                            key={score}
                        >
                            {score?.toLocaleString() || 0}
                        </motion.span>

                        {showScoreChange && (
                            <motion.div
                                initial={{ opacity: 0, y: 0 }}
                                animate={{ opacity: 1, y: -20 }}
                                exit={{ opacity: 0 }}
                                className={`absolute -top-1 -right-2 text-sm font-semibold ${scoreChange > 0 ? 'text-green-600' : 'text-red-600'
                                    }`}
                            >
                                {scoreChange > 0 ? `+${scoreChange.toLocaleString()}` : scoreChange.toLocaleString()}
                            </motion.div>
                        )}
                    </div>
                </div>
                <LeaderboardPosition variant="Position" />
            </div>
            <div>
                <CarbonCount />
            </div>
        </div>
    );
} 