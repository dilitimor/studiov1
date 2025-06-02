
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, FileText, Users, Settings, Newspaper, HelpCircle, Dock, Image as ImageIconLucide } from "lucide-react"; // Added Newspaper, HelpCircle, Dock, ImageIconLucide
import Link from "next/link";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-primary tracking-tight">Admin Dashboard</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Resumes</CardTitle>
            <FileText className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month (dummy data)</p>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Registered Users</CardTitle>
            <Users className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">589</div>
            <p className="text-xs text-muted-foreground">+12 from last week (dummy data)</p>
          </CardContent>
        </Card>

         <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Site Activity</CardTitle>
            <BarChart className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">High</div>
            <p className="text-xs text-muted-foreground">Based on recent logins (dummy data)</p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Quick Links</CardTitle>
          <CardDescription>Manage various aspects of your application.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link href="/admin/logo" className="block p-4 bg-muted/50 hover:bg-muted rounded-lg transition-colors">
            <ImageIconLucide className="h-6 w-6 mb-2 text-primary" />
            <h3 className="font-semibold">Manage Logo</h3>
            <p className="text-xs text-muted-foreground">Update the site logo.</p>
          </Link>
          <Link href="/admin/content/tentang-kami" className="block p-4 bg-muted/50 hover:bg-muted rounded-lg transition-colors">
            <FileText className="h-6 w-6 mb-2 text-primary" />
            <h3 className="font-semibold">Edit Tentang Kami</h3>
            <p className="text-xs text-muted-foreground">Update the About Us page content.</p>
          </Link>
          <Link href="/admin/content/blog" className="block p-4 bg-muted/50 hover:bg-muted rounded-lg transition-colors">
             <Newspaper className="h-6 w-6 mb-2 text-primary" />
            <h3 className="font-semibold">Manage Blog</h3>
            <p className="text-xs text-muted-foreground">Create, edit, or delete blog posts.</p>
          </Link>
           <Link href="/admin/content/bantuan" className="block p-4 bg-muted/50 hover:bg-muted rounded-lg transition-colors">
             <HelpCircle className="h-6 w-6 mb-2 text-primary" />
            <h3 className="font-semibold">Edit Bantuan</h3>
            <p className="text-xs text-muted-foreground">Update the Help/FAQ page content.</p>
          </Link>
          <Link href="/admin/content/footer" className="block p-4 bg-muted/50 hover:bg-muted rounded-lg transition-colors">
             <Dock className="h-6 w-6 mb-2 text-primary" />
            <h3 className="font-semibold">Manage Footer</h3>
            <p className="text-xs text-muted-foreground">Update footer content.</p>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
