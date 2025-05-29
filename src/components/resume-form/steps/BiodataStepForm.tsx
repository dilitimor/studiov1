
"use client";

import { useState, type ChangeEvent } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Image from 'next/image';
import type { FullResumeValues } from '@/lib/schema';
import { Button } from '@/components/ui/button';
import { UploadCloud, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function BiodataStepForm() {
  const { control, setValue, watch } = useFormContext<FullResumeValues>();
  const { toast } = useToast();
  
  const currentPhotoUrl = watch('biodata.photoUrl');
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentPhotoUrl || null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Format File Salah",
          description: "Harap unggah file gambar (contoh: JPG, PNG).",
          variant: "destructive",
        });
        event.target.value = ''; // Clear the file input
        return;
      }
      // Max 2MB file size
      if (file.size > 2 * 1024 * 1024) {
         toast({
          title: "Ukuran File Terlalu Besar",
          description: "Ukuran file maksimal adalah 2MB.",
          variant: "destructive",
        });
        event.target.value = ''; // Clear the file input
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setValue('biodata.photoUrl', result, { shouldValidate: true });
        setPreviewUrl(result);
      };
      reader.readAsDataURL(file);
    } else {
      // If no file is selected (e.g., user cancels dialog), clear existing
      // setValue('biodata.photoUrl', '', { shouldValidate: true });
      // setPreviewUrl(null);
      // Retain existing photo if selection is cancelled. 
      // To clear, user must click "Hapus Foto"
    }
  };

  const removePhoto = () => {
    setValue('biodata.photoUrl', '', { shouldValidate: true });
    setPreviewUrl(null);
    // Reset file input visually (though it's hard to control directly)
    const fileInput = document.getElementById('photo-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
     toast({
      title: "Foto Dihapus",
      description: "Foto profil telah dihapus.",
    });
  };
  
  // Sync previewUrl if currentPhotoUrl changes externally (e.g. form reset or load from db)
  useState(() => {
    if (currentPhotoUrl && currentPhotoUrl !== previewUrl) {
      setPreviewUrl(currentPhotoUrl);
    }
    if (!currentPhotoUrl && previewUrl) {
        setPreviewUrl(null);
    }
  });


  return (
    <div className="space-y-6 p-2">
      <h2 className="text-2xl font-semibold text-primary mb-6">Lengkapi Biodata Anda</h2>
      <FormField
        control={control}
        name="biodata.name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nama Lengkap</FormLabel>
            <FormControl>
              <Input placeholder="Contoh: John Doe" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="biodata.address"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Alamat</FormLabel>
            <FormControl>
              <Textarea placeholder="Contoh: Jl. Merdeka No. 10, Jakarta" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={control}
          name="biodata.contactNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nomor Kontak (Telepon/WA)</FormLabel>
              <FormControl>
                <Input placeholder="Contoh: 081234567890" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="biodata.birthPlaceDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tempat & Tanggal Lahir</FormLabel>
              <FormControl>
                <Input placeholder="Contoh: Jakarta, 17 Agustus 1995" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <FormField
        control={control}
        name="biodata.gender"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>Gender</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                value={field.value}
                className="flex flex-col space-y-1 md:flex-row md:space-y-0 md:space-x-4"
              >
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="Laki-laki" />
                  </FormControl>
                  <Label className="font-normal">Laki-laki</Label>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="Perempuan" />
                  </FormControl>
                  <Label className="font-normal">Perempuan</Label>
                </FormItem>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormItem>
        <FormLabel htmlFor="photo-upload">Foto Profil (opsional, maks. 2MB)</FormLabel>
        <div className="flex items-center gap-4">
          <Input
            id="photo-upload"
            type="file"
            accept="image/png, image/jpeg, image/gif"
            onChange={handleFileChange}
            className="hidden" // Hidden, triggered by button
          />
          <Button type="button" variant="outline" onClick={() => document.getElementById('photo-upload')?.click()}>
            <UploadCloud className="mr-2 h-4 w-4" /> Unggah Foto
          </Button>
          {previewUrl && (
            <Button type="button" variant="destructive" size="sm" onClick={removePhoto}>
              <XCircle className="mr-2 h-4 w-4" /> Hapus Foto
            </Button>
          )}
        </div>
        <FormMessage>{/* For potential file input errors if not handled by toast */}</FormMessage>
        {previewUrl && (
          <div className="mt-4 p-2 border rounded-md inline-block bg-muted">
            <Image 
              src={previewUrl} 
              alt="Pratinjau Foto Profil" 
              width={150} 
              height={150} 
              className="rounded object-contain"
              data-ai-hint="profile photo" 
            />
          </div>
        )}
      </FormItem>

    </div>
  );
}
