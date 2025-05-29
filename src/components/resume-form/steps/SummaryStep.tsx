
"use client";

import type { FullResumeValues } from '@/lib/schema';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { UserCircle2, GraduationCap, Briefcase, Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { polishResumeDescription } from '@/ai/flows/polish-resume';
import { useFormContext } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

interface SummaryStepProps {
  data: FullResumeValues;
}

export default function SummaryStep({ data }: SummaryStepProps) {
  const { setValue } = useFormContext<FullResumeValues>();
  const { toast } = useToast();
  const [polishingStates, setPolishingStates] = useState<{ [key: string]: boolean }>({});

  const handlePolish = async (type: 'education' | 'experience', index: number, text: string, fieldPath: `education.${number}.skills` | `experience.${number}.tasks`) => {
    const key = `${type}-${index}`;
    setPolishingStates(prev => ({ ...prev, [key]: true }));
    try {
      const result = await polishResumeDescription({
        sectionDescription: text,
        targetPosition: "posisi yang relevan" // This can be made dynamic if needed
      });
      if (result.polishedDescription) {
        setValue(fieldPath, result.polishedDescription, { shouldValidate: true });
        toast({ title: "Deskripsi Dipoles", description: "Berhasil diperbarui dengan AI." });
      } else {
        toast({ title: "Gagal Memoles", description: "AI tidak dapat memproses deskripsi saat ini.", variant: "destructive" });
      }
    } catch (error) {
      console.error(`Error polishing ${type} at index ${index}:`, error);
      toast({ title: "Error AI", description: "Gagal menghubungi AI.", variant: "destructive" });
    } finally {
      setPolishingStates(prev => ({ ...prev, [key]: false }));
    }
  };

  return (
    <div className="space-y-8 p-2">
      <h2 className="text-3xl font-semibold text-primary mb-8 text-center">Ringkasan Resume Anda</h2>
      
      {/* Biodata Section */}
      <Card className="shadow-lg">
        <CardHeader className="flex flex-row items-center space-x-3 bg-muted/30 p-4 rounded-t-lg">
          <UserCircle2 className="h-6 w-6 text-primary" />
          <CardTitle className="text-xl">Biodata Diri</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-3 text-foreground/90">
          <p><strong>Nama:</strong> {data.biodata?.name || "-"}</p>
          <p><strong>Alamat:</strong> {data.biodata?.address || "-"}</p>
          <p><strong>Umur:</strong> {data.biodata?.age ? `${data.biodata.age} tahun` : "-"}</p>
          <p><strong>Gender:</strong> {data.biodata?.gender || "-"}</p>
        </CardContent>
      </Card>

      <Separator />

      {/* Education Section */}
      <Card className="shadow-lg">
        <CardHeader className="flex flex-row items-center space-x-3 bg-muted/30 p-4 rounded-t-lg">
          <GraduationCap className="h-6 w-6 text-primary" />
          <CardTitle className="text-xl">Riwayat Pendidikan</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {data.education && data.education.length > 0 ? data.education.map((edu, index) => (
            <div key={`edu-${index}`} className="pb-4 border-b last:border-b-0 border-border/50">
              <h4 className="font-semibold text-lg text-foreground">{edu.institution || "Institusi Tidak Disebutkan"}</h4>
              <p className="text-sm text-muted-foreground">{edu.major || "Jurusan Tidak Disebutkan"} - IPK/Nilai: {edu.gpa || "-"}</p>
              <div className="mt-2 flex justify-between items-start gap-2">
                <p className="text-foreground/90 whitespace-pre-wrap flex-1"><strong>Keahlian:</strong> {edu.skills || "-"}</p>
                {edu.skills && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handlePolish('education', index, edu.skills, `education.${index}.skills`)}
                    disabled={polishingStates[`education-${index}`]}
                    className="text-accent border-accent hover:bg-accent/10 hover:text-accent shrink-0"
                  >
                    {polishingStates[`education-${index}`] ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4"/>}
                    <span className="ml-1 hidden sm:inline">Polish</span>
                  </Button>
                )}
              </div>
            </div>
          )) : <p className="text-muted-foreground">Tidak ada riwayat pendidikan yang dimasukkan.</p>}
        </CardContent>
      </Card>

      <Separator />

      {/* Experience Section */}
      <Card className="shadow-lg">
        <CardHeader className="flex flex-row items-center space-x-3 bg-muted/30 p-4 rounded-t-lg">
          <Briefcase className="h-6 w-6 text-primary" />
          <CardTitle className="text-xl">Pengalaman Kerja/Magang</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {data.experience && data.experience.length > 0 ? data.experience.map((exp, index) => (
            <div key={`exp-${index}`} className="pb-4 border-b last:border-b-0 border-border/50">
              <h4 className="font-semibold text-lg text-foreground">{exp.company || "Perusahaan Tidak Disebutkan"} - {exp.position || "Posisi Tidak Disebutkan"}</h4>
              <p className="text-sm text-muted-foreground">{exp.department || "Departemen Tidak Disebutkan"} | {exp.month || "-"}, {exp.year || "-"}</p>
              <div className="mt-2 flex justify-between items-start gap-2">
                 <p className="text-foreground/90 whitespace-pre-wrap flex-1"><strong>Tugas:</strong> {exp.tasks || "-"}</p>
                 {exp.tasks && (
                   <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handlePolish('experience', index, exp.tasks, `experience.${index}.tasks`)}
                    disabled={polishingStates[`experience-${index}`]}
                    className="text-accent border-accent hover:bg-accent/10 hover:text-accent shrink-0"
                  >
                    {polishingStates[`experience-${index}`] ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4"/>}
                    <span className="ml-1 hidden sm:inline">Polish</span>
                  </Button>
                 )}
              </div>
            </div>
          )) : <p className="text-muted-foreground">Tidak ada pengalaman kerja yang dimasukkan.</p>}
        </CardContent>
      </Card>
      
      <p className="text-center text-muted-foreground mt-8">
        Harap periksa kembali semua data Anda. Jika sudah sesuai, klik tombol &quot;Simpan Resume&quot; di bawah.
      </p>
    </div>
  );
}
