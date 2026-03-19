import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // 仅允许 GET 请求
  if (req.method !== "GET") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  try {
    // 获取当前用户会话
    const session = await getServerSession(req, res, authOptions);
    
    if (!session || !(session as any).user) {
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }

    const userId = (session as any).user.id as string;

    // 查询用户订单（按创建时间倒序）
    const orders = await prisma.order.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 50, // 最多返回 50 个订单
    });

    return res.status(200).json({
      success: true,
      orders: orders.map((order) => ({
        id: order.id,
        orderId: order.orderId,
        status: order.status,
        totalAmount: order.totalAmount,
        currency: order.currency,
        customerEmail: order.customerEmail,
        iccids: order.iccids,
        createdAt: order.createdAt.toISOString(),
        paidAt: order.paidAt?.toISOString() || null,
      })),
    });
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to fetch orders",
    });
  }
}
