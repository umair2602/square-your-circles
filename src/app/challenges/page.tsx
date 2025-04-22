'use client';
import CarbonCount from '@/components/common/CarbonCount';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChallengesRenderer } from '@/components/challenges/ChallengesRenderer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useSelector, useDispatch } from 'react-redux';
import { setScore, setResponses, setCurrentStep } from '@/store/slices/ideaCreationSlice';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import UsernameMenu from '@/components/common/username-menu';
import { useRouter } from 'next/navigation';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/challenges/app-sidebar';

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
  validation?: {
    required?: boolean;
    pattern?: string;
    errorMessage?: string;
  };
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
      id: 'geo_1',
      challenge: 'Enter W3W square words location',
      type: 'text',
      placeholder: 'Enter W3W location',
      validation: {
        required: true,
        pattern: '^[a-zA-Z]+\\.[a-zA-Z]+\\.[a-zA-Z]+$',
        errorMessage: 'Please enter a valid W3W location',
      },
    },
    {
      id: 'geo_2',
      challenge: 'Verify your identity using Yoti',
      type: 'verify',
    },
    {
      id: 'geo_3',
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
  const router = useRouter();
  const { score, title, description, responses, currentStep } = useSelector((state: any) => state.ideaCreation);

  useEffect(() => {
    if (!title || !description) {
      router.push('/new-idea');
    }
  }, [title, description]);

  const category = steps[currentStep].label as keyof typeof categoryChallenges;
  const challenges = categoryChallenges[category] as Challenge[];

  const updateResponses = (id: string, value: string) => {
    // Get the previous responses for this challenge
    const previousValue = responses[id];

    // Update responses in Redux
    dispatch(setResponses({ [id]: value }));

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
    const hasW3W = responses['geo_1']?.length > 0;
    const hasYoti = responses['geo_2'] === 'verified';
    const hasDeclaration = responses['geo_3'] === 'true';

    // Store whether points were previously awarded
    const wasAwarded = responses['geo_score_awarded'] === 'true';

    if (hasW3W && hasYoti && hasDeclaration) {
      if (!wasAwarded) {
        dispatch(setScore(score + 100000));
        dispatch(setResponses({ 'geo_score_awarded': 'true' }));
      }
    } else if (wasAwarded) {
      // Remove points if previously awarded but conditions no longer met
      dispatch(setScore(score - 100000));
      dispatch(setResponses({ 'geo_score_awarded': 'false' }));
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
    dispatch(setCurrentStep(Math.min(currentStep + 1, steps.length - 1)));
  };

  const prev = () => {
    if (currentStep === 0) {
      router.push('/new-idea');
      return;
    }
    dispatch(setCurrentStep(Math.max(currentStep - 1, 0)));
  };

  return (
    <SidebarProvider>
      <AppSidebar 
        steps={steps} 
        currentStep={currentStep} 
        onStepClick={(index) => dispatch(setCurrentStep(index))} 
      />
      <div className="min-h-screen w-full flex flex-col bg-gray-50 px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-3 shrink-0 flex-wrap gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <SidebarTrigger className="md:hidden" />
            <UsernameMenu />
            <CarbonCount />
          </div>
          <div className="flex items-center justify-between gap-1 px-2.5 py-1 bg-white rounded-md shadow-md border">
            <span className="text-gray-600 font-medium">Score: </span>
            <span className="text-green-600 font-medium">{`${score}`}</span>
          </div>
        </div>
        <div className="mx-auto w-full">
          <div className="mb-5 flex flex-col items-center justify-center font-bold text-xl">
            <div>Complete the challenges to earn points!</div>
            <div className="md:hidden">{steps[currentStep].label}</div>
          </div>

          {/* Category Form here */}
          <div className="max-w-4xl w-full mx-auto md:min-h-[68vh] overflow-y-auto">
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

          <div className="max-w-4xl w-full mx-auto flex justify-between gap-3 mt-5">
            <div>
              {/* <Button
                className="bg-blue-700 hover:bg-blue-900"
                onClick={() => {
                  router.push('/new-idea');
                }}
              >
                Back
              </Button> */}
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={prev} className="flex items-center gap-2">
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
      </div>
    </SidebarProvider>
  );
};

export default page;
