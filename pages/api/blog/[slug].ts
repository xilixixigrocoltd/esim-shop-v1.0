import { NextApiRequest, NextApiResponse } from "next";
import { blogPosts } from "@/lib/blog-posts";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { slug } = req.query;

  if (req.method === "GET") {
    const post = blogPosts.find(p => p.slug === slug);
    
    if (!post) {
      return res.status(404).json({ success: false, error: "Post not found" });
    }

    return res.status(200).json({ success: true, post });
  }

  return res.status(405).json({ success: false, error: "Method not allowed" });
}
