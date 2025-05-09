import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import { RootState } from '@/store';
import { resetForm } from '@/store/slices/ideaCreationSlice';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import PaymentDialog from '../dialogs/payment-dialog';

// Dynamic import with no SSR
const RecaptchaComponent = dynamic(() => import('@/components/common/Recaptcha'), { ssr: false });

type Challenge = {
  id: string;
  challenge: string;
  type: 'mcq' | 'text' | 'verify' | 'declaration' | 'register' | 'checkbox';
  options?: { label: string; value: string; score: number }[];
  placeholder?: string;
  buttonText?: string;
  validation?: {
    required?: boolean;
    pattern?: string;
    errorMessage?: string;
  };
};

type Props = {
  challenge: Challenge;
  response: string;
  onChange: (value: string) => void;
};

export function ChallengesRenderer({ challenge, response, onChange }: Props) {
  const { user } = useAuth();
  const router = useRouter();
  const dispatch = useDispatch();
  const { score, title, description, responses } = useSelector((state: RootState) => state.ideaCreation);
  const currentPpm = useSelector((state: any) => state.carbonCount.currentPpm);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const recaptchaRef = useRef<any>(null);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [hoveredOption, setHoveredOption] = useState<string | null>(null);

  useEffect(() => {
    if (user?.isIdVerified && challenge.type === 'verify') {
      onChange('verified');
    }
  }, [user, challenge.type, onChange]);

  const handleCaptchaChange = (token: string | null) => {
    setCaptchaToken(token);
  };

  const verifyYoti = async () => {
    if (!user) {
      router.push('/login?from=form');
      return;
    }

    if (!captchaToken) {
      toast.error('Please verify you are human');
      return;
    }

    // Proceed with verification
    onChange('verified');
    // Reset captcha after use
    recaptchaRef.current?.reset();
    setCaptchaToken(null);
  };

  const handleRegisterScore = async () => {
    if (!user) {
      router.push('/login?from=form');
      return;
    }

    if (!captchaToken) {
      toast.error('Please verify you are human');
      return;
    }

    // Reset captcha after use
    recaptchaRef.current?.reset();
    setCaptchaToken(null);

    // Proceed with registration
    try {
      setLoading(true);
      if (!currentPpm) {
        toast.error('Please refresh or wait for the ppm value to be displayed');
        return;
      }

      const payload = {
        title: title || 'Idea title',
        description: description || 'Idea description',
        w3wLocation: responses.geo_1 ? responses.geo_1 : "",
        citations: responses.bonus_1 ? [responses.bonus_1] : [],
        score: Math.max((score ?? 0) - currentPpm, 0),
      };

      const token = localStorage.getItem('user_token');
      if (!token) {
        toast.error('User not authenticated');
        return;
      }
      const response = await fetch('/api/create-idea', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.status === 403 && data.needsPayment) {
        setShowPaymentDialog(true);
        return;
      }

      if (!response.ok) {
        toast.error(data?.message || 'Idea creation failed');
        return;
      }

      router.push('/');

      toast.success(data?.message || 'Idea creation successful');
      dispatch(resetForm());
    } catch (error: any) {
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = () => {
    setShowPaymentDialog(false);
    router.push('/payment');
  };

  // Calculate potential score change if this option is selected
  const calculateScoreChange = (optionValue: string) => {
    if (!challenge.options) return 0;

    // Find the score of the currently hovered option
    const option = challenge.options.find(opt => opt.value === optionValue);
    if (!option) return 0;

    // If we're hovering over the currently selected option, deselection would reduce score
    if (response === optionValue) {
      return -option.score;
    }

    // If another option is already selected, we replace its score with the new one
    if (response) {
      const currentOption = challenge.options.find(opt => opt.value === response);
      return option.score - (currentOption?.score || 0);
    }

    // Otherwise it's a new selection
    return option.score;
  };

  return (
    <div className="">
      <Label className="block text-md font-medium mb-3">{challenge.challenge}</Label>

      {challenge.type === 'mcq' && challenge.options && (
        <div className="flex flex-col gap-2">
          {challenge.options.map((opt, index) => {
            const isSelected = response === opt.value;
            const scoreChange = calculateScoreChange(opt.value);
            const isHovered = hoveredOption === opt.value;

            return (
              <div
                key={index}
                className={`flex items-center justify-between rounded-lg border p-3 transition-all cursor-pointer
                  ${isSelected ? 'border-blue-500 bg-blue-50' : 'hover:bg-muted'}
                `}
                onClick={() => {
                  // Toggle selection - if already selected, clear it
                  onChange(isSelected ? '' : opt.value);
                }}
                onMouseEnter={() => setHoveredOption(opt.value)}
                onMouseLeave={() => setHoveredOption(null)}
              >
                <div className="flex items-center gap-3">
                  <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${isSelected ? 'border-blue-500 bg-blue-500' : 'border-gray-300'}`}>
                    {isSelected && (
                      <div className="h-2.5 w-2.5 rounded-full bg-white" />
                    )}
                  </div>
                  <Label htmlFor={`${challenge.id}-${opt.value}`} className="cursor-pointer">
                    {opt.label}
                  </Label>
                </div>

                <div className="flex items-center">
                  {(isHovered || isSelected) && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={`text-sm font-medium px-2 py-1 rounded ${scoreChange > 0 ? 'bg-green-100 text-green-800' :
                        scoreChange < 0 ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}
                    >
                      {scoreChange > 0 ? `+${scoreChange.toLocaleString()}` :
                        scoreChange < 0 ? scoreChange.toLocaleString() :
                          '0'} points
                    </motion.div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {challenge.type === 'text' && <Input placeholder={challenge.placeholder || 'Type here...'} value={response} onChange={(e) => onChange(e.target.value)} />}

      {challenge.type === 'verify' && (
        <div className="space-y-4">
          {!user?.isIdVerified && (
            <div className="flex justify-center">
              <RecaptchaComponent
                sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_V2_SITE_KEY || ''}
                onChange={handleCaptchaChange}
                onExpired={() => setCaptchaToken(null)}
              />
            </div>
          )}
          <Button onClick={verifyYoti} className="w-full" disabled={user?.isIdVerified}>
            {user?.isIdVerified ? 'Already Verified' : 'Verify with Yoti'}
          </Button>
        </div>
      )}

      {challenge.type === 'declaration' && (
        <Button onClick={() => onChange('signed')} className="w-full">
          Sign Declaration
        </Button>
      )}

      {challenge.type === 'register' && (
        <div className="space-y-4">
          <div className="flex justify-center">
            <RecaptchaComponent
              sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_V2_SITE_KEY || ''}
              onChange={handleCaptchaChange}
              onExpired={() => setCaptchaToken(null)}
            />
          </div>
          <Button onClick={handleRegisterScore} disabled={loading} className="w-full">
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? 'Registering...' : 'Register Score'}
          </Button>
        </div>
      )}

      {challenge.type === 'checkbox' && (
        <div className="flex items-center space-x-2">
          <Checkbox id={challenge.id} checked={response === 'true'} onCheckedChange={(checked: any) => onChange(checked ? 'true' : 'false')} />
          <Label htmlFor={challenge.id}>I acknowledge and accept</Label>
        </div>
      )}

      <PaymentDialog
        open={showPaymentDialog}
        onOpenChange={setShowPaymentDialog}
        onPay={handlePayment}
      />
    </div>
  );
}
