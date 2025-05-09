'use client';

import ReactGoogleRecaptcha from 'react-google-recaptcha';

interface RecaptchaProps {
    sitekey: string;
    onChange: (token: string | null) => void;
    onExpired: () => void;
}

export default function Recaptcha({ sitekey, onChange, onExpired }: RecaptchaProps) {
    return (
        <ReactGoogleRecaptcha
            sitekey={sitekey}
            onChange={onChange}
            onExpired={onExpired}
        />
    );
} 