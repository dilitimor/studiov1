
"use client";

import { useState, useEffect } from 'react';
import { getFooterContent } from '@/services/firestoreService';
import type { FooterContentValues } from '@/lib/schema';

export default function Footer() {
  const [footerText, setFooterText] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchFooter() {
      try {
        const data = await getFooterContent();
        if (data && data.text) {
          setFooterText(data.text);
        } else {
          // Fallback if no data is found or text is empty
          setFooterText(`© ${new Date().getFullYear()} ResumeForge. All rights reserved.`);
        }
      } catch (error) {
        console.error("Failed to fetch footer content:", error);
        // Fallback on error
        setFooterText(`© ${new Date().getFullYear()} ResumeForge. All rights reserved.`);
      } finally {
        setIsLoading(false);
      }
    }
    fetchFooter();
  }, []);

  // To avoid hydration mismatch, render a placeholder or nothing until client-side fetch completes
  if (isLoading) {
    // You can return a minimal placeholder or null
    // Returning null might cause layout shifts, a simple placeholder is often better
    return (
      <footer className="border-t bg-background">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          &nbsp; {/* Non-breaking space or a simple loading indicator */}
        </div>
      </footer>
    );
  }

  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
        {footerText}
      </div>
    </footer>
  );
}
