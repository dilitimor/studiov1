
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { Loader2, FileText, Image as ImageIcon } from "lucide-react";
import { AboutUsContentSchema, type AboutUsContentValues } from "@/lib/schema";
import { getTentangKami, updateTentangKami } from "@/services/firestoreService";
import NextImage from "next/image";

const defaultAboutUsValues: AboutUsContentValues = {
  title: "Tentang CVBeres.id",
  content: "CVBeres.id adalah platform inovatif yang dirancang untuk membantu Anda membuat resume profesional dengan mudah dan cepat. Kami percaya bahwa setiap orang berhak mendapatkan kesempatan terbaik dalam karir mereka, dan resume yang kuat adalah langkah pertama menuju kesuksesan.\n\nMisi kami adalah memberdayakan pencari kerja dengan alat yang canggih namun intuitif, menggabungkan desain modern dengan teknologi AI terkini untuk menghasilkan resume yang menonjol.\n\nTim kami terdiri dari para profesional di bidang HR, desain, dan teknologi, yang berkolaborasi untuk memberikan pengalaman terbaik bagi pengguna kami.",
  imageUrl: "https://placehold.co/800x400.png",
  imageAlt: "Our Team",
  dataAiHint: "team collaboration",
};

export default function ManageTentangKamiPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);


  const form = useForm<AboutUsContentValues>({
    resolver: zodResolver(AboutUsContentSchema),
    defaultValues: defaultAboutUsValues,
  });

  useEffect(() => {
    async function fetchData() {
      setIsFetching(true);
      try {
        const data = await getTentangKami();
        if (data) {
          // Ensure title is updated if it still contains old name
          if (data.title === "Tentang ResumeForge") {
            data.title = defaultAboutUsValues.title;
          }
          if (data.content.startsWith("ResumeForge adalah")) {
             data.content = defaultAboutUsValues.content;
          }
          form.reset(data);
          if (data.imageUrl) setCurrentImageUrl(data.imageUrl);
        } else {
          await updateTentangKami(defaultAboutUsValues);
          form.reset(defaultAboutUsValues);
          if (defaultAboutUsValues.imageUrl) setCurrentImageUrl(defaultAboutUsValues.imageUrl);
        }
      } catch (error) {
        toast({ title: "Error", description: "Gagal memuat konten Tentang Kami.", variant: "destructive" });
      } finally {
        setIsFetching(false);
      }
    }
    fetchData();
  }, [form, toast]);

  const onSubmit = async (values: AboutUsContentValues) => {
    setIsLoading(true);
    try {
      await updateTentangKami(values);
      if (values.imageUrl) setCurrentImageUrl(values.imageUrl); else setCurrentImageUrl(null);
      toast({ title: "Sukses", description: "Konten Tentang Kami berhasil diperbarui." });
    } catch (error) {
      toast({ title: "Error", description: "Gagal memperbarui konten.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex items-center justify-center h-40">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Card className="shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center">
          <FileText className="mr-2 h-6 w-6 text-primary" /> Kelola Konten Tentang Kami
        </CardTitle>
        <CardDescription>Perbarui teks dan gambar yang ditampilkan di halaman Tentang Kami. Gunakan baris baru untuk paragraf pada konten.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Judul Halaman</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Isi Konten (gunakan baris baru untuk paragraf)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Masukkan konten halaman Tentang Kami di sini..."
                      {...field}
                      rows={10}
                      className="min-h-[200px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             {currentImageUrl && (
              <div className="mb-4 p-2 border rounded-md bg-muted flex flex-col items-center">
                <FormLabel className="mb-1 self-start text-sm">Pratinjau Gambar Saat Ini:</FormLabel>
                <NextImage src={currentImageUrl} alt="Current About Us Image" width={300} height={150} className="object-contain rounded-md" data-ai-hint={form.getValues("dataAiHint") || "placeholder"}/>
              </div>
            )}
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL Gambar (opsional)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/image.png" {...field} onChange={(e) => { field.onChange(e); setCurrentImageUrl(e.target.value); }}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="imageAlt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Teks Alternatif Gambar (opsional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Deskripsi singkat gambar" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dataAiHint"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Petunjuk AI untuk Gambar (opsional, maks 2 kata)</FormLabel>
                      <FormControl>
                        <Input placeholder="Contoh: team office" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </div>


            <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Simpan Perubahan
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
