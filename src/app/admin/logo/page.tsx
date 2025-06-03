
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState, type ChangeEvent } from "react";
import { Loader2, Image as ImageIcon, UploadCloud, XCircle } from "lucide-react";
import { LogoSchema, type LogoValues } from "@/lib/schema";
import { getLogo, updateLogo } from "@/services/firestoreService";
import NextImage from "next/image";
import { Label } from "@/components/ui/label";

const MAX_LOGO_SIZE_KB = 200; // Max raw file size in KB

export default function ManageLogoPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [currentLogoPreview, setCurrentLogoPreview] = useState<string | null>(null);

  const form = useForm<LogoValues>({
    resolver: zodResolver(LogoSchema),
    defaultValues: { dataUri: "" }, // Default to empty string for dataUri
  });

  useEffect(() => {
    async function fetchLogo() {
      setIsFetching(true);
      try {
        const logoData = await getLogo();
        if (logoData && logoData.dataUri) {
          form.reset({ dataUri: logoData.dataUri });
          setCurrentLogoPreview(logoData.dataUri);
        } else {
          form.reset({ dataUri: "" });
          setCurrentLogoPreview(null);
        }
      } catch (error) {
        toast({ title: "Error", description: "Gagal memuat logo.", variant: "destructive" });
      } finally {
        setIsFetching(false);
      }
    }
    fetchLogo();
  }, [form, toast]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast({ title: "Format File Salah", description: "Harap unggah file gambar (PNG, JPG, SVG, GIF).", variant: "destructive" });
        event.target.value = '';
        return;
      }
      if (file.size > MAX_LOGO_SIZE_KB * 1024) {
        toast({ title: "Ukuran File Terlalu Besar", description: `Ukuran file logo maksimal adalah ${MAX_LOGO_SIZE_KB}KB.`, variant: "destructive" });
        event.target.value = '';
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        form.setValue('dataUri', result, { shouldValidate: true });
        setCurrentLogoPreview(result);
      };
      reader.onerror = () => {
         toast({ title: "Error Baca File", description: "Gagal membaca file logo.", variant: "destructive" });
      }
      reader.readAsDataURL(file);
    }
  };

  const removeCurrentLogo = () => {
    form.setValue('dataUri', null, { shouldValidate: true }); // Set to null to clear
    setCurrentLogoPreview(null);
    const fileInput = document.getElementById('logo-upload') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
    toast({ title: "Logo Dihapus", description: "Logo kustom telah dihapus." });
  };

  const onSubmit = async (values: LogoValues) => {
    setIsLoading(true);
    try {
      // Ensure dataUri is either a base64 string or null (if removed)
      const dataToSave: LogoValues = {
        dataUri: values.dataUri || null,
      };
      await updateLogo(dataToSave);
      setCurrentLogoPreview(values.dataUri || null);
      toast({ title: "Sukses", description: "Logo berhasil diperbarui." });
    } catch (error) {
      toast({ title: "Error", description: "Gagal memperbarui logo.", variant: "destructive" });
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
    <Card className="max-w-2xl mx-auto shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center">
          <ImageIcon className="mr-2 h-6 w-6 text-primary" /> Kelola Logo Situs
        </CardTitle>
        <CardDescription>Unggah logo yang akan tampil di header situs (maks. ${MAX_LOGO_SIZE_KB}KB).</CardDescription>
      </CardHeader>
      <CardContent>
        {currentLogoPreview && (
          <div className="mb-6 p-4 border rounded-md bg-muted flex flex-col items-center">
            <Label className="mb-2 self-start font-medium">Pratinjau Logo Saat Ini:</Label>
            <NextImage src={currentLogoPreview} alt="Current Site Logo" width={200} height={60} className="object-contain rounded-md" data-ai-hint="company logo"/>
          </div>
        )}
        {!currentLogoPreview && !isFetching && (
             <div className="mb-6 p-4 border border-dashed rounded-md bg-muted/50 text-center">
                <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground mb-2"/>
                <p className="text-sm text-muted-foreground">Belum ada logo kustom yang diunggah.</p>
            </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormItem>
                <FormLabel htmlFor="logo-upload">File Logo</FormLabel>
                <div className="flex items-center gap-4 mt-1">
                    <Input
                        id="logo-upload"
                        type="file"
                        accept="image/png, image/jpeg, image/svg+xml, image/gif"
                        onChange={handleFileChange}
                        className="hidden"
                    />
                    <Button type="button" variant="outline" onClick={() => document.getElementById('logo-upload')?.click()}>
                        <UploadCloud className="mr-2 h-4 w-4" /> {currentLogoPreview ? 'Ganti Logo' : 'Unggah Logo'}
                    </Button>
                    {currentLogoPreview && (
                         <Button type="button" variant="destructive" size="sm" onClick={removeCurrentLogo}>
                            <XCircle className="mr-1 h-4 w-4" /> Hapus Logo
                        </Button>
                    )}
                </div>
                <FormField 
                  control={form.control} 
                  name="dataUri" 
                  render={({ field }) => <Input {...field} value={field.value === null ? '' : field.value || ''} type="hidden" />} 
                />
                <FormMessage>{form.formState.errors.dataUri?.message}</FormMessage>
            </FormItem>
            
            <Button type="submit" disabled={isLoading || isFetching} className="w-full">
              {(isLoading || isFetching) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Simpan Logo
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
