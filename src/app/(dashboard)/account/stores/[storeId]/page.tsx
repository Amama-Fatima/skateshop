import type { Metadata } from "next"
import { revalidatePath, revalidateTag } from "next/cache"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"
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

    const storeWithSameName = await prisma.store.findFirst({
      where: {
        name,
        id: {
          not: storeId,
        },
      },
    })

    if (storeWithSameName) {
      throw new Error("A store with the same name already exists.")
    }

    await prisma.store.update({
      where: {
        id: storeId,
      },
      data: {
        name,
        description,
      },
    })

    revalidateTag(storeId)
  }

  async function deleteStore() {
    "use server"

    await prisma.store.delete({
      where: {
        id: storeId,
      },
    })

    const path = "/account/stores"
    revalidatePath(path)
    redirect(path)
  }

  if (!store) {
    return notFound()
  }

  return (
    <section className="container grid w-full items-center gap-10 pb-10 pt-6 md:py-10">
      <HeaderDescrip
        title={store.name}
        description={store.description ?? "Manage your store"}
      />
      <div className="flex flex-col items-center justify-center gap-2.5 sm:flex-row">
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
          <Label htmlFor="update-store-name">Name</Label>
          <Input
            id="update-store-name"
            type="text"
            name="name"
            placeholder="Type store name here..."
            required
            minLength={30}
            maxLength={50}
            defaultValue={store.name}
          />
        </fieldset>
        <fieldset className="grid gap-2.5">
          <Label htmlFor="update-store-description">Description</Label>
          <Textarea
            id="update-store-description"
            name="description"
            minLength={3}
            maxLength={255}
            placeholder="Type store description here."
            defaultValue={store.description ?? ""}
          />
        </fieldset>
        {/* <LoadingButton type="submit">Update Store</LoadingButton> */}
        {/* <LoadingButton variant="destructive" formAction={deleteStore}>
          Update Store
        </LoadingButton> */}
        <Button type="submit">
          Update Store
          <span className="sr-only">Update Store</span>
        </Button>
        <Button variant={"destructive"} onClick={deleteStore}>
          Delete Store <span className="sr-only">Delete Store</span>
        </Button>
      </form>
    </section>
  )
}

//this method of getting query params works in server side rendering
// for cliemt side, you can use useSearchParams() hook
