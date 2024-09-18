import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import UserModel from "@/model/User";
import UserProfileModel from "@/model/UserProfile";
import { signInSchema } from "@/schemas/signInSchema";
import dbConnect from "@/lib/dbConnect";

// interface AuthCredentials {
//   email: string;
//   password: string;
// }

// interface AuthResponse {
//   success: boolean;
//   message: string;
//   user?: any; // You can replace 'any' with a more specific type if needed
// }
async function authorize(credentials: any): Promise<any> {
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
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any): Promise<any> {
        return authorize(credentials);
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        await dbConnect();
        let existingUser = await UserModel.findOne({ email: user.email });

        if (!existingUser) {
          // Create new user
          existingUser = new UserModel({
            email: user.email,
            username: user.email?.split("@")[0] || `user_${Date.now()}`,
            isVerified: true,
            role: "user",
            // Set a random password for Google users
            password: await bcrypt.hash(
              Math.random().toString(36).slice(-8),
              10
            ),
            verifyCode: "GOOGLE_AUTH",
            verifyCodeExpiry: new Date(),
          });
          await existingUser.save();

          // Create corresponding user profile
          const newUserProfile = new UserProfileModel({
            userId: existingUser._id,
            firstName: user.name?.split(" ")[0] || "",
            lastName: user.name?.split(" ").slice(1).join(" ") || "",
            avatarUrl: user.image,
          });
          await newUserProfile.save();
        } else {
          // Update existing user
          existingUser.isVerified = true;
          await existingUser.save();

          // Update or create user profile
          await UserProfileModel.findOneAndUpdate(
            { userId: existingUser._id },
            {
              $set: {
                firstName: user.name?.split(" ")[0] || "",
                lastName: user.name?.split(" ").slice(1).join(" ") || "",
                avatarUrl: user.image,
                email: user.email, // Add this line
              },
            },
            { upsert: true, new: true }
          );
        }
        // Add these lines to update the user object with _id, role, and username
        user._id = existingUser._id;
        user.role = existingUser.role;
        user.username = existingUser.username;
        console.log("Google user in sign-in callback:", user);
      }
      return true;
    },
    async redirect({ url, baseUrl }) {
      // Always redirect to the home page after sign-in
      return baseUrl;
    },
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
        session.user.role = token.role as string;
        session.user.username = token.username as string;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60, // 1 hour
  },
  jwt: {
    maxAge: 60 * 60, // 1 hour
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/auth/sign-in",
    error: "/auth/error", // Add this line
  },
};
