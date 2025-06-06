
"use client";

import { useState } from 'react';
import { useFormContext, useFieldArray, Controller } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, PlusCircle, Sparkles, Trash2 } from 'lucide-react';
import type { FullResumeValues } from '@/lib/schema';
import { polishResumeDescription } from '@/ai/flows/polish-resume';
import { useToast } from '@/hooks/use-toast';

export default function ExperienceStepForm() {
  const { control, setValue } = useFormContext<FullResumeValues>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "experience",
  });
  const { toast } = useToast();
  const [polishingIndex, setPolishingIndex] = useState<number | null>(null);

  const handlePolishDescription = async (index: number, currentTasks: string) => {
    if (!currentTasks || !currentTasks.trim()) {
      toast({ title: "Tidak ada teks", description: "Harap isi tugas pekerjaan terlebih dahulu.", variant: "destructive" });
      return;
    }
    setPolishingIndex(index);
    try {
      const result = await polishResumeDescription({
        sectionDescription: currentTasks,
        targetPosition: "posisi profesional", // Can be made dynamic later
      });
      if (result.polishedDescription) {
        setValue(`experience.${index}.tasks`, result.polishedDescription, { shouldValidate: true });
        toast({ title: "Deskripsi Dipoles", description: "Tugas pekerjaan berhasil diperbarui dengan AI." });
      } else {
        toast({ title: "Gagal Memoles", description: "AI tidak dapat memproses deskripsi saat ini.", variant: "destructive" });
      }
    } catch (error) {
      console.error("Error polishing description:", error);
      toast({ title: "Error", description: "Terjadi kesalahan saat menghubungi AI.", variant: "destructive" });
    } finally {
      setPolishingIndex(null);
    }
  };

  return (
    <div className="space-y-6 p-2">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-primary">Pengalaman Kerja/Magang</h2>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append({ company: '', position: '', location: '', period: '', tasks: '', achievements: '' })}
        >
          <PlusCircle className="mr-2 h-4 w-4" /> Tambah Pengalaman
        </Button>
      </div>

      {fields.length === 0 && (
        <p className="text-muted-foreground text-center py-4">
          Belum ada pengalaman kerja/magang. Klik tombol di atas untuk menambahkan.
        </p>
      )}

      <div className="space-y-6">
        {fields.map((field, index) => (
          <Card key={field.id} className="relative shadow-md border">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg text-foreground/90">Pengalaman #{index + 1}</CardTitle>
                {fields.length > 0 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:bg-destructive/10"
                    onClick={() => remove(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={control}
                name={`experience.${index}.company`}
                render={({ field: inputField }) => (
                  <FormItem>
                    <FormLabel>Nama Perusahaan</FormLabel>
                    <FormControl>
                      <Input placeholder="Contoh: Tokopedia, SGV Consulting" {...inputField} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name={`experience.${index}.position`}
                render={({ field: inputField }) => (
                  <FormItem>
                    <FormLabel>Posisi / Jabatan</FormLabel>
                    <FormControl>
                      <Input placeholder="Contoh: Staf Admin, Junior Consultant" {...inputField} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={control}
                  name={`experience.${index}.location`}
                  render={({ field: inputField }) => (
                    <FormItem>
                      <FormLabel>Lokasi Kerja</FormLabel>
                      <FormControl>
                        <Input placeholder="Contoh: Jakarta, Manila, Bandung" {...inputField} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name={`experience.${index}.period`}
                  render={({ field: inputField }) => (
                    <FormItem>
                      <FormLabel>Periode Kerja</FormLabel>
                      <FormControl>
                        <Input placeholder="Contoh: Jan 2021 – Des 2023" {...inputField} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Controller
                control={control}
                name={`experience.${index}.tasks`}
                render={({ field: { onChange, onBlur, value, name, ref } }) => (
                  <FormItem>
                    <div className="flex justify-between items-center mb-1">
                      <FormLabel>Tugas & Tanggung Jawab</FormLabel>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handlePolishDescription(index, value)}
                        disabled={polishingIndex === index}
                        className="text-accent border-accent hover:bg-accent/10 hover:text-accent"
                      >
                        {polishingIndex === index ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Sparkles className="mr-2 h-4 w-4" />
                        )}
                        Polish dengan AI
                      </Button>
                    </div>
                    <FormControl>
                      <Textarea
                        placeholder="Ringkasan 2–3 kalimat (boleh pakai poin-poin)"
                        name={name}
                        value={value}
                        onChange={onChange}
                        onBlur={onBlur}
                        ref={ref}
                        rows={4}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name={`experience.${index}.achievements`}
                render={({ field: inputField }) => (
                  <FormItem>
                    <FormLabel>Pencapaian (opsional)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Contoh: Meningkatkan efisiensi 30%, berhasil memimpin proyek X, dll." {...inputField} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

    