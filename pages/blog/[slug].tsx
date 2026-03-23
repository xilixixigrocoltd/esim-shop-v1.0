import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import SEO from "@/components/ui/SEO";

interface BlogPost {
  slug: string;
  title: string;
  content: string;
  excerpt: string;
  coverImage: string;
  publishedAt: string;
  updatedAt: string;
  category: string;
  tags: string[];
  readTime: number;
  author: string;
}

export default function BlogPostPage() {
  const router = useRouter();
  const { slug } = router.query;
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      fetchPost();
    }
  }, [slug]);

  async function fetchPost() {
    try {
      const res = await fetch(`/api/blog/${slug}`);
      const data = await res.json();
      if (data.success) {
        setPost(data.post);
      } else {
        router.push("/blog");
      }
    } catch (error) {
      console.error("Failed to fetch post:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!post) {
    return null;
  }

  return (
    <>
      <SEO
        title={`${post.title} - SimRyoko`}
        description={post.excerpt}
        canonical={`/blog/${post.slug}`}
      />

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 返回按钮 */}
        <button
          onClick={() => router.back()}
          className="mb-6 text-gray-600 hover:text-gray-900 flex items-center gap-2"
        >
          ← 返回博客
        </button>

        {/* 文章头部 */}
        <header className="mb-8">
          {/* 分类标签 */}
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-orange-100 text-orange-800 text-sm font-medium rounded-full">
              {post.category}
            </span>
            <span className="text-sm text-gray-500">
              {post.readTime} 分钟阅读
            </span>
          </div>

          {/* 标题 */}
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {post.title}
          </h1>

          {/* 元信息 */}
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>作者：{post.author}</span>
            <span>•</span>
            <span>
              发布于：{new Date(post.publishedAt).toLocaleDateString("zh-CN")}
            </span>
            {post.updatedAt !== post.publishedAt && (
              <>
                <span>•</span>
                <span>
                  更新于：{new Date(post.updatedAt).toLocaleDateString("zh-CN")}
                </span>
              </>
            )}
          </div>
        </header>

        {/* 封面图 */}
        <div className="h-64 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg mb-8 flex items-center justify-center">
          <span className="text-white text-8xl">🌍</span>
        </div>

        {/* 标签 */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* 文章内容 */}
        <div className="prose prose-lg max-w-none">
          <div
            className="text-gray-800 leading-relaxed space-y-4"
            dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, "<br/>") }}
          />
        </div>

        {/* 分享按钮 */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">分享这篇文章</h3>
          <div className="flex gap-3">
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                alert("链接已复制！");
              }}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition"
            >
              🔗 复制链接
            </button>
            <button
              onClick={() => {
                window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(window.location.href)}`, "_blank");
              }}
              className="px-4 py-2 bg-blue-400 hover:bg-blue-500 text-white rounded-lg transition"
            >
              🐦 Twitter
            </button>
            <button
              onClick={() => {
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, "_blank");
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
            >
              📘 Facebook
            </button>
          </div>
        </div>

        {/* 相关文章（占位） */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">相关文章</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="text-center py-8 text-gray-500">
              相关文章即将上线
            </div>
          </div>
        </div>
      </article>
    </>
  );
}
