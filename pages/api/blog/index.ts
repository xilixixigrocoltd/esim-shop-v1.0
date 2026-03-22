import { NextApiRequest, NextApiResponse } from "next";
import { blogPosts } from "@/lib/blog-posts";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const { category, tag, page = "1", limit = "10" } = req.query;
    
    let filteredPosts = blogPosts;

    // 按分类筛选
    if (category) {
      filteredPosts = filteredPosts.filter(p => p.category === category);
    }

    // 按标签筛选
    if (tag) {
      filteredPosts = filteredPosts.filter(p => p.tags.includes(tag as string));
    }

    // 分页
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;
    const paginatedPosts = filteredPosts.slice(startIndex, endIndex);

    return res.status(200).json({
      success: true,
      posts: paginatedPosts,
      total: filteredPosts.length,
      page: pageNum,
      totalPages: Math.ceil(filteredPosts.length / limitNum)
    });
  }

  return res.status(405).json({ success: false, error: "Method not allowed" });
}
