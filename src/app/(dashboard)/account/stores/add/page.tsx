import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { AddStoreForm } from "~/components/forms/add-store-form"
import { HeaderDescrip } from "~/components/header-descrip"
import { authOptions } from "~/lib/auth"
import { getCurrentUser } from "~/lib/session"
import { type SessionUser } from "~/types"

export const metadata: Metadata = {
  title: "Add Store",
  description: "Add a new store.",
}

export default async function AddStorePage() {
  const user: SessionUser | undefined = await getCurrentUser()

  if (!user) {
    redirect(authOptions.pages?.signIn || "/api/auth/signin")
  }

  return (
    <section className="container grid w-full items-center space-y-10 pb-10 pt-6 md:py-10">
      <HeaderDescrip title="Add Store" description="Add a new store." />
      <AddStoreForm userId={user?.id} />
    </section>
  )
}
