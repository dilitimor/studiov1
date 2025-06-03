
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { Loader2, Image as ImageIcon } from "lucide-react";
import { LogoSchema, type LogoValues } from "@/lib/schema";
import { getLogo, updateLogo } from "@/services/firestoreService";
import NextImage from "next/image"; // Renamed to avoid conflict
import { Label } from "@/components/ui/label"; // Added import for base Label

export default function ManageLogoPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [currentLogoUrl, setCurrentLogoUrl] = useState<string | null>(null);

  const form = useForm<LogoValues>({
    resolver: zodResolver(LogoSchema),
    defaultValues: { url: "" },
  });

  useEffect(() => {
    async function fetchLogo() {
      setIsFetching(true);
      try {
        const logoData = await getLogo();
        if (logoData && logoData.url) {
          form.reset({ url: logoData.url });
          setCurrentLogoUrl(logoData.url);
        } else {
          // If no logo data, ensure form is reset to default empty string
          // and currentLogoUrl is null to hide preview
          form.reset({ url: "" });
          setCurrentLogoUrl(null);
        }
      } catch (error) {
        toast({ title: "Error", description: "Failed to fetch logo.", variant: "destructive" });
      } finally {
        setIsFetching(false);
      }
    }
    fetchLogo();
  }, [form, toast]);

  const onSubmit = async (values: LogoValues) => {
    setIsLoading(true);
    try {
      await updateLogo(values);
      setCurrentLogoUrl(values.url || null); // Update preview, set to null if URL is empty
      toast({ title: "Success", description: "Logo updated successfully." });
    } catch (error) {
      toast({ title: "Error", description: "Failed to update logo.", variant: "destructive" });
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
    <Card className="max-w-2xl mx-auto shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center">
          <ImageIcon className="mr-2 h-6 w-6 text-primary" /> Manage Site Logo
        </CardTitle>
        <CardDescription>Update the logo that appears in the site header.</CardDescription>
      </CardHeader>
      <CardContent>
        {currentLogoUrl && (
          <div className="mb-6 p-4 border rounded-md bg-muted flex flex-col items-center">
            <Label className="mb-2 self-start font-medium">Current Logo:</Label>
            <NextImage src={currentLogoUrl} alt="Current Site Logo" width={200} height={60} className="object-contain rounded-md" data-ai-hint="company logo" />
          </div>
        )}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Logo Image URL</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="https://example.com/logo.png" 
                      {...field} 
                      value={field.value === null ? '' : field.value || ''} // Ensure value is not null
                      onChange={(e) => {
                        field.onChange(e);
                        // Optionally update preview as user types, or rely on onSubmit
                        // setCurrentLogoUrl(e.target.value || null); 
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading || isFetching} className="w-full">
              {(isLoading || isFetching) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Logo URL
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
