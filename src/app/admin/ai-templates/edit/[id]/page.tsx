
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState, type ChangeEvent } from "react";
import { Loader2, ArrowLeft, Sparkles, UploadCloud, FileText, XCircle, Download } from "lucide-react";
import { AiResumeTemplateSchema, type AiResumeTemplateValues } from "@/lib/schema";
import { getAiResumeTemplate, updateAiResumeTemplate } from "@/services/firestoreService";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

export default function EditAiTemplatePage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  
  const templateId = typeof params.id === 'string' ? params.id : null;

  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  // fileNameForDisplay will hold the name of the currently selected or existing file for UI.
  const [fileNameForDisplay, setFileNameForDisplay] = useState<string | null>(null);
  // No longer need selectedFile, currentPdfInfo, or fileMarkedForRemoval in the same way.
  // We will rely on form state (contentPdfDataUri, contentPdfFileName)

  const form = useForm<AiResumeTemplateValues>({
    resolver: zodResolver(AiResumeTemplateSchema),
    defaultValues: {
      name: "",
      description: "",
      contentPdfDataUri: undefined,
      contentPdfFileName: undefined,
    },
    mode: "onChange",
  });

  const watchedPdfDataUri = form.watch('contentPdfDataUri');
  const watchedPdfFileName = form.watch('contentPdfFileName');

  useEffect(() => {
    if (!templateId) {
      toast({ title: "Error", description: "ID Template tidak valid.", variant: "destructive" });
      router.push("/admin/ai-templates");
      return;
    }

    async function fetchTemplate() {
      setIsFetching(true);
      try {
        const templateData = await getAiResumeTemplate(templateId as string);
        if (templateData) {
          form.reset({
            name: templateData.name || "",
            description: templateData.description || "",
            contentPdfDataUri: templateData.contentPdfDataUri || undefined,
            contentPdfFileName: templateData.contentPdfFileName || undefined,
          });
          setFileNameForDisplay(templateData.contentPdfFileName || null);
        } else {
          toast({ title: "Error", description: "Template AI tidak ditemukan.", variant: "destructive" });
          router.push("/admin/ai-templates");
        }
      } catch (error) {
        toast({ title: "Error", description: "Gagal memuat template AI.", variant: "destructive" });
      } finally {
        setIsFetching(false);
      }
    }
    fetchTemplate();
  }, [templateId, form, toast, router]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type !== "application/pdf") {
        toast({ title: "Format File Salah", description: "Harap unggah file PDF.", variant: "destructive" });
        // Do not clear existing valid data if user selects wrong file type
        event.target.value = '';
        return;
      }
      if (file.size > 700 * 1024) { // ~700KB limit for base64 in 1MB doc
        toast({ title: "Ukuran File Terlalu Besar", description: "Ukuran file PDF maksimal adalah 700KB.", variant: "destructive" });
        event.target.value = '';
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        form.setValue('contentPdfDataUri', reader.result as string, { shouldValidate: true });
        form.setValue('contentPdfFileName', file.name, { shouldValidate: true });
        setFileNameForDisplay(file.name); // Update display name immediately
      };
      reader.onerror = () => {
         toast({ title: "Error Baca File", description: "Gagal membaca file PDF.", variant: "destructive" });
      }
      reader.readAsDataURL(file);
    }
  };

  const removeCurrentOrSelectedFile = () => {
    form.setValue('contentPdfDataUri', null, { shouldValidate: true });
    form.setValue('contentPdfFileName', null, { shouldValidate: true });
    setFileNameForDisplay(null); // Clear display name
    const fileInput = document.getElementById('pdf-upload-edit') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  const onSubmit = async (values: AiResumeTemplateValues) => {
    if (!templateId) return;
    setIsLoading(true);

    // Values already contain contentPdfDataUri and contentPdfFileName
    // If they are null, it means the file was removed.
    // If they have data, it's either existing or new.
    const dataToUpdate: Partial<AiResumeTemplateValues> = {
        name: values.name,
        description: values.description,
        contentPdfDataUri: values.contentPdfDataUri, 
        contentPdfFileName: values.contentPdfFileName,
    };

    try {
      await updateAiResumeTemplate(templateId, dataToUpdate);
      toast({ title: "Sukses", description: "Template AI berhasil diperbarui." });
      router.push("/admin/ai-templates");
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Gagal memperbarui template AI.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex items-center justify-center h-60">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2">Memuat data template...</p>
      </div>
    );
  }

  return (
    <Card className="shadow-xl">
      <CardHeader>
         <div className="flex items-center justify-between">
            <CardTitle className="text-2xl flex items-center">
              <Sparkles className="mr-2 h-6 w-6 text-primary" /> Edit Template AI
            </CardTitle>
            <Button variant="outline" size="sm" asChild>
                <Link href="/admin/ai-templates">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke Daftar Template
                </Link>
            </Button>
        </div>
        <CardDescription>Perbarui detail template AI di bawah ini. PDF akan disimpan langsung di database (maks 700KB).</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem>
                <FormLabel>Nama Template</FormLabel>
                <FormControl><Input {...field} /></FormControl><FormMessage />
              </FormItem>
            )}/>
            <FormField control={form.control} name="description" render={({ field }) => (
              <FormItem>
                <FormLabel>Deskripsi Singkat</FormLabel>
                <FormControl><Textarea {...field} rows={3} /></FormControl><FormMessage />
              </FormItem>
            )}/>
            
            <FormItem>
                <FormLabel htmlFor="pdf-upload-edit">Template PDF (maks. 700KB)</FormLabel>
                {/* Display current file info if a file name exists in form state */}
                {watchedPdfFileName && (
                    <div className="my-2 p-3 border rounded-md bg-muted text-sm">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <FileText className="h-5 w-5 text-primary" />
                                <span>File Saat Ini: {watchedPdfFileName}</span>
                            </div>
                            {watchedPdfDataUri && (
                                <a href={watchedPdfDataUri} download={watchedPdfFileName || 'template.pdf'}>
                                    <Button variant="outline" size="sm"><Download className="mr-1 h-4 w-4"/> Unduh/Lihat</Button>
                                </a>
                            )}
                        </div>
                    </div>
                )}
                 {!watchedPdfFileName && !isFetching && (
                    <div className="my-2 p-3 border rounded-md bg-muted/50 text-sm text-muted-foreground">
                        Tidak ada file PDF yang terunggah untuk template ini.
                    </div>
                )}

                <div className="flex items-center gap-4 mt-1">
                    <Input
                        id="pdf-upload-edit"
                        type="file"
                        accept=".pdf"
                        onChange={handleFileChange}
                        className="hidden"
                    />
                    <Button type="button" variant="outline" onClick={() => document.getElementById('pdf-upload-edit')?.click()}>
                        <UploadCloud className="mr-2 h-4 w-4" /> {watchedPdfFileName ? 'Ganti PDF' : 'Unggah PDF Baru'}
                    </Button>
                    {watchedPdfFileName && (
                         <Button type="button" variant="destructive" size="sm" onClick={removeCurrentOrSelectedFile}>
                            <XCircle className="mr-1 h-4 w-4" /> Hapus PDF
                        </Button>
                    )}
                </div>
                {/* Hidden inputs for react-hook-form to track these values */}
                <FormField 
                  control={form.control} 
                  name="contentPdfDataUri" 
                  render={({ field }) => <Input {...field} value={field.value === null ? '' : field.value || ''} type="hidden" />} 
                />
                 <FormField 
                  control={form.control} 
                  name="contentPdfFileName" 
                  render={({ field }) => <Input {...field} value={field.value === null ? '' : field.value || ''} type="hidden" />} 
                />
                <FormMessage /> {/* For errors related to the conceptual "file" field */}
            </FormItem>

            <Button type="submit" disabled={isLoading || isFetching} className="w-full md:w-auto">
              {(isLoading || isFetching) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Simpan Perubahan
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

