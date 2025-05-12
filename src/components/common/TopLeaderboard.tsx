'use client';
import { RootState } from '@/store';
import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import { useSelector } from 'react-redux';

export default function TopLeaderboard() {
    const ideas = useSelector((state: RootState) => state.ideas.ideas.slice(0, 3));

    const animations = {
        container: {
            hidden: { opacity: 0 },
            show: {
                opacity: 1,
                transition: {
                    staggerChildren: 0.1
                }
            }
        },
        item: {
            hidden: { opacity: 0, y: 20 },
            show: { opacity: 1, y: 0 }
        }
    };

    const getMedalIcon = (position: number) => {
        switch (position) {
            case 0: return "🥇";
            case 1: return "🥈";
            case 2: return "🥉";
            default: return "";
        }
    };

    const handleScrollToLeaderboard = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const leaderboardSection = document.getElementById('leaderboard');
        if (leaderboardSection) {
            leaderboardSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    };

    return (
        <div className="w-full">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-800">Top Players</h3>
                <button
                    onClick={handleScrollToLeaderboard}
                    className="text-sm flex items-center gap-1 text-gray-500 hover:text-gray-800 transition-colors group"
                >
                    Full Leaderboard <ArrowDown className="h-3 w-3 group-hover:animate-bounce" />
                </button>
            </div>

            {ideas.length > 0 ? (
                <motion.div
                    className="space-y-3"
                    variants={animations.container}
                    initial="hidden"
                    animate="show"
                >
                    {ideas.map((idea, index) => (
                        <motion.div key={idea._id} variants={animations.item}>
                            <div className="bg-white rounded-lg py-4 px-5 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="text-xl mr-1">{getMedalIcon(index)}</span>
                                    <span className="font-medium text-base">{idea.username}</span>
                                </div>
                                <div>
                                    <span className="font-semibold text-gray-800">
                                        {Number(idea.carbonCount).toLocaleString()} pts
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            ) : (
                <div className="space-y-3">
                    {[1, 2, 3].map((_, index) => (
                        <div key={index} className="bg-white rounded-lg py-4 px-5 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="text-xl mr-1">{getMedalIcon(index)}</span>
                                <span className="font-medium text-base">{index === 0 ? "xyz" : index === 1 ? "xyz" : "ammar"}</span>
                            </div>
                            <div>
                                <span className="font-semibold text-gray-800">
                                    {index === 0 ? "130,572,439" : index === 1 ? "230,572,439" : "200,572,439"} pts
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
} 