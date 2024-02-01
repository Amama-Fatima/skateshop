import {
  useEffect,
  useMemo,
  useState,
  type Dispatch,
  type HTMLAttributes,
  type ReactNode,
  type SetStateAction,
} from "react"
import { rankItem } from "@tanstack/match-sorter-utils"
import {
  flexRender,
  getCoreRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type Column,
  type ColumnDef,
  type FilterFn,
  type PaginationState,
  type Row,
  type SortingState,
  type Table,
} from "@tanstack/react-table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"
import { cn } from "~/lib/utils"

import { Icons } from "./icons"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"

interface Props<TData, TValue = unknown> {
  tableTitle?: ReactNode
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  isLoading?: boolean
  isRefetching?: boolean
  isError?: boolean
  state?: {
    pagination?: PaginationState
    globalFilter?: string
  }
  setPagination?: Dispatch<SetStateAction<PaginationState>>
  manualPagination?: boolean
  setGlobalFilter?: Dispatch<SetStateAction<string>>
  disableGlobalFilter?: boolean
  disableColumnVisibility?: boolean
  itemsPerPageOptions?: number[]
  itemsCount?: number
  headerRowProps?: HTMLAttributes<HTMLTableRowElement>
  headerCellProps?: HTMLAttributes<HTMLTableCellElement>
  bodyRowProps?:
    | ((row: Row<TData>) => HTMLAttributes<HTMLTableRowElement>)
    | HTMLAttributes<HTMLTableRowElement>
  bodyCellProps?: HTMLAttributes<HTMLTableCellElement>
  footerRowProps?: HTMLAttributes<HTMLTableRowElement>
  footerCellProps?: HTMLAttributes<HTMLTableCellElement>
  ascendingSortIndecator?: ReactNode
  descendingSortIndecator?: ReactNode
  rowHoverEffect?: boolean
}

const fuzzyFilter: FilterFn<unknown> = (
  row,
  columnId,
  value: string,
  addMeta
) => {
  // Rank the item

  const itemRank = rankItem(row.getValue(columnId), value)

  // Store the itemRank info
  addMeta({
    itemRank,
  })

  // Return if the item should be filtered in/out
  return itemRank.passed
}

export function ReactTable<TData, TValue = unknown>(
  props: Props<TData, TValue>
) {
  const { manualPagination, state } = props

  const [sorting, setSorting] = useState<SortingState>([
    {
      id: "createdAt",
      desc: true,
    },
  ])

  const [globalFilter, setGlobalFilter] = useState<string>(
    state?.globalFilter ?? ""
  )

  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: state?.pagination?.pageIndex ?? 0,
    pageSize: state?.pagination?.pageSize ?? 10,
  })
  const pagination = useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize]
  )
  const table = useReactTable<TData>({
    columns: props.columns,
    data: props.data,
    state: {
      sorting,
      pagination,
      globalFilter,
    },
    filterFns: { fuzzy: fuzzyFilter },
    pageCount:
      manualPagination && props.itemsCount
        ? Math.ceil(
            props.itemsCount /
              (props.state?.pagination?.pageSize ?? pagination.pageSize)
          )
        : undefined,
    manualPagination,
    onSortingChange: setSorting ?? setSorting,
    onPaginationChange: props.setPagination ?? setPagination,
    onGlobalFilterChange: props.setGlobalFilter ?? setGlobalFilter,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getCoreRowModel: getCoreRowModel(),
    globalFilterFn: fuzzyFilter as FilterFn<TData> | undefined,
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
  })

  return (
    <>
      <div className="flex py-4">
        <h2 className="text-2xl">{props.tableTitle}</h2>
        <div className="ml-auto mr-0 flex gap-4">
          {props.disableGlobalFilter ? null : (
            <div>
              <Label htmlFor="globalFilterInput">Search any field</Label>
              <Input
                id="globalFilterInput"
                placeholder="Search..."
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="w-40 border border-muted"
              />
            </div>
          )}
          {props.disableColumnVisibility ? null : (
            <Popover>
              <PopoverTrigger>
                <Button variant="outline">
                  Show Columns
                  <Icons.chevronDown
                    className="-mr-1 ml-2 size-5"
                    aria-hidden="true"
                  />
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-40">
                <div className="grid gap-4">
                  <div className="flex items-center space-x-2">
                    <input
                      id="toggleAllColumns"
                      type="checkbox"
                      {...{
                        checked: table.getIsAllColumnsVisible(),
                        onChange: table.getToggleAllColumnsVisibilityHandler(),
                      }}
                    />
                    <Label>Toggle All</Label>
                  </div>
                  {table.getAllLeafColumns().map((column) => (
                    <div key={column.id}>
                      <input
                        type="checkbox"
                        id={column.id}
                        {...{
                          checked: column.getIsVisible(),
                          onChange: column.getToggleVisibilityHandler(),
                        }}
                      />
                      <Label
                        htmlFor={column.id}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {column.id}
                      </Label>
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>
      <div className="overflow-x-auto overflow-y-hidden pb-1">
        <table className="w-full border-collapse border">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr {...(props.headerRowProps ?? {})} key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    className="border-collapse border px-4 pb-3.5 pt-2 text-left text-xs font-bold tracking-wide text-muted-foreground md:text-sm"
                    {...(props.headerCellProps ?? {})}
                    key={header.id}
                    colSpan={header.colSpan}
                  >
                    {header.isPlaceholder ? null : (
                      <>
                        <div
                          {...{
                            className: header.column.getCanSort()
                              ? "flex flex-wrap gap-1 cursor-pointer select-none"
                              : "",
                            onClick: header.column.getToggleSortingHandler(),
                          }}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {{
                            asc: props.ascendingSortIndecator ?? " 🔼",
                            desc: props.descendingSortIndecator ?? " 🔽",
                          }[header.column.getIsSorted() as string] ?? null}
                        </div>
                        {header.column.getCanFilter() ? (
                          <div>
                            <Filter column={header.column} table={table} />
                          </div>
                        ) : null}
                      </>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {props.isLoading || props.isRefetching ? (
              <tr>
                <td
                  className="border-collapse border px-4"
                  colSpan={table.getVisibleLeafColumns().length}
                >
                  <div className="py-6 text-center text-lg">{"Loading..."}</div>
                </td>
              </tr>
            ) : null}
            {!(props.isLoading && props.isRefetching) && props.isError ? (
              <tr>
                <td
                  className="border-collapse border px-4"
                  colSpan={table.getVisibleLeafColumns().length}
                >
                  <div className="py-6 text-center text-lg">
                    An error occured!
                  </div>
                </td>
              </tr>
            ) : null}
            {!(props.isLoading || props.isRefetching || props.isError)
              ? table.getRowModel().rows.map((row) => {
                  return (
                    <tr
                      className={cn(
                        props.rowHoverEffect &&
                          "cursor-pointer transition-colors hover:bg-muted/25"
                      )}
                      {...(typeof props.bodyRowProps === "function"
                        ? props.bodyRowProps(row)
                        : props.bodyRowProps ?? {})}
                      key={row.id}
                    >
                      {row.getVisibleCells().map((cell) => {
                        return (
                          <td
                            className="border-collapse border p-2"
                            {...(props.bodyCellProps ?? {})}
                            key={cell.id}
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </td>
                        )
                      })}
                    </tr>
                  )
                })
              : null}
            {!(props.isLoading || props.isRefetching || props.isError) &&
            props.data.length === 0 ? (
              <tr>
                <td
                  className="border-collapse border px-4"
                  colSpan={table.getVisibleLeafColumns().length}
                >
                  <div className="py-6 text-center text-lg">
                    No data available.
                  </div>
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
      <div className="mt-5 flex w-full flex-wrap items-center gap-2 text-sm md:text-base">
        <Button
          aria-label="paginate back by 1 page"
          size="sm"
          variant="outline"
          className="size-9 p-0"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage}
        >
          <Icons.chevronLeft className="size-5" aria-hidden="true" />
        </Button>
        <Button
          aria-label="paginate forward by 1 page"
          size="sm"
          variant="outline"
          className="size-9 p-0"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage}
        >
          <Icons.chevronRight className="size-5" aria-hidden="true" />
        </Button>
        <span className="flex items-center gap-1">
          <div>Page</div>
          <strong>
            {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </strong>
        </span>
        <span className="hidden items-center gap-1 md:flex">
          | Go to page:
          <Input
            type="number"
            defaultValue={table.getState().pagination.pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0
              table.setPageIndex(page)
            }}
            className="h-9 w-16"
          />
        </span>
        <Select
          value={table.getState().pagination.pageSize.toString()}
          onValueChange={(value) => {
            table.setPageSize(Number(value))
            setPagination({
              ...table.getState().pagination,
              pageSize: Number(value),
            })
          }}
        >
          <SelectTrigger className="h-9 w-28">
            <SelectValue
              placeholder={`Show ${table.getState().pagination.pageSize}`}
            />
          </SelectTrigger>
          <SelectContent>
            {(props.itemsPerPageOptions ?? [10, 20, 30, 40]).map((pageSize) => (
              <SelectItem key={pageSize} value={pageSize.toString()}>
                Show {pageSize}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </>
  )
}

function Filter<TData, TValue = unknown>({
  column,
  table,
}: {
  column: Column<TData, TValue>
  table: Table<TData>
}) {
  const firstValue = table
    .getPreFilteredRowModel()
    .flatRows[0]?.getValue(column.id)

  const columnFilterValue = column.getFilterValue()

  const sortedUniqueValues = useMemo(
    () =>
      typeof firstValue === "number"
        ? []
        : (Array.from(
            column.getFacetedUniqueValues().keys()
          ).sort() as string[]),
    [column, firstValue]
  )

  return typeof firstValue === "number" ? (
    <DebouncedInput
      type="number"
      min={Number(column.getFacetedMinMaxValues()?.[0] ?? "")}
      max={Number(column.getFacetedMinMaxValues()?.[1] ?? "")}
      value={(columnFilterValue as [number, number])?.[0] ?? ""}
      onChange={(value) =>
        column.setFilterValue((old: [number, number]) => [value, old?.[1]])
      }
      placeholder={`Range (${column.getFacetedMinMaxValues()?.[0] ?? ""} - ${
        column.getFacetedUniqueValues().size
      })`}
      className="mt-2.5 w-36 rounded-none text-sm shadow"
    />
  ) : (
    <>
      <datalist id={column.id + "list"}>
        {sortedUniqueValues.slice(0, 5000).map((value: string) => (
          <option value={value} key={value} />
        ))}
      </datalist>
      <DebouncedInput
        type="text"
        value={(columnFilterValue ?? "") as string}
        onChange={(value) => column.setFilterValue(value)}
        placeholder={`Search... (${column.getFacetedUniqueValues().size})`}
        className="mt-2 w-36 rounded-none text-sm shadow"
        list={column.id + "list"}
      />
    </>
  )
}

interface DebouncedInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  value: string | number
  onChange: (value: string | number) => void
  debounce?: number
}

// A debounced input react component
const DebouncedInput = ({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: DebouncedInputProps) => {
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)

    return () => clearTimeout(timeout)
  }, [value, debounce, onChange])

  return (
    <Input
      {...props}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  )
}
