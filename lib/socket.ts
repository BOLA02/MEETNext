export function initSocket(roomId: string): WebSocket {
  const socket = new WebSocket(`ws://localhost:3001?roomId=${roomId}`)

  socket.onopen = () => {
    console.log(`Connected to room: ${roomId}`)
  }

  socket.onclose = () => {
    console.log(`Disconnected from room: ${roomId}`)
  }

  return socket
}
