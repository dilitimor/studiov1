
"use client";

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Loader2, FileCheck2, Palette, GraduationCap, Briefcase, Repeat } from 'lucide-react'; // Added new icons

const resumeTypes = [
  { id: 'lulusan_baru', label: 'Lulusan Baru', description: 'Ideal untuk Anda yang baru lulus dan ingin menonjolkan potensi serta pendidikan.', icon: <GraduationCap className="h-5 w-5" /> },
  { id: 'profesional', label: 'Profesional', description: 'Dirancang untuk profesional berpengalaman yang ingin menunjukkan pencapaian dan keahlian spesifik.', icon: <Briefcase className="h-5 w-5" /> },
  { id: 'ganti_karier', label: 'Ganti Karier', description: 'Fokus pada transferable skills dan bagaimana pengalaman masa lalu relevan dengan jalur karier baru.', icon: <Repeat className="h-5 w-5" /> },
];

export default function GenerateResumePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const [resumeId, setResumeId] = useState<string | null>(null);
  const [selectedResumeType, setSelectedResumeType] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const id = searchParams.get('resumeId');
    if (id) {
      setResumeId(id);
      setIsLoading(false);
    } else {
      toast({
        title: 'Error',
        description: 'ID Resume tidak ditemukan. Mengarahkan kembali...',
        variant: 'destructive',
      });
      router.push('/my-resumes'); // Or '/resume'
    }
  }, [searchParams, router, toast]);

  const handleGenerateResume = () => {
    if (!selectedResumeType) {
      toast({
        title: 'Pilih Tipe Resume',
        description: 'Harap pilih salah satu tipe resume sebelum melanjutkan.',
        variant: 'destructive',
      });
      return;
    }
    // Placeholder for actual generation logic
    const selectedTypeLabel = resumeTypes.find(rt => rt.id === selectedResumeType)?.label || selectedResumeType;
    console.log(`Generating resume ID: ${resumeId}, Type: ${selectedTypeLabel}`);
    toast({
      title: 'Proses Dimulai (Placeholder)',
      description: `Resume ID: ${resumeId} dengan tipe "${selectedTypeLabel}" akan segera digenerate. Fitur ini sedang dalam pengembangan.`,
    });
    // Potentially redirect to a "processing" or "download" page in the future
    // router.push(`/resume/view/${resumeId}?type=${selectedResumeType}`);
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="flex items-center justify-center h-[calc(100vh-10rem)]">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="ml-4 text-lg">Memuat informasi resume...</p>
        </div>
      </ProtectedRoute>
    );
  }

  if (!resumeId) {
    // This case should be handled by the redirect in useEffect, but as a fallback:
    return (
      <ProtectedRoute>
        <div className="flex flex-col items-center justify-center h-[calc(100vh-10rem)]">
          <p className="text-lg text-destructive">ID Resume tidak valid.</p>
          <Button onClick={() => router.push('/my-resumes')} className="mt-4">Kembali ke Resume Saya</Button>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="max-w-2xl mx-auto py-8">
        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit mb-4">
                <Palette className="h-10 w-10 text-primary" />
            </div>
            <CardTitle className="text-3xl">Pilih Tipe Resume Anda</CardTitle>
            <CardDescription className="text-lg">
              Resume Anda dengan ID: <span className="font-semibold text-primary">{resumeId}</span> telah disimpan.
              Sekarang, pilih tipe yang paling sesuai dengan tujuan Anda.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8 pt-6">
            <RadioGroup
              value={selectedResumeType || undefined}
              onValueChange={setSelectedResumeType}
              className="space-y-4"
            >
              {resumeTypes.map((type) => (
                <Label
                  key={type.id}
                  htmlFor={`type-${type.id}`}
                  className={`flex flex-col md:flex-row items-start md:items-center p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                    selectedResumeType === type.id ? 'ring-2 ring-primary border-primary bg-primary/5' : 'border-border'
                  }`}
                >
                  <RadioGroupItem value={type.id} id={`type-${type.id}`} className="sr-only" />
                  <div className="flex items-center mb-2 md:mb-0 md:mr-4">
                    <span className={`p-2 rounded-full mr-3 ${selectedResumeType === type.id ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                      {type.icon}
                    </span>
                    <span className="text-lg font-medium text-foreground">{type.label}</span>
                  </div>
                  <span className={`text-sm ${selectedResumeType === type.id ? 'text-primary-foreground/90 md:text-primary/90' : 'text-muted-foreground'}`}>{type.description}</span>
                </Label>
              ))}
            </RadioGroup>

            <Button
              onClick={handleGenerateResume}
              className="w-full text-lg py-6"
              disabled={!selectedResumeType}
            >
              <FileCheck2 className="mr-2 h-5 w-5" />
              Generate Resume (Segera Hadir)
            </Button>
            <Button variant="outline" onClick={() => router.push('/my-resumes')} className="w-full">
                Kembali ke Daftar Resume Saya
            </Button>
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  );
}

