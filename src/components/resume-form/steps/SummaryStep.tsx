"use client";

import type { FullResumeValues } from '@/lib/schema';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Building, GraduationCap, UserCircle2, Briefcase, Edit3, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { polishResumeDescription } from '@/ai/flows/polish-resume';
import { useFormContext } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';


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
        targetPosition: "posisi yang relevan"
      });
      if (result.polishedDescription) {
        setValue(fieldPath, result.polishedDescription, { shouldValidate: true });
        toast({ title: "Deskripsi Dipoles", description: "Berhasil diperbarui dengan AI." });
      } else {
        toast({ title: "Gagal Memoles", variant: "destructive" });
      }
    } catch (error) {
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
          <p><strong>Nama:</strong> {data.biodata.name}</p>
          <p><strong>Alamat:</strong> {data.biodata.address}</p>
          <p><strong>Umur:</strong> {data.biodata.age} tahun</p>
          <p><strong>Gender:</strong> {data.biodata.gender}</p>
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
          {data.education.map((edu, index) => (
            <div key={`edu-${index}`} className="pb-4 border-b last:border-b-0 border-border/50">
              <h4 className="font-semibold text-lg text-foreground">{edu.institution}</h4>
              <p className="text-sm text-muted-foreground">{edu.major} - IPK/Nilai: {edu.gpa}</p>
              <div className="mt-2 flex justify-between items-start">
                <p className="text-foreground/90 whitespace-pre-wrap"><strong>Keahlian:</strong> {edu.skills}</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handlePolish('education', index, edu.skills, `education.${index}.skills`)}
                  disabled={polishingStates[`education-${index}`]}
                  className="ml-2 text-accent border-accent hover:bg-accent/10 hover:text-accent"
                >
                  {polishingStates[`education-${index}`] ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4"/>}
                  <span className="ml-1 hidden sm:inline">Polish</span>
                </Button>
              </div>
            </div>
          ))}
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
          {data.experience.map((exp, index) => (
            <div key={`exp-${index}`} className="pb-4 border-b last:border-b-0 border-border/50">
              <h4 className="font-semibold text-lg text-foreground">{exp.company} - {exp.position}</h4>
              <p className="text-sm text-muted-foreground">{exp.department} | {exp.month}, {exp.year}</p>
              <div className="mt-2 flex justify-between items-start">
                 <p className="text-foreground/90 whitespace-pre-wrap"><strong>Tugas:</strong> {exp.tasks}</p>
                 <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handlePolish('experience', index, exp.tasks, `experience.${index}.tasks`)}
                  disabled={polishingStates[`experience-${index}`]}
                  className="ml-2 text-accent border-accent hover:bg-accent/10 hover:text-accent"
                >
                  {polishingStates[`experience-${index}`] ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4"/>}
                  <span className="ml-1 hidden sm:inline">Polish</span>
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
      
      <p className="text-center text-muted-foreground mt-8">
        Har