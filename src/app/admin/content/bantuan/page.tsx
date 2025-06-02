
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { Loader2, HelpCircle, PlusCircle, Trash2 } from "lucide-react";
import { BantuanContentSchema, type BantuanContentValues } from "@/lib/schema";
import { getBantuan, updateBantuan } from "@/services/firestoreService";

const defaultFaqItem = { question: "", answer: "" };
const defaultBantuanValues: BantuanContentValues = {
  mainTitle: "Pusat Bantuan ResumeForge",
  introText: "Kami siap membantu Anda! Temukan jawaban atas pertanyaan umum di bawah ini, atau hubungi kami jika Anda memerlukan bantuan lebih lanjut.",
  faqTitle: "Pertanyaan Umum (FAQ)",
  faqs: [defaultFaqItem],
  contactTitle: "Hubungi Kami",
  contactIntroText: "Jika Anda tidak menemukan jawaban yang Anda cari, jangan ragu untuk menghubungi tim dukungan kami:",
  contactEmail: "dukungan@example.com",
  contactPhone: "+62 21 000 0000",
  contactHours: "(Jam Kerja)",
};

export default function ManageBantuanPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  const form = useForm<BantuanContentValues>({
    resolver: zodResolver(BantuanContentSchema),
    defaultValues: defaultBantuanValues,
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "faqs",
  });

  useEffect(() => {
    async function fetchData() {
      setIsFetching(true);
      try {
        const data = await getBantuan();
        if (data) {
          form.reset(data);
        } else {
          // If no data in Firestore, set default values which might trigger an initial save
          // Or, initialize Firestore with default values if this page is visited for the first time
           await updateBantuan(defaultBantuanValues); 
           form.reset(defaultBantuanValues);
        }
      } catch (error) {
        toast({ title: "Error", description: "Gagal memuat konten Bantuan.", variant: "destructive" });
      } finally {
        setIsFetching(false);
      }
    }
    fetchData();
  }, [form, toast]);

  const onSubmit = async (values: BantuanContentValues) => {
    setIsLoading(true);
    try {
      await updateBantuan(values);
      toast({ title: "Sukses", description: "Konten Bantuan berhasil diperbarui." });
    } catch (error) {
      toast({ title: "Error", description: "Gagal memperbarui konten Bantuan.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex items-center justify-center h-60">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Card className="shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center">
          <HelpCircle className="mr-2 h-6 w-6 text-primary" /> Kelola Konten Halaman Bantuan
        </CardTitle>
        <CardDescription>Perbarui teks, FAQ, dan info kontak yang ditampilkan di halaman Bantuan.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            
            <FormField control={form.control} name="mainTitle" render={({ field }) => (
              <FormItem>
                <FormLabel>Judul Utama Halaman</FormLabel>
                <FormControl><Input {...field} /></FormControl><FormMessage />
              </FormItem>
            )}/>
            <FormField control={form.control} name="introText" render={({ field }) => (
              <FormItem>
                <FormLabel>Teks Perkenalan Halaman</FormLabel>
                <FormControl><Textarea {...field} rows={3} /></FormControl><FormMessage />
              </FormItem>
            )}/>

            <Separator />
            <h3 className="text-xl font-semibold text-foreground/90">Bagian FAQ</h3>
            <FormField control={form.control} name="faqTitle" render={({ field }) => (
              <FormItem>
                <FormLabel>Judul untuk FAQ</FormLabel>
                <FormControl><Input {...field} /></FormControl><FormMessage />
              </FormItem>
            )}/>
            
            {fields.map((field, index) => (
              <Card key={field.id} className="p-4 space-y-4 border shadow-sm">
                <div className="flex justify-between items-center">
                  <FormLabel className="text-base">FAQ #{index + 1}</FormLabel>
                  <Button type="button" variant="ghost" size="sm" onClick={() => remove(index)} className="text-destructive hover:bg-destructive/10">
                    <Trash2 className="mr-1 h-4 w-4" /> Hapus FAQ Ini
                  </Button>
                </div>
                <FormField control={form.control} name={`faqs.${index}.question`} render={({ field: faqField }) => (
                  <FormItem>
                    <FormLabel>Pertanyaan</FormLabel>
                    <FormControl><Input {...faqField} /></FormControl><FormMessage />
                  </FormItem>
                )}/>
                <FormField control={form.control} name={`faqs.${index}.answer`} render={({ field: faqField }) => (
                  <FormItem>
                    <FormLabel>Jawaban</FormLabel>
                    <FormControl><Textarea {...faqField} rows={3}/></FormControl><FormMessage />
                  </FormItem>
                )}/>
              </Card>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={() => append(defaultFaqItem)}>
              <PlusCircle className="mr-2 h-4 w-4" /> Tambah FAQ
            </Button>

            <Separator />
            <h3 className="text-xl font-semibold text-foreground/90">Bagian Info Kontak</h3>
            <FormField control={form.control} name="contactTitle" render={({ field }) => (
              <FormItem>
                <FormLabel>Judul untuk Info Kontak</FormLabel>
                <FormControl><Input {...field} /></FormControl><FormMessage />
              </FormItem>
            )}/>
             <FormField control={form.control} name="contactIntroText" render={({ field }) => (
              <FormItem>
                <FormLabel>Teks Perkenalan Kontak</FormLabel>
                <FormControl><Textarea {...field} rows={2} /></FormControl><FormMessage />
              </FormItem>
            )}/>
            <FormField control={form.control} name="contactEmail" render={({ field }) => (
              <FormItem>
                <FormLabel>Email Kontak</FormLabel>
                <FormControl><Input type="email" placeholder="contoh@email.com" {...field} /></FormControl><FormMessage />
              </FormItem>
            )}/>
            <FormField control={form.control} name="contactPhone" render={({ field }) => (
              <FormItem>
                <FormLabel>Nomor Telepon Kontak</FormLabel>
                <FormControl><Input placeholder="+62 000 0000" {...field} /></FormControl><FormMessage />
              </FormItem>
            )}/>
            <FormField control={form.control} name="contactHours" render={({ field }) => (
              <FormItem>
                <FormLabel>Keterangan Jam Kerja (opsional)</FormLabel>
                <FormControl><Input placeholder="(Jam Kerja)" {...field} /></FormControl><FormMessage />
              </FormItem>
            )}/>

            <Button type="submit" disabled={isLoading || isFetching} className="w-full md:w-auto">
              {(isLoading || isFetching) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Simpan Perubahan Konten Bantuan
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
