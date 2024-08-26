"use server";

import { signIn, signOut } from "next-auth/react";
import { redirect } from "next/navigation";

export async function handleCredentialSignin({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  try {
    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      const errorMessage =
        result.error === "CredentialsSignin"
          ? "Invalid credentials"
          : `Error: ${result.error}`;
      return { message: errorMessage };
    }

    if (result?.url) {
      redirect("/");
    }
  } catch (error) {
    return { message: "Something went wrong" };
  }
}

export async function handleSignOut() {
  await signOut({ redirect: false });
}

// export async function handleGoogleSignin() {
//   if (typeof window !== "undefined") {
//     await signIn("google", { redirect: false });
//   }
// }
