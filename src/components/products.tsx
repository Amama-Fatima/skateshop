"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type { Product, PRODUCT_CATEGORY } from "@prisma/client"
import { useQuery } from "@tanstack/react-query"
import type { ColumnDef, PaginationState } from "@tanstack/react-table"
import { Table } from "~/components/table"
import { buttonVariants } from "~/components/ui/button"
import { formatEnum, formatPrice } from "~/lib/utils"
import dayjs from "dayjs"

interface ProductsProps {
  storeId: string
}

export function Products({ storeId }: ProductsProps) {
  const router = useRouter()

  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const pagination = useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize]
  )

  const columns = useMemo<ColumnDef<Product, unknown>[]>(
    () => [
      { accessorKey: "name", header: "Name" },
      {
        accessorKey: "catergory",
        header: "Category",
        cell: ({ cell }) => formatEnum(cell.getValue() as PRODUCT_CATEGORY),
      },
      {
        accessorKey: "price",
        header: "Price",
        cell: ({ cell }) => formatPrice(cell.getValue() as number),
        enableColumnFilter: false,
      },
      {
        accessorKey: "quantity",
        header: "Quantity",
      },
      {
        accessorKey: "inventory",
        header: "Inventory",
      },
      {
        accessorKey: "rating",
        header: "Rating",
      },
      {
        accessorKey: "createdAt",
        header: "Created At",
        cell: ({ cell }) =>
          dayjs(cell.getValue() as Date).format("DD/MM/YYYY, hh:mm a"),
        enableColumnFilter: false,
      },
    ],
    []
  )

  const { data, isLoading, isError, isRefetching } = useQuery({
    queryKey: ["products", storeId, pagination],
    queryFn: async () => {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          storeId,
          page: pagination.pageIndex,
          perPage: pagination.pageSize,
        }),
      })

      const { products, count } = (await response.json()) as {
        products: Product[]
        count: number
      }
      return { products, count }
    },
    enabled: !!storeId,
    refetchOnWindowFocus: false,
  })

  return (
    <Table
      tableTitle={`Products (${data?.count ?? 0} entries)`}
      addNewButton={
        <Link
          href={`/account/stores/${storeId}/products/add`}
          className={buttonVariants({
            variant: "outline",
          })}
        >
          Add Product
        </Link>
      }
      columns={columns}
      data={data?.products ?? []}
      state={{
        pagination,
      }}
      setPagination={setPagination}
      itemsCount={data?.count ?? 0}
      isLoading={isLoading}
      isRefetching={isRefetching}
      isError={isError}
      manualPagination
      rowHoverEffect
      disableGlobalFilter={false}
      bodyRowProps={(row) => ({
        onClick: () => {
          const productId = row.original.id
          router.push(`/account/stores/${storeId}/products/${productId}`)
        },
      })}
    />
  )
}

export default Products
