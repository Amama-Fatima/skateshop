import type { SessionUser } from "~/types"
import { getServerSession } from "next-auth/next"

import { authOptions } from "./auth"

export async function getCurrentUser(): Promise<SessionUser | undefined> {
  const session = await getServerSession(authOptions)
  console.log("Session: ", session)
  console.log("Session user: ", session?.user)
  return session?.user
}
