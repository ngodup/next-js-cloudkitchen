// import "next-auth";
import "next-auth/jwt";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    role: string;
    isVerified: boolean;
  }

  interface Session {
    user: User;
    role: string;
    // user: {
    //   _id: string;
    //   isVerified: boolean;
    // } & DefaultSession["user"];
  }
}
//Want to modify next-auth/jwt interface and Extend the built-in types for `JWT`
declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    // isVerified: boolean;
  }
}
