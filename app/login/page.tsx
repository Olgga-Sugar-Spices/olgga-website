"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"login" | "signup" | "forgot">("login");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;

        setMessage(
          "Signup successful! Please check your email to verify your account."
        );
      }

      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;

        router.push("/");
        router.refresh();
      }

      if (mode === "forgot") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;

        setMessage("Password reset link sent to your email.");
      }
    } catch (err: any) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#000000] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl shadow-xl p-8">

        <h1 className="text-3xl font-bold text-center text-white">
          {mode === "signup"
            ? "Create an Account"
            : mode === "forgot"
            ? "Reset Password"
            : "Welcome Back"}
        </h1>

        <p className="text-center text-gray-400 mt-2">
          {mode === "signup"
            ? "Sign up using your email"
            : mode === "forgot"
            ? "Enter your email to reset password"
            : "Login to continue shopping"}
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">

          <input
            type="email"
            required
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-12 bg-[#222222] border border-[#333333] text-white rounded-lg px-4 outline-none focus:ring-2 focus:ring-yellow-500"
          />

          {mode !== "forgot" && (
            <input
              type="password"
              required
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-12 bg-[#222222] border border-[#333333] text-white rounded-lg px-4 outline-none focus:ring-2 focus:ring-yellow-500"
            />
          )}

          {message && (
            <p className="text-sm text-center text-red-500">
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-yellow-500 text-white rounded-lg font-semibold hover:bg-yellow-300 transition disabled:opacity-50"
          >
            {loading
              ? "Please wait..."
              : mode === "signup"
              ? "Sign Up"
              : mode === "forgot"
              ? "Send Reset Link"
              : "Login"}
          </button>
        </form>

        {/* TOGGLES */}
        <div className="mt-6 text-center text-sm space-y-2">
          {mode === "login" && (
            <>
              <button
                onClick={() => setMode("forgot")}
                className="text-yellow-500 font-semibold"
              >
                Forgot password?
              </button>
              <p className="text-white">
                Don’t have an account?{" "}
                <button
                  onClick={() => setMode("signup")}
                  className="text-yellow-500 font-semibold"
                >
                  Sign Up
                </button>
              </p>
            </>
          )}

          {mode !== "login" && (
            <button
              onClick={() => setMode("login")}
              className="text-yellow-500 font-semibold"
            >
              Back to Login
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
