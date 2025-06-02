
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, Loader2 } from "lucide-react";
import { getBantuan } from "@/services/firestoreService";
import type { BantuanContentValues } from "@/lib/schema";

async function fetchBantuanData(): Promise<BantuanContentValues | null> {
  try {
    const data = await getBantuan();
    // Provide default structure if no data is found to prevent rendering errors
    if (!data) {
      return {
        mainTitle: "Pusat Bantuan",
        introText: "Informasi bantuan akan segera tersedia.",
        faqTitle: "Pertanyaan Umum (FAQ)",
        faqs: [{ question: "Bagaimana cara memulai?", answer: "Informasi akan segera ditambahkan." }],
        contactTitle: "Hubungi Kami",
        contactIntroText: "Anda bisa menghubungi kami melalui:",
        contactEmail: "",
        contactPhone: "",
        contactHours: "",
      };
    }
    return data;
  } catch (error) {
    console.error("Failed to fetch Bantuan data:", error);
    return null; // Or a default structure on error
  }
}


export default async function BantuanPage() {
  const bantuanData = await fetchBantuanData();

  if (!bantuanData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-20rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg text-muted-foreground">Memuat konten bantuan...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl text-primary">{bantuanData.mainTitle}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg text-foreground/90 mb-8">
            {bantuanData.introText}
          </p>

          <h2 className="text-2xl font-semibold mb-4 text-primary">{bantuanData.faqTitle}</h2>
          {bantuanData.faqs && bantuanData.faqs.length > 0 ? (
            <Accordion type="single" collapsible className="w-full">
              {bantuanData.faqs.map((faq, index) => (
                <AccordionItem value={`item-${index + 1}`} key={index}>
                  <AccordionTrigger className="text-lg hover:text-accent transition-colors text-left">{faq.question}</AccordionTrigger>
                  <AccordionContent className="text-base text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <p className="text-muted-foreground">Tidak ada FAQ yang tersedia saat ini.</p>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-primary">{bantuanData.contactTitle}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-lg text-foreground/90">
            {bantuanData.contactIntroText}
          </p>
          {bantuanData.contactEmail && (
            <div className="flex items-center space-x-3">
              <Mail className="h-6 w-6 text-primary" />
              <a href={`mailto:${bantuanData.contactEmail}`} className="text-lg text-accent hover:underline">
                {bantuanData.contactEmail}
              </a>
            </div>
          )}
          {bantuanData.contactPhone && (
            <div className="flex items-center space-x-3">
              <Phone className="h-6 w-6 text-primary" />
              <span className="text-lg text-foreground/90">{bantuanData.contactPhone} {bantuanData.contactHours && `${bantuanData.contactHours}`}</span>
            </div>
          )}
          {(!bantuanData.contactEmail && !bantuanData.contactPhone) && (
            <p className="text-muted-foreground">Informasi kontak belum tersedia.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
