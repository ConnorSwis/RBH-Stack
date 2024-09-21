import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { getAllExpenses } from '@/lib/api'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'

export const Route = createFileRoute('/_authenticated/expenses')({
  component: Expenses,
})

function Expenses() {
  const { isPending, error, data } = useQuery({
    queryKey: ['get-all-expenses'],
    queryFn: getAllExpenses,
  })

  if (error) {
    return <p>Error: {error.message}</p>
  }
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Id</TableHead>
          <TableHead>Title</TableHead>
          <TableHead>Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isPending
          ? Array(3)
              .fill(0)
              .map((_, i) => (
                <TableRow key={i}>
                  <TableCell className="w-[100px] animate-pulse">
                    <Skeleton className="h-4" />
                  </TableCell>
                  <TableCell className="animate-pulse">
                    <Skeleton className="h-4" />
                  </TableCell>
                  <TableCell className="animate-pulse">
                    <Skeleton className="h-4" />
                  </TableCell>
                </TableRow>
              ))
          : data.expenses.map((e) => (
              <TableRow key={e.id}>
                <TableCell className="font-medium">{e.id}</TableCell>
                <TableCell>{e.title}</TableCell>
                <TableCell>{e.amount}</TableCell>
              </TableRow>
            ))}
      </TableBody>
    </Table>
  )
}
