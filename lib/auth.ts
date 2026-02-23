import { supabase } from "@/lib/supabase";

export async function signUpWithEmail(email: string) {
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback`,
    },
  });

  if (error) throw error;
}

export async function verifyOtp(
  email: string,
  token: string,
  password: string
) {
  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: "email",
  });

  if (error) throw error;

  await supabase.auth.updateUser({ password });
  return data;
}

export async function login(email: string, password: string) {
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
}

export async function logout() {
  await supabase.auth.signOut();
}
