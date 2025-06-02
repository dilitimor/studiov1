
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Loader2 } from "lucide-react";
import { getBlogPostBySlug, getAllBlogSlugs, type BlogPostDocument } from "@/services/firestoreService";
import { notFound } from "next/navigation";

async function fetchBlogPost(slug: string): Promise<BlogPostDocument | null> {
  try {
    const post = await getBlogPostBySlug(slug);
    return post;
  } catch (error) {
    console.error(`Failed to fetch blog post with slug ${slug}:`, error);
    return null;
  }
}

export async function generateStaticParams() {
  try {
    const slugs = await getAllBlogSlugs();
    return slugs.map(item => ({ slug: item.slug }));
  } catch (error) {
    console.error("Failed to generate static params for blog posts:", error);
    return [];
  }
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await fetchBlogPost(params.slug);

  if (!post) {
    notFound(); // Triggers the not-found page
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
        {post.imageUrl && (
          <CardHeader className="p-0">
            <Image 
              src={post.imageUrl} 
              alt={post.imageAlt || post.title} 
              width={800} 
              height={400} 
              className="object-cover w-full h-64 md:h-96"
              data-ai-hint={post.dataAiHint || "blog image"}
            />
          </CardHeader>
        )}
        <CardContent className="p-6 md:p-8">
          <CardTitle className="text-3xl md:text-4xl font-bold mb-4 text-primary">{post.title}</CardTitle>
          <CardDescription className="text-sm text-muted-foreground mb-6">
            Published on {new Date(post.date || post.createdAt || Date.now()).toLocaleDateString()}
          </CardDescription>
          <div 
            className="prose prose-lg max-w-none dark:prose-invert prose-headings:text-primary"
            dangerouslySetInnerHTML={{ __html: post.content }} // Assuming content is HTML
          />
        </CardContent>
      </Card>
    </div>
  );
}
