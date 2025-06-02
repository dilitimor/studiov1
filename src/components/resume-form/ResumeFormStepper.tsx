
"use client";

import { useEffect, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { FullResumeValues, ResumeDocument } from '@/lib/schema';
import { FullResumeSchema } from '@/lib/schema';
import { useRouter, useSearchParams } from 'next/navigation'; // Added useSearchParams

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
import { auth } from '@/config/firebase';
import { addResume, getResume, updateResume } from '@/services/firestoreService'; // Updated imports
import { useAuth } from '@/contexts/AuthContext'; // Added useAuth

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

const defaultFormValues: FullResumeValues = {
  targetPosition: { applyingForPosition: false, positionName: '', companyName: '', industry: '' },
  biodata: { name: '', address: '', contactNumber: '', birthPlaceDate: '', gender: 'Laki-laki', photoUrl: '' },
  shortProfile: { background: '', strengths: '', careerGoals: '', teamValue: '' },
  education: [{ level: '', institution: '', major: '', yearRange: '', gpa: '', achievements: '' }],
  experience: [],
  skills: { hasSkills: false, mainSkills: '', foreignLanguages: '' },
  hobbies: { hasHobbies: false, hobbiesList: '' },
  references: { hasReferences: false, entries: [] },
};

export default function ResumeFormStepper() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingData, setIsFetchingData] = useState(false); // For loading existing resume
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user: currentUser, loading: authLoading } = useAuth(); // Use useAuth hook
  const editId = searchParams.get('editId');


  const methods = useForm<FullResumeValues>({
    resolver: zodResolver(FullResumeSchema),
    defaultValues: defaultFormValues,
  });

  const { handleSubmit, trigger, getValues, reset } = methods;

  useEffect(() => {
    if (editId && currentUser && !authLoading) {
      const fetchResumeData = async () => {
        setIsFetchingData(true);
        try {
          const resumeData = await getResume(currentUser.uid, editId);
          if (resumeData) {
            // Ensure arrays are not undefined for field arrays
            const dataToReset: FullResumeValues = {
              ...defaultFormValues, // Start with defaults to ensure all keys are present
              ...resumeData,
              education: resumeData.education?.length ? resumeData.education : [{ level: '', institution: '', major: '', yearRange: '', gpa: '', achievements: '' }],
              experience: resumeData.experience?.length ? resumeData.experience : [],
              references: {
                hasReferences: resumeData.references?.hasReferences || false,
                entries: resumeData.references?.entries?.length ? resumeData.references.entries : [],
              }
            };
            reset(dataToReset);
          } else {
            toast({ title: "Error", description: "Resume tidak ditemukan.", variant: "destructive" });
            router.push('/resume'); // Redirect if resume not found for editing
          }
        } catch (error) {
          console.error("Error fetching resume for edit:", error);
          toast({ title: "Error", description: "Gagal memuat data resume.", variant: "destructive" });
        } finally {
          setIsFetchingData(false);
        }
      };
      fetchResumeData();
    } else if (!editId) {
      // Reset to default if not editing or if user changes
      reset(defaultFormValues);
      setCurrentStep(1);
    }
  }, [editId, currentUser, authLoading, reset, toast, router]);


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
      setCurrentStep(prev => prev - 1);
    }
  };

  const onSubmit = async (data: FullResumeValues) => {
    setIsLoading(true);
    if (!currentUser) {
      toast({ title: "Error", description: "Anda harus login untuk menyimpan resume.", variant: "destructive" });
      setIsLoading(false);
      return;
    }

    // Ensure potentially empty arrays are handled correctly if not touched
    const dataToSave: FullResumeValues = {
      ...data,
      experience: data.experience?.length ? data.experience : [],
      references: {
        hasReferences: data.references?.hasReferences || false,
        entries: data.references?.hasReferences && data.references.entries?.length ? data.references.entries : [],
      },
      skills: {
        hasSkills: data.skills?.hasSkills || false,
        mainSkills: data.skills?.hasSkills ? data.skills.mainSkills : '',
        foreignLanguages: data.skills?.hasSkills ? data.skills.foreignLanguages : '',
      },
       hobbies: {
        hasHobbies: data.hobbies?.hasHobbies || false,
        hobbiesList: data.hobbies?.hasHobbies ? data.hobbies.hobbiesList : '',
      }
    };


    try {
      let resumeIdToRedirect: string;
      if (editId) {
        await updateResume(currentUser.uid, editId, dataToSave);
        resumeIdToRedirect = editId;
        toast({
          title: 'Resume Diperbarui!',
          description: 'Resume Anda telah berhasil diperbarui.',
        });
      } else {
        const newResumeId = await addResume(currentUser.uid, dataToSave);
        resumeIdToRedirect = newResumeId;
        toast({
          title: 'Resume Disimpan!',
          description: 'Resume Anda telah berhasil disimpan.',
        });
      }
      reset(defaultFormValues);
      setCurrentStep(1);
      router.push(`/resume/generate?resumeId=${resumeIdToRedirect}`);

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

  if (isFetchingData || authLoading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <Loader2 className="mr-2 h-8 w-8 animate-spin text-primary" />
        <p>{authLoading ? "Memverifikasi pengguna..." : "Memuat data resume..."}</p>
      </div>
    );
  }
  
  const currentResumeData = getValues();

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 w-full">
        <StepIndicator currentStep={currentStep} steps={steps} />

        <div className="min-h-[400px]">
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
          <Button type="button" variant="outline" onClick={handlePrev} disabled={currentStep === 1 || isLoading || isFetchingData}>
            Kembali
          </Button>
          {currentStep < steps.length ? (
            <Button type="button" onClick={handleNext} disabled={isLoading || isFetchingData}>
              Lanjut
            </Button>
          ) : (
            <Button type="submit" disabled={isLoading || isFetchingData}>
              {(isLoading || isFetchingData) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editId ? 'Simpan Perubahan & Lanjut' : 'Simpan Resume & Lanjut'}
            </Button>
          )}
        </div>
      </form>
    </FormProvider>
  );
}
    