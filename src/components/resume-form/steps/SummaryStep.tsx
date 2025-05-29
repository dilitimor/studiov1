
"use client";

import type { FullResumeValues } from '@/lib/schema';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Target, UserCircle2, GraduationCap, Briefcase, Sparkles, Brain, Smile, Users, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { polishResumeDescription } from '@/ai/flows/polish-resume';
import { useFormContext } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import Image from 'next/image';

interface SummaryStepProps {
  data: FullResumeValues;
}

export default function SummaryStep({ data }: SummaryStepProps) {
  const { setValue } = useFormContext<FullResumeValues>();
  const { toast } = useToast();
  const [polishingStates, setPolishingStates] = useState<{ [key: string]: boolean }>({});

  const handlePolish = async (
    section: 'experience', // Only experience tasks are polishable for now
    index: number, 
    text: string, 
    fieldPath: `experience.${number}.tasks` // Specific path for experience tasks
  ) => {
    const key = `${section}-${index}`;
    if (!text || !text.trim()) {
      toast({ title: "Tidak ada teks", description: "Isi bagian ini terlebih dahulu untuk dipoles.", variant: "destructive" });
      return;
    }
    setPolishingStates(prev => ({ ...prev, [key]: true }));
    try {
      const result = await polishResumeDescription({
        sectionDescription: text,
        targetPosition: data.targetPosition?.positionName || "posisi yang relevan"
      });
      if (result.polishedDescription) {
        setValue(fieldPath, result.polishedDescription, { shouldValidate: true });
        toast({ title: "Deskripsi Dipoles", description: "Berhasil diperbarui dengan AI." });
      } else {
        toast({ title: "Gagal Memoles", description: "AI tidak dapat memproses deskripsi saat ini.", variant: "destructive" });
      }
    } catch (error) {
      console.error(`Error polishing ${section} at index ${index}:`, error);
      toast({ title: "Error AI", description: "Gagal menghubungi AI.", variant: "destructive" });
    } finally {
      setPolishingStates(prev => ({ ...prev, [key]: false }));
    }
  };

  const renderTextWithLineBreaks = (text: string | undefined | null) => {
    if (!text) return "-";
    return text.split('\n').map((line, idx) => (
      <span key={idx}>{line}{idx === text.split('\n').length - 1 ? '' : <br />}</span>
    ));
  };

  return (
    <div className="space-y-8 p-2">
      <h2 className="text-3xl font-semibold text-primary mb-8 text-center">Ringkasan Resume Anda</h2>
      
      {/* Target Position Section */}
      {data.targetPosition?.applyingForPosition && (
        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center space-x-3 bg-muted/30 p-4 rounded-t-lg">
            <Target className="h-6 w-6 text-primary" />
            <CardTitle className="text-xl">Posisi yang Dilamar</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-3 text-foreground/90">
            <p><strong>Posisi:</strong> {data.targetPosition.positionName || "-"}</p>
            {data.targetPosition.companyName && <p><strong>Nama Perusahaan:</strong> {data.targetPosition.companyName}</p>}
            {data.targetPosition.industry && <p><strong>Industri:</strong> {data.targetPosition.industry}</p>}
          </CardContent>
        </Card>
      )}
      <Separator />

      {/* Biodata Section */}
      <Card className="shadow-lg">
        <CardHeader className="flex flex-row items-center space-x-3 bg-muted/30 p-4 rounded-t-lg">
          <UserCircle2 className="h-6 w-6 text-primary" />
          <CardTitle className="text-xl">Biodata Diri</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-3 text-foreground/90">
          {data.biodata?.photoUrl && (
            <div className="mb-4 flex justify-center">
              <Image src={data.biodata.photoUrl} alt="Foto Profil" width={100} height={100} className="rounded-full object-cover" data-ai-hint="profile photo"/>
            </div>
          )}
          <p><strong>Nama:</strong> {data.biodata?.name || "-"}</p>
          <p><strong>Alamat:</strong> {renderTextWithLineBreaks(data.biodata?.address)}</p>
          <p><strong>Nomor Kontak:</strong> {data.biodata?.contactNumber || "-"}</p>
          <p><strong>Tempat & Tanggal Lahir:</strong> {data.biodata?.birthPlaceDate || "-"}</p>
          <p><strong>Gender:</strong> {data.biodata?.gender || "-"}</p>
        </CardContent>
      </Card>
      <Separator />

      {/* Short Profile Section */}
      <Card className="shadow-lg">
        <CardHeader className="flex flex-row items-center space-x-3 bg-muted/30 p-4 rounded-t-lg">
          <Sparkles className="h-6 w-6 text-primary" /> {/* Changed icon */}
          <CardTitle className="text-xl">Profil Singkat</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-3 text-foreground/90">
          <p><strong>Latar Belakang:</strong> {renderTextWithLineBreaks(data.shortProfile?.background)}</p>
          <p><strong>Kekuatan Utama:</strong> {renderTextWithLineBreaks(data.shortProfile?.strengths)}</p>
          <p><strong>Tujuan Karier:</strong> {renderTextWithLineBreaks(data.shortProfile?.careerGoals)}</p>
          <p><strong>Nilai untuk Tim/Perusahaan:</strong> {renderTextWithLineBreaks(data.shortProfile?.teamValue)}</p>
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
              <h4 className="font-semibold text-lg text-foreground">{edu.institution || "Institusi Tidak Disebutkan"} ({edu.level || "Jenjang Tidak Disebutkan"})</h4>
              <p className="text-sm text-muted-foreground">{edu.major || "Jurusan Tidak Disebutkan"} | {edu.yearRange || "-"}</p>
              {edu.gpa && <p className="text-foreground/90"><strong>IPK:</strong> {edu.gpa}</p>}
              {edu.achievements && <p className="text-foreground/90"><strong>Prestasi:</strong> {renderTextWithLineBreaks(edu.achievements)}</p>}
            </div>
          )) : <p className="text-muted-foreground">Tidak ada riwayat pendidikan yang dimasukkan.</p>}
        </CardContent>
      </Card>
      <Separator />

      {/* Experience Section */}
      {data.experience && data.experience.length > 0 && (
        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center space-x-3 bg-muted/30 p-4 rounded-t-lg">
            <Briefcase className="h-6 w-6 text-primary" />
            <CardTitle className="text-xl">Pengalaman Kerja/Magang</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {data.experience.map((exp, index) => (
              <div key={`exp-${index}`} className="pb-4 border-b last:border-b-0 border-border/50">
                <h4 className="font-semibold text-lg text-foreground">{exp.company || "Perusahaan Tidak Disebutkan"} - {exp.position || "Posisi Tidak Disebutkan"}</h4>
                <p className="text-sm text-muted-foreground">{exp.location || "Lokasi Tidak Disebutkan"} | {exp.period || "-"}</p>
                <div className="mt-2 flex justify-between items-start gap-2">
                  <p className="text-foreground/90 whitespace-pre-wrap flex-1"><strong>Tugas & Tanggung Jawab:</strong> {renderTextWithLineBreaks(exp.tasks)}</p>
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
                {exp.achievements && <p className="text-foreground/90 mt-1"><strong>Pencapaian:</strong> {renderTextWithLineBreaks(exp.achievements)}</p>}
              </div>
            ))}
          </CardContent>
        </Card>
      )}
      {data.experience && data.experience.length > 0 && <Separator />}


      {/* Skills Section */}
      {data.skills?.hasSkills && (
        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center space-x-3 bg-muted/30 p-4 rounded-t-lg">
            <Brain className="h-6 w-6 text-primary" />
            <CardTitle className="text-xl">Keahlian</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-3 text-foreground/90">
            <p><strong>Keahlian Utama:</strong> {renderTextWithLineBreaks(data.skills.mainSkills)}</p>
            {data.skills.foreignLanguages && <p><strong>Bahasa Asing:</strong> {renderTextWithLineBreaks(data.skills.foreignLanguages)}</p>}
          </CardContent>
        </Card>
      )}
      {data.skills?.hasSkills && <Separator />}

      {/* Hobbies Section */}
      {data.hobbies?.hasHobbies && (
        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center space-x-3 bg-muted/30 p-4 rounded-t-lg">
            <Smile className="h-6 w-6 text-primary" />
            <CardTitle className="text-xl">Hobi</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-3 text-foreground/90">
            <p><strong>Daftar Hobi:</strong> {renderTextWithLineBreaks(data.hobbies.hobbiesList)}</p>
          </CardContent>
        </Card>
      )}
      {data.hobbies?.hasHobbies && <Separator />}

      {/* References Section */}
      {data.references?.hasReferences && data.references.entries && data.references.entries.length > 0 && (
        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center space-x-3 bg-muted/30 p-4 rounded-t-lg">
            <Users className="h-6 w-6 text-primary" />
            <CardTitle className="text-xl">Referensi</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {data.references.entries.map((ref, index) => (
              <div key={`ref-${index}`} className="pb-4 border-b last:border-b-0 border-border/50">
                <h4 className="font-semibold text-lg text-foreground">{ref.fullName || "Nama Tidak Disebutkan"}</h4>
                <p className="text-sm text-muted-foreground">{ref.position || "Posisi Tidak Disebutkan"} di {ref.company || "Perusahaan Tidak Disebutkan"}</p>
                <p className="text-foreground/90"><strong>Kontak:</strong> {ref.contactNumber || "-"}</p>
                {ref.email && <p className="text-foreground/90"><strong>Email:</strong> {ref.email}</p>}
                <p className="text-foreground/90"><strong>Hubungan:</strong> {ref.relationship || "-"}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
      
      <p className="text-center text-muted-foreground mt-8">
        Harap periksa kembali semua data Anda. Jika sudah sesuai, klik tombol &quot;Simpan Resume&quot; di bawah.
      </p>
    </div>
  );
}

    