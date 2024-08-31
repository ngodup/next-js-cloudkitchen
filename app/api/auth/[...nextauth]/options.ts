import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import UserModel from "@/model/User";
import { signInSchema } from "@/schemas/signInSchema";
import dbConnect from "@/lib/dbConnect";

interface AuthCredentials {
  email: string;
  password: string;
}

interface AuthResponse {
  success: boolean;
  message: string;
  user?: any; // You can replace 'any' with a more specific type if needed
}

async function authorize(credentials: AuthCredentials): Promise<AuthResponse> {
  await dbConnect();

  const parsedCredentials = signInSchema.safeParse(credentials);

  if (!parsedCredentials.success) {
    throw new Error("Invalid credentials");
  }

  const { email, password } = parsedCredentials.data;

  try {
    const user = await UserModel.findOne({ email });

    if (!user) {
      throw new Error("No user found with this email");
    }

    // if (!user.isVerified) {
    //   throw new Error("Please verify your account before logging in");
    // }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (isPasswordCorrect) {
      return user;
    } else {
      throw new Error("Incorrect password");
    }
  } catch (error) {
    console.error("Login credential error:", error);
    throw new Error("Login credential error");
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID as string,
      clientSecret: process.env.AUTH_GOOGLE_SECRET as string,
    }),
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: {
          label: "Password",
          type: "password",
        },
      },
      async authorize(credentials: any): Promise<any> {
        return authorize(credentials);
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id?.toString();
        token.isVerified = user.isVerified;
        token.role = user.role;
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id as string;
        session.user.role = token.role;
        session.user.username = token.username as string;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Redirect to the home page after sign-in
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Redirect to the home page by default
      return baseUrl;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60, // Session duration in seconds (1 hour)
  },
  jwt: {
    maxAge: 60 * 60, // JWT token lifespan in seconds (1 hour)
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/auth/sign-in",
  },
};