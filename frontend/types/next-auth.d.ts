import NextAuth, { DefaultSession, DefaultUser } from "next-auth"
import { DefaultJWT } from "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      activated?: boolean
    } & DefaultSession["user"]
  }

  interface User {
    id: string
    activated?: boolean
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    activated?: boolean
    deleted?: boolean
  }
}