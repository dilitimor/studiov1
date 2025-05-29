import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";

// TODO: Fetch blog post by slug from CMS
const fetchBlogPostBySlug = async (slug: string) => {
  // Simulate fetching data
  await new Promise(resolve => setTimeout(resolve, 100));
  const posts = [
    { slug: "tips-menulis-resume-ats-friendly", title: "5 Tips Menulis Resume ATS-Friendly", content: "<p>Ini adalah konten lengkap tentang tips menulis resume ATS-friendly...</p><p>Pastikan menggunakan kata kunci yang relevan...</p>", date: "2024-07-28", imageUrl: "https://placehold.co/800x400.png", imageAlt: "Resume ATS", dataAiHint: "resume computer" },
    { slug: "kesalahan-umum-dalam-resume", title: "Hindari Kesalahan Umum Ini Dalam Resume Anda", content: "<p>Konten tentang kesalahan umum dalam resume...</p>", date: "2024-07-25", imageUrl: "https://placehold.co/800x400.png", imageAlt: "Resume mistakes", dataAiHint: "document error" },
    { slug: "maksimalkan-pengalaman-magang", title: "Cara Memaksimalkan Pengalaman Magang di Resume", content: "<p>Konten tentang memaksimalkan pengalaman magang...</p>", date: "2024-07-22", imageUrl: "https://placehold.co/800x400.png", imageAlt: "Internship experience", dataAiHint: "office intern" },
  ];
  return posts.find(p => p.slug === slug) || null;
};

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await fetchBlogPostBySlug(params.slug);

  if (!post) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold">Post not found</h1>
        <Button asChild variant="link" className="mt-4">
          <Link href="/blog">Back to Blog</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <Button variant="outline" asChild className="mb-8 group">
        <Link href="/blog">
          <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Blog
        </Link>
      </Button>
      <Card className="shadow-lg overflow-hidden">
        <CardHeader className="p-0">
           <Image 
            src={post.imageUrl} 
            alt={post.imageAlt} 
            width={800} 
            height={400} 
            className="object-cover w-full h-64 md:h-96"
            data-ai-hint={post.dataAiHint}
          />
        </CardHeader>
        <CardContent className="p-6 md:p-8">
          <CardTitle className="text-3xl md:text-4xl font-bold mb-4 text-primary">{post.title}</CardTitle>
          <CardDescription className="text-sm text-muted-foreground mb-6">
            Published on {new Date(post.date).toLocaleDateString()}
          </CardDescription>
          <div 
            className="prose prose-lg max-w-none dark:prose-invert prose-headings:text-primary"
            dangerouslySetInnerHTML={{ __html: post.content }} 
          />
        </CardContent>
      </Card>
    </div>
  );
}

// Optional: Generate static paths if you have a known list of slugs
// export async function generateStaticParams() {
//   // TODO: Fetch all slugs from CMS
//   const slugs = ["tips-menulis-resume-ats-friendly", "kesalahan-umum-dalam-resume", "maksimalkan-pengalaman-magang"];
//   return slugs.map(slug => ({ slug