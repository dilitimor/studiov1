
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { getTentangKami } from "@/services/firestoreService";
import type { AboutUsContentValues } from "@/lib/schema";
import { Loader2 } from "lucide-react";

// Default content if CMS fetch fails or data is not set
const defaultAboutUsContent: AboutUsContentValues = {
  title: "Tentang CVBeres.id",
  content: "CVBeres.id adalah platform inovatif yang dirancang untuk membantu Anda membuat resume profesional dengan mudah dan cepat. Kami percaya bahwa setiap orang berhak mendapatkan kesempatan terbaik dalam karir mereka, dan resume yang kuat adalah langkah pertama menuju kesuksesan.\n\nMisi kami adalah memberdayakan pencari kerja dengan alat yang canggih namun intuitif, menggabungkan desain modern dengan teknologi AI terkini untuk menghasilkan resume yang menonjol.\n\nTim kami terdiri dari para profesional di bidang HR, desain, dan teknologi, yang berkolaborasi untuk memberikan pengalaman terbaik bagi pengguna kami.",
  imageUrl: "https://placehold.co/800x400.png",
  imageAlt: "Our Team",
  dataAiHint: "team collaboration",
};

async function fetchAboutUsData(): Promise<AboutUsContentValues> {
  try {
    const data = await getTentangKami();
    if (data && data.title && data.content) { // Basic check for essential fields
      // If data is fetched, ensure title is updated if it still contains old name
      if (data.title === "Tentang ResumeForge") {
        data.title = defaultAboutUsContent.title;
      }
      if (data.content.startsWith("ResumeForge adalah")) {
         data.content = defaultAboutUsContent.content;
      }
      return data;
    }
    return defaultAboutUsContent; // Return default if data is incomplete or not found
  } catch (error) {
    console.error("Failed to fetch Tentang Kami data:", error);
    return defaultAboutUsContent; // Return default on error
  }
}

export default async function TentangKamiPage() {
  const aboutUsData = await fetchAboutUsData();

  // This check is mostly for if fetchAboutUsData itself could return null, 
  // but with defaults, it should always return an object.
  if (!aboutUsData) {
     return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-20rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg text-muted-foreground">Memuat konten...</p>
      </div>
    );
  }
  
  // Split content into paragraphs for rendering
  const paragraphs = aboutUsData.content.split('\n').filter(p => p.trim() !== '');

  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl text-primary">{aboutUsData.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {paragraphs.map((p, index) => (
            <p key={index} className="text-lg leading-relaxed text-foreground/90">
              {p}
            </p>
          ))}
          {aboutUsData.imageUrl && (
            <div className="mt-8">
              <Image 
                src={aboutUsData.imageUrl} 
                alt={aboutUsData.imageAlt || "Tentang Kami Image"}
                width={800} 
                height={400} 
                className="rounded-lg object-cover w-full"
                data-ai-hint={aboutUsData.dataAiHint || "office team"} 
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
