type Step = {
  label: string;
};

type StepperProps = {
  steps: Step[];
  currentStep: number;
};

export function Stepper({ steps, currentStep }: StepperProps) {
  return (
    <>
      <div className="flex items-center justify-center gap-2 sm:gap-4 sm:mb-6">
        {steps.map((step, index) => {
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;

          return (
            <div key={index} className="flex items-center gap-2 w-auto">
              <div
                className={`
                w-6 h-6 rounded-full flex items-center justify-center 
                font-bold text-white transition-all shrink-0 text-sm
                ${isCompleted ? 'bg-blue-900' : isActive ? 'bg-green-600' : 'bg-gray-300'}
              `}
              >
                {index + 1}
              </div>
              <span
                className={`
                text-sm ${isActive ? 'font-medium text-green-600' : 'text-gray-500'}
                truncate hidden sm:block
              `}
              >
                {step.label}
              </span>

              {index !== steps.length - 1 && <div className="hidden md:block w-5 h-px bg-gray-300 mx-2" />}
              {index !== steps.length - 1 && <div className="sm:hidden w-5 h-px bg-gray-300 mx-2" />}
            </div>
          );
        })}
      </div>
      {/* Active step label for small screens */}
      <div className="sm:hidden text-sm font-medium text-blue-600 text-center m-4">{steps[currentStep].label}</div>
    </>
  );
}
