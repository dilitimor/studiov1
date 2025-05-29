
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import ResumeFormStepper from "@/components/resume-form/ResumeFormStepper";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, CheckCircle2, Download, Rocket } from "lucide-react";

// New component for the left sidebar
function ResumeSidebar() {
  const features = [
    {
      icon: <Sparkles className="h-7 w-7 text-yellow-300" />,
      title: "Super Easy",
      description: "Fill out one simple form and you're done!",
    },
    {
      icon: <CheckCircle2 className="h-7 w-7 text-yellow-300" />,
      title: "Professional Design",
      description: "Impress recruiters with a clean, modern look.",
    },
    {
      icon: <Download className="h-7 w-7 text-yellow-300" />,
      title: "Instant Download",
      description: "Get your resume in PDF format instantly.",
    },
  ];

  return (
    <aside className="w-full md:w-1/3 lg:w-1/4 bg-accent text-accent-foreground p-8 flex flex-col space-y-10">
      <div>
        <h1 className="text-4xl font-bold">
          <span className="text-yellow-300">Awesome</span> Resume!
        </h1>
        <p className="mt-3 text-lg leading-relaxed">
          Stand out from the crowd with a professional resume that gets you noticed! <Rocket className="inline h-5 w-5 ml-1" />
        </p>
      </div>
      <div className="space-y-8">
        {features.map((feature, index) => (
          <div key={index} className="flex items-start space-x-4">
            <div className="flex-shrink-0 mt-1">{feature.icon}</div>
            <div>
              <h2 className="text-xl font-semibold">{feature.title}</h2>
              <p className="text-sm opacity-90">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}

export default function ResumePage() {
  return (
    <ProtectedRoute>
      {/* 
        The parent <main> in layout.tsx has "container mx-auto px-4 py-8".
        To make this layout full-width for the columns, we need to adjust.
        For now, this will be constrained by the layout.tsx container.
        A more ideal solution would involve making layout.tsx more flexible or
        applying negative margins if this component needs to break out of the container.
        Given the constraints, this will render the two columns *within* the existing page container.
      */}
      <div className="flex flex-col md:flex-row shadow-2xl rounded-xl overflow-hidden border border-border">
        <ResumeSidebar />
        <main className="w-full md:w-2/3 lg:w-3/4 bg-card">
          {/* The Card component itself adds padding, so the direct children of 'main' might not need extra padding if Card is full height */}
          <div className="p-4 sm:p-6 md:p-8 h-full overflow-y-auto">
             {/* We can remove the Card and CardContent here if ResumeFormStepper itself is styled or if we want the form to directly use the 'main' area's background */}
            <Card className="shadow-none border-0 h-full"> {/* Or remove Card completely if ResumeFormStepper manages its own background/padding */}
              <CardContent className="p-0 md:p-2 h-full"> {/* Adjust padding as needed */}
                <ResumeFormStepper />
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
