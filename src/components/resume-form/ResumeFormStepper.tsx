
"use client";

import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { FullResumeValues, BiodataValues, EducationEntryValues, ExperienceEntryValues } from '@/lib/schema';
import { FullResumeSchema } from '@/lib/schema';

import BiodataStepForm from './steps/BiodataStepForm';
import EducationStepForm from './steps/EducationStepForm';
import ExperienceStepForm from './steps/ExperienceStepForm';
import SummaryStep from './steps/SummaryStep';
import StepIndicator from './StepIndicator';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { db, auth } from '@/config/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

const steps = [
  { id: 1, name: 'Biodata Diri', fields: ['biodata'] },
  { id: 2, name: 'Riwayat Pendidikan', fields: ['education'] },
  { id: 3, name: 'Pengalaman Kerja', fields: ['experience'] },
  { id: 4, name: 'Ringkasan & Selesai' },
];

export default function ResumeFormStepper() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const methods = useForm<FullResumeValues>({
    resolver: zodResolver(FullResumeSchema), // Full schema for final validation, but steps validate partially
    defaultValues: {
      biodata: { name: '', address: '', age: '', gender: '' }, // Changed age and gender from undefined to ''
      education: [{ institution: '', gpa: '', major: '', skills: '' }],
      experience: [{ company: '', department: '', position: '', tasks: '', year: '', month: '' }],
    },
  });

  const { handleSubmit, trigger, getValues } = methods;

  const handleNext = async () => {
    let isValid = false;
    if (currentStep === 1) {
      isValid = await trigger('biodata');
    } else if (currentStep === 2) {
      isValid = await trigger('education');
    } else if (currentStep === 3) {
      isValid = await trigger('experience');
    }

    if (isValid) {
      if (currentStep < steps.length) {
        setCurrentStep(prev => prev + 1);
      }
    } else {
       toast({
        title: "Form Tidak Valid",
        description: "Harap periksa kembali isian Anda pada langkah ini.",
        variant: "destructive",
      });
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const onSubmit = async (data: FullResumeValues) => {
    setIsLoading(true);
    const currentUser = auth.currentUser;
    if (!currentUser) {
      toast({ title: "Error", description: "User not authenticated.", variant: "destructive" });
      setIsLoading(false);
      return;
    }

    try {
      // Store the resume data in Firestore
      const resumeDocRef = doc(db, `users/${currentUser.uid}/resumes`, `resume_${Date.now()}`);
      await setDoc(resumeDocRef, {
        ...data,
        userId: currentUser.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      toast({
        title: 'Resume Disimpan!',
        description: 'Resume Anda telah berhasil disimpan.',
      });
      // Potentially reset form or navigate to a success page/dashboard
      // methods.reset();
      // setCurrentStep(1); // Or navigate
    } catch (error) {
      console.error('Error saving resume:', error);
      toast({
        title: 'Gagal Menyimpan Resume',
        description: 'Terjadi kesalahan saat menyimpan resume Anda. Silakan coba lagi.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const currentResumeData = getValues();

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <StepIndicator currentStep={currentStep} steps={steps} />

        <div className="min-h-[300px]"> {/* Ensure consistent height for steps */}
          {currentStep === 1 && <BiodataStepForm />}
          {currentStep === 2 && <EducationStepForm />}
          {currentStep === 3 && <ExperienceStepForm />}
          {currentStep === 4 && <SummaryStep data={currentResumeData} />}
        </div>

        <div className="flex justify-between pt-6 border-t">
          <Button type="button" variant="outline" onClick={handlePrev} disabled={currentStep === 1 || isLoading}>
            Kembali
          </Button>
          {currentStep < steps.length ? (
            <Button type="button" onClick={handleNext} disabled={isLoading}>
              Lanjut
            </Button>
          ) : (
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Simpan Resume
            </Button>
          )}
        </div>
      </form>
    </FormProvider>
  );
}
