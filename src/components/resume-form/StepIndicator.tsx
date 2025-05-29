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
      <ol role="list" className="flex items-center justify-center space-x-2 md:space-x-4">
        {steps.map((step, stepIdx) => (
          <li key={step.name} className="relative flex-1">
            {currentStep > step.id ? (
              <div className="group flex w-full flex-col items-center">
                <span className="flex items-center px-2 py-1 text-xs font-medium">
                  <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary group-hover:bg-primary/80">
                    <svg className="h-4 w-4 text-primary-foreground" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                    </svg>
                  </span>
                  <span className="ml-2 hidden text-xs font-medium text-primary md:inline-block">{step.name}</span>
                </span>
                {stepIdx !== steps.length - 1 && <div className="absolute right-0 top-1/2 h-0.5 w-[calc(100%-2rem)] -translate-y-1/2 transform bg-primary md:w-[calc(100%-3rem)]" />}
              </div>
            ) : currentStep === step.id ? (
              <div className="group flex w-full flex-col items-center" aria-current="step">
                <span className="flex items-center px-2 py-1 text-xs font-medium">
                  <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border-2 border-primary bg-background">
                    <span className="text-primary">{step.id}</span>
                  </span>
                  <span className="ml-2 hidden text-xs font-medium text-primary md:inline-block">{step.name}</span>
                </span>
                {stepIdx !== steps.length - 1 && <div className="absolute right-0 top-1/2 h-0.5 w-[calc(100%-2rem)] -translate-y-1/2 transform bg-border md:w-[calc(100%-3rem)]" />}
              </div>
            ) : (
              <div className="group flex w-full flex-col items-center">
                <span className="flex items-center px-2 py-1 text-xs font-medium">
                  <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border-2 border-border bg-background group-hover:border-muted-foreground">
                    <span className="text-muted-foreground">{step.id}</span>
                  </span>
                  <span className="ml-2 hidden text-xs font-medium text-muted-foreground group-hover:text-foreground md:inline-block">{step.name}</span>
                </span>
                {stepIdx !== steps.length - 1 && <div className="absolute right-0 top-1/2 h-0.5 w-[calc(100%-2rem)] -translate-y-1/2 transform bg-border md:w-[calc(100%-3rem)]" />}
              </div>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}