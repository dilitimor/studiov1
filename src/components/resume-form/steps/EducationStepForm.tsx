
"use client";

import { useFormContext, useFieldArray, Controller } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { PlusCircle, Trash2 } from 'lucide-react';
import type { FullResumeValues } from '@/lib/schema';

const educationLevels = ["SMA/SMK", "D1", "D2", "D3", "S1/D4", "S2", "S3", "Lainnya"];

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
          onClick={() => append({ level: '', institution: '', major: '', yearRange: '', gpa: '', achievements: '' })}
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
                {fields.length > 0 && ( // Show remove button only if there's at least one item
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
                name={`education.${index}.level`}
                render={({ field: selectField }) => (
                  <FormItem>
                    <FormLabel>Jenjang Pendidikan</FormLabel>
                    <Select onValueChange={selectField.onChange} defaultValue={selectField.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih jenjang pendidikan" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {educationLevels.map(level => (
                          <SelectItem key={level} value={level}>{level}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name={`education.${index}.institution`}
                render={({ field: inputField }) => (
                  <FormItem>
                    <FormLabel>Nama Institusi</FormLabel>
                    <FormControl>
                      <Input placeholder="Contoh: Universitas Indonesia, SMKN 1 Bandung" {...inputField} />
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
                    <FormLabel>Jurusan / Program Studi</FormLabel>
                    <FormControl>
                      <Input placeholder="Contoh: Manajemen, Teknik Informatika" {...inputField} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name={`education.${index}.yearRange`}
                render={({ field: inputField }) => (
                  <FormItem>
                    <FormLabel>Tahun Masuk – Lulus</FormLabel>
                    <FormControl>
                      <Input placeholder="Contoh: 2018 – 2022" {...inputField} />
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
                      <FormLabel>IPK (opsional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Misal: 3.75" {...inputField} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name={`education.${index}.achievements`}
                  render={({ field: inputField }) => (
                    <FormItem>
                      <FormLabel>Prestasi (opsional)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Contoh: Cum Laude, Juara 1 lomba debat, dll." {...inputField} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

    