import type { Metadata } from "next"
import { revalidateTag } from "next/cache"
import Link from "next/link"
import { notFound } from "next/navigation"
import { HeaderDescrip } from "~/components/header-descrip"
import { Icons } from "~/components/icons"
import { Button, buttonVariants } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { LoadingButton } from "~/components/ui/loading-button"
import { Textarea } from "~/components/ui/textarea"
import { prisma } from "~/lib/db"
import { cn } from "~/lib/utils"

export const metadata: Metadata = {
  title: "Manage Store",
  description: "Manage your store",
}

interface EditStorePageProps {
  params: {
    storeId: string
  }
}
export default async function EditStorePage({ params }: EditStorePageProps) {
  const storeId = params.storeId

  const store = await prisma.store.findUnique({
    where: {
      id: storeId,
    },
    select: {
      id: true,
      name: true,
      description: true,
    },
  })

  async function updateStore(fd: FormData) {
    "use server"

    const name = fd.get("name") as string
    const description = fd.get("description") as string

    await prisma.store.update({
      where: {
        id: storeId,
      },
      data: {
        name,
        description,
      },
    })

    const tag = `store:${storeId}`
    revalidateTag(tag)
  }

  if (!store) {
    return notFound()
  }

  return (
    <section className="container grid w-full items-center space-y-10 pb-8 pt-6 md:py-10">
      <HeaderDescrip
        title={store.name}
        description={store.description ?? "Manage your store"}
      />
      <div className="flex items-center gap-2.5">
        <Link href={`/account/stores/${storeId}`}>
          <div
            className={cn(
              buttonVariants({
                size: "sm",
                variant: "secondary",
              })
            )}
          >
            <Icons.store className="mr-2 size-4" />
            Manage Store
            <span className="sr-only">Manage Store</span>
          </div>
        </Link>
        <Link href={`/account/stores/${storeId}/products`}>
          <div
            className={cn(
              buttonVariants({
                size: "sm",
                variant: "outline",
              })
            )}
          >
            <Icons.product className="mr-2 size-4" />
            Manage Products
            <span className="sr-only">Manage Products</span>
          </div>
        </Link>
      </div>
      {/* updateStore has error. need to solve this */}
      <form action={updateStore} className="mx-auto grid w-full max-w-xl gap-5">
        <fieldset className="grid gap-2.5">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            type="text"
            name="name"
            placeholder="Name"
            defaultValue={store.name}
          />
        </fieldset>
        <fieldset className="grid gap-2.5">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            placeholder="Description"
            defaultValue={store.description ?? ""}
          />
        </fieldset>
        {/* <LoadingButton>Update Store</LoadingButton> */}
        <Button type="submit">Update Store</Button>
      </form>
    </section>
  )
}

//this method of getting query params works in server side rendering
// for cliemt side, you can use useSearchParams() hook
