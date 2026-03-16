"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function AdminIndex() {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (user?.role === "admin") {
      router.push("/admin/dashboard");
    } else {
      router.push("/login");
    }
  }, [user, router]);

  return (
    <div style={{ minHeight: "60vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <p>Redirecting to Admin Portal...</p>
    </div>
  );
}
