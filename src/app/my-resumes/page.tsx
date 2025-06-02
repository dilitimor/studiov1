
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Loader2, PlusCircle, Edit, Trash2, FileText, Settings2, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { getUserResumes, deleteResume, type ResumeDocument } from "@/services/firestoreService";
import { format } from 'date-fns';

export default function MyResumesPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [resumes, setResumes] = useState<ResumeDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  async function fetchResumes() {
    if (!user) return;
    setIsLoading(true);
    try {
      const fetchedResumes = await getUserResumes(user.uid);
      setResumes(fetchedResumes);
    } catch (error) {
      console.error("Error fetching resumes:", error);
      toast({ title: "Error", description: "Gagal memuat daftar resume Anda.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (!authLoading && user) {
      fetchResumes();
    }
    if (!authLoading && !user) {
      router.push('/login'); // Should be handled by ProtectedRoute, but as a fallback
    }
  }, [user, authLoading, router, toast]);

  const handleDeleteResume = async (id: string) => {
    if (!user) return;
    setIsDeleting(id);
    try {
      await deleteResume(user.uid, id);
      toast({ title: "Sukses", description: "Resume berhasil dihapus." });
      fetchResumes(); // Refresh the list
    } catch (error) {
      toast({ title: "Error", description: "Gagal menghapus resume.", variant: "destructive" });
    } finally {
      setIsDeleting(null);
    }
  };

  const getResumeTitle = (resume: ResumeDocument) => {
    if (resume.targetPosition?.applyingForPosition && resume.targetPosition.positionName) {
      return resume.targetPosition.positionName;
    }
    if (resume.biodata?.name) {
      return `Resume untuk ${resume.biodata.name}`;
    }
    return "Resume Tanpa Judul";
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    // Firestore timestamp can be { seconds: number, nanoseconds: number }
    if (timestamp.seconds) {
      return format(new Date(timestamp.seconds * 1000), 'dd MMM yyyy, HH:mm');
    }
    // If it's already a Date object or string
    try {
      return format(new Date(timestamp), 'dd MMM yyyy, HH:mm');
    } catch (e) {
      return 'Invalid Date';
    }
  };


  if (authLoading || (isLoading && resumes.length === 0)) {
    return (
      <ProtectedRoute>
        <div className="flex items-center justify-center h-[calc(100vh-10rem)]">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="ml-4 text-lg">{authLoading ? "Memverifikasi pengguna..." : "Memuat resume Anda..."}</p>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="space-y-8">
        <Card className="shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <div>
              <CardTitle className="text-3xl flex items-center text-primary">
                <FileText className="mr-3 h-8 w-8" /> Resume Saya
              </CardTitle>
              <CardDescription>Kelola semua resume yang telah Anda buat.</CardDescription>
            </div>
            <Button asChild size="lg">
              <Link href="/resume">
                <PlusCircle className="mr-2 h-5 w-5" /> Buat Resume Baru
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {isLoading && resumes.length > 0 && <p className="text-muted-foreground text-sm mb-2">Memuat ulang daftar...</p>}
            {resumes.length === 0 && !isLoading ? (
              <div className="text-center py-16">
                <FileText className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">Anda Belum Memiliki Resume</h3>
                <p className="text-muted-foreground mb-6">Mulai buat resume profesional pertama Anda sekarang!</p>
                <Button asChild size="lg">
                  <Link href="/resume">
                    <PlusCircle className="mr-2 h-5 w-5" /> Buat Resume Baru
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[200px]">Judul Resume</TableHead>
                      <TableHead>Terakhir Diperbarui</TableHead>
                      <TableHead className="text-right min-w-[200px]">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {resumes.map((resume) => (
                      <TableRow key={resume.id}>
                        <TableCell className="font-medium">{getResumeTitle(resume)}</TableCell>
                        <TableCell>{formatDate(resume.updatedAt || resume.createdAt)}</TableCell>
                        <TableCell className="text-right space-x-2">
                           <Button variant="outline" size="sm" asChild className="hover:text-accent hover:border-accent">
                            <Link href={`/resume/generate?resumeId=${resume.id}`}>
                              <Settings2 className="mr-1 h-4 w-4 md:mr-2" /> <span className="hidden md:inline">Pilih Tampilan</span>
                            </Link>
                          </Button>
                          <Button variant="outline" size="sm" asChild className="hover:text-primary hover:border-primary">
                            <Link href={`/resume?editId=${resume.id}`}>
                              <Edit className="mr-1 h-4 w-4 md:mr-2" /> <span className="hidden md:inline">Edit</span>
                            </Link>
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="destructive" size="sm" disabled={isDeleting === resume.id}>
                                {isDeleting === resume.id ? <Loader2 className="h-4 w-4 animate-spin md:mr-2" /> : <Trash2 className="mr-1 h-4 w-4 md:mr-2" />}
                                <span className="hidden md:inline">Hapus</span>
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Anda yakin ingin menghapus resume ini?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Tindakan ini tidak dapat dibatalkan. Resume &quot;{getResumeTitle(resume)}&quot; akan dihapus secara permanen.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel disabled={isDeleting === resume.id}>Batal</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteResume(resume.id)}
                                  disabled={isDeleting === resume.id}
                                  className="bg-destructive hover:bg-destructive/90"
                                >
                                  {isDeleting === resume.id && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                  Ya, Hapus
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  );
}
