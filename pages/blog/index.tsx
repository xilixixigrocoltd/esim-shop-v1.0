import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import SEO from "@/components/ui/SEO";

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string;
  publishedAt: string;
  category: string;
  readTime: number;
}

interface BlogProps {
  posts?: BlogPost[];
}

export default function BlogPage({ posts }: BlogProps) {
  const router = useRouter();
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(!posts);
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    if (!posts) {
      fetchPosts();
    } else {
      setBlogPosts(posts);
    }
  }, [posts]);

  async function fetchPosts() {
    try {
      const res = await fetch("/api/blog");
      const data = await res.json();
      if (data.success) {
        setBlogPosts(data.posts);
      }
    } catch (error) {
      console.error("Failed to fetch blog posts:", error);
    } finally {
      setLoading(false);
    }
  }

  const categories = ["all", ...Array.from(new Set(blogPosts.map(p => p.category)))];
  
  const filteredPosts = selectedCategory === "all" 
    ? blogPosts 
    : blogPosts.filter(p => p.category === selectedCategory);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title="博客 - SimRyoko"
        description="eSIM 使用教程、旅行攻略、产品评测"
        canonical="/blog"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 页面标题 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">SimRyoko 博客</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            eSIM 使用教程、旅行攻略、产品评测，帮助您更好地使用全球 eSIM 服务
          </p>
        </div>

        {/* 分类筛选 */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                selectedCategory === category
                  ? "bg-orange-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {category === "all" ? "全部" : category}
            </button>
          ))}
        </div>

        {/* 文章列表 */}
        {filteredPosts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📝</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              暂无文章
            </h3>
            <p className="text-gray-600">
              我们正在努力创作内容，敬请期待！
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <article
                key={post.slug}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition cursor-pointer"
                onClick={() => router.push(`/blog/${post.slug}`)}
              >
                {/* 封面图 */}
                <div className="h-48 bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                  <span className="text-white text-6xl">🌍</span>
                </div>

                {/* 内容 */}
                <div className="p-6">
                  {/* 分类标签 */}
                  <span className="inline-block px-3 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded-full mb-3">
                    {post.category}
                  </span>

                  {/* 标题 */}
                  <h2 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                    {post.title}
                  </h2>

                  {/* 摘要 */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>

                  {/* 元信息 */}
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>
                      {new Date(post.publishedAt).toLocaleDateString("zh-CN")}
                    </span>
                    <span>{post.readTime} 分钟阅读</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
