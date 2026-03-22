import { useEffect } from "react";
import { useRouter } from "next/router";
import SEO from "@/components/ui/SEO";

export default function SignInPage() {
  const router = useRouter();
  useEffect(() => { router.replace('/'); }, [router]);
  return <SEO title="登录 - SimRyoko" description="" canonical="/auth/signin" noIndex />;
}
