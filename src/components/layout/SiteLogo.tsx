"use client";

import Link from 'next/link';
import { FileTextIcon } from 'lucide-react'; // Or a custom logo component

// TODO: Replace with dynamic logo from CMS
const logoUrlFromCMS = null; 
const siteName = "ResumeForge";

export default function SiteLogo() {
  return (
    <Link href="/" className="flex items-center space-x-2 text-2xl font-bold text-primary">
      {logoUrlFromCMS ? (
        <img src={logoUrlFromCMS} alt={siteName} className="h-8 w-auto" />
      ) : (
        <>
          <FileTextIcon className="h-8 w-8" />
          <span>{siteName}</span>
        </>
      )}
    </Link>
  );
}
