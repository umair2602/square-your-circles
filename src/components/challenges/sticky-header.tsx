'use client';

import CarbonCount from '@/components/common/CarbonCount';
import LogoWithText from '@/components/common/LogoWithText';
import UsernameMenu from '@/components/common/username-menu';
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
        <div className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/90 border-b border-gray-200 py-2 px-4 flex items-center justify-between w-full shadow-sm h-14">
            <div className="flex items-center gap-4">
                <div className="hidden sm:block">
                    <LogoWithText size="sm" />
                </div>
                <div className="h-6 border-l border-gray-300 mx-1 hidden sm:block"></div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                        <span className="font-medium text-sm text-gray-700">Points:</span>
                        <div className="relative">
                            <motion.span
                                className="text-lg font-bold text-gray-800"
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
                                    className={`absolute -top-1 -right-2 text-sm font-semibold ${scoreChange > 0 ? 'text-gray-900' : 'text-gray-700'
                                        }`}
                                >
                                    {scoreChange > 0 ? `+${scoreChange.toLocaleString()}` : scoreChange.toLocaleString()}
                                </motion.div>
                            )}
                        </div>
                    </div>
                    <LeaderboardPosition variant="Position" />
                </div>
            </div>
            <div className="flex items-center gap-3">
                <div className="hidden sm:block">
                    <UsernameMenu />
                </div>
            </div>
        </div>
    );
} 