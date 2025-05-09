'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Define the site structure
export const siteStructure = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Process', path: '/process' },
    { name: 'Case Studies', path: '/case-studies' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contact', path: '/contact' }
];

export default function ScaffoldNavigation() {
    const pathname = usePathname();

    return (
        <nav className="fixed bottom-8 left-0 right-0 mx-auto w-fit bg-white/80 dark:bg-black/80 backdrop-blur-md shadow-lg rounded-lg py-3 px-6 z-20">
            <ul className="flex space-x-6">
                {siteStructure.map((item) => (
                    <li key={item.path}>
                        <Link
                            href={item.path}
                            className={`text-sm font-medium transition-colors ${pathname === item.path
                                    ? 'text-primary font-bold'
                                    : 'text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary'
                                }`}
                        >
                            {item.name}
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
} 