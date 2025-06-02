
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Loader2, PlusCircle, Edit, Trash2, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getAiResumeTemplates, deleteAiResumeTemplate, type AiResumeTemplateDocument } from "@/services/firestoreService";

export default function ManageAiTemplatesPage() {
  const [templates, setTemplates] = useState<AiResumeTemplateDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const { toast } = useToast();

  async function fetchTemplates() {
    setIsLoading(true);
    try {
      const fetchedTemplates = await getAiResumeTemplates();
      setTemplates(fetchedTemplates);
    } catch (error) {
      toast({ title: "Error", description: "Gagal memuat daftar template AI.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchTemplates();
  }, [toast]); // Removed fetchTemplates from dependency array as it's defined in scope

  const handleDeleteTemplate = async (id: string) => {
    setIsDeleting(id);
    try {
      await deleteAiResumeTemplate(id);
      toast({ title: "Sukses", description: "Template AI berhasil dihapus." });
      fetchTemplates(); // Refresh the list
    } catch (error) {
      toast({ title: "Error", description: "Gagal menghapus template AI.", variant: "destructive" });
    } finally {
      setIsDeleting(null);
    }
  };

  if (isLoading && templates.length === 0) {
    return (
      <div className="flex items-center justify-center h-60">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Card className="shadow-xl">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-2xl flex items-center">
            <Sparkles className="mr-2 h-6 w-6 text-primary" /> Kelola Template Resume AI
          </CardTitle>
          <CardDescription>Buat, edit, atau hapus template yang akan digunakan oleh AI.</CardDescription>
        </div>
        <Button asChild size="sm">
          <Link href="/admin/ai-templates/new">
            <PlusCircle className="mr-2 h-4 w-4" /> Tambah Template Baru
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading && templates.length > 0 && <p className="text-muted-foreground text-sm mb-2">Memuat ulang daftar...</p>}
        {templates.length === 0 && !isLoading ? (
          <p className="text-muted-foreground text-center py-10">Belum ada template AI. Klik tombol di atas untuk menambahkan.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Template</TableHead>
                <TableHead>Deskripsi Singkat</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {templates.map((template) => (
                <TableRow key={template.id}>
                  <TableCell className="font-medium">{template.name}</TableCell>
                  <TableCell className="truncate max-w-xs">{template.description}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="icon" asChild className="hover:text-primary hover:border-primary">
                      <Link href={`/admin/ai-templates/edit/${template.id}`}>
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Link>
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="icon" disabled={isDeleting === template.id}>
                          {isDeleting === template.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                          <span className="sr-only">Hapus</span>
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Anda yakin ingin menghapus?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tindakan ini tidak dapat dibatalkan. Template &quot;{template.name}&quot; akan dihapus secara permanen.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel disabled={isDeleting === template.id}>Batal</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteTemplate(template.id)}
                            disabled={isDeleting === template.id}
                            className="bg-destructive hover:bg-destructive/90"
                          >
                            {isDeleting === template.id && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
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
        )}
      </CardContent>
    </Card>
  );
}
