"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type { Product } from "@prisma/client"
import type {
  ColumnDef,
  ColumnFiltersState,
  PaginationState,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table"
import { Table } from "~/components/table"
import { Button } from "~/components/ui/button"
import { formatPrice } from "~/lib/utils"
import dayjs from "dayjs"

interface ProductsProps {
  storeId: string
}

type fieldValue = string | undefined

export function Products({ storeId }: ProductsProps) {
  const router = useRouter()

  const [data, setData] = useState<{
    products: Product[] | null
    count: number
  }>({
    products: null,
    count: 0,
  })

  const [sorting, setSorting] = useState<SortingState>([
    { id: "createdAt", desc: true },
  ])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    id: false,
    createdBy: false,
    updatedBy: false,
    updatedAt: false,
  })
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
      { accessorKey: "id", enableColumnFilter: false, enableSorting: false },
      { accessorKey: "name", header: "Name" },
      {
        accessorKey: "price",
        header: "Price",
        cell: ({ cell }) =>
          cell.getValue() ? formatPrice(Number(cell.getValue())) : "-",
        enableColumnFilter: false,
      },
      {
        accessorKey: "createdAt",
        header: "Created At",
        cell: ({ cell }) =>
          dayjs(cell.getValue() as Date).format("DD/MM/YYYY, hh:mm a"),
        enableColumnFilter: false,
      },
      {
        accessorKey: "createdBy",
        header: "Created By",
        enableSorting: false,
        enableColumnFilter: false,
      },
      {
        accessorKey: "updatedAt",
        header: "Updated At",
        cell: ({ cell, row }) =>
          row.getValue("updatedBy")
            ? dayjs(cell.getValue() as Date).format("DD/MM/YYYY, hh:mm a")
            : "-",
        enableSorting: false,
        enableColumnFilter: false,
      },
      {
        accessorKey: "updatedBy",
        header: "Updated By",
        enableSorting: false,
        enableColumnFilter: false,
      },
    ],
    []
  )

  //get paginated products from prisma
  useEffect(() => {
    async function getProducts() {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          storeId,
          page: pagination.pageIndex,
          perPage: pagination.pageSize,
          name: columnFilters.find((filter) => filter.id === "name")
            ?.value as fieldValue,
          sortBy: sorting[0]?.id as
            | "name"
            | "price"
            | "createdAt"
            | "published",
          sortDesc: sorting[0]?.desc,
        }),
      })

      const { products, count } = (await response.json()) as {
        products: Product[]
        count: number
      }

      setData({ products, count })
    }
    void getProducts()
  }, [pagination, columnFilters, sorting, storeId])

  return (
    <Table
      tableTitle={
        <>
          {`Products (${data?.count ?? 0} entries)`}
          <Link
            href={`/account/stores/${storeId}/products/add`}
            className="ml-4"
          >
            <Button>Add product</Button>
          </Link>
        </>
      }
      columns={columns}
      data={data?.products ?? []}
      state={{
        sorting,
        columnFilters,
        columnVisibility,
        pagination,
      }}
      setSorting={setSorting}
      setColumnFilters={setColumnFilters}
      setColumnVisibility={setColumnVisibility}
      setPagination={setPagination}
      itemsCount={data?.count}
      isLoading={false}
      isRefetching={false}
      isError={false}
      manualFiltering
      manualPagination
      manualSorting
      rowHoverEffect
      disableGlobalFilter
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
