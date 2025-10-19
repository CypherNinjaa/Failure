import { ModernHeader } from "@/components/ui/modern-header";
import { ModernFooter } from "@/components/ui/modern-footer";
import { BlogPostContent } from "@/components/ui/blog-post-content";
import { BlogComments } from "@/components/ui/blog-comments";
import { RelatedArticles } from "@/components/ui/related-articles";

interface BlogPostPageProps {
	params: Promise<{
		id: string;
	}>;
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
	const { id } = await params;

	return (
		<main className="min-h-screen bg-background">
			<ModernHeader />
			<div className="container mx-auto px-4 py-8">
				<BlogPostContent postId={id} />
			</div>
			<div className="border-t">
				<BlogComments postId={id} />
			</div>
			<div className="border-t bg-muted/50">
				<RelatedArticles postId={id} />
			</div>
			<ModernFooter />
		</main>
	);
}
