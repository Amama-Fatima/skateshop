import type { Metadata } from "next"
import { notFound, redirect } from "next/navigation"

import { authOptions } from "~/lib/auth"
import { getCurrentUser } from "~/lib/session"
import { AddStoreForm } from "~/components/forms/add-store-form"
import { HeaderDescrip } from "~/components/header-descrip"
import { prisma } from "~/lib/db"

export const metadata: Metadata = {
  title: "Add Store",
  description: "Add a new store.",
}

export default async function AddStorePage() {
//   const user = await getCurrentUser()
    const user = await prisma.user.findUnique({
        where:{
            id: "1"
        }
    })

    if (!user) {
        redirect(authOptions.pages?.signIn || "/login")
    }

    return (
        <section className="container grid w-full items-center gap-6 pb-8 pt-6 md:py-10">
        <HeaderDescrip title="Add Store" description="Add a new store." />
        <AddStoreForm userId={user?.id} />
        </section>
    )
}