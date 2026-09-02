import { useState, useEffect, useMemo, useCallback } from "react";
import { AuthContext } from "./auth-context";
import { loginUser, registerUser, logoutUser } from "../api/authApi";


function decodeToken(token) {
  try {
    const payload = token.split(".")[1];
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(normalized));
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(() => localStorage.getItem("accessToken"));

  const user = useMemo(() => (accessToken ? decodeToken(accessToken) : null), [accessToken]);

  useEffect(() => {
    const handleStorage = () => {
      setAccessToken(localStorage.getItem("accessToken"));
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const login = useCallback(async (email, password) => {
    const { data } = await loginUser({ email, password });
    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);
    setAccessToken(data.accessToken);
    return data;
  }, []);

  const register = useCallback(async (name, email, password) => {
    const { data } = await registerUser({ name, email, password });
    return data;
  }, []);

  const logout = useCallback(async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    try {
      if (refreshToken) {
        await logoutUser(refreshToken);
      }
    } catch (err) {
      console.error(err);
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      setAccessToken(null);
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      accessToken,
      isAuthenticated: Boolean(accessToken),
      login,
      register,
      logout,
    }),
    [user, accessToken, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
