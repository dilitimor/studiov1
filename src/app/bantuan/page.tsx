import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone } from "lucide-react";

// TODO: Fetch FAQ and contact info from CMS
const faqDataFromCMS = [
  {
    question: "Bagaimana cara memulai membuat resume?",
    answer: "Setelah login, klik tombol 'Buat Resume Baru' di dashboard Anda. Ikuti langkah-langkah yang ada untuk mengisi informasi pribadi, pendidikan, dan pengalaman kerja Anda.",
  },
  {
    question: "Apakah saya bisa menyimpan resume dan melanjutkannya nanti?",
    answer: "Ya, semua data yang Anda masukkan akan tersimpan secara otomatis. Anda bisa keluar dan melanjutkan pengisian resume kapan saja.",
  },
  {
    question: "Bagaimana cara menggunakan fitur AI Polisher?",
    answer: "Pada bagian deskripsi pekerjaan atau keahlian, Anda akan menemukan tombol 'Polish dengan AI'. Klik tombol tersebut, dan sistem kami akan membantu menyempurnakan tulisan Anda.",
  },
  {
    question: "Apakah data saya aman?",
    answer: "Kami sangat menjaga privasi dan keamanan data Anda. Semua informasi disimpan dengan enkripsi dan tidak akan dibagikan kepada pihak ketiga tanpa izin Anda.",
  },
];

const contactInfoFromCMS = {
  email: "dukungan@resumeforge.com",
  phone: "+62 21 123 4567",
};

export default function BantuanPage() {
  return (
    <div className="space-y-12">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl text-primary">Pusat Bantuan ResumeForge</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg text-foreground/90 mb-8">
            Kami siap membantu Anda! Temukan jawaban atas pertanyaan umum di bawah ini, atau hubungi kami jika Anda memerlukan bantuan lebih lanjut.
          </p>

          <h2 className="text-2xl font-semibold mb-4 text-primary">Pertanyaan Umum (FAQ)</h2>
          <Accordion type="single" collapsible className="w-full">
            {faqDataFromCMS.map((faq, index) => (
              <AccordionItem value={`item-${index + 1}`} key={index}>
                <AccordionTrigger className="text-lg hover:text-accent transition-colors">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-base text-muted-foreground leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-primary">Hubungi Kami</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-lg text-foreground/90">
            Jika Anda tidak menemukan jawaban yang Anda cari, jangan ragu untuk menghubungi tim dukungan kami:
          </p>
          <div className="flex items-center space-x-3">
            <Mail className="h-6 w-6 text-primary" />
            <a href={`mailto:${contactInfoFromCMS.email}`} className="text-lg text-accent hover:underline">
              {contactInfoFromCMS.email}
            </a>
          </div>
          <div className="flex items-center space-x-3">
            <Phone className="h-6 w-6 text-primary" />
            <span className="text-lg text-foreground/90">{contactInfoFromCMS.phone} (Jam Kerja)</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}