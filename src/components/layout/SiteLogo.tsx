
"use client";

import Link from 'next/link';
import { FileTextIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getLogo } from '@/services/firestoreService';
import type { LogoValues } from '@/lib/schema';

const siteName = "ResumeForge";

export default function SiteLogo() {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchSiteLogo() {
      setIsLoading(true);
      try {
        const logoData = await getLogo();
        if (logoData && logoData.url) {
          setLogoUrl(logoData.url);
        } else {
          setLogoUrl(null); 
        }
      } catch (error) {
        console.error("Failed to fetch site logo:", error);
        setLogoUrl(null); 
      } finally {
        setIsLoading(false);
      }
    }
    fetchSiteLogo();
  }, []);

  // Render a placeholder or default while loading to avoid flash of incorrect content
  // or to match server-rendered content initially if necessary.
  // For a logo, showing default then swapping is often acceptable.

  return (
    <Link href="/" className="flex items-center space-x-2 text-2xl font-bold text-primary">
      {/* Conditionally render based on loading state if you want to prevent flash of default logo */}
      {/* For simplicity, we'll show default if loading or no URL */}
      {logoUrl && !isLoading ? (
        <img src={logoUrl} alt={siteName} className="h-8 w-auto max-h-8" data-ai-hint="company logo"/>
      ) : (
        <>
          <FileTextIcon className="h-8 w-8" />
          <span>{siteName}</span>
        </>
      )}
    </Link>
  );
}
