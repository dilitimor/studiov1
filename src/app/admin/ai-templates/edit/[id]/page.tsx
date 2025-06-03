
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
import { getAiResumeTemplate, updateAiResumeTemplate, type AiResumeTemplateDocument } from "@/services/firestoreService";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

export default function EditAiTemplatePage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  
  const templateId = typeof params.id === 'string' ? params.id : null;

  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [currentPdfInfo, setCurrentPdfInfo] = useState<{ name: string | null, url: string | null, storagePath: string | null }>({ name: null, url: null, storagePath: null });
  const [fileMarkedForRemoval, setFileMarkedForRemoval] = useState(false);


  const form = useForm<AiResumeTemplateValues>({
    resolver: zodResolver(AiResumeTemplateSchema),
    defaultValues: {
      name: "",
      description: "",
      contentUrl: undefined, 
      contentFileName: undefined,
      contentStoragePath: undefined,
    },
    mode: "onChange",
  });

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
          const resetData = {
            ...templateData,
            contentUrl: templateData.contentUrl || undefined,
            contentFileName: templateData.contentFileName || undefined,
            contentStoragePath: templateData.contentStoragePath || undefined,
          };
          form.reset(resetData as AiResumeTemplateValues);

          if (templateData.contentUrl && templateData.contentFileName) {
            setCurrentPdfInfo({ 
              name: templateData.contentFileName, 
              url: templateData.contentUrl,
              storagePath: templateData.contentStoragePath || null
            });
          } else {
            setCurrentPdfInfo({ name: null, url: null, storagePath: null });
          }
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
        setSelectedFile(null);
        event.target.value = '';
        return;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({ title: "Ukuran File Terlalu Besar", description: "Ukuran file PDF maksimal adalah 5MB.", variant: "destructive" });
        setSelectedFile(null);
        event.target.value = '';
        return;
      }
      setSelectedFile(file);
      setCurrentPdfInfo(prev => ({ ...prev, name: file.name, url: null })); 
      setFileMarkedForRemoval(false); 
      form.setValue('contentUrl', undefined); 
      form.setValue('contentFileName', undefined);
      form.setValue('contentStoragePath', undefined);
    }
  };

  const removeCurrentOrSelectedFile = () => {
    setSelectedFile(null); 
    setCurrentPdfInfo(prev => ({...prev, name: 'Akan dihapus saat disimpan', url: null, storagePath: prev.storagePath})); // Keep original storagePath in UI state for deletion reference
    setFileMarkedForRemoval(true); 
    form.setValue('contentUrl', null); 
    form.setValue('contentFileName', null);
    form.setValue('contentStoragePath', null); // This is important for the form state
    const fileInput = document.getElementById('pdf-upload-edit') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };


  const onSubmit = async (values: AiResumeTemplateValues) => {
    if (!templateId) return;
    setIsLoading(true);

    // Base data to update (non-file fields)
    const dataToUpdate: Partial<AiResumeTemplateValues> = {
        name: values.name,
        description: values.description,
    };

    // This will be passed to the service function for deleting the *actual file* from storage if needed
    const originalStoragePathForDeletion = currentPdfInfo.storagePath;


    if (selectedFile) {
        // New file selected. Service function will handle upload and update file metadata.
        // No need to set contentUrl/FileName/StoragePath in dataToUpdate here.
    } else if (fileMarkedForRemoval) {
        // File explicitly marked for removal, and no new file selected.
        // Set Firestore fields to null.
        dataToUpdate.contentUrl = null;
        dataToUpdate.contentFileName = null;
        dataToUpdate.contentStoragePath = null;
    } else {
        // No new file, not marked for removal: means we want to keep the existing file details.
        // These values come from the form's current state (after initial load or if unchanged).
        dataToUpdate.contentUrl = values.contentUrl;
        dataToUpdate.contentFileName = values.contentFileName;
        dataToUpdate.contentStoragePath = values.contentStoragePath;
    }

    try {
      // Pass `originalStoragePathForDeletion` for the service to use if it needs to delete from storage.
      await updateAiResumeTemplate(templateId, dataToUpdate, selectedFile || undefined, originalStoragePathForDeletion);
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
        <CardDescription>Perbarui detail template AI di bawah ini.</CardDescription>
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
                <FormLabel htmlFor="pdf-upload-edit">Template PDF (maks. 5MB)</FormLabel>
                {/* Display current file if it exists, no new file selected, and not marked for removal */}
                {currentPdfInfo.url && currentPdfInfo.name && !selectedFile && !fileMarkedForRemoval && (
                    <div className="my-2 p-3 border rounded-md bg-muted text-sm">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <FileText className="h-5 w-5 text-primary" />
                                <span>File Saat Ini: {currentPdfInfo.name}</span>
                            </div>
                            <Link href={currentPdfInfo.url} target="_blank" rel="noopener noreferrer" passHref>
                                <Button variant="outline" size="sm"><Download className="mr-1 h-4 w-4"/> Lihat</Button>
                            </Link>
                        </div>
                    </div>
                )}
                {/* Display newly selected file */}
                 {selectedFile && (
                     <div className="my-2 p-3 border rounded-md bg-muted text-sm flex items-center gap-2">
                        <FileText className="h-5 w-5 text-green-600" />
                        <span>File Baru: {selectedFile.name}</span>
                    </div>
                )}
                {/* Display message if file is marked for removal */}
                {fileMarkedForRemoval && !selectedFile && (
                    <div className="my-2 p-3 border rounded-md bg-destructive/10 text-destructive text-sm flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        <span>File saat ini akan dihapus setelah disimpan.</span>
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
                        <UploadCloud className="mr-2 h-4 w-4" /> {currentPdfInfo.name && !selectedFile && !fileMarkedForRemoval ? 'Ganti PDF' : 'Unggah PDF Baru'}
                    </Button>
                    {/* Show remove button if there's a current file or a new file selected, and it's not already marked for removal */}
                    {(currentPdfInfo.url || selectedFile) && !fileMarkedForRemoval && (
                         <Button type="button" variant="destructive" size="sm" onClick={removeCurrentOrSelectedFile}>
                            <XCircle className="mr-1 h-4 w-4" /> Hapus PDF
                        </Button>
                    )}
                </div>
                {/* Hidden inputs for react-hook-form to track these values if needed, though service primarily drives them now */}
                <FormField 
                  control={form.control} 
                  name="contentUrl" 
                  render={({ field }) => <Input {...field} value={field.value === null ? '' : field.value || ''} type="hidden" />} 
                />
                 <FormField 
                  control={form.control} 
                  name="contentFileName" 
                  render={({ field }) => <Input {...field} value={field.value === null ? '' : field.value || ''} type="hidden" />} 
                />
                 <FormField 
                  control={form.control} 
                  name="contentStoragePath" 
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


