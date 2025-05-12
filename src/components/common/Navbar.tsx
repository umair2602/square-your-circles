'use client';

import LogoWithText from '@/components/common/LogoWithText';
import { Button } from '@/components/ui/button';
import { RootState } from '@/store';
import { AnimatePresence, motion, Variants } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import CarbonCount from './CarbonCount';

// Define animation variants
const digitVariants: Variants = {
    hidden: {
        y: -20,
        opacity: 0
    },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            duration: 0.3,
            ease: "easeOut"
        }
    },
    exit: {
        y: 20,
        opacity: 0,
        transition: {
            duration: 0.3,
            ease: "easeIn"
        }
    }
};

/**
 * AnimatedDigit - Shows a single digit with animation when it changes
 */
function AnimatedDigit({ value, index }: { value: string; index: number }) {
    return (
        <div className="inline-block w-[0.6em] h-[1.2em] relative overflow-hidden text-center">
            <AnimatePresence mode="wait" initial={false}>
                <motion.span
                    key={`${value}-${index}`}
                    variants={digitVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="absolute inset-0 flex items-center justify-center"
                >
                    {value}
                </motion.span>
            </AnimatePresence>
        </div>
    );
}

const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Case Studies', path: '/case-studies' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contact', path: '/contact' },
];

export default function Navbar() {
    const router = useRouter();
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const currentPpm = useSelector((state: RootState) => state.carbonCount.currentPpm);
    const [formattedPpm, setFormattedPpm] = useState("427.7557");

    useEffect(() => {
        if (currentPpm) {
            // Format to show fewer decimal places for the header display
            setFormattedPpm(currentPpm.toFixed(4));
        }
    }, [currentPpm]);

    // Handle scroll event to add shadow to navbar
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 10) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu when route changes
    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 bg-white transition-all duration-300 
      ${scrolled ? 'border-b border-gray-200 shadow-sm' : 'border-b border-gray-100'}`}
        >
            <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
                <div className="flex justify-between items-center h-14 sm:h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Link href="/">
                            <LogoWithText size="sm" className="h-8 sm:h-auto" />
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-4 lg:space-x-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                href={link.path}
                                className={`text-sm font-medium hover:text-gray-900 transition-colors 
                  ${pathname === link.path ? 'text-gray-900 border-b-2 border-gray-900 pb-1' : 'text-gray-600'}`}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    {/* Carbon Clock & Buttons */}
                    <div className="hidden md:flex items-center space-x-2 lg:space-x-4">
                        <Button
                            onClick={() => router.push('/login')}
                            className="bg-gray-900 hover:bg-black text-white rounded-md text-xs sm:text-sm"
                            size="sm"
                        >
                            Login
                        </Button>
                        <Button
                            onClick={() => router.push('/new-idea')}
                            className="bg-gray-600 hover:bg-gray-700 text-white rounded-md text-xs sm:text-sm"
                            size="sm"
                        >
                            New Idea
                        </Button>
                        {
                            pathname !== '/' && (
                                <CarbonCount />
                            )
                        }
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center gap-2">
                        {pathname !== '/' && (
                            <div className="bg-gray-100 rounded-md px-2 py-1">
                                <CarbonCount className="text-xs" />
                            </div>
                        )}

                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-gray-600 hover:text-gray-900 focus:outline-none"
                            aria-label="Toggle menu"
                        >
                            {isOpen ? (
                                <X className="h-5 w-5 sm:h-6 sm:w-6" />
                            ) : (
                                <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="md:hidden bg-white overflow-hidden"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 max-h-[calc(100vh-4rem)] overflow-y-auto">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    href={link.path}
                                    className={`block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-100 hover:text-gray-900 transition-colors
                      ${pathname === link.path ? 'text-gray-900 bg-gray-50' : 'text-gray-600'}`}
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <div className="pt-4 pb-2 border-t border-gray-200 flex flex-col gap-2">
                                <Button
                                    onClick={() => router.push('/login')}
                                    className="w-full bg-gray-900 hover:bg-black text-white rounded-md"
                                    size="sm"
                                >
                                    Login
                                </Button>
                                <Button
                                    onClick={() => router.push('/new-idea')}
                                    className="w-full bg-gray-600 hover:bg-gray-700 text-white rounded-md"
                                    size="sm"
                                >
                                    New Idea
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
} 