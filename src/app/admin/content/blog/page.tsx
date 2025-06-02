
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Loader2, PlusCircle, Edit, Trash2, Newspaper } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getBlogPosts, deleteBlogPost, type BlogPostDocument } from "@/services/firestoreService";

export default function ManageBlogPostsPage() {
  const [posts, setPosts] = useState<BlogPostDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null); // Store ID of post being deleted
  const { toast } = useToast();

  async function fetchPosts() {
    setIsLoading(true);
    try {
      const fetchedPosts = await getBlogPosts();
      setPosts(fetchedPosts);
    } catch (error) {
      toast({ title: "Error", description: "Gagal memuat daftar post blog.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchPosts();
  }, [toast]);

  const handleDeletePost = async (id: string) => {
    setIsDeleting(id);
    try {
      await deleteBlogPost(id);
      toast({ title: "Sukses", description: "Post blog berhasil dihapus." });
      fetchPosts(); // Refresh the list
    } catch (error) {
      toast({ title: "Error", description: "Gagal menghapus post blog.", variant: "destructive" });
    } finally {
      setIsDeleting(null);
    }
  };

  if (isLoading && posts.length === 0) {
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
            <Newspaper className="mr-2 h-6 w-6 text-primary" /> Kelola Postingan Blog
          </CardTitle>
          <CardDescription>Buat, edit, atau hapus postingan blog.</CardDescription>
        </div>
        <Button asChild size="sm">
          <Link href="/admin/content/blog/new">
            <PlusCircle className="mr-2 h-4 w-4" /> Tambah Postingan Baru
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading && posts.length > 0 && <p className="text-muted-foreground text-sm mb-2">Memuat ulang daftar...</p>}
        {posts.length === 0 && !isLoading ? (
          <p className="text-muted-foreground text-center py-10">Belum ada postingan blog. Klik tombol di atas untuk menambahkan.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Judul</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Tanggal Publikasi</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell className="font-medium">{post.title}</TableCell>
                  <TableCell>{post.slug}</TableCell>
                  <TableCell>{post.date ? new Date(post.date).toLocaleDateString() : 'Belum Dipublikasi'}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="icon" asChild className="hover:text-primary hover:border-primary">
                      <Link href={`/admin/content/blog/edit/${post.id}`}>
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Link>
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="icon" disabled={isDeleting === post.id}>
                          {isDeleting === post.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                          <span className="sr-only">Hapus</span>
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Anda yakin ingin menghapus?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tindakan ini tidak dapat dibatalkan. Postingan &quot;{post.title}&quot; akan dihapus secara permanen.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel disabled={isDeleting === post.id}>Batal</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeletePost(post.id)}
                            disabled={isDeleting === post.id}
                            className="bg-destructive hover:bg-destructive/90"
                          >
                            {isDeleting === post.id && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
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
