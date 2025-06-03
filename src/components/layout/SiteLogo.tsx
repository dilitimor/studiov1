
"use client";

import Link from 'next/link';
import { FileTextIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getLogo } from '@/services/firestoreService';
import type { LogoValues } from '@/lib/schema';
import NextImage from 'next/image'; // Using NextImage for optimized image handling

const siteName = "CVBeres.id";

export default function SiteLogo() {
  const [logoDataUri, setLogoDataUri] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchSiteLogo() {
      setIsLoading(true);
      try {
        const logoData = await getLogo();
        if (logoData && logoData.dataUri) {
          setLogoDataUri(logoData.dataUri);
        } else {
          setLogoDataUri(null); 
        }
      } catch (error) {
        console.error("Failed to fetch site logo:", error);
        setLogoDataUri(null); 
      } finally {
        setIsLoading(false);
      }
    }
    fetchSiteLogo();
  }, []);


  return (
    <Link href="/" className="flex items-center space-x-2 text-2xl font-bold text-primary h-8"> {/* Set height for consistency */}
      {isLoading ? (
        <>
          <FileTextIcon className="h-8 w-8" />
          <span>{siteName}</span>
        </>
      ) : logoDataUri ? (
        // Using NextImage for potential optimization, though src is a data URI.
        // For data URIs, standard <img> might be simpler and just as effective.
        // Reverting to <img> for simplicity with data URIs if NextImage causes issues or isn't ideal.
        <img src={logoDataUri} alt={siteName} className="h-full w-auto object-contain" data-ai-hint="company logo"/>
      ) : (
        <>
          <FileTextIcon className="h-8 w-8" />
          <span>{siteName}</span>
        </>
      )}
    </Link>
  );
}
