"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const handleLogin = () => {
    if (!username) return;
    localStorage.setItem("username", username);
    router.push("/fundraiser");
  };

  return (
    <div className="flex justify-center mt-32 mx-auto w-3/4 max-w-2xl flex-col gap-5 background">
      <h2 className="self-center mb-4">Fundraisers Login Portal</h2>
      <Input
        type="text"
        placeholder="Username"
        onChange={(e) => setUsername(e.target.value)}
      />
      <Button className="w-20 self-center" onClick={handleLogin}>
        Login
      </Button>
    </div>
  );
}