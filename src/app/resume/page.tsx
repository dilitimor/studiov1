
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import ResumeFormStepper from "@/components/resume-form/ResumeFormStepper";
import { Card, CardContent } from "@/components/ui/card";
import { Zap } from "lucide-react";

function GenZIntro() {
  return (
    <div className="relative bg-gradient-to-br from-primary via-accent to-secondary p-8 md:p-12 rounded-xl shadow-2xl overflow-hidden mb-12">
      <div className="absolute inset-0 opacity-10">
        {/* Decorative background elements can go here */}
      </div>
      <div className="relative z-10 text-center md:text-left">
        <div className="flex justify-center md:justify-start items-center mb-4">
          <Zap className="h-12 w-12 text-primary-foreground animate-pulse" />
          <h1 className="text-4xl md:text-5xl font-extrabold text-primary-foreground ml-3 tracking-tight">
            Let&apos;s Forge Your Future!
          </h1>
        </div>
        <p className="text-lg md:text-xl text-primary-foreground/90 max-w-2xl mx-auto md:mx-0">
          Unleash your potential with a resume that truly stands out. Our intuitive builder and AI smarts make it a breeze.
        </p>
      </div>
    </div>
  );
}

function ProfessionalFormArea() {
  return (
    <Card className="shadow-xl border-2 border-border">
      <CardContent className="p-6 md:p-10">
        <ResumeFormStepper />
      </CardContent>
    </Card>
  );
}

export default function ResumePage() {
  return (
    <ProtectedRoute>
      <div className="container mx-auto py-8">
        {/* Top 1/3 Gen-Z Style */}
        <section className="mb-12">
          <GenZIntro />
        </section>

        {/* Bottom 2/3 Professional Style */}
        <section>
          <ProfessionalFormArea />
        </section>
      </div>
    </ProtectedRoute>
  );
}
