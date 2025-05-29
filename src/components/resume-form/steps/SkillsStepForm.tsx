
"use client";

import { useFormContext, Controller } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import type { FullResumeValues } from '@/lib/schema';

export default function SkillsStepForm() {
  const { control, watch } = useFormContext<FullResumeValues>();
  const hasSkills = watch('skills.hasSkills');

  return (
    <div className="space-y-6 p-2">
      <h2 className="text-2xl font-semibold text-primary mb-6">Keahlian</h2>
      
      <FormField
        control={control}
        name="skills.hasSkills"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>Apakah Anda ingin mencantumkan keahlian?</FormLabel>
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

      {hasSkills && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <FormField
            control={control}
            name="skills.mainSkills"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Daftar Keahlian Utama (pisahkan dengan koma)</FormLabel>
                <FormControl>
                  <Textarea placeholder="Contoh: Microsoft Excel, Analisis Data, Public Speaking, Desain Grafis" {...field} rows={3}/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="skills.foreignLanguages"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bahasa Asing yang Dikuasai (opsional, pisahkan dengan koma)</FormLabel>
                <FormControl>
                  <Textarea placeholder="Contoh: Bahasa Inggris (Lancar), Jepang (Dasar), Mandarin (Percakapan)" {...field} rows={3}/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      )}
    </div>
  );
}

    