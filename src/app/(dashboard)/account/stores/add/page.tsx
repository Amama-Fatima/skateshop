import type { Metadata } from "next"
import { notFound, redirect } from "next/navigation"
import { AddStoreForm } from "~/components/forms/add-store-form"
import { HeaderDescrip } from "~/components/header-descrip"
import { authOptions } from "~/lib/auth"
import { prisma } from "~/lib/db"
import { getCurrentUser } from "~/lib/session"

export const metadata: Metadata = {
  title: "Add Store",
  description: "Add a new store.",
}

export default async function AddStorePage() {
  //   const user = await getCurrentUser()
  const user = await prisma.user.findUnique({
    where: {
      id: "1",
    },
  })

  if (!user) {
    redirect(authOptions.pages?.signIn || "/api/auth/signin")
  }

  return (
    <section className="container grid w-full items-center gap-14 pb-8 pt-6 md:py-10">
      <HeaderDescrip title="Add Store" description="Add a new store." />
      <AddStoreForm userId={user?.id} />
    </section>
  )
}
