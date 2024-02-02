import { type NextRequest } from "next/server"
import { authOptions } from "~/lib/auth"
import { prisma } from "~/lib/db"
import { editStoreSchema } from "~/lib/validations/store"
import { getServerSession } from "next-auth"
import { z } from "zod"

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return new Response("Unauthorized", { status: 401 })
    }

    const input = editStoreSchema.parse(await req.json())

    const store = await prisma.store.findUnique({
      where: { id: input.storeId },
      select: { user: { select: { id: true } } },
    })

    if (!store) {
      return new Response("Store not found", { status: 404 })
    }

    const updatedStore = await prisma.store.update({
      where: { id: input.storeId },
      data: {
        name: input.name,
        description: input.description,
      },
    })
    return new Response(JSON.stringify(updatedStore), { status: 200 })
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 })
    } else if (error instanceof Error) {
      return new Response(error.message, { status: 500 })
    } else {
      return new Response(null, { status: 500 })
    }
  }
}
