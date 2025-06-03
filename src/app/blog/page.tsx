
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Loader2 } from "lucide-react";
import { getBlogPosts, type BlogPostDocument } from "@/services/firestoreService";

async function fetchBlogPosts(): Promise<BlogPostDocument[]> {
  try {
    const posts = await getBlogPosts();
    return posts;
  } catch (error) {
    console.error("Failed to fetch blog posts:", error);
    return []; // Return empty array on error
  }
}

export default async function BlogPage() {
  const blogPosts = await fetchBlogPosts();

  if (!blogPosts) { // Should not happen if fetchBlogPosts returns [] on error
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-20rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg text-muted-foreground">Memuat daftar blog...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold text-primary">Blog CVBeres.id</h1>
      <p className="text-lg text-muted-foreground">
        Temukan tips, trik, dan wawasan terbaru seputar penulisan resume dan pengembangan karir.
      </p>
      {blogPosts.length === 0 ? (
        <p className="text-muted-foreground text-center py-10 text-lg">
          Belum ada postingan blog. Silakan cek kembali nanti!
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <Card key={post.id} className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="p-0">
                <Image 
                  src={post.imageUrl || "https://placehold.co/400x250.png"} 
                  alt={post.imageAlt || post.title} 
                  width={400} 
                  height={250} 
                  className="object-cover w-full h-48"
                  data-ai-hint={post.dataAiHint || "blog article"}
                />
              </CardHeader>
              <CardContent className="p-6 flex-grow">
                <CardTitle className="text-xl mb-2 hover:text-primary transition-colors">
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </CardTitle>
                <CardDescription className="text-sm text-muted-foreground mb-3 line-clamp-3">
                  {/* For description, we might need a summary field or generate from content */}
                  {post.content.substring(0, 150).replace(/<[^>]+>/g, '')}... 
                </CardDescription>
                <p className="text-xs text-muted-foreground">Published on {new Date(post.date || post.createdAt || Date.now()).toLocaleDateString()}</p>
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
      )}
    </div>
  );
}
