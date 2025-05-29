import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

// TODO: Fetch blog posts from CMS
const blogPostsFromCMS = [
  { id: "1", slug: "tips-menulis-resume-ats-friendly", title: "5 Tips Menulis Resume ATS-Friendly", description: "Pelajari cara membuat resume Anda lolos sistem ATS dan menarik perhatian perekrut.", date: "2024-07-28", imageUrl: "https://placehold.co/400x250.png", imageAlt: "Resume ATS", dataAiHint: "resume computer" },
  { id: "2", slug: "kesalahan-umum-dalam-resume", title: "Hindari Kesalahan Umum Ini Dalam Resume Anda", description: "Kesalahan kecil bisa berakibat fatal. Ketahui apa saja yang harus dihindari saat menulis resume.", date: "2024-07-25", imageUrl: "https://placehold.co/400x250.png", imageAlt: "Resume mistakes", dataAiHint: "document error"  },
  { id: "3", slug: "maksimalkan-pengalaman-magang", title: "Cara Memaksimalkan Pengalaman Magang di Resume", description: "Pengalaman magang sangat berharga. Tunjukkan kontribusi Anda secara efektif dalam resume.", date: "2024-07-22", imageUrl: "https://placehold.co/400x250.png", imageAlt: "Internship experience", dataAiHint: "office intern" },
];

export default function BlogPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold text-primary">Blog ResumeForge</h1>
      <p className="text-lg text-muted-foreground">
        Temukan tips, trik, dan wawasan terbaru seputar penulisan resume dan pengembangan karir.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogPostsFromCMS.map((post) => (
          <Card key={post.id} className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="p-0">
              <Image 
                src={post.imageUrl} 
                alt={post.imageAlt} 
                width={400} 
                height={250} 
                className="object-cover w-full h-48"
                data-ai-hint={post.dataAiHint}
              />
            </CardHeader>
            <CardContent className="p-6 flex-grow">
              <CardTitle className="text-xl mb-2 hover:text-primary transition-colors">
                <Link href={`/blog/${post.slug}`}>{post.title}</Link>
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground mb-3">{post.description}</CardDescription>
              <p className="text-xs text-muted-foreground">Published on {new Date(post.date).toLocaleDateString()}</p>
            </CardContent>
            <CardFooter className="p-6 pt-0">
              <Button variant="outline" asChild className="group w-full">
                <Link href={`/blog/${post.slug}`}>
                  Read More <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}