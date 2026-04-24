import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

/**
 * SSE Real-time Route for ArabGram
 * Using standard Server-Sent Events for instant updates
 */

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    return new Response('Unauthorized', { status: 401 })
  }

  const userId = session.user.id
  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    start(controller) {
      // Send initial heartbeat/keep-alive
      controller.enqueue(encoder.encode(': heartbeat\n\n'))

      // Simple mechanism to keep connection alive on Vercel (10s)
      const keepAliveInterval = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(': keep-alive\n\n'))
        } catch (e) {
          clearInterval(keepAliveInterval)
        }
      }, 10000)

      // In production on Vercel, this would listen to Redis/Pusher
      // For local dev, we'll send a connection established message
      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'connected', userId })}\n\n`))

      // Clean up when connection closes
      request.signal.addEventListener('abort', () => {
        clearInterval(keepAliveInterval)
        controller.close()
      })
    },
    cancel() {
      // Optional cleanup
    }
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no', // Disable buffering on Nginx/Proxy
    },
  })
}
