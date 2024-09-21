import { createFileRoute } from '@tanstack/react-router'
import { getCurrentUser } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'
import { Avatar, AvatarFallback,} from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/_authenticated/profile')({
  component: Profile,
})

function Profile() {
  const { isPending, error, data } = useQuery({
    queryKey: ['get-current-user'],
    queryFn: getCurrentUser,
  })
  if (isPending) {
    return 'loading...'
  }
  if (error) {
    return <p>Error: {error.message}</p>
  }
  const { user } = data
  return (
    <div className="p-2">
      <h3>Hello {user.given_name}</h3>
      <Avatar>
        {/* <AvatarImage src={user.picture!} /> */}
        <AvatarFallback>{user.given_name[0]}</AvatarFallback>
      </Avatar>
      <a href="/api/logout"><Button>Logout</Button></a>
    </div>
  )
}
