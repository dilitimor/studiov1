
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Loader2, ArrowLeft, Newspaper, ImageIcon } from "lucide-react";
import { BlogPostSchema, type BlogPostValues } from "@/lib/schema";
import { addBlogPost } from "@/services/firestoreService";
import { useRouter } from "next/navigation";
import Link from "next/link";
import NextImage from "next/image";

const defaultValues: Partial<BlogPostValues> = {
  title: "",
  slug: "",
  content: "",
  imageUrl: "",
  imageAlt: "",
  dataAiHint: "",
};

export default function NewBlogPostPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);

  const form = useForm<BlogPostValues>({
    resolver: zodResolver(BlogPostSchema),
    defaultValues,
    mode: "onChange",
  });

  const onSubmit = async (values: BlogPostValues) => {
    setIsLoading(true);
    try {
      await addBlogPost(values);
      toast({ title: "Sukses", description: "Postingan blog baru berhasil ditambahkan." });
      router.push("/admin/content/blog");
    } catch (error) {
      toast({ title: "Error", description: "Gagal menambahkan postingan blog.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="shadow-xl">
      <CardHeader>
        <div className="flex items-center justify-between">
            <CardTitle className="text-2xl flex items-center">
              <Newspaper className="mr-2 h-6 w-6 text-primary" /> Tambah Postingan Blog Baru
            </CardTitle>
            <Button variant="outline" size="sm" asChild>
                <Link href="/admin/content/blog">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke Daftar Blog
                </Link>
            </Button>
        </div>
        <CardDescription>Isi formulir di bawah untuk membuat postingan blog baru.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField control={form.control} name="title" render={({ field }) => (
              <FormItem>
                <FormLabel>Judul Postingan</FormLabel>
                <FormControl><Input placeholder="Judul yang menarik..." {...field} /></FormControl><FormMessage />
              </FormItem>
            )}/>
            <FormField control={form.control} name="slug" render={({ field }) => (
              <FormItem>
                <FormLabel>Slug (URL-friendly)</FormLabel>
                <FormControl><Input placeholder="contoh-judul-postingan" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}/>
            <FormField control={form.control} name="content" render={({ field }) => (
              <FormItem>
                <FormLabel>Isi Konten (HTML atau Markdown)</FormLabel>
                <FormControl><Textarea placeholder="Tulis konten blog Anda di sini..." {...field} rows={15} className="min-h-[300px]" /></FormControl>
                <FormMessage />
              </FormItem>
            )}/>
            
            {currentImageUrl && (
              <div className="mb-4 p-2 border rounded-md bg-muted flex flex-col items-center">
                <FormLabel className="mb-1 self-start text-sm">Pratinjau Gambar Saat Ini:</FormLabel>
                <NextImage src={currentImageUrl} alt="Current Blog Post Image" width={300} height={150} className="object-contain rounded-md" data-ai-hint={form.getValues("dataAiHint") || "placeholder"}/>
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
            <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Simpan Postingan
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
