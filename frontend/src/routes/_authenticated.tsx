import { createFileRoute, Outlet } from '@tanstack/react-router'
import { userQueryOptions } from '@/lib/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/_authenticated')({
  loader: async ({ context }) => {
    try {
      const queryClient = context.queryClient
      const data = await queryClient.fetchQuery(userQueryOptions)
      return data
    } catch (e) {
      console.error(e)
      return null
    }
  },
  component: Component,

})

function Component() {
  const data = Route.useLoaderData();
  if (!data) {
    return <NotLoggedIn />
  }
  return <Outlet />
}

function NotLoggedIn() {
  return <Card>
    <CardHeader>
      <CardTitle>Not Logged In</CardTitle>
      <CardDescription>Please login to access this page.</CardDescription>
    </CardHeader>
    <CardContent><a href='/api/login'><Button className='w-full'>Login Here</Button></a></CardContent>
  </Card>
}