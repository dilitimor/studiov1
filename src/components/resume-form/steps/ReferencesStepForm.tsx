
"use client";

import { useFormContext, useFieldArray } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { PlusCircle, Trash2 } from 'lucide-react';
import type { FullResumeValues } from '@/lib/schema';

export default function ReferencesStepForm() {
  const { control, watch } = useFormContext<FullResumeValues>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "references.entries",
  });
  const hasReferences = watch('references.hasReferences');

  return (
    <div className="space-y-6 p-2">
      <h2 className="text-2xl font-semibold text-primary mb-6">Referensi</h2>
      
      <FormField
        control={control}
        name="references.hasReferences"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>Apakah Anda ingin mencantumkan referensi?</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={(value) => field.onChange(value === 'true')}
                value={String(field.value)}
                className="flex flex-col space-y-1 md:flex-row md:space-y-0 md:space-x-4"
              >
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="true" />
                  </FormControl>
                  <Label className="font-normal">Ya</Label>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="false" />
                  </FormControl>
                  <Label className="font-normal">Tidak</Label>
                </FormItem>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {hasReferences && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="flex justify-end items-center mb-4">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({ fullName: '', position: '', company: '', contactNumber: '', email: '', relationship: '' })}
            >
              <PlusCircle className="mr-2 h-4 w-4" /> Tambah Referensi
            </Button>
          </div>

          {fields.length === 0 && (
            <p className="text-muted-foreground text-center py-4">
              Belum ada referensi. Klik tombol di atas untuk menambahkan.
            </p>
          )}

          <div className="space-y-6">
            {fields.map((field, index) => (
              <Card key={field.id} className="relative shadow-md border">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg text-foreground/90">Referensi #{index + 1}</CardTitle>
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
                    name={`references.entries.${index}.fullName`}
                    render={({ field: inputField }) => (
                      <FormItem>
                        <FormLabel>Nama Lengkap</FormLabel>
                        <FormControl>
                          <Input placeholder="Contoh: Budi Santoso" {...inputField} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name={`references.entries.${index}.position`}
                    render={({ field: inputField }) => (
                      <FormItem>
                        <FormLabel>Posisi / Jabatan</FormLabel>
                        <FormControl>
                          <Input placeholder="Contoh: Manajer HR, Supervisor Proyek" {...inputField} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name={`references.entries.${index}.company`}
                    render={({ field: inputField }) => (
                      <FormItem>
                        <FormLabel>Nama Perusahaan / Institusi</FormLabel>
                        <FormControl>
                          <Input placeholder="Contoh: PT Maju Terus, SGV Consulting" {...inputField} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name={`references.entries.${index}.contactNumber`}
                    render={({ field: inputField }) => (
                      <FormItem>
                        <FormLabel>Nomor Telepon / WhatsApp</FormLabel>
                        <FormControl>
                          <Input placeholder="Contoh: 0812-xxxx-xxxx" {...inputField} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name={`references.entries.${index}.email`}
                    render={({ field: inputField }) => (
                      <FormItem>
                        <FormLabel>Email (opsional)</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="Contoh: budi.santoso@example.com" {...inputField} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={control}
                    name={`references.entries.${index}.relationship`}
                    render={({ field: inputField }) => (
                      <FormItem>
                        <FormLabel>Hubungan Profesional</FormLabel>
                        <FormControl>
                          <Input placeholder="Contoh: Atasan langsung, rekan kerja" {...inputField} />
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
      )}
    </div>
  );
}

    