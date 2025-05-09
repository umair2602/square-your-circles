'use client';

import { useEffect, useRef } from 'react';

declare global {
    interface Window {
        grecaptcha: any;
        onRecaptchaLoad: () => void;
    }
}

interface RecaptchaProps {
    sitekey: string;
    onChange: (token: string | null) => void;
    onExpired: () => void;
}

export default function Recaptcha({ sitekey, onChange, onExpired }: RecaptchaProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const captchaId = useRef<number | null>(null);

    useEffect(() => {
        // Check if script already exists
        const existingScript = document.getElementById('recaptcha-script');
        if (!existingScript) {
            // Load the reCAPTCHA script
            const script = document.createElement('script');
            script.id = 'recaptcha-script';
            script.src = `https://www.google.com/recaptcha/api.js?render=explicit`;
            script.async = true;
            script.defer = true;

            // Define the callback that will be called when the script loads
            window.onRecaptchaLoad = () => {
                if (containerRef.current) {
                    renderCaptcha();
                }
            };

            script.onload = () => window.onRecaptchaLoad();
            document.head.appendChild(script);
        } else if (window.grecaptcha && window.grecaptcha.render) {
            renderCaptcha();
        }

        function renderCaptcha() {
            if (containerRef.current && !captchaId.current) {
                try {
                    captchaId.current = window.grecaptcha.render(containerRef.current, {
                        sitekey,
                        callback: onChange,
                        'expired-callback': onExpired
                    });
                } catch (error) {
                    console.error('reCAPTCHA rendering error:', error);
                }
            }
        }

        return () => {
            // Clean up if needed
            if (captchaId.current !== null && window.grecaptcha && window.grecaptcha.reset) {
                try {
                    window.grecaptcha.reset(captchaId.current);
                } catch (error) {
                    console.error('reCAPTCHA reset error:', error);
                }
            }
        };
    }, [sitekey, onChange, onExpired]);

    return <div ref={containerRef} />;
} 