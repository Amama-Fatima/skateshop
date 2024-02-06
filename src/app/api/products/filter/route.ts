import { type NextRequest } from "next/server"
import { PRODUCT_CATEGORY } from "@prisma/client"
import { prisma } from "~/lib/db"
import { filterProductSchema } from "~/lib/validations/product"
import { z } from "zod"

export async function POST(req: NextRequest) {
  try {
    const input = filterProductSchema.parse(await req.json())
    console.log("Your input", input)
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

    console.log("Your products", products)

    const productsByCategory = Object.values(PRODUCT_CATEGORY).map(
      (category) => ({
        category,
        products: products.filter((product) => product.catergory === category),
      })
    )

    console.log("Your grouped products", productsByCategory)

    return new Response(JSON.stringify(productsByCategory), { status: 200 })
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      console.log("Your error", error)
      return new Response(JSON.stringify(error.issues), { status: 422 })
    } else if (error instanceof Error) {
      return new Response(error.message, { status: 500 })
    } else {
      return new Response(null, { status: 500 })
    }
  }
}
