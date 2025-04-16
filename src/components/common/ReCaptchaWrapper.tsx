'use client';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';

interface ReCaptchaWrapperProps {
  children: React.ReactNode;
}

export default function ReCaptchaWrapper({ children }: ReCaptchaWrapperProps) {
  return (
    <GoogleReCaptchaProvider reCaptchaKey={`${process.env.NEXT_PUBLIC_RECAPTCHA_V3_SITE_KEY}`} scriptProps={{ async: true, defer: true }}>
      {children}
    </GoogleReCaptchaProvider>
  );
}
