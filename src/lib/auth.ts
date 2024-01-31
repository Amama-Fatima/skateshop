import { type GetServerSidePropsContext } from "next"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { type USER_ROLE } from "@prisma/client"
import { env } from "~/env.mjs"
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth"
import GoogleProvider from "next-auth/providers/google"

import { prisma } from "./db"

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      // id: string
      role: USER_ROLE
      active: boolean
      seller: boolean
    } & DefaultSession["user"]
  }

  interface User {
    role: USER_ROLE
    active: boolean
    seller: boolean
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  secret: env.NEXTAUTH_SECRET,
  callbacks: {
    jwt: ({ token, user }) => ({
      ...token,
      role: user?.role,
      active: user?.active,
      seller: user?.seller,
    }),
    session: ({ session, user, token }) => ({
      ...session,
      user: {
        ...session.user,
        // id: user.id,
        role: token.role,
        active: token.active,
        seller: token.seller,
      },
    }),
    async signIn({ profile }) {
      if (!profile?.email) {
        throw new Error("No email found")
      }

      await prisma.user.upsert({
        where: {
          email: profile.email,
        },
        update: {},
        create: {
          name: profile.name,
          email: profile.email,
          image: profile.image,
          emailVerified: new Date(),
          password: "password",
          role: "USER",
          active: true,
          seller: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      })
      return true
    },
  },
  session: {
    strategy: "jwt",
  },
}

// GoogleProvider({
//     clientId: env.GOOGLE_CLIENT_ID,
//     clientSecret: env.GOOGLE_CLIENT_SECRET
// }),
//getServerAuthSession func is a wrapper around GetServerSidePropsContext
// export const getServerAuthSession = (ctx: {
//   req: GetServerSidePropsContext["req"]
//   res: GetServerSidePropsContext["res"]
// }) => {
//   return getServerSession(ctx.req, ctx.res, authOptions)
// }

// CredentialsProvider({
//   id: "credentials",
//   name: "credentials",
//   credentials: {
//     email: {
//       label: "Email",
//       type: "email",
//       placeholder: "abc@example.com",
//     },
//   },
//   async authorize(credentials: Record<"email", string> | undefined) {
//     console.log("Inside authorize function")
//     if (!credentials?.email) {
//       return null
//     }

//     const user = await prisma.user.findUnique({
//       where: { email: credentials.email },
//     })
//     console.log("User in database", user)

//     if (!user) {
//       console.log("No user found")
//       return null
//     }

//     return {
//       id: user.id,
//       name: user.name,
//       email: user.email,
//       role: user.role,
//       active: user.active,
//       seller: user.seller,
//     }
//   },
// }),
// ],
// secret: process.env.NEXTAUTH_SECRET,
// callbacks: {
// jwt: ({ token, user }) => {
//   console.log("Inside jwt callback")
//   console.log("User", user)

//   return {
//     ...token,
//     id: user?.id,
//     role: user?.role,
//     active: user?.active,
//     seller: user?.seller,
//   }
// },

// session: ({ session, user }) => {
//   console.log("Inside session callback")
//   console.log("User", user)
//   console.log("Session", session)

//   return {
//     ...session,
//     user: {
//       ...session.user,
//       id: user.id,
//       role: user.role,
//       active: user.active,
//       seller: user.seller,
//     },
//   }
// },
// },
