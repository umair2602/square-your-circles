'use client';
import Image from 'next/image';
import Link from 'next/link';

type LogoWithTextProps = {
    className?: string;
    textClassName?: string;
    size?: 'sm' | 'md' | 'lg';
};

export default function LogoWithText({
    className = "",
    textClassName = "",
    size = 'md'
}: LogoWithTextProps) {
    // Size configs
    const sizeConfig = {
        sm: { logoSize: 26, textSize: 'text-lg' },
        md: { logoSize: 34, textSize: 'text-xl' },
        lg: { logoSize: 42, textSize: 'text-2xl' },
    };

    const { logoSize, textSize } = sizeConfig[size];

    return (
        <Link href="/" className={`flex items-center gap-2 ${className}`}>
            <div className="relative">
                <Image
                    src="/squareyourcircles.svg"
                    alt="Square Your Circles Logo"
                    width={logoSize}
                    height={logoSize}
                    className="dark:invert"
                />
            </div>
            <span className={`font-bold tracking-tight whitespace-nowrap ${textSize} ${textClassName}`}>
                Square Your Circles
            </span>
        </Link>
    );
} 