import { type NextRequest } from "next/server"
import { PRODUCT_CATEGORY, type Product } from "@prisma/client"
import { prisma } from "~/lib/db"
import { filterProductSchema } from "~/lib/validations/product"
import { type GroupedProduct } from "~/types"
import { z } from "zod"

export async function POST(req: NextRequest) {
  try {
    const input = filterProductSchema.parse(req.body)

    const products = await prisma.product.findMany({
      where: {
        name: {
          contains: input.query,
          mode: "insensitive",
        },
      },
      select: {
        id: true,
        name: true,
        quantity: true,
        catergory: true,
      },
    })

    const groupedProducts = Object.values(PRODUCT_CATEGORY).map((category) => ({
      category,
      products: products.filter((product) => product.catergory === category),
    })) satisfies GroupedProduct<Pick<Product, "id" | "name">>[]

    return new Response(JSON.stringify(groupedProducts), { status: 200 })
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