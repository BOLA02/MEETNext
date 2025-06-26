import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mic, MicOff, Video, VideoOff, Camera, ChevronDown } from 'lucide-react';

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
    if (stream) stream.getTracks().forEach(track => track.stop());
    router.push(`/meetings/${meetingId}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex flex-row gap-16 items-center">
        {/* Camera Preview Card */}
        <div className="bg-gray-100 rounded-2xl shadow-xl p-6 flex flex-col items-center relative" style={{ width: 480, height: 320 }}>
          <div className="absolute top-4 left-4 text-white text-lg font-semibold drop-shadow">Uwem Precious</div>
          {videoOn && !videoError ? (
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover rounded-xl" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-300 rounded-xl text-gray-500 text-4xl">
              <Camera size={64} />
            </div>
          )}
          {/* Controls overlay */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-row gap-4 items-center">
            <button
              className={`rounded-full w-12 h-12 flex items-center justify-center shadow-md text-xl transition-all duration-200 ${micOn ? 'bg-white text-black' : 'bg-red-600 text-white'}`}
              onClick={() => setMicOn(v => !v)}
              title={micOn ? 'Mute mic' : 'Unmute mic'}
            >
              {micOn ? <Mic /> : <MicOff />}
            </button>
            <button
              className={`rounded-full w-12 h-12 flex items-center justify-center shadow-md text-xl transition-all duration-200 ${videoOn ? 'bg-white text-black' : 'bg-red-600 text-white'}`}
              onClick={() => setVideoOn(v => !v)}
              title={videoOn ? 'Turn off camera' : 'Turn on camera'}
            >
              {videoOn ? <Video /> : <VideoOff />}
            </button>
          </div>
          {/* Device selectors */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex flex-row gap-2 items-center">
            <select
              className="bg-white border rounded px-2 py-1 text-xs"
              value={selectedAudio}
              onChange={e => setSelectedAudio(e.target.value)}
            >
              <option value="">{micError ? 'Mic not found' : 'Select mic'}</option>
              {audioDevices.map(d => (
                <option key={d.deviceId} value={d.deviceId}>{d.label || 'Microphone'}</option>
              ))}
            </select>
            <select
              className="bg-white border rounded px-2 py-1 text-xs"
              value={selectedVideo}
              onChange={e => setSelectedVideo(e.target.value)}
            >
              <option value="">{videoError ? 'Camera not found' : 'Select camera'}</option>
              {videoDevices.map(d => (
                <option key={d.deviceId} value={d.deviceId}>{d.label || 'Camera'}</option>
              ))}
            </select>
          </div>
        </div>
        {/* Join Card */}
        <div className="flex flex-col items-center gap-8">
          <div className="text-2xl font-semibold mb-2">Ready to join?</div>
          <div className="text-gray-500 mb-4">No one else is here</div>
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-4 rounded-full text-lg font-bold shadow-lg mb-2"
            onClick={handleJoin}
          >
            Join now
          </button>
          <button className="border border-gray-300 text-gray-700 px-6 py-2 rounded-full text-base font-semibold flex items-center gap-2">
            Other ways to join <ChevronDown size={18} />
          </button>
        </div>
      </div>
    </div>
  );
} 