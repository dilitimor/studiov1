
"use client";

import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { FullResumeValues } from '@/lib/schema';
import { FullResumeSchema } from '@/lib/schema';

import TargetPositionStepForm from './steps/TargetPositionStepForm';
import BiodataStepForm from './steps/BiodataStepForm';
import ShortProfileStepForm from './steps/ShortProfileStepForm';
import EducationStepForm from './steps/EducationStepForm';
import ExperienceStepForm from './steps/ExperienceStepForm';
import SkillsStepForm from './steps/SkillsStepForm';
import HobbiesStepForm from './steps/HobbiesStepForm';
import ReferencesStepForm from './steps/ReferencesStepForm';
import SummaryStep from './steps/SummaryStep';

import StepIndicator from './StepIndicator';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { db, auth } from '@/config/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

const steps = [
  { id: 1, name: 'Posisi Dilamar', fields: ['targetPosition'] },
  { id: 2, name: 'Biodata Diri', fields: ['biodata'] },
  { id: 3, name: 'Profil Singkat', fields: ['shortProfile'] },
  { id: 4, name: 'Pendidikan', fields: ['education'] },
  { id: 5, name: 'Pengalaman Kerja', fields: ['experience'] },
  { id: 6, name: 'Keahlian', fields: ['skills'] },
  { id: 7, name: 'Hobi', fields: ['hobbies'] },
  { id: 8, name: 'Referensi', fields: ['references'] },
  { id: 9, name: 'Ringkasan & Selesai' },
];

export default function ResumeFormStepper() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const methods = useForm<FullResumeValues>({
    resolver: zodResolver(FullResumeSchema),
    defaultValues: {
      targetPosition: { applyingForPosition: false, positionName: '', companyName: '', industry: '' },
      biodata: { name: '', address: '', contactNumber: '', birthPlaceDate: '', gender: '', photoUrl: '' },
      shortProfile: { background: '', strengths: '', careerGoals: '', teamValue: '' },
      education: [{ level: '', institution: '', major: '', yearRange: '', gpa: '', achievements: '' }],
      experience: [], 
      skills: { hasSkills: false, mainSkills: '', foreignLanguages: '' },
      hobbies: { hasHobbies: false, hobbiesList: '' },
      references: { hasReferences: false, entries: [] },
    },
  });

  const { handleSubmit, trigger, getValues } = methods;

  const handleNext = async () => {
    let isValid = false;
    const currentStepConfig = steps.find(step => step.id === currentStep);
    
    if (currentStepConfig && currentStepConfig.fields) {
      isValid = await trigger(currentStepConfig.fields as any);
    } else if (currentStep < steps.length) { 
      isValid = true;
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
      setCurrentStep(prev => prev - 1); // Corrected to prev - 1
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
      const dataToSave = {
        ...data,
        experience: data.experience?.length ? data.experience : [],
        references: data.references?.entries?.length ? data.references : { hasReferences: false, entries: [] },
      };

      const resumeDocRef = doc(db, `users/${currentUser.uid}/resumes`, `resume_${Date.now()}`);
      await setDoc(resumeDocRef, {
        ...dataToSave,
        userId: currentUser.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      toast({
        title: 'Resume Disimpan!',
        description: 'Resume Anda telah berhasil disimpan.',
      });
      methods.reset(); 
      setCurrentStep(1); 
    } catch (error: any) {
      console.error('Error saving resume:', error);
      const errorMessage = error.message || 'Terjadi kesalahan saat menyimpan resume Anda. Silakan coba lagi.';
      toast({
        title: 'Gagal Menyimpan Resume',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const currentResumeData = getValues();

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 w-full">
        <StepIndicator currentStep={currentStep} steps={steps} />

        <div className="min-h-[400px]"> {/* Ensure consistent height for steps */}
          {currentStep === 1 && <TargetPositionStepForm />}
          {currentStep === 2 && <BiodataStepForm />}
          {currentStep === 3 && <ShortProfileStepForm />}
          {currentStep === 4 && <EducationStepForm />}
          {currentStep === 5 && <ExperienceStepForm />}
          {currentStep === 6 && <SkillsStepForm />}
          {currentStep === 7 && <HobbiesStepForm />}
          {currentStep === 8 && <ReferencesStepForm />}
          {currentStep === 9 && <SummaryStep data={currentResumeData} />}
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
    
