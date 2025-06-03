
"use client";

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Loader2, FileCheck2, Palette, GraduationCap, Briefcase, Repeat, UserCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getResume, type FullResumeValues, getAiResumeTemplates, type AiResumeTemplateDocument, type ResumeType } from '@/services/firestoreService';
import { generateFullResume, type GenerateFullResumeOutput } from '@/ai/flows/generate-full-resume';
// Import Zod to infer the type for flowInputData, matching the AI flow's input schema structure.
import type { z } from 'zod';
import type { GenerateFullResumeInput } from '@/ai/flows/generate-full-resume';


const resumeTypeOptions = [
  { id: 'lulusan_baru' as ResumeType, label: 'Lulusan Baru', description: 'Ideal untuk Anda yang baru lulus dan ingin menonjolkan potensi serta pendidikan.', icon: <GraduationCap className="h-5 w-5" /> },
  { id: 'profesional' as ResumeType, label: 'Profesional', description: 'Dirancang untuk profesional berpengalaman yang ingin menunjukkan pencapaian dan keahlian spesifik.', icon: <Briefcase className="h-5 w-5" /> },
  { id: 'ganti_karier' as ResumeType, label: 'Ganti Karier', description: 'Fokus pada transferable skills dan bagaimana pengalaman masa lalu relevan dengan jalur karier baru.', icon: <Repeat className="h-5 w-5" /> },
];

export default function GenerateResumePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();

  const [resumeId, setResumeId] = useState<string | null>(null);
  const [resumeData, setResumeData] = useState<FullResumeValues | null>(null);
  const [selectedUserResumeType, setSelectedUserResumeType] = useState<ResumeType | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResumeText, setGeneratedResumeText] = useState<string | null>(null);
  const [aiTemplates, setAiTemplates] = useState<AiResumeTemplateDocument[]>([]);

  useEffect(() => {
    const id = searchParams.get('resumeId');
    if (id) {
      setResumeId(id);
    } else {
      toast({
        title: 'Error',
        description: 'ID Resume tidak ditemukan. Mengarahkan kembali...',
        variant: 'destructive',
      });
      router.push('/my-resumes');
    }

    async function fetchInitialData() {
      if (!user || !id) return;
      setIsLoadingData(true);
      try {
        const fetchedResumeData = await getResume(user.uid, id);
        if (fetchedResumeData) {
          setResumeData(fetchedResumeData);
        } else {
          toast({ title: 'Error', description: 'Resume tidak ditemukan.', variant: 'destructive' });
          router.push('/my-resumes');
          return;
        }

        const fetchedTemplates = await getAiResumeTemplates();
        setAiTemplates(fetchedTemplates);

      } catch (error) {
        console.error("Error fetching initial data:", error);
        toast({ title: 'Error Memuat Data', description: 'Gagal memuat data resume atau template.', variant: 'destructive' });
      } finally {
        setIsLoadingData(false);
      }
    }

    if (!authLoading && user) {
        fetchInitialData();
    }

  }, [searchParams, router, toast, user, authLoading]);

  const handleGenerateResume = async () => {
    if (!selectedUserResumeType) {
      toast({
        title: 'Pilih Tipe Resume',
        description: 'Harap pilih salah satu tipe resume sebelum melanjutkan.',
        variant: 'destructive',
      });
      return;
    }
    if (!resumeData) {
      toast({ title: 'Error', description: 'Data resume tidak tersedia.', variant: 'destructive' });
      return;
    }

    setIsGenerating(true);
    setGeneratedResumeText(null);

    try {
      const relevantTemplate = aiTemplates.find(t => t.resumeType === selectedUserResumeType && t.contentPdfDataUri);
      const referenceTemplatePdfUri = relevantTemplate?.contentPdfDataUri || undefined;

      if (relevantTemplate && !referenceTemplatePdfUri) {
        toast({ title: "Info Template", description: `Template untuk tipe '${selectedUserResumeType}' ditemukan, namun tidak ada PDF terlampir. Melanjutkan tanpa referensi PDF.`, variant: "default" });
      } else if (!relevantTemplate) {
         toast({ title: "Info Template", description: `Tidak ada template yang sesuai dengan tipe '${selectedUserResumeType}'. Melanjutkan tanpa referensi PDF.`, variant: "default" });
      }

      // Construct a plain object for resumeData to pass to the server action,
      // matching the structure expected by FullResumeDataSchemaZod in the AI flow.
      // This explicitly omits Firestore Timestamps or other non-plain objects.
      const flowInputResumeData: GenerateFullResumeInput['resumeData'] = {
        targetPosition: resumeData.targetPosition,
        biodata: resumeData.biodata,
        shortProfile: resumeData.shortProfile,
        education: resumeData.education,
        experience: resumeData.experience,
        skills: resumeData.skills,
        hobbies: resumeData.hobbies,
        references: resumeData.references,
      };

      const result: GenerateFullResumeOutput = await generateFullResume({
        resumeData: flowInputResumeData,
        selectedResumeType: selectedUserResumeType,
        referenceTemplatePdfUri: referenceTemplatePdfUri,
      });

      setGeneratedResumeText(result.generatedResumeText);
      toast({
        title: 'Resume Dihasilkan!',
        description: 'Resume Anda telah berhasil dibuat oleh AI.',
      });
    } catch (error: any) {
      console.error('Error generating resume:', error);
      toast({
        title: 'Gagal Menghasilkan Resume',
        description: error.message || 'Terjadi kesalahan saat AI membuat resume.',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  if (authLoading || isLoadingData) {
    return (
      <ProtectedRoute>
        <div className="flex items-center justify-center h-[calc(100vh-10rem)]">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="ml-4 text-lg">{authLoading ? "Memverifikasi..." : "Memuat informasi resume..."}</p>
        </div>
      </ProtectedRoute>
    );
  }

  if (!resumeId || !resumeData) {
    return (
      <ProtectedRoute>
        <div className="flex flex-col items-center justify-center h-[calc(100vh-10rem)]">
          <p className="text-lg text-destructive">ID Resume tidak valid atau data tidak ditemukan.</p>
          <Button onClick={() => router.push('/my-resumes')} className="mt-4">Kembali ke Resume Saya</Button>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="max-w-4xl mx-auto py-8">
        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit mb-4">
                <Palette className="h-10 w-10 text-primary" />
            </div>
            <CardTitle className="text-3xl">Hasilkan Resume Anda</CardTitle>
            <CardDescription className="text-lg">
              Resume Anda (<span className="font-semibold text-primary">{resumeData.biodata?.name || resumeId}</span>) siap.
              Pilih tipe yang paling sesuai untuk gaya dan nada yang diinginkan.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8 pt-6">
            <RadioGroup
              value={selectedUserResumeType || undefined}
              onValueChange={(value) => setSelectedUserResumeType(value as ResumeType)}
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              {resumeTypeOptions.map((type) => (
                <Label
                  key={type.id}
                  htmlFor={`type-${type.id}`}
                  className={`flex flex-col items-center justify-start p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                    selectedUserResumeType === type.id ? 'ring-2 ring-primary border-primary bg-primary/5' : 'border-border'
                  }`}
                >
                  <RadioGroupItem value={type.id} id={`type-${type.id}`} className="sr-only" />
                  <div className={`p-3 rounded-full mb-3 ${selectedUserResumeType === type.id ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                    {type.icon}
                  </div>
                  <span className="text-lg font-semibold text-foreground mb-1 text-center">{type.label}</span>
                  <span className={`text-sm text-center ${selectedUserResumeType === type.id ? 'text-primary-foreground/90 md:text-primary/90' : 'text-muted-foreground'}`}>{type.description}</span>
                </Label>
              ))}
            </RadioGroup>

            <Button
              onClick={handleGenerateResume}
              className="w-full text-lg py-6"
              disabled={!selectedUserResumeType || isGenerating || isLoadingData}
            >
              {isGenerating ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <FileCheck2 className="mr-2 h-5 w-5" />}
              {isGenerating ? 'Menghasilkan...' : 'Generate Resume dengan AI'}
            </Button>

            {generatedResumeText && (
              <div className="space-y-4 pt-6 border-t">
                <h3 className="text-2xl font-semibold text-primary">Resume yang Dihasilkan AI:</h3>
                <Textarea
                  value={generatedResumeText}
                  readOnly
                  rows={20}
                  className="bg-muted/30 text-sm font-mono p-4"
                  placeholder="Konten resume akan muncul di sini..."
                />
                <Button onClick={() => navigator.clipboard.writeText(generatedResumeText)} variant="outline">Salin ke Clipboard</Button>
              </div>
            )}

            <Button variant="outline" onClick={() => router.push('/my-resumes')} className="w-full mt-4">
                Kembali ke Daftar Resume Saya
            </Button>
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  );
}

