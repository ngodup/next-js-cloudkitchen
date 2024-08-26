// import NextAuth from "next-auth";
// import GoogleProvider from "next-auth/providers/google";
// import CredentialsProvider from "next-auth/providers/credentials";
// import dbConnect from "./dbConnect";
// import bcrypt from "bcryptjs";
// import UserModel from "@/model/User";
// import { signInSchema } from "@/schemas/signInSchema";

// export default NextAuth({
//   providers: [
//     GoogleProvider({
//       clientId: process.env.AUTH_GOOGLE_ID as string,
//       clientSecret: process.env.AUTH_GOOGLE_SECRET as string,
//     }),
//     CredentialsProvider({
//       name: "Credentials",
//       credentials: {
//         email: { label: "Email", type: "email", placeholder: "email" },
//         password: {
//           label: "Password",
//           type: "password",
//           placeholder: "Password",
//         },
//       },
//       async authorize(credentials) {
//         await dbConnect(); // Ensure MongoDB connection

//         const parsedCredentials = signInSchema.safeParse(credentials);

//         if (!parsedCredentials.success) {
//           throw new Error("Invalid credentials");
//         }

//         const { email, password } = parsedCredentials.data;

//         try {
//           const user = await UserModel.findOne({ email });
//           console.log("Fetched user:", user); // Add this line

//           if (!user) {
//             throw new Error("No user found with this email");
//           }

//           if (!user.isVerified) {
//             throw new Error("Please verify your account before logging in");
//           }

//           const isPasswordCorrect = await bcrypt.compare(
//             password,
//             user.password
//           );

//           if (isPasswordCorrect) {
//             return user;
//           } else {
//             throw new Error("Incorrect password");
//           }
//         } catch (error) {
//           throw new Error("Login credential error");
//         }
//       },
//     }),
//   ],
//   callbacks: {
//     async jwt({ token, user }) {
//       if (user) {
//         token.id = user.id;
//         token.role = user.role;
//       }
//       return token;
//     },
//     async session({ session, token }) {
//       session.user.id = token.id;
//       session.user.role = token.role;
//       return session;
//     },
//   },
//   pages: {
//     signIn: "/auth/sign-in",
//   },
// });
