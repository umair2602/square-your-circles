'use client';

import { useEffect, useRef, useState } from 'react';

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

// Create a unique ID for each instance
let instanceCounter = 0;

export default function Recaptcha({ sitekey, onChange, onExpired }: RecaptchaProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const captchaId = useRef<number | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [instanceId] = useState(() => `recaptcha-container-${++instanceCounter}`);
    const [scriptLoaded, setScriptLoaded] = useState(false);
    const renderAttempted = useRef(false);

    // Handle script loading
    useEffect(() => {
        if (scriptLoaded) return;

        // Define the callback that will be called when the script loads
        window.onRecaptchaLoad = () => {
            setScriptLoaded(true);
            setIsLoaded(true);
        };

        // Check if script already exists
        const existingScript = document.getElementById('recaptcha-script');
        if (!existingScript) {
            // Load the reCAPTCHA script
            const script = document.createElement('script');
            script.id = 'recaptcha-script';
            script.src = `https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoad&render=explicit`;
            script.async = true;
            script.defer = true;
            document.head.appendChild(script);
        } else {
            // Script exists, might already be loaded
            if (window.grecaptcha && typeof window.grecaptcha.render === 'function') {
                setScriptLoaded(true);
                setIsLoaded(true);
            }
        }

        return () => {
            // Nothing to clean up for script loading
        };
    }, [scriptLoaded]);

    // Handle rendering captcha
    useEffect(() => {
        // Only attempt to render if the script is loaded and container exists
        if (!scriptLoaded || !containerRef.current || renderAttempted.current) return;

        renderAttempted.current = true;

        // Wait a bit to ensure DOM stability
        const timer = setTimeout(() => {
            try {
                if (captchaId.current === null &&
                    window.grecaptcha &&
                    typeof window.grecaptcha.render === 'function' &&
                    containerRef.current) {

                    captchaId.current = window.grecaptcha.render(instanceId, {
                        sitekey,
                        callback: onChange,
                        'expired-callback': onExpired
                    });
                }
            } catch (error) {
                console.error('reCAPTCHA rendering error:', error);
            }
        }, 300);

        return () => {
            clearTimeout(timer);
        };
    }, [scriptLoaded, sitekey, onChange, onExpired, instanceId]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (captchaId.current !== null &&
                window.grecaptcha &&
                typeof window.grecaptcha.reset === 'function') {
                try {
                    window.grecaptcha.reset(captchaId.current);
                } catch (error) {
                    console.error('reCAPTCHA reset error:', error);
                }
            }
        };
    }, []);

    return (
        <div className="recaptcha-container">
            <div id={instanceId} ref={containerRef} />
            {!isLoaded && <div className="text-sm text-gray-500 mt-2">Loading reCAPTCHA...</div>}
        </div>
    );
} 