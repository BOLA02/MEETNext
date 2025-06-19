// server/ws-server.ts
import { WebSocketServer, WebSocket } from 'ws'
import { IncomingMessage } from 'http'
import { parse } from 'url'

// Store clients by room ID
const rooms: Record<string, WebSocket[]> = {}

// Create WebSocket server on port 3001
const wss = new WebSocketServer({ port: 3001 })

wss.on('connection', (ws: WebSocket, req: IncomingMessage) => {
  const parsedUrl = parse(req.url || '', true)
  const roomId = parsedUrl.query.roomId as string | undefined

  if (!roomId) {
    ws.close(1008, 'Missing roomId')
    return
  }

  // Initialize room if not exists
  if (!rooms[roomId]) {
    rooms[roomId] = []
  }

  // Add this client to the room
  rooms[roomId].push(ws)

  console.log(`Client connected to room ${roomId}`)

  ws.on('message', (message) => {
    console.log(`Message from room ${roomId}:`, message.toString())

    // Broadcast to all others in the same room
    rooms[roomId].forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message)
      }
    })
  })

  ws.on('close', () => {
    // Remove client from room on disconnect
    rooms[roomId] = rooms[roomId].filter((client) => client !== ws)
    console.log(`Client disconnected from room ${roomId}`)
  })
})

console.log('✅ WebSocket server running on ws://localhost:3001')
