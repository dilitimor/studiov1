
"use client";

import { useFormContext, Controller } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import type { FullResumeValues } from '@/lib/schema';

export default function TargetPositionStepForm() {
  const { control, watch } = useFormContext<FullResumeValues>();
  const applyingForPosition = watch('targetPosition.applyingForPosition');

  return (
    <div className="space-y-6 p-2">
      <h2 className="text-2xl font-semibold text-primary mb-6">Posisi yang Dilamar</h2>
      
      <FormField
        control={control}
        name="targetPosition.applyingForPosition"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>Apakah Anda sedang melamar posisi tertentu saat ini?</FormLabel>
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

      {applyingForPosition && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <FormField
            control={control}
            name="targetPosition.positionName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Posisi yang Dilamar</FormLabel>
                <FormControl>
                  <Input placeholder="Contoh: Marketing Manager" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="targetPosition.companyName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nama Perusahaan (opsional)</FormLabel>
                <FormControl>
                  <Input placeholder="Contoh: PT Sejahtera Bersama" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="targetPosition.industry"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Industri (opsional)</FormLabel>
                <FormControl>
                  <Input placeholder="Contoh: Teknologi Informasi" {...field} />
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

    