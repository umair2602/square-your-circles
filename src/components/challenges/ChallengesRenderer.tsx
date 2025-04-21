import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

type Challenge = {
  id: string;
  challenge: string;
  type: 'mcq' | 'text' | 'verify' | 'declaration' | 'register' | 'checkbox';
  options?: { label: string; value: string; score: number }[];
  placeholder?: string;
  buttonText?: string;
};

type Props = {
  challenge: Challenge;
  response: string;
  onChange: (value: string) => void;
};

export function ChallengesRenderer({ challenge, response, onChange }: Props) {
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
        <Button onClick={() => onChange('verified')} className="w-full">
          Verify with Yoti
        </Button>
      )}

      {challenge.type === 'declaration' && (
        <Button onClick={() => onChange('signed')} className="w-full">
          Sign Declaration
        </Button>
      )}

      {challenge.type === 'register' && (
        <Button onClick={() => onChange('registered')} className="w-full">
          {challenge.buttonText || 'Register Score'}
        </Button>
      )}

      {challenge.type === 'checkbox' && (
        <div className="flex items-center space-x-2">
          <Checkbox id={challenge.id} checked={response === 'true'} onCheckedChange={(checked: any) => onChange(checked ? 'true' : 'false')} />
          <Label htmlFor={challenge.id}>I acknowledge and accept</Label>
        </div>
      )}
    </div>
  );
}
