import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

/**
 * WebRTC Signalling Route for ArabGram
 * Handles SDP and ICE candidate exchange between peers
 */

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// In-memory store for signaling (in production, use Redis or a proper message queue)
const signalingStore = new Map<string, any[]>()

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!(session?.user as any)?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { callId, signal, type } = await request.json()

  if (!callId || !signal) {
    return NextResponse.json({ error: 'Missing callId or signal' }, { status: 400 })
  }

  try {
    // Store signal for the other peer to retrieve
    if (!signalingStore.has(callId)) {
      signalingStore.set(callId, [])
    }

    signalingStore.get(callId)?.push({
      from: (session!.user as any).id,
      signal,
      type,
      timestamp: Date.now(),
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[SIGNAL_ERROR]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!(session?.user as any)?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const callId = searchParams.get('callId')

  if (!callId) {
    return NextResponse.json({ error: 'Missing callId' }, { status: 400 })
  }

  try {
    const signals = signalingStore.get(callId) || []
    
    // Filter signals for this user (not from themselves)
    const relevantSignals = signals.filter((s) => s.from !== (session!.user as any).id)

    // Clear old signals (older than 5 minutes)
    const now = Date.now()
    const filtered = relevantSignals.filter((s) => now - s.timestamp < 5 * 60 * 1000)
    
    if (filtered.length > 0) {
      signalingStore.set(callId, filtered)
    }

    return NextResponse.json(relevantSignals)
  } catch (error) {
    console.error('[SIGNAL_GET_ERROR]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
