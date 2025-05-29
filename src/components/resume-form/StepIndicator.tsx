
interface Step {
  id: number;
  name: string;
}

interface StepIndicatorProps {
  currentStep: number;
  steps: Step[];
}

export default function StepIndicator({ currentStep, steps }: StepIndicatorProps) {
  return (
    <nav aria-label="Progress">
      {/* Added overflow-x-auto, py-2 for scrollbar spacing, px-2 for content padding, and justify-start for scrollable content */}
      <ol role="list" className="flex items-center justify-start md:justify-center space-x-1 sm:space-x-2 md:space-x-4 overflow-x-auto py-2 px-2">
        {steps.map((step, stepIdx) => (
          // Added min-w to ensure flex items don't shrink too much. flex-shrink-0 prevents shrinking past content size if not using flex-1.
          // Using flex-1 with min-w allows them to grow but not shrink too small.
          <li key={step.name} className="relative flex-1 flex-shrink-0 min-w-[70px] sm:min-w-[80px] md:min-w-[100px]">
            {currentStep > step.id ? (
              // Added text-center for the content within the li
              <div className="group flex w-full flex-col items-center text-center">
                <span className="flex items-center px-1 sm:px-2 py-1 text-xs font-medium">
                  <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary group-hover:bg-primary/80">
                    <svg className="h-4 w-4 text-primary-foreground" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                    </svg>
                  </span>
                </span>
                {/* Step name: hidden on xs, inline-block on md+, full width, breaks words, centered */}
                <span className="mt-1 hidden text-xs font-medium text-primary md:inline-block w-full break-words px-1">{step.name}</span>
                {/* Line connecting to the NEXT step. Drawn if not the last step. */}
                {stepIdx !== steps.length - 1 && (
                  <div className="absolute left-[calc(50%_+_0.75rem)] top-[11px] h-0.5 w-[calc(100%_-_1.5rem)] -translate-y-1/2 transform bg-primary -z-10 md:left-[calc(50%_+_0.875rem)] md:w-[calc(100%_-_1.75rem)]" />
                )}
              </div>
            ) : currentStep === step.id ? (
              <div className="group flex w-full flex-col items-center text-center" aria-current="step">
                <span className="flex items-center px-1 sm:px-2 py-1 text-xs font-medium">
                  <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border-2 border-primary bg-background">
                    <span className="text-primary">{step.id}</span>
                  </span>
                </span>
                <span className="mt-1 hidden text-xs font-medium text-primary md:inline-block w-full break-words px-1">{step.name}</span>
                {stepIdx !== steps.length - 1 && (
                  <div className="absolute left-[calc(50%_+_0.75rem)] top-[11px] h-0.5 w-[calc(100%_-_1.5rem)] -translate-y-1/2 transform bg-border -z-10 md:left-[calc(50%_+_0.875rem)] md:w-[calc(100%_-_1.75rem)]" />
                )}
              </div>
            ) : (
              <div className="group flex w-full flex-col items-center text-center">
                <span className="flex items-center px-1 sm:px-2 py-1 text-xs font-medium">
                  <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border-2 border-border bg-background group-hover:border-muted-foreground">
                    <span className="text-muted-foreground">{step.id}</span>
                  </span>
                </span>
                <span className="mt-1 hidden text-xs font-medium text-muted-foreground group-hover:text-foreground md:inline-block w-full break-words px-1">{step.name}</span>
                {stepIdx !== steps.length - 1 && (
                  <div className="absolute left-[calc(50%_+_0.75rem)] top-[11px] h-0.5 w-[calc(100%_-_1.5rem)] -translate-y-1/2 transform bg-border -z-10 md:left-[calc(50%_+_0.875rem)] md:w-[calc(100%_-_1.75rem)]" />
                )}
              </div>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
