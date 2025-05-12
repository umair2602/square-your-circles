'use client';
import BrandWatermark from '@/components/common/BrandWatermark';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FaArrowRight } from 'react-icons/fa';

// Import directly but render conditionally
import Recaptcha from '@/components/common/Recaptcha';
import Navbar from '@/components/common/Navbar';

const Page = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [showRecaptcha, setShowRecaptcha] = useState(false);

  // Ensure we only render the Recaptcha on the client and after a small delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowRecaptcha(true);
    }, 500); // Small delay to ensure the DOM is stable

    return () => clearTimeout(timer);
  }, []);

  const handleStartChallenge = () => {
    router.push('/challenges');
  };

  const handleCaptchaChange = (token: string | null) => {
    setCaptchaToken(token);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 px-4 sm:px-6 lg:px-8 py-8">
      {/* Background watermark */}
      <BrandWatermark opacity={0.04} size="70vh" blur={2} offsetY={20} />
      <Navbar />

      <div className="flex grow items-center justify-center">
        <div className="w-full max-w-lg">
          <Card className="w-full border-2 border-gray-200 shadow-lg">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-3xl font-bold text-gray-800">
                Do you want 100,000 points?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-4">
              <div className="text-center text-lg text-gray-600">
                <p>Start creating your idea and earn up to 100,000 points!</p>
                <p className="mt-2 text-sm text-gray-500">We'll ask for details about your idea later.</p>
              </div>

              <div className="flex justify-center mt-8">
                {showRecaptcha ? (
                  <Recaptcha
                    sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_V2_SITE_KEY || ''}
                    onChange={handleCaptchaChange}
                    onExpired={() => setCaptchaToken(null)}
                  />
                ) : (
                  <div className="h-[78px] flex items-center justify-center text-sm text-gray-500">
                    Loading reCAPTCHA...
                  </div>
                )}
              </div>

              <div className="flex justify-center">
                <Button
                  onClick={handleStartChallenge}
                  className="bg-gray-800 hover:bg-gray-900 text-white text-lg py-6 px-8 rounded-full transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-3 hover:cursor-pointer"
                  disabled={!captchaToken}
                >
                  Start Now <FaArrowRight />
                </Button>
              </div>

              <div className="text-center text-xs text-gray-400 mt-4">
                Complete all challenges to maximize your score!
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Page;
