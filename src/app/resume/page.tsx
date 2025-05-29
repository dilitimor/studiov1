
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import ResumeFormStepper from "@/components/resume-form/ResumeFormStepper";
import { Card, CardContent } from "@/components/ui/card";
import ResumeSidebar from "@/components/layout/ResumeSidebar"; // Import the reusable sidebar

export default function ResumePage() {
  return (
    <ProtectedRoute>
      <div className="flex flex-col md:flex-row shadow-2xl rounded-xl overflow-hidden border border-border">
        <ResumeSidebar />
        <main className="w-full md:w-2/3 lg:w-3/4 bg-card">
          <div className="p-4 sm:p-6 md:p-8 h-full overflow-y-auto">
            <Card className="shadow-none border-0 h-full">
              <CardContent className="p-0 md:p-2 h-full">
                <ResumeFormStepper />
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
