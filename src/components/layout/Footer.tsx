"use client";

// TODO: Make footer content dynamic from CMS
const footerTextFromCMS = `© ${new Date().getFullYear()} ResumeForge. All rights reserved.`;

export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
        {footerTextFromCMS}
      </div>
    </footer>
  );
}