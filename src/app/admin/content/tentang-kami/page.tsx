"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { Loader2, FileText } from "lucide-react";
import { TextContentSchema, type TextContentValues } from "@/lib/schema";
import { getTentangKami, updateTentangKami } from "@/services/firestoreService";

export default function ManageTentangKamiPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  const form = useForm<TextContentValues>({
    resolver: zodResolver(TextContentSchema),
    defaultValues: { content: "" },
  });

  useEffect(() => {
    async function fetchData() {
      setIsFetching(true);
      try {
        const data = await getTentangKami();
        if (data) {
          form.reset({ content: data.content });
        }
      } catch (error) {
        toast({ title: "Error", description: "Gagal memuat konten Tentang Kami.", variant: "destructive" });
      } finally {
        setIsFetching(false);
      }
    }
    fetchData();
  }, [form, toast]);

  const onSubmit = async (values: TextContentValues) => {
    setIsLoading(true);
    try {
      await updateTentangKami(values);
      toast({ title: "Sukses", description: "Konten Tentang Kami berhasil diperbarui." });
    } catch (error) {
      toast({ title: "Error", description: "Gagal memperbarui konten.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex items-center justify-center h-40">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Card className="shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center">
          <FileText className="mr-2 h-6 w-6 text-primary" /> Kelola Konten Tentang Kami
        </CardTitle>
        <CardDescription>Perbarui teks yang ditampilkan di halaman Tentang Kami. Anda bisa menggunakan Markdown.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Isi Konten</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Masukkan konten halaman Tentang Kami di sini..."
                      {...field}
                      rows={15}
                      className="min-h-[300px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Simpan Perubahan
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}