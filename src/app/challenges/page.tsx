'use client';
import { AppSidebar } from '@/components/challenges/app-sidebar';
import { ChallengesRenderer } from '@/components/challenges/ChallengesRenderer';
import { StickyFooter } from '@/components/challenges/sticky-footer';
import { StickyHeader } from '@/components/challenges/sticky-header';
import BrandWatermark from '@/components/common/BrandWatermark';
import LogoWithText from '@/components/common/LogoWithText';
import UsernameMenu from '@/components/common/username-menu';
import { Card, CardContent } from '@/components/ui/card';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { setCurrentStep, setDescription, setResponses, setScore, setTitle } from '@/store/slices/ideaCreationSlice';
import { setIdeas } from '@/store/slices/ideasSlice';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';

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

// Define the creative label type for type safety
type CreativeLabel = 'Nakedness' | 'Designer Re:designer' | 'Home' | 'Bonus' | 'Now';
type OriginalCategory = 'Technology' | 'Customer' | 'Geography' | 'Bonus' | 'Time';

// Updated step labels with more creative names
const steps = [
  { label: 'Nakedness' as CreativeLabel }, // Changed from Technology
  { label: 'Designer Re:designer' as CreativeLabel }, // Changed from Customer
  { label: 'Home' as CreativeLabel }, // Changed from Geography
  { label: 'Bonus' as CreativeLabel }, // Kept the same
  { label: 'Now' as CreativeLabel } // Changed from Time
];

// Map the new creative names to the original categories for data handling
const creativeToOriginalMap: Record<CreativeLabel, OriginalCategory> = {
  'Nakedness': 'Technology',
  'Designer Re:designer': 'Customer',
  'Home': 'Geography',
  'Bonus': 'Bonus',
  'Now': 'Time'
};

const categoryChallenges = {
  Technology: [
    {
      id: 'tech_1',
      challenge: 'Do you want 100,000 points?',
      type: 'mcq',
      options: [
        { label: 'Leave your user with nothing but the value add. (nothing but a smile)', value: 'op_1', score: 100000 },
      ],
    },
    {
      id: 'tech_2',
      challenge: 'Do you want 10,000 points?',
      type: 'mcq',
      options: [
        { label: 'Leave your user with something that will be collected by yourself for re-use. (a delayed smile)', value: 'op_2', score: 10000 },
      ],
    },
    {
      id: 'tech_3',
      challenge: 'Do you want 1000 points?',
      type: 'mcq',
      options: [
        { label: 'Leave user with something that has to be thrown into the refuse bin and collected from curbside.', value: 'op_3', score: 1000 },
      ],
    },
    {
      id: 'tech_4',
      challenge: 'Do you want 1000 points?',
      type: 'mcq',
      options: [
        { label: 'Leave user with something that will need to be collected by a third party e.g. curbside recycling. (an obligation/cost)', value: 'op_1', score: 1000 },
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
      ],
    },
    {
      id: 'cust_2',
      challenge: 'Do you want 10,000 points?',
      type: 'mcq',
      options: [
        { label: 'You have shown your idea to some presumed stakeholders and turned them into Re:designers by changing your offer of service based on their views.', value: 'op_2', score: 10000 },
      ],
    },
    {
      id: 'cust_3',
      challenge: 'Do you want 1000 points?',
      type: 'mcq',
      options: [
        { label: 'You have shown your idea to some presumed stakeholders and kept your offer of service the same as before.', value: 'op_3', score: 1000 },
      ],
    },
    {
      id: 'cust_4',
      challenge: 'Do you want 0 points?',
      type: 'mcq',
      options: [
        { label: 'You have not shown your idea to any stake holders at all.', value: 'op_1', score: 0 },
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
      challenge: 'Name your idea',
      type: 'text',
      placeholder: 'Give your idea a title',
      validation: {
        required: true,
        errorMessage: 'Please provide a title for your idea'
      }
    },
    {
      id: 'time_2',
      challenge: 'Describe your idea',
      type: 'text',
      placeholder: 'Briefly describe what your idea is about',
      validation: {
        required: true,
        errorMessage: 'Please provide a description for your idea'
      }
    },
    {
      id: 'time_3',
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

  // Choose which variant to use - 'Position' or 'Score'
  const positionVariant = 'Position';

  // Fetch ideas data for leaderboard position calculation
  useEffect(() => {
    const fetchIdeas = async () => {
      try {
        const response = await fetch('/api/ideas', {
          method: 'GET',
        });

        const ideas = await response.json();
        dispatch(setIdeas(ideas));
      } catch (error) {
        console.error('Error fetching ideas:', error);
      }
    };

    fetchIdeas();
  }, [dispatch]);

  // useEffect(() => {
  //   if (!title || !description) {
  //     router.push('/new-idea');
  //   }
  // }, [title, description, router]);

  // Get the creative label for current step
  const creativeLabel = steps[currentStep].label as CreativeLabel;

  // Map the creative label back to the original category for data
  const originalCategory = creativeToOriginalMap[creativeLabel];
  const currentChallenges = categoryChallenges[originalCategory] as Challenge[];

  const updateResponses = (id: string, value: string) => {
    // Get the previous responses for this challenge
    const previousValue = responses[id];

    // Update responses in Redux
    dispatch(setResponses({ [id]: value }));

    // Handle scoring for Technology and Customer MCQs
    if (id.startsWith('tech_') || id.startsWith('cust_')) {
      const challenge = currentChallenges.find((c) => c.id === id);

      // If value is empty, it means the user deselected the option
      if (value === '') {
        // Find the previously selected option to subtract its score
        const previousOption = challenge?.options?.find((opt) => opt.value === previousValue);
        const previousPoints = previousOption?.score || 0;

        // Subtract the previous points
        dispatch(setScore(score - previousPoints));
        return;
      }

      // Handle normal selection/change
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
    if (originalCategory === 'Time') {
      // Save title and description to store
      if (responses['time_1']) {
        dispatch(setTitle(responses['time_1']));
      }

      if (responses['time_2']) {
        dispatch(setDescription(responses['time_2']));
      }

      if (responses['time_3'] === 'registered') {
        // Final submission logic here
        console.log('Final Score:', score);
        // You can add API call here to save the score
      }
    }
  };

  const next = () => {
    // Check if there are any validation errors before proceeding
    const isValidationPass = validateCurrentStep();
    if (!isValidationPass) {
      return;
    }

    // Check scores before moving to next step
    if (originalCategory === 'Geography') {
      handleGeographyScore();
    } else if (originalCategory === 'Bonus') {
      handleBonusScore();
    } else if (originalCategory === 'Time') {
      handleTimeSubmission();
    }
    dispatch(setCurrentStep(Math.min(currentStep + 1, steps.length - 1)));
  };

  // Validate current step fields
  const validateCurrentStep = (): boolean => {
    // Validate "Time" step form fields
    if (originalCategory === 'Time') {
      const titleField = responses['time_1'];
      const descriptionField = responses['time_2'];

      let isValid = true;

      // Check if title is filled
      if (!titleField && currentChallenges.find(c => c.id === 'time_1')?.validation?.required) {
        toast.error('Please provide a title for your idea');
        isValid = false;
      }

      // Check if description is filled
      if (!descriptionField && currentChallenges.find(c => c.id === 'time_2')?.validation?.required) {
        toast.error('Please provide a description for your idea');
        isValid = false;
      }

      return isValid;
    }

    // Validate Geography step
    if (originalCategory === 'Geography') {
      const w3wLocation = responses['geo_1'];

      if (!w3wLocation && currentChallenges.find(c => c.id === 'geo_1')?.validation?.required) {
        toast.error('Please provide a valid W3W location');
        return false;
      }

      // Validate W3W format if there's a pattern
      const pattern = currentChallenges.find(c => c.id === 'geo_1')?.validation?.pattern;
      if (pattern && w3wLocation) {
        const regex = new RegExp(pattern);
        if (!regex.test(w3wLocation)) {
          toast.error('Please provide a valid W3W location format');
          return false;
        }
      }
    }

    return true;
  };

  const prev = () => {
    if (currentStep === 0) {
      router.push('/new-idea');
      return;
    }
    dispatch(setCurrentStep(Math.max(currentStep - 1, 0)));
  };

  return (
    <div className="flex flex-col min-h-screen overflow-hidden bg-gray-50">
      {/* Background watermark */}
      <BrandWatermark opacity={0.03} size="70vh" blur={2} offsetY={20} />

      <StickyHeader />

      <SidebarProvider>
        <div className="flex flex-1 overflow-hidden pt-14 pb-14">
          <div className="hidden sm:block w-64 shrink-0 pt-0 sticky top-14 h-[calc(100vh-28px)] z-30">
            <AppSidebar
              steps={steps}
              currentStep={currentStep}
              onStepClick={(index) => dispatch(setCurrentStep(index))}
            />
          </div>
          <div className="flex-1 bg-white flex flex-col h-full overflow-auto">
            <header className="flex justify-between px-6 py-4 border-b sm:hidden bg-white/90 backdrop-blur-md shadow-sm sticky top-14 z-30">
              <div className="flex items-center gap-2">
                <LogoWithText size="sm" />
              </div>
              <SidebarTrigger className="sm:hidden" />
            </header>

            <main className="flex-1 w-full max-w-7xl mx-auto p-4 pb-20">
              <div className="mb-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold">{steps[currentStep]?.label}</h2>
                  <div className="flex items-center gap-2 sm:hidden">
                    <UsernameMenu />
                  </div>
                </div>

                {steps[currentStep]?.label === 'Nakedness' && (
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-medium">How naked is your idea?</h3>
                    <p className="text-gray-600">The simpler, the better</p>
                  </div>
                )}

                <Card className="shadow-md">
                  <CardContent className="p-6">
                    {currentChallenges.map((challenge: Challenge) => (
                      <div key={challenge.id} className="mb-8">
                        <ChallengesRenderer
                          challenge={challenge}
                          response={responses[challenge.id] || ''}
                          onChange={(value) => updateResponses(challenge.id, value)}
                        />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </main>
          </div>
        </div>
      </SidebarProvider>

      <StickyFooter
        onNext={next}
        onPrev={prev}
        isFirstStep={currentStep === 0}
        isLastStep={currentStep === steps.length - 1}
      />
    </div>
  );
};

export default page;
