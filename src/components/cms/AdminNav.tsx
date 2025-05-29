"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ADMIN_NAV_LINKS } from "@/lib/constants";
import SiteLogo from "@/components/layout/SiteLogo";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LayoutDashboard, Image as ImageIcon, FileText, Newspaper, HelpCircle, Dock } from "lucide-react"; // Using 'Dock' for Footer as an example

const iconMap: { [key: string]: React.ElementType } = {
  '/admin/dashboard': LayoutDashboard,
  '/admin/logo': ImageIcon,
  '/admin/content/tentang-kami': FileText,
  '/admin/content/blog': Newspaper,
  '/admin/content/bantuan': HelpCircle,
  '/admin/content/footer': Dock,
};


export default function AdminNav() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex md:flex-col md:w-64 border-r bg-background">
      <div className="p-4 border-b">
        <SiteLogo />
      </div>
      <ScrollArea className="flex-1">
        <nav className="p-4 space-y-2">
          {ADMIN_NAV_LINKS.map((link) => {
            const IconComponent = iconMap[link.href] || FileText;
            return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
                pathname === link.href || (pathname.startsWith(link.href) && link.href !== '/admin/dashboard')
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <IconComponent className="mr-3 h-5 w-5" />
              {link.label}
            </Link>
          )})}
        </nav>
      </ScrollArea>
    </