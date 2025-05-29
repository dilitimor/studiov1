import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

// TODO: Fetch content from CMS
const aboutUsContentFromCMS = {
  title: "Tentang ResumeForge",
  paragraphs: [
    "ResumeForge adalah platform inovatif yang dirancang untuk membantu Anda membuat resume profesional dengan mudah dan cepat. Kami percaya bahwa setiap orang berhak mendapatkan kesempatan terbaik dalam karir mereka, dan resume yang kuat adalah langkah pertama menuju kesuksesan.",
    "Misi kami adalah memberdayakan pencari kerja dengan alat yang canggih namun intuitif, menggabungkan desain modern dengan teknologi AI terkini untuk menghasilkan resume yang menonjol.",
    "Tim kami terdiri dari para profesional di bidang HR, desain, dan teknologi, yang berkolaborasi untuk memberikan pengalaman terbaik bagi pengguna kami."
  ],
  imageUrl: "https://placehold.co/800x400.png",
  imageAlt: "Our Team"
};


export default function TentangKamiPage() {
  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl text-primary">{aboutUsContentFromCMS.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {aboutUsContentFromCMS.paragraphs.map((p, index) => (
            <p key={index} className="text-lg leading-relaxed text-foreground/90">
              {p}
            </p>
          ))}
          <div className="mt-8">
            <Image 
              src={aboutUsContentFromCMS.imageUrl} 
              alt={aboutUsContentFromCMS.imageAlt}
              width={800} 
              height={400} 
              className="rounded-lg object-cover w-full"
              data-ai-hint="team collaboration" 
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}