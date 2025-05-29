"use client";

import { useFormContext, useFieldArray } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { PlusCircle, Trash2 } from 'lucide-react';
import type { FullResumeValues } from '@/lib/schema';

export default function EducationStepForm() {
  const { control } = useFormContext<FullResumeValues>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "education",
  });

  return (
    <div className="space-y-6 p-2">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-primary">Riwayat Pendidikan</h2>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append({ institution: '', gpa: '', major: '', skills: '' })}
        >
          <PlusCircle className="mr-2 h-4 w-4" /> Tambah Pendidikan
        </Button>
      </div>

      {fields.length === 0 && (
        <p className="text-muted-foreground text-center py-4">
          Belum ada riwayat pendidikan. Klik tombol di atas untuk menambahkan.
        </p>
      )}

      <div className="space-y-6">
        {fields.map((field, index) => (
          <Card key={field.id} className="relative shadow-md border">
             <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg text-foreground/90">Pendidikan #{index + 1}</CardTitle>
                {fields.length > 1 && (
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
                name={`education.${index}.institution`}
                render={({ field: inputField }) => (
                  <FormItem>
                    <FormLabel>Nama Lembaga Pendidikan</FormLabel>
                    <FormControl>
                      <Input placeholder="Contoh: Universitas Indonesia" {...inputField} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={control}
                  name={`education.${index}.gpa`}
                  render={({ field: inputField }) => (
                    <FormItem>
                      <FormLabel>Nilai/IPK</FormLabel>
                      <FormControl>
                        <Input placeholder="Contoh: 3.75 atau Sangat Baik" {...inputField} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name={`education.${index}.major`}
                  render={({ field: inputField }) => (
                    <FormItem>
                      <FormLabel>Jurusan</FormLabel>
                      <FormControl>
                        <Input placeholder="Contoh: Teknik Informatika" {...inputField} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={control}
                name={`education.${index}.skills`}
                render={({ field: inputField }) => (
                  <FormItem>
                    <FormLabel>Keahlian (pisahkan dengan koma)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Contoh: Pemrograman Web, Analisis Data, Desain Grafis" {...inputField} />
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