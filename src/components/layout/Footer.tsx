"use client";

import { useState, useEffect } from 'react';

// TODO: Make footer content dynamic from CMS

export default function Footer() {
  const [currentYear, setCurrentYear] = useState<number | null>(null);

  useEffect(() => {
    // This effect runs only on the client, after the component has mounted
    setCurrentYear(new Date().getFullYear());
  }, []); // Empty dependency array ensures this runs once on mount

  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
        {/* 
          On the server, currentYear is null, so the fallback is rendered.
          On the client, currentYear is initially null, so the fallback is rendered (matching the server).
          After mount, useEffect updates currentYear, and the client re-renders with the dynamic year.
        */}
        {currentYear !== null
          ? `© ${currentYear} ResumeForge. All rights reserved.`
          : `© ResumeForge. All rights reserved.`}
      </div>
    </footer>
  );
}
