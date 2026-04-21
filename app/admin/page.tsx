import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'

const prisma = new PrismaClient()

export default async function Admin() {
  const session = await getServerSession()
  if (!session || (session.user as any)?.role !== 'ADMIN') {
    redirect('/unauthorized')
  }

  const users = await prisma.user.findMany()
  const posts = await prisma.post.findMany({
    include: { user: true }
  })

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center space-x-4">
        <div className="instagram-gradient p-4 rounded-xl text-white text-2xl font-bold">
          Admin Panel
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-card p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold mb-6">Users ({users.length})</h2>
          <div className="space-y-3">
            {users.map((user) => (
              <div key={user.id} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                <div>
                  <p className="font-semibold">{user.username}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
                <div className="flex space-x-2">
                  <button className="text-destructive hover:bg-destructive/10 p-2 rounded">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold mb-6">Recent Posts ({posts.length})</h2>
          <div className="space-y-3">
            {posts.map((post) => (
              <div key={post.id} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                <div>
                  <p className="font-semibold">Post by {post.user.username}</p>
                  <p className="text-sm text-muted-foreground">{post.caption?.slice(0, 50)}...</p>
                </div>
                <button className="text-destructive hover:bg-destructive/10 p-2 rounded">Delete</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
