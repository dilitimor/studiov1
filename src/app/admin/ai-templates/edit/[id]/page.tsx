
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
import { Loader2, ArrowLeft, Sparkles } from "lucide-react";
import { AiResumeTemplateSchema, type AiResumeTemplateValues } from "@/lib/schema";
import { getAiResumeTemplate, updateAiResumeTemplate, type AiResumeTemplateDocument } from "@/services/firestoreService";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

export default function EditAiTemplatePage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  
  const templateId = typeof params.id === 'string' ? params.id : null;

  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  const form = useForm<AiResumeTemplateValues>({
    resolver: zodResolver(AiResumeTemplateSchema),
    defaultValues: {
      name: "",
      description: "",
      content: "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (!templateId) {
      toast({ title: "Error", description: "ID Template tidak valid.", variant: "destructive" });
      router.push("/admin/ai-templates");
      return;
    }

    async function fetchTemplate() {
      setIsFetching(true);
      try {
        const templateData = await getAiResumeTemplate(templateId as string);
        if (templateData) {
          form.reset(templateData as AiResumeTemplateValues);
        } else {
          toast({ title: "Error", description: "Template AI tidak ditemukan.", variant: "destructive" });
          router.push("/admin/ai-templates");
        }
      } catch (error) {
        toast({ title: "Error", description: "Gagal memuat template AI.", variant: "destructive" });
      } finally {
        setIsFetching(false);
      }
    }
    fetchTemplate();
  }, [templateId, form, toast, router]);

  const onSubmit = async (values: AiResumeTemplateValues) => {
    if (!templateId) return;
    setIsLoading(true);
    try {
      await updateAiResumeTemplate(templateId, values);
      toast({ title: "Sukses", description: "Template AI berhasil diperbarui." });
      router.push("/admin/ai-templates");
    } catch (error) {
      toast({ title: "Error", description: "Gagal memperbarui template AI.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex items-center justify-center h-60">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2">Memuat data template...</p>
      </div>
    );
  }

  return (
    <Card className="shadow-xl">
      <CardHeader>
         <div className="flex items-center justify-between">
            <CardTitle className="text-2xl flex items-center">
              <Sparkles className="mr-2 h-6 w-6 text-primary" /> Edit Template AI
            </CardTitle>
            <Button variant="outline" size="sm" asChild>
                <Link href="/admin/ai-templates">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke Daftar Template
                </Link>
            </Button>
        </div>
        <CardDescription>Perbarui detail template AI di bawah ini.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem>
                <FormLabel>Nama Template</FormLabel>
                <FormControl><Input {...field} /></FormControl><FormMessage />
              </FormItem>
            )}/>
            <FormField control={form.control} name="description" render={({ field }) => (
              <FormItem>
                <FormLabel>Deskripsi Singkat</FormLabel>
                <FormControl><Textarea {...field} rows={3} /></FormControl><FormMessage />
              </FormItem>
            )}/>
            <FormField control={form.control} name="content" render={({ field }) => (
              <FormItem>
                <FormLabel>Konten Template / Referensi</FormLabel>
                <FormControl><Textarea {...field} rows={10} className="min-h-[200px]" /></FormControl><FormMessage />
              </FormItem>
            )}/>
            
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
