
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useState, type ChangeEvent } from "react";
import { Loader2, ArrowLeft, Sparkles, UploadCloud, FileText, XCircle } from "lucide-react";
import { AiResumeTemplateSchema, type AiResumeTemplateValues, ResumeTypeEnum } from "@/lib/schema";
import { addAiResumeTemplate } from "@/services/firestoreService";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // Added

const resumeTypeOptions = [
  { value: "lulusan_baru", label: "Lulusan Baru" },
  { value: "profesional", label: "Profesional" },
  { value: "ganti_karier", label: "Ganti Karier" },
];

const defaultValues: Partial<AiResumeTemplateValues> = {
  name: "",
  description: "",
  resumeType: undefined,
  contentPdfDataUri: undefined,
  contentPdfFileName: undefined,
};

export default function NewAiTemplatePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [fileNameForDisplay, setFileNameForDisplay] = useState<string | null>(null);


  const form = useForm<AiResumeTemplateValues>({
    resolver: zodResolver(AiResumeTemplateSchema),
    defaultValues,
    mode: "onChange",
  });

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type !== "application/pdf") {
        toast({ title: "Format File Salah", description: "Harap unggah file PDF.", variant: "destructive" });
        form.setValue('contentPdfDataUri', null);
        form.setValue('contentPdfFileName', null);
        setFileNameForDisplay(null);
        event.target.value = '';
        return;
      }
      if (file.size > 700 * 1024) {
        toast({ title: "Ukuran File Terlalu Besar", description: "Ukuran file PDF maksimal adalah 700KB (karena disimpan di database).", variant: "destructive" });
        form.setValue('contentPdfDataUri', null);
        form.setValue('contentPdfFileName', null);
        setFileNameForDisplay(null);
        event.target.value = '';
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        form.setValue('contentPdfDataUri', reader.result as string, { shouldValidate: true });
        form.setValue('contentPdfFileName', file.name, { shouldValidate: true });
        setFileNameForDisplay(file.name);
      };
      reader.onerror = () => {
        toast({ title: "Error Baca File", description: "Gagal membaca file PDF.", variant: "destructive" });
        form.setValue('contentPdfDataUri', null);
        form.setValue('contentPdfFileName', null);
        setFileNameForDisplay(null);
      }
      reader.readAsDataURL(file);

    } else {
      // Do nothing, keep existing values if any
    }
  };

  const removeSelectedFile = () => {
    form.setValue('contentPdfDataUri', null, { shouldValidate: true });
    form.setValue('contentPdfFileName', null, { shouldValidate: true });
    setFileNameForDisplay(null);
    const fileInput = document.getElementById('pdf-upload') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  }

  const onSubmit = async (values: AiResumeTemplateValues) => {
    setIsLoading(true);
    try {
      await addAiResumeTemplate(values);
      toast({ title: "Sukses", description: "Template AI baru berhasil ditambahkan." });
      router.push("/admin/ai-templates");
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Gagal menambahkan template AI.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="shadow-xl">
      <CardHeader>
        <div className="flex items-center justify-between">
            <CardTitle className="text-2xl flex items-center">
              <Sparkles className="mr-2 h-6 w-6 text-primary" /> Tambah Template AI Baru
            </CardTitle>
            <Button variant="outline" size="sm" asChild>
                <Link href="/admin/ai-templates">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke Daftar Template
                </Link>
            </Button>
        </div>
        <CardDescription>Isi formulir di bawah untuk membuat template AI baru. PDF akan disimpan langsung di database (maks 700KB).</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem>
                <FormLabel>Nama Template</FormLabel>
                <FormControl><Input placeholder="Contoh: Template Kronologis Modern" {...field} /></FormControl><FormMessage />
              </FormItem>
            )}/>
            <FormField control={form.control} name="description" render={({ field }) => (
              <FormItem>
                <FormLabel>Deskripsi Singkat</FormLabel>
                <FormControl><Textarea placeholder="Deskripsikan template ini dan kegunaannya..." {...field} rows={3} /></FormControl>
                <FormMessage />
              </FormItem>
            )}/>
            <FormField
              control={form.control}
              name="resumeType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipe Resume (untuk Referensi AI)</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value || undefined}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih tipe resume yang relevan" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {resumeTypeOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormItem>
                <FormLabel htmlFor="pdf-upload">Template PDF (maks. 700KB)</FormLabel>
                <div className="flex items-center gap-4">
                    <Input
                        id="pdf-upload"
                        type="file"
                        accept=".pdf"
                        onChange={handleFileChange}
                        className="hidden"
                    />
                    <Button type="button" variant="outline" onClick={() => document.getElementById('pdf-upload')?.click()}>
                        <UploadCloud className="mr-2 h-4 w-4" /> Unggah PDF
                    </Button>
                    {fileNameForDisplay && (
                         <Button type="button" variant="ghost" size="sm" onClick={removeSelectedFile} className="text-destructive hover:bg-destructive/10">
                            <XCircle className="mr-1 h-4 w-4" /> Hapus Pilihan
                        </Button>
                    )}
                </div>
                {fileNameForDisplay && (
                    <div className="mt-2 p-2 border rounded-md bg-muted text-sm flex items-center gap-2">
                        <FileText className="h-5 w-5 text-primary" />
                        <span>{fileNameForDisplay}</span>
                    </div>
                )}
                <FormField
                  control={form.control}
                  name="contentPdfDataUri"
                  render={({ field }) => (
                    <Input
                      {...field}
                      value={field.value === null ? '' : field.value || ''}
                      type="hidden"
                    />
                  )}
                />
                <FormField
                  control={form.control}
                  name="contentPdfFileName"
                  render={({ field }) => (
                    <Input
                      {...field}
                      value={field.value === null ? '' : field.value || ''}
                      type="hidden"
                    />
                  )}
                />
                <FormMessage />
            </FormItem>

            <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Simpan Template
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
