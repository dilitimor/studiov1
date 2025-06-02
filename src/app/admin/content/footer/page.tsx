
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input"; // Keep Input for consistency, though Textarea might be better for longer footer text
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { Loader2, Settings } from "lucide-react"; // Using Settings icon as an example for footer config
import { FooterContentSchema, type FooterContentValues } from "@/lib/schema";
import { getFooterContent, updateFooterContent } from "@/services/firestoreService";

const defaultFooterValues: FooterContentValues = {
  text: `© ${new Date().getFullYear()} ResumeForge. All rights reserved.`,
};

export default function ManageFooterPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  const form = useForm<FooterContentValues>({
    resolver: zodResolver(FooterContentSchema),
    defaultValues: defaultFooterValues,
  });

  useEffect(() => {
    async function fetchData() {
      setIsFetching(true);
      try {
        const data = await getFooterContent();
        if (data) {
          form.reset(data);
        } else {
          await updateFooterContent(defaultFooterValues);
          form.reset(defaultFooterValues);
        }
      } catch (error) {
        toast({ title: "Error", description: "Gagal memuat konten Footer.", variant: "destructive" });
      } finally {
        setIsFetching(false);
      }
    }
    fetchData();
  }, [form, toast]);

  const onSubmit = async (values: FooterContentValues) => {
    setIsLoading(true);
    try {
      await updateFooterContent(values);
      toast({ title: "Sukses", description: "Konten Footer berhasil diperbarui." });
    } catch (error) {
      toast({ title: "Error", description: "Gagal memperbarui konten Footer.", variant: "destructive" });
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
          <Settings className="mr-2 h-6 w-6 text-primary" /> Kelola Konten Footer
        </CardTitle>
        <CardDescription>Perbarui teks yang ditampilkan di bagian footer situs Anda.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="text"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Teks Footer</FormLabel>
                  <FormControl>
                    <Input placeholder="Contoh: © 2024 Nama Perusahaan Anda." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading || isFetching} className="w-full md:w-auto">
              {(isLoading || isFetching) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Simpan Perubahan Footer
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
