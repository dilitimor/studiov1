
"use client";

import { useFormContext } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import type { FullResumeValues } from '@/lib/schema';

export default function ShortProfileStepForm() {
  const { control } = useFormContext<FullResumeValues>();

  return (
    <div className="space-y-6 p-2">
      <h2 className="text-2xl font-semibold text-primary mb-6">Profil Singkat</h2>
      
      <FormField
        control={control}
        name="shortProfile.background"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Ceritakan sedikit tentang latar belakang kamu</FormLabel>
            <FormControl>
              <Textarea placeholder="Misalnya: pendidikan atau pengalaman umum..." {...field} rows={3} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="shortProfile.strengths"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Apa kekuatan utama kamu dalam bekerja?</FormLabel>
            <FormControl>
              <Textarea placeholder="Contoh: teliti, komunikatif, cepat belajar, dll." {...field} rows={3} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="shortProfile.careerGoals"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Apa tujuan karier kamu saat ini?</FormLabel>
            <FormControl>
              <Textarea placeholder="Contoh: ingin berkontribusi di bidang A, mendapatkan pengalaman di industri B, dst." {...field} rows={3} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="shortProfile.teamValue"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Apa nilai yang kamu bawa ke tim/perusahaan?</FormLabel>
            <FormControl>
              <Textarea placeholder="Contoh: disiplin, bisa kerja tim, inisiatif tinggi, kemampuan problem-solving." {...field} rows={3} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

    