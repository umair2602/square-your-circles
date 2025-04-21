'use client';
import CarbonCount from '@/components/common/CarbonCount';
import { useEffect, useState } from 'react';
import { Stepper } from '@/components/challenges/stepper';
import { Button } from '@/components/ui/button';
import { ChallengesRenderer } from '@/components/challenges/ChallengesRenderer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useSelector, useDispatch } from 'react-redux';
import { setScore } from '@/store/slices/ideaCreationSlice';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';

type Option = {
  label: string;
  value: string;
  score: number;
};

type Challenge = {
  id: string;
  challenge: string;
  type: 'mcq' | 'text' | 'verify' | 'declaration' | 'register' | 'checkbox';
  options?: Option[];
  placeholder?: string;
  buttonText?: string;
};

const steps = [{ label: 'Technology' }, { label: 'Customer' }, { label: 'Geography' }, { label: 'Bonus' }, { label: 'Time' }];

const categoryChallenges = {
  Technology: [
    {
      id: 'tech_1',
      challenge: 'Do you want 100,000 points?',
      type: 'mcq',
      options: [
        { label: 'Leave your user with nothing but the value add. (nothing but a smile)', value: 'op_1', score: 100000 },
        { label: 'Sample wrong option', value: 'op_2', score: 0 },
        { label: 'Sample wrong option', value: 'op_3', score: 0 },
      ],
    },
    {
      id: 'tech_2',
      challenge: 'Do you want 10,000 points?',
      type: 'mcq',
      options: [
        { label: 'Sample wrong option', value: 'op_1', score: 0 },
        { label: 'Leave your user with something that will be collected by yourself for re-use. (a delayed smile)', value: 'op_2', score: 10000 },
        { label: 'Sample wrong option', value: 'op_3', score: 0 },
      ],
    },
    {
      id: 'tech_3',
      challenge: 'Do you want 1000 points?',
      type: 'mcq',
      options: [
        { label: 'Sample wrong option', value: 'op_1', score: 0 },
        { label: 'Sample wrong option', value: 'op_2', score: 0 },
        { label: 'Leave user with something that has to be thrown into the refuse bin and collected from curbside.', value: 'op_3', score: 1000 },
      ],
    },
    {
      id: 'tech_4',
      challenge: 'Do you want 1000 points?',
      type: 'mcq',
      options: [
        { label: 'Leave user with something that will need to be collected by a third party e.g. curbside recycling. (an obligation/cost)', value: 'op_1', score: 1000 },
        { label: 'Sample wrong option', value: 'op_2', score: 0 },
        { label: 'Sample wrong option', value: 'op_3', score: 0 },
      ],
    },
  ],
  Customer: [
    {
      id: 'cust_1',
      challenge: 'Do you want 100,000 points?',
      type: 'mcq',
      options: [
        { label: 'You have shown your idea to some presumed stakeholders and as a result both your idea has changed and the presumed stakeholders have changed along the way.', value: 'op_1', score: 100000 },
        { label: 'Sample wrong option', value: 'op_2', score: 0 },
        { label: 'Sample wrong option', value: 'op_3', score: 0 },
      ],
    },
    {
      id: 'cust_2',
      challenge: 'Do you want 10,000 points?',
      type: 'mcq',
      options: [
        { label: 'Sample wrong option', value: 'op_1', score: 0 },
        { label: 'You have shown your idea to some presumed stakeholders and turned them into Re:designers by changing your offer of service based on their views.', value: 'op_2', score: 10000 },
        { label: 'Sample wrong option', value: 'op_3', score: 0 },
      ],
    },
    {
      id: 'cust_3',
      challenge: 'Do you want 1000 points?',
      type: 'mcq',
      options: [
        { label: 'Sample wrong option', value: 'op_1', score: 0 },
        { label: 'Sample wrong option', value: 'op_2', score: 0 },
        { label: 'You have shown your idea to some presumed stakeholders and kept your offer of service the same as before.', value: 'op_3', score: 1000 },
      ],
    },
    {
      id: 'cust_4',
      challenge: 'Do you want 0 points?',
      type: 'mcq',
      options: [
        { label: 'You have not shown your idea to any stake holders at all.', value: 'op_1', score: 0 },
        { label: 'Sample wrong option', value: 'op_2', score: 0 },
        { label: 'Sample wrong option', value: 'op_3', score: 0 },
      ],
    },
  ],
  Geography: [
    {
      id: 'geo_2',
      challenge: 'Enter W3W square words location',
      type: 'text',
    },
    {
      id: 'geo_3',
      challenge: 'Verify your identity using Yoti',
      type: 'verify',
    },
    {
      id: 'geo_4',
      challenge: 'Sign unlimited liability declaration',
      type: 'checkbox',
    },
  ],
  Bonus: [
    {
      id: 'bonus_1',
      challenge: 'Do you want 10,000 bonus points (Enter reference code for citing an idea)',
      type: 'text',
    },
  ],
  Time: [
    {
      id: 'time_1',
      challenge: 'Register your final score',
      type: 'register',
      buttonText: 'Register Score',
    },
  ],
};

const page = () => {
  const dispatch = useDispatch();
  const { score } = useSelector((state: any) => state.ideaCreation);
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState<Record<string, string>>({});

  useEffect(() => {
    console.log('Responses:', responses);
    console.log('Score:', score);
  }, [responses, score]);

  const category = steps[currentStep].label as keyof typeof categoryChallenges;
  const challenges = categoryChallenges[category] as Challenge[];

  const updateResponses = (id: string, value: string) => {
    // Get the previous responses for this challenge
    const previousValue = responses[id];

    // Update responses state
    setResponses((prev) => ({ ...prev, [id]: value }));

    // Handle scoring for Technology and Customer MCQs
    if (id.startsWith('tech_') || id.startsWith('cust_')) {
      const challenge = challenges.find((c) => c.id === id);
      const selectedOption = challenge?.options?.find((opt) => opt.value === value);
      const newPoints = selectedOption?.score || 0;
      const previousOption = challenge?.options?.find((opt) => opt.value === previousValue);
      const previousPoints = previousOption?.score || 0;

      // Deduct previous points and add new points
      const scoreDifference = newPoints - previousPoints;
      dispatch(setScore(score + scoreDifference));
    }
  };

  const handleGeographyScore = () => {
    const hasW3W = responses['geo_2']?.length > 0;
    const hasYoti = responses['geo_3'] === 'verified';
    const hasDeclaration = responses['geo_4'] === 'true';

    if (hasW3W && hasYoti && hasDeclaration) {
      dispatch(setScore(score + 100000));
    }
  };

  const handleBonusScore = () => {
    if (responses['bonus_1']?.length > 0) {
      dispatch(setScore(score + 10000));
    }
  };

  const handleTimeSubmission = () => {
    if (category === 'Time' && responses['time_1'] === 'registered') {
      // Final submission logic here
      console.log('Final Score:', score);
      // You can add API call here to save the score
    }
  };

  const next = () => {
    // Check scores before moving to next step
    if (category === 'Geography') {
      handleGeographyScore();
    } else if (category === 'Bonus') {
      handleBonusScore();
    } else if (category === 'Time') {
      handleTimeSubmission();
    }
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const prev = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-3">
        <CarbonCount />
        <div className="flex items-center justify-between gap-1 px-2.5 py-1 bg-white rounded-md shadow-md border">
          <span className="text-gray-600 font-medium">Score: </span>
          <span className="text-green-600 font-medium">{`${score}`}</span>
        </div>
      </div>
      <div className="mx-auto">
        <div className="mb-5 flex justify-center font-bold text-xl">Complete the challenges to earn points!</div>
        <Stepper steps={steps} currentStep={currentStep} />

        {/* Category Form here */}
        <div className="max-w-2xl mx-auto md:h-[63vh] overflow-y-auto">
          {category === 'Geography' && (
            <div className="text-md font-medium mb-4">
              <div>Do you want 100,000 points? (Complete all)</div>
            </div>
          )}
          {challenges.map((c: Challenge) => (
            <Card className="mb-4" key={c.id}>
              <CardContent>
                <ChallengesRenderer key={c.id} challenge={c} response={responses[c.id] || ''} onChange={(val) => updateResponses(c.id, val)} />
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex justify-end gap-3 mt-5">
          <Button onClick={prev} disabled={currentStep === 0} className="flex items-center gap-2">
            <IoIosArrowBack className="w-5 h-5" />
            <span className="sr-only">Previous</span>
          </Button>
          <Button onClick={next} disabled={currentStep === steps.length - 1} className="flex items-center gap-2">
            <IoIosArrowForward className="w-5 h-5" />
            <span className="sr-only">Next</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default page;
