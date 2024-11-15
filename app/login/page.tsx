"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {useRouter} from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const handleLogin = () => {
    router.push("/fundraiser");
  }

  return (
    <div className="flex justify-center mt-64 mx-auto w-3/4 max-w-2xl flex-col gap-5">
      <h2>Login Page</h2>
      <Input type="text" placeholder="Username" />
      <Button className="w-20 self-center" onClick={handleLogin}>Login</Button>
    </div>
  );
}
