import type { RefObject } from "react"

interface InitWebRTCProps {
  roomId: string
  socket: WebSocket
  localVideoRef: RefObject<HTMLVideoElement | null>
  remoteVideoRef: RefObject<HTMLVideoElement | null>
}

export function initWebRTC({
  roomId,
  socket,
  localVideoRef,
  remoteVideoRef
}: InitWebRTCProps) {
  const peer = new RTCPeerConnection({
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
  })

  let localStream: MediaStream | null = null
  let hasSentOffer = false

  // ✅ Safe send method that waits for socket to open
  const send = (data: any) => {
    const message = JSON.stringify(data)
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(message)
    } else {
      socket.addEventListener("open", () => socket.send(message), { once: true })
    }
  }

  // ✅ Handle incoming signaling messages
  socket.onmessage = async (event) => {
    const data = JSON.parse(event.data)

    if (data.type === "offer") {
      console.log("🔄 Received offer")
      if (peer.signalingState !== "closed") {
        await peer.setRemoteDescription(new RTCSessionDescription(data.offer))
        const answer = await peer.createAnswer()
        await peer.setLocalDescription(answer)
        send({ type: "answer", answer })
      }
    }

    if (data.type === "answer") {
      console.log("✅ Received answer")
      if (peer.signalingState !== "closed") {
        await peer.setRemoteDescription(new RTCSessionDescription(data.answer))
      }
    }

    if (data.type === "ice-candidate" && data.candidate) {
      console.log("📡 Received ICE candidate")
      if (peer.signalingState !== "closed") {
        try {
          await peer.addIceCandidate(new RTCIceCandidate(data.candidate))
        } catch (err) {
          console.error("Error adding ICE candidate", err)
        }
      }
    }
  }

  // ✅ Send our ICE candidates to the other peer
  peer.onicecandidate = (event) => {
    if (event.candidate) {
      send({ type: "ice-candidate", candidate: event.candidate })
    }
  }

  // ✅ Show the remote stream when received
  peer.ontrack = (event) => {
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = event.streams[0]
    }
  }

  // ✅ Setup local media
  const setupMedia = async () => {
    try {
      localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      })

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = localStream
      }

      if (peer.signalingState === "closed") {
        console.warn("Peer is closed. Skipping track addition.")
        return
      }

      localStream.getTracks().forEach((track) => {
        peer.addTrack(track, localStream!)
      })

      // ✅ Only create offer if this client is the initiator
      if (!hasSentOffer) {
        const offer = await peer.createOffer()
        await peer.setLocalDescription(offer)
        send({ type: "offer", offer })
        hasSentOffer = true
      }

    } catch (err: any) {
      console.error("❌ Permission denied or media error", err)
      alert("Camera and microphone access is required to join the meeting.")
    }
  }

  setupMedia()

  // ✅ Cleanup when component unmounts
  return () => {
    console.log("🧹 Cleaning up WebRTC and media")
    if (peer.signalingState !== "closed") peer.close()
    if (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING) {
      socket.close()
    }
    localStream?.getTracks().forEach((track) => track.stop())
  }
}
