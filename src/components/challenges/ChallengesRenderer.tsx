import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';
import PaymentDialog from '../dialogs/payment-dialog';
import { useDispatch, useSelector } from 'react-redux';
import { resetForm } from '@/store/slices/ideaCreationSlice';

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
  const { score, title, description, responses } = useSelector((state: any) => state.ideaCreation);
  const currentPpm = useSelector((state: any) => state.carbonCount.currentPpm);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);

  useEffect(() => {
    if (user?.isIdVerified && challenge.type === 'verify') {
      onChange('verified');
    }
  }, [user, challenge.type]);

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

  return (
    <div className="">
      <Label className="block text-md font-medium mb-3">{challenge.challenge}</Label>

      {challenge.type === 'mcq' && challenge.options && (
        <RadioGroup value={response} onValueChange={onChange} className="flex flex-col gap-2">
          {challenge.options.map((opt, index) => (
            <div key={index} className="flex items-center space-x-2 rounded-lg border p-3 hover:bg-muted transition-all cursor-pointer" onClick={() => onChange(opt.value.toString())}>
              <RadioGroupItem value={opt.value} id={`${challenge.id}-${opt.value}`} />
              <Label htmlFor={`${challenge.id}-${opt.value}`}>{opt.label}</Label>
            </div>
          ))}
        </RadioGroup>
      )}

      {challenge.type === 'text' && <Input placeholder={challenge.placeholder || 'Type here...'} value={response} onChange={(e) => onChange(e.target.value)} />}

      {challenge.type === 'verify' && (
        <div className="space-y-4">
          {!user?.isIdVerified && (
            <div className="flex justify-center">
              <ReCAPTCHA ref={recaptchaRef} sitekey={`${process.env.NEXT_PUBLIC_RECAPTCHA_V2_SITE_KEY}`} onChange={handleCaptchaChange} onExpired={() => setCaptchaToken(null)} />
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
            <ReCAPTCHA ref={recaptchaRef} sitekey={`${process.env.NEXT_PUBLIC_RECAPTCHA_V2_SITE_KEY}`} onChange={handleCaptchaChange} onExpired={() => setCaptchaToken(null)} />
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
