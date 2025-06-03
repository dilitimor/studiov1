
import ResumeSidebar from "@/components/layout/ResumeSidebar";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col md:flex-row shadow-2xl rounded-xl overflow-hidden border border-border">
      <ResumeSidebar />
      <main className="w-full md:w-2/3 lg:w-3/4 bg-card">
        <div className="p-4 sm:p-6 md:p-8 h-full overflow-y-auto">
          <div className="flex flex-col items-center justify-center text-center py-12">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Welcome to <span className="text-primary">CVBeres.id</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10">
              Craft your perfect professional resume effortlessly. Our step-by-step builder and AI-powered tools will help you stand out.
            </p>
            <Button size="lg" asChild className="group">
              <Link href="/resume">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            
            <div className="mt-20 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 max-w-5xl w-full">
              <div className="p-6 bg-background rounded-lg shadow-md border border-border">
                <h3 className="text-xl font-semibold mb-3 text-primary">Easy to Use</h3>
                <p className="text-muted-foreground text-sm">Intuitive step-by-step forms guide you through the resume creation process.</p>
              </div>
              <div className="p-6 bg-background rounded-lg shadow-md border border-border">
                <h3 className="text-xl font-semibold mb-3 text-primary">AI-Powered</h3>
                <p className="text-muted-foreground text-sm">Enhance your resume with our AI writing polisher for impactful descriptions.</p>
              </div>
              <div className="p-6 bg-background rounded-lg shadow-md border border-border">
                <h3 className="text-xl font-semibold mb-3 text-primary">Professional Templates</h3>
                <p className="text-muted-foreground text-sm">Choose from a variety of professional templates (coming soon!).</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
