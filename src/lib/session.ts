import { authOptions } from "./auth";
import { getServerSession } from "next-auth/next";
import type { SessionUser } from "~/types";

export async function getCurrentUser(): Promise<SessionUser | undefined>{
const session = await getServerSession(authOptions);
    return session?.user
}