
"use client";

import { useFormContext } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import type { FullResumeValues } from '@/lib/schema';

export default function HobbiesStepForm() {
  const { control, watch } = useFormContext<FullResumeValues>();
  const hasHobbies = watch('hobbies.hasHobbies');

  return (
    <div className="space-y-6 p-2">
      <h2 className="text-2xl font-semibold text-primary mb-6">Hobi</h2>
      
      <FormField
        control={control}
        name="hobbies.hasHobbies"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>Apakah Anda ingin mencantumkan hobi?</FormLabel>
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

      {hasHobbies && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <FormField
            control={control}
            name="hobbies.hobbiesList"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Daftar Hobi (pisahkan dengan koma)</FormLabel>
                <FormControl>
                  <Textarea placeholder="Contoh: Membaca, Main Tenis, Traveling, Fotografi" {...field} rows={3}/>
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

    