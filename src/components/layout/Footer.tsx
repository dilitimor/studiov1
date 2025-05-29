"use client";

import { useState, useEffect } from 'react';

// TODO: Make footer content dynamic from CMS

export default function Footer() {
  const [footerText, setFooterText] = useState<string>('');

  useEffect(() => {
    const year = new Date().getFullYear();
    setFooterText(`© ${year} ResumeForge. All rights reserved.`);
  }, []);

  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
        {footerText || `© ResumeForge. All rights reserved.`} {/* Fallback text while year is loading */}
      </div>
    </footer>
  );
}
