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
    const [loadError, setLoadError] = useState<string | null>(null);
    const renderAttempted = useRef(false);
    const renderTimer = useRef<NodeJS.Timeout | null>(null);
    const maxRetries = 3;
    const [retryCount, setRetryCount] = useState(0);

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

            // Add error handling for script loading
            script.onerror = () => {
                setLoadError('Failed to load reCAPTCHA script. Please refresh the page.');

                // Retry loading after a delay if under max retries
                if (retryCount < maxRetries) {
                    setTimeout(() => {
                        setRetryCount(retryCount + 1);
                        document.head.removeChild(script);
                        setLoadError(null);
                    }, 1000);
                }
            };

            document.head.appendChild(script);
        } else {
            // Script exists, might already be loaded
            if (window.grecaptcha && typeof window.grecaptcha.render === 'function') {
                setScriptLoaded(true);
                setIsLoaded(true);
            } else {
                // Script exists but not initialized properly
                // Re-add the onload callback and wait
                window.onRecaptchaLoad = () => {
                    setScriptLoaded(true);
                    setIsLoaded(true);
                };
            }
        }

        // Fallback timeout in case the script doesn't load or callback doesn't fire
        const fallbackTimer = setTimeout(() => {
            if (!scriptLoaded && retryCount < maxRetries) {
                setRetryCount(retryCount + 1);
                // Try to reload the script
                const oldScript = document.getElementById('recaptcha-script');
                if (oldScript) {
                    document.head.removeChild(oldScript);
                }
                setLoadError(null);
            }
        }, 5000);

        return () => {
            clearTimeout(fallbackTimer);
        };
    }, [scriptLoaded, retryCount]);

    // Handle rendering captcha
    useEffect(() => {
        // Only attempt to render if the script is loaded and container exists
        if (!scriptLoaded || !containerRef.current) return;

        // If we already tried to render and it failed, reset and try again
        if (renderAttempted.current && retryCount < maxRetries) {
            if (renderTimer.current) {
                clearTimeout(renderTimer.current);
            }
            renderAttempted.current = false;
        }

        if (renderAttempted.current) return;
        renderAttempted.current = true;

        // Wait a bit to ensure DOM stability
        renderTimer.current = setTimeout(() => {
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
                setLoadError('Error rendering reCAPTCHA. Please refresh the page.');

                // Reset render attempt flag to allow retrying
                if (retryCount < maxRetries) {
                    renderAttempted.current = false;
                    setRetryCount(retryCount + 1);
                }
            }
        }, 300);

        return () => {
            if (renderTimer.current) {
                clearTimeout(renderTimer.current);
            }
        };
    }, [scriptLoaded, sitekey, onChange, onExpired, instanceId, retryCount]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (renderTimer.current) {
                clearTimeout(renderTimer.current);
            }

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

    // Reset captcha
    const resetCaptcha = () => {
        if (captchaId.current !== null && window.grecaptcha) {
            try {
                renderAttempted.current = false;
                window.grecaptcha.reset(captchaId.current);
                captchaId.current = null;
                setRetryCount(0);
                setLoadError(null);
            } catch (error) {
                console.error('Manual reset error:', error);
            }
        }
    };

    return (
        <div className="recaptcha-container">
            <div id={instanceId} ref={containerRef} />
            {!isLoaded && !loadError && (
                <div className="text-sm text-gray-500 mt-2">Loading reCAPTCHA...</div>
            )}
            {loadError && (
                <div className="mt-2">
                    <p className="text-sm text-red-500">{loadError}</p>
                    <button
                        onClick={resetCaptcha}
                        className="text-sm text-blue-500 mt-1 underline"
                    >
                        Try again
                    </button>
                </div>
            )}
        </div>
    );
} 