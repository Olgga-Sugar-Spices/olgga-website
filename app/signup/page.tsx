"use client";

import { useState } from "react";
import { signUpWithEmail, verifyOtp } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [step, setStep] = useState<"email" | "otp">("email");

  async function sendOtp() {
    await signUpWithEmail(email);
    setStep("otp");
  }

  async function completeSignup() {
    await verifyOtp(email, otp, password);
    router.push("/");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFFDF6]">
      <div className="bg-white p-8 rounded-xl w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6">Sign Up</h1>

        {step === "email" && (
          <>
            <input
              className="w-full mb-4 p-3 border rounded"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
            />
            <button onClick={sendOtp} className="w-full bg-orange-500 text-white py-3 rounded">
              Send OTP
            </button>
          </>
        )}

        {step === "otp" && (
          <>
            <input
              className="w-full mb-4 p-3 border rounded"
              placeholder="OTP"
              onChange={(e) => setOtp(e.target.value)}
            />
            <input
              className="w-full mb-6 p-3 border rounded"
              type="password"
              placeholder="Set Password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={completeSignup} className="w-full bg-orange-500 text-white py-3 rounded">
              Create Account
            </button>
          </>
        )}
      </div>
    </div>
  );
}
