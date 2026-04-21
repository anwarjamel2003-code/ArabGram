/**
 * Real-time Event Manager for ArabGram
 * Using Server-Sent Events (SSE) for efficient real-time updates
 */

type EventType = 'message' | 'call' | 'notification'

interface RealtimeEvent {
  type: EventType
  data: any
  receiverId: string
}

// In a serverless environment (Vercel), we can't store persistent connections in memory
// between requests easily. For a true production real-time system on Vercel, 
// a service like Pusher, Ably, or Upstash Redis (Pub/Sub) is required.
// However, we'll implement a clean SSE structure that can be easily connected 
// to a Pub/Sub provider.

class EventManager {
  private static instance: EventManager
  private listeners: Map<string, (event: RealtimeEvent) => void> = new Map()

  private constructor() {}

  public static getInstance(): EventManager {
    if (!EventManager.instance) {
      EventManager.instance = new EventManager()
    }
    return EventManager.instance
  }

  /**
   * Emit an event to a specific user
   * In a serverless environment, this would publish to Redis/Pusher
   */
  public async emit(type: EventType, receiverId: string, data: any) {
    console.log(`[REALTIME] Emitting ${type} to user ${receiverId}`)
    
    // For the current process (if connection is local)
    const listener = this.listeners.get(receiverId)
    if (listener) {
      listener({ type, data, receiverId })
    }

    // TODO: In production on Vercel, use a Pub/Sub provider here:
    // await pusher.trigger(`user-${receiverId}`, type, data);
  }

  /**
   * Subscribe to events for a specific user
   */
  public subscribe(userId: string, callback: (event: RealtimeEvent) => void) {
    this.listeners.set(userId, callback)
    return () => this.listeners.delete(userId)
  }
}

export const eventManager = EventManager.getInstance()
