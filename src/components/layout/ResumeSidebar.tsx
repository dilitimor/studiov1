
"use client";

import { Sparkles, CheckCircle2, Download, Rocket } from "lucide-react";

export default function ResumeSidebar() {
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
