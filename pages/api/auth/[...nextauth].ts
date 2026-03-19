import NextAuth, { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import EmailProvider from "next-auth/providers/email";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  
  providers: [
    // 邮箱登录（无密码，魔法链接）- 使用 Resend
    EmailProvider({
      server: {
        host: "smtp.resend.com",
        port: 465,
        auth: {
          user: "resend",
          pass: process.env.RESEND_API_KEY,
        },
      },
      from: "SimRyoko <noreply@simryoko.com>",
    }),
    // Google 登录暂不启用（待配置）
    // GoogleProvider({
    //   clientId: process.env.GOOGLE_CLIENT_ID || "",
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    // }),
  ],
  
  // 自定义 JWT（用于追踪推荐码等）
  callbacks: {
    async session({ session, user }: any) {
      if (session.user) {
        session.user.id = user.id;
        session.user.referralCode = user.referralCode;
      }
      return session;
    },
    
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id;
        token.referralCode = user.referralCode;
      }
      return token;
    },
  },
  
  // 页面配置
  pages: {
    signIn: "/auth/signin", // 登录页
    signOut: "/auth/signout", // 登出页
    error: "/auth/error", // 错误页
  },
  
  // 会话配置
  session: {
    strategy: "jwt", // 使用 JWT 而非数据库 session
    maxAge: 30 * 24 * 60 * 60, // 30 天
  },
  
  // 调试模式（开发环境开启）
  debug: process.env.NODE_ENV === "development",
};

export default NextAuth(authOptions);
