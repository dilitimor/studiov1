
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { Loader2, ArrowLeft, Newspaper, ImageIcon } from "lucide-react";
import { BlogPostSchema, type BlogPostValues } from "@/lib/schema";
import { getBlogPost, updateBlogPost, type BlogPostDocument } from "@/services/firestoreService";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import NextImage from "next/image";

export default function EditBlogPostPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  
  const postId = typeof params.id === 'string' ? params.id : null;

  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);

  const form = useForm<BlogPostValues>({
    resolver: zodResolver(BlogPostSchema),
    defaultValues: {
      title: "",
      slug: "",
      content: "",
      imageUrl: "",
      imageAlt: "",
      dataAiHint: "",
      date: new Date().toISOString().split('T')[0], // Default to today for new/editing
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (!postId) {
      toast({ title: "Error", description: "ID Postingan tidak valid.", variant: "destructive" });
      router.push("/admin/content/blog");
      return;
    }

    async function fetchPost() {
      setIsFetching(true);
      try {
        const postData = await getBlogPost(postId as string);
        if (postData) {
          // Ensure date is in YYYY-MM-DD format for the input
          if (postData.date && typeof postData.date !== 'string') {
             // Assuming date might be Firestore Timestamp or Date object
             postData.date = new Date(postData.date.seconds ? postData.date.seconds * 1000 : postData.date).toISOString().split('T')[0];
          } else if (!postData.date) {
             postData.date = new Date().toISOString().split('T')[0];
          }
          form.reset(postData as BlogPostValues);
          if (postData.imageUrl) setCurrentImageUrl(postData.imageUrl);
        } else {
          toast({ title: "Error", description: "Postingan blog tidak ditemukan.", variant: "destructive" });
          router.push("/admin/content/blog");
        }
      } catch (error) {
        toast({ title: "Error", description: "Gagal memuat postingan blog.", variant: "destructive" });
      } finally {
        setIsFetching(false);
      }
    }
    fetchPost();
  }, [postId, form, toast, router]);

  const onSubmit = async (values: BlogPostValues) => {
    if (!postId) return;
    setIsLoading(true);
    try {
      await updateBlogPost(postId, values);
      if (values.imageUrl) setCurrentImageUrl(values.imageUrl); else setCurrentImageUrl(null);
      toast({ title: "Sukses", description: "Postingan blog berhasil diperbarui." });
      router.push("/admin/content/blog");
    } catch (error) {
      toast({ title: "Error", description: "Gagal memperbarui postingan blog.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex items-center justify-center h-60">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2">Memuat data postingan...</p>
      </div>
    );
  }

  return (
    <Card className="shadow-xl">
      <CardHeader>
         <div className="flex items-center justify-between">
            <CardTitle className="text-2xl flex items-center">
              <Newspaper className="mr-2 h-6 w-6 text-primary" /> Edit Postingan Blog
            </CardTitle>
            <Button variant="outline" size="sm" asChild>
                <Link href="/admin/content/blog">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke Daftar Blog
                </Link>
            </Button>
        </div>
        <CardDescription>Perbarui detail postingan blog di bawah ini.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField control={form.control} name="title" render={({ field }) => (
              <FormItem>
                <FormLabel>Judul Postingan</FormLabel>
                <FormControl><Input {...field} /></FormControl><FormMessage />
              </FormItem>
            )}/>
            <FormField control={form.control} name="slug" render={({ field }) => (
              <FormItem>
                <FormLabel>Slug</FormLabel>
                <FormControl><Input {...field} /></FormControl><FormMessage />
              </FormItem>
            )}/>
             <FormField control={form.control} name="date" render={({ field }) => (
              <FormItem>
                <FormLabel>Tanggal Publikasi (YYYY-MM-DD)</FormLabel>
                <FormControl><Input type="date" {...field} /></FormControl><FormMessage />
              </FormItem>
            )}/>
            <FormField control={form.control} name="content" render={({ field }) => (
              <FormItem>
                <FormLabel>Isi Konten (HTML atau Markdown)</FormLabel>
                <FormControl><Textarea {...field} rows={15} className="min-h-[300px]" /></FormControl><FormMessage />
              </FormItem>
            )}/>

            {currentImageUrl && (
              <div className="mb-4 p-2 border rounded-md bg-muted flex flex-col items-center">
                <FormLabel className="mb-1 self-start text-sm">Pratinjau Gambar Saat Ini:</FormLabel>
                <NextImage src={currentImageUrl} alt={form.getValues("imageAlt") || "Blog Post Image"} width={300} height={150} className="object-contain rounded-md" data-ai-hint={form.getValues("dataAiHint") || "placeholder"} />
              </div>
            )}
            <FormField control={form.control} name="imageUrl" render={({ field }) => (
              <FormItem>
                <FormLabel>URL Gambar Utama (opsional)</FormLabel>
                <FormControl>
                    <Input 
                        placeholder="https://example.com/image.png" 
                        {...field} 
                        onChange={(e) => { field.onChange(e); setCurrentImageUrl(e.target.value); }}
                    />
                </FormControl><FormMessage />
              </FormItem>
            )}/>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="imageAlt" render={({ field }) => (
                <FormItem>
                    <FormLabel>Teks Alternatif Gambar (opsional)</FormLabel>
                    <FormControl><Input placeholder="Deskripsi singkat gambar" {...field} /></FormControl><FormMessage />
                </FormItem>
                )}/>
                <FormField control={form.control} name="dataAiHint" render={({ field }) => (
                <FormItem>
                    <FormLabel>Petunjuk AI untuk Gambar (opsional, maks 2 kata)</FormLabel>
                    <FormControl><Input placeholder="Contoh: technology future" {...field} /></FormControl><FormMessage />
                </FormItem>
                )}/>
            </div>
            <Button type="submit" disabled={isLoading || isFetching} className="w-full md:w-auto">
              {(isLoading || isFetching) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Simpan Perubahan
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
