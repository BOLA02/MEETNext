'use client'
import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mic, MicOff, Video, VideoOff, Camera, ChevronDown, User, Image as ImageIcon } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';
import Image from 'next/image';

// Simple confetti component
function ConfettiBurst({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center animate-fade-in">
      <svg width="400" height="200" viewBox="0 0 400 200">
        <g>
          {[...Array(30)].map((_, i) => (
            <circle
              key={i}
              cx={Math.random() * 400}
              cy={Math.random() * 200}
              r={Math.random() * 6 + 3}
              fill={`hsl(${Math.random() * 360},80%,70%)`}
              opacity={0.7}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}

export default function MeetingLobby() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const meetingId = searchParams.get('id');
  const [videoOn, setVideoOn] = useState(true);
  const [micOn, setMicOn] = useState(true);
  const [videoDevices, setVideoDevices] = useState([]);
  const [audioDevices, setAudioDevices] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState('');
  const [selectedAudio, setSelectedAudio] = useState('');
  const [videoError, setVideoError] = useState('');
  const [micError, setMicError] = useState('');
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [userName, setUserName] = useState('You');
  const [userAvatar, setUserAvatar] = useState('/avatars/currentUser.jpg');
  const [showConfetti, setShowConfetti] = useState(false);
  const [bgImage, setBgImage] = useState('');

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    try {
      const settings = JSON.parse(localStorage.getItem('general_settings_v1') || '{}');
      if (settings.firstName && settings.lastName) setUserName(`${settings.firstName} ${settings.lastName}`);
      if (settings.avatar) setUserAvatar(settings.avatar);
    } catch {}
  }, []);

  useEffect(() => {
    async function getDevices() {
      const devices = await navigator.mediaDevices.enumerateDevices();
      setVideoDevices(devices.filter(d => d.kind === 'videoinput'));
      setAudioDevices(devices.filter(d => d.kind === 'audioinput'));
    }
    getDevices();
  }, []);

  useEffect(() => {
    if (videoOn || micOn) {
      navigator.mediaDevices.getUserMedia({ video: videoOn, audio: micOn })
        .then(s => {
          setStream(s);
          if (videoRef.current && videoOn) {
            videoRef.current.srcObject = s;
          }
          setVideoError('');
          setMicError('');
        })
        .catch(err => {
          if (err.name.includes('Video')) setVideoError('Camera not found');
          if (err.name.includes('Audio')) setMicError('Mic not found');
        });
    } else {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
      }
      if (videoRef.current) videoRef.current.srcObject = null;
    }
    return () => {
      if (stream) stream.getTracks().forEach(track => track.stop());
    };
  }, [videoOn, micOn, selectedVideo, selectedAudio]);

  const handleJoin = () => {
    setShowConfetti(true);
    setTimeout(() => {
      setShowConfetti(false);
      if (stream) stream.getTracks().forEach(track => track.stop());
      if (meetingId) {
        router.push(`/meetings/${meetingId}?joined=1`);
      } else {
        router.push('/');
      }
    }, 1200);
  };

  const handleBgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setBgImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <TooltipProvider>
      {/* Animated SVG blobs background */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <svg width="100vw" height="100vh" className="absolute inset-0 w-full h-full" style={{ minHeight: '100vh' }}>
          <defs>
            <radialGradient id="blob1" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
              <stop offset="0%" stopColor="#a5b4fc" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#f7eaff" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="blob2" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
              <stop offset="0%" stopColor="#f472b6" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#e0e7ff" stopOpacity="0" />
            </radialGradient>
          </defs>
          <ellipse cx="20%" cy="30%" rx="320" ry="180" fill="url(#blob1)" className="animate-pulse" />
          <ellipse cx="80%" cy="70%" rx="260" ry="140" fill="url(#blob2)" className="animate-pulse" />
        </svg>
      </div>
      {/* Top-left logo */}
      <div className="fixed top-6 left-8 z-20 flex items-center gap-2">
        <Image src="/placeholder-logo.svg" alt="Brand Logo" width={40} height={40} className="rounded-xl shadow" />
        <span className="font-bold text-xl text-[#7c3aed] drop-shadow-sm tracking-tight">MeetNext</span>
      </div>
      <ConfettiBurst show={showConfetti} />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#eaf3ff] via-white to-[#f7eaff]">
        <div className={`flex ${isMobile ? 'flex-col gap-8' : 'flex-row gap-20'} items-center w-full max-w-6xl p-6`}>
          {/* Camera Preview Card */}
          <div
            className="relative flex flex-col items-center justify-between rounded-3xl shadow-2xl border border-white/40 bg-white/70 backdrop-blur-2xl transition-all duration-300 glassmorphic px-0 py-0"
            style={{ width: isMobile ? '100%' : 420, height: 340 }}
          >
            <div className="absolute top-5 left-6 text-lg font-semibold drop-shadow text-gray-900/90 z-10">
              {meetingId ? 'Ready to join?' : 'No Meeting ID'}
            </div>
            <div className="flex-1 w-full flex items-center justify-center">
              {videoOn && !videoError ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover rounded-2xl border-2 border-[#a5b4fc] shadow-lg transition-all duration-300"
                  style={{ maxHeight: 220, background: 'linear-gradient(135deg, #e0e7ff 0%, #f3e8ff 100%)', backgroundImage: bgImage ? `url(${bgImage})` : undefined, backgroundSize: 'cover', backgroundPosition: 'center' }}
                />
              ) : (
                <div className="w-full h-[220px] flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl text-gray-400 text-5xl relative">
                  <Avatar className="h-20 w-20 shadow-xl border-4 border-white/60 bg-white/80">
                    <AvatarImage src={userAvatar} alt={userName} />
                    <AvatarFallback className="text-3xl bg-gray-200 text-gray-500">
                      {userName.split(' ').map(n => n[0]).join('').toUpperCase() || <User size={40} />}
                    </AvatarFallback>
                  </Avatar>
                  <span className="absolute bottom-3 left-1/2 -translate-x-1/2 text-gray-400 text-xs animate-fade-in">Camera is off</span>
                </div>
              )}
            </div>
            {/* Controls overlay */}
            <div className="flex flex-row gap-4 items-center justify-center mt-2 mb-2">
              <button
                className={`rounded-full w-11 h-11 flex items-center justify-center shadow text-xl transition-all duration-200 border-2 focus:outline-none focus:ring-2 focus:ring-blue-400 ${micOn ? 'bg-white text-black border-white hover:scale-110' : 'bg-red-600 text-white border-red-400 animate-mic-pulse'}`}
                onClick={() => setMicOn(v => !v)}
                title={micOn ? 'Mute mic' : 'Unmute mic'}
                aria-label={micOn ? 'Mute microphone' : 'Unmute microphone'}
                tabIndex={0}
              >
                {micOn ? <Mic /> : <MicOff />}
              </button>
              <button
                className={`rounded-full w-11 h-11 flex items-center justify-center shadow text-xl transition-all duration-200 border-2 focus:outline-none focus:ring-2 focus:ring-purple-400 ${videoOn ? 'bg-white text-black border-white hover:scale-110' : 'bg-red-600 text-white border-red-400 animate-mic-pulse'}`}
                onClick={() => setVideoOn(v => !v)}
                title={videoOn ? 'Turn off camera' : 'Turn on camera'}
                aria-label={videoOn ? 'Turn off camera' : 'Turn on camera'}
                tabIndex={0}
              >
                {videoOn ? <Video /> : <VideoOff />}
              </button>
              {/* Change background button */}
              <label className="ml-2 cursor-pointer flex items-center gap-1 px-2 py-1 rounded-lg bg-white/80 border border-gray-200 text-xs text-gray-600 hover:bg-purple-50 transition shadow-sm">
                <ImageIcon className="w-4 h-4" />
                <span>Change background</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleBgChange} />
              </label>
            </div>
            {/* Device selectors */}
            <div className="flex flex-row gap-2 items-center justify-center w-full px-6 pb-4">
              <div className="relative flex-1">
                <select
                  className="bg-white/90 border rounded-lg px-8 py-2 text-xs shadow focus:outline-none focus:ring-2 focus:ring-blue-300 pr-8 w-full"
                  value={selectedAudio}
                  onChange={e => setSelectedAudio(e.target.value)}
                  aria-label="Select microphone"
                >
                  <option value="">{micError ? 'Mic not found' : 'Select mic'}</option>
                  {audioDevices.map(d => (
                    <option key={d.deviceId} value={d.deviceId}>{d.label || 'Microphone'}</option>
                  ))}
                </select>
                <Mic className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
              <div className="relative flex-1">
                <select
                  className="bg-white/90 border rounded-lg px-8 py-2 text-xs shadow focus:outline-none focus:ring-2 focus:ring-purple-300 pr-8 w-full"
                  value={selectedVideo}
                  onChange={e => setSelectedVideo(e.target.value)}
                  aria-label="Select camera"
                >
                  <option value="">{videoError ? 'Camera not found' : 'Select camera'}</option>
                  {videoDevices.map(d => (
                    <option key={d.deviceId} value={d.deviceId}>{d.label || 'Camera'}</option>
                  ))}
                </select>
                <Video className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
            {(videoError || micError) && (
              <div className="absolute top-2 right-4 text-xs text-red-500 animate-shake">
                {videoError || micError}
              </div>
            )}
          </div>
          {/* Join Card */}
          <div className="flex flex-col items-center gap-8 w-full max-w-xs bg-white/70 rounded-3xl shadow-xl border border-white/40 py-10 px-8 backdrop-blur-xl">
            <div className="text-2xl font-semibold mb-2 text-gray-900 text-center drop-shadow-sm">{meetingId ? 'Ready to join?' : 'No Meeting ID provided'}</div>
            <div className="text-gray-500 mb-4 text-center">{meetingId ? 'No one else is here' : 'Please use a valid meeting link.'}</div>
            <button
              className={`relative bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-12 py-4 rounded-full text-lg font-bold shadow-lg mb-2 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-200 active:scale-95 ${meetingId ? 'animate-mic-pulse' : 'opacity-60 cursor-not-allowed'}`}
              onClick={handleJoin}
              disabled={!meetingId}
              aria-label="Join meeting now"
            >
              Join now
              {meetingId && (
                <span className="absolute -right-4 -top-4 w-4 h-4 bg-green-400 rounded-full animate-ping" />
              )}
            </button>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className="border border-gray-200 text-gray-700 px-6 py-2 rounded-full text-base font-semibold flex items-center gap-2 bg-white/90 shadow hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-300 active:scale-95"
                  aria-label="Other ways to join"
                >
                  Other ways to join <ChevronDown size={18} />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top">
                <span>Coming soon: Join by phone, room device, or calendar</span>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
} 