"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Check local storage for persistent session
    const storedUser = localStorage.getItem("athix_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("athix_user", JSON.stringify(userData));
    if (userData.role === "admin") {
      router.push("/admin/dashboard");
    } else {
      router.push("/");
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("athix_user");
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
