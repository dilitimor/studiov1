
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
import { Loader2, ArrowLeft, Sparkles } from "lucide-react";
import { AiResumeTemplateSchema, type AiResumeTemplateValues } from "@/lib/schema";
import { addAiResumeTemplate } from "@/services/firestoreService";
import { useRouter } from "next/navigation";
import Link from "next/link";

const defaultValues: Partial<AiResumeTemplateValues> = {
  name: "",
  description: "",
  content: "",
};

export default function NewAiTemplatePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<AiResumeTemplateValues>({
    resolver: zodResolver(AiResumeTemplateSchema),
    defaultValues,
    mode: "onChange",
  });

  const onSubmit = async (values: AiResumeTemplateValues) => {
    setIsLoading(true);
    try {
      await addAiResumeTemplate(values);
      toast({ title: "Sukses", description: "Template AI baru berhasil ditambahkan." });
      router.push("/admin/ai-templates");
    } catch (error) {
      toast({ title: "Error", description: "Gagal menambahkan template AI.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="shadow-xl">
      <CardHeader>
        <div className="flex items-center justify-between">
            <CardTitle className="text-2xl flex items-center">
              <Sparkles className="mr-2 h-6 w-6 text-primary" /> Tambah Template AI Baru
            </CardTitle>
            <Button variant="outline" size="sm" asChild>
                <Link href="/admin/ai-templates">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke Daftar Template
                </Link>
            </Button>
        </div>
        <CardDescription>Isi formulir di bawah untuk membuat template AI baru.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem>
                <FormLabel>Nama Template</FormLabel>
                <FormControl><Input placeholder="Contoh: Template Kronologis Modern" {...field} /></FormControl><FormMessage />
              </FormItem>
            )}/>
            <FormField control={form.control} name="description" render={({ field }) => (
              <FormItem>
                <FormLabel>Deskripsi Singkat</FormLabel>
                <FormControl><Textarea placeholder="Deskripsikan template ini dan kegunaannya..." {...field} rows={3} /></FormControl>
                <FormMessage />
              </FormItem>
            )}/>
            <FormField control={form.control} name="content" render={({ field }) => (
              <FormItem>
                <FormLabel>Konten Template / Referensi</FormLabel>
                <FormControl><Textarea placeholder="Isi konten template, contoh teks, atau URL referensi..." {...field} rows={10} className="min-h-[200px]" /></FormControl>
                <FormMessage />
              </FormItem>
            )}/>
            
            <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Simpan Template
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
