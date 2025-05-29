
"use client";

import { useFormContext } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import type { FullResumeValues } from '@/lib/schema';

export default function BiodataStepForm() {
  const { control } = useFormContext<FullResumeValues>();

  return (
    <div className="space-y-6 p-2">
      <h2 className="text-2xl font-semibold text-primary mb-6">Lengkapi Biodata Anda</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          name="biodata.age"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Umur</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="Contoh: 25" 
                  {...field} 
                  onChange={event => field.onChange(event.target.value === '' ? '' : +event.target.value)} // Handle empty string for coercion
                  value={field.value === undefined ? '' : field.value} // Ensure value is not undefined
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <FormField
        control={control}
        name="biodata.address"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Alamat</FormLabel>
            <FormControl>
              <Input placeholder="Contoh: Jl. Merdeka No. 10, Jakarta" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="biodata.gender"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>Gender</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                value={field.value} // Changed from defaultValue to value
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
    </div>
  );
}
