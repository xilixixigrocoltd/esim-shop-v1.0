import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

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

    // 查询订单详情
    const order = await prisma.order.findFirst({
      where: {
        id: id as string,
        userId, // 确保只能查看自己的订单
      },
    });

    if (!order) {
      return res.status(404).json({ success: false, error: "Order not found" });
    }

    return res.status(200).json({
      success: true,
      order: {
        id: order.id,
        orderId: order.orderId,
        status: order.status,
        totalAmount: order.totalAmount,
        currency: order.currency,
        customerEmail: order.customerEmail,
        customerName: order.customerName,
        iccids: order.iccids,
        items: order.items,
        createdAt: order.createdAt.toISOString(),
        paidAt: order.paidAt?.toISOString() || null,
        completedAt: order.completedAt?.toISOString() || null,
      },
    });
  } catch (error) {
    console.error("Failed to fetch order:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to fetch order",
    });
  }
}
