const AnimatedMeetingGraphic = () => (
  <svg viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <style>
      {`
        .subtle-float {
          animation: float 8s ease-in-out infinite;
        }
        .subtle-float-fast {
          animation: float 6s ease-in-out infinite;
          animation-delay: 1s;
        }
        .pulse {
            animation: pulse 3s ease-in-out infinite;
        }
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        @keyframes pulse {
            0% { opacity: 0.85; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.02); }
            100% { opacity: 0.85; transform: scale(1); }
        }
        
        /* New styles for orbit */
        .orbit-container {
          animation: orbit-rotation 35s linear infinite;
          transform-origin: 250px 250px;
        }
        
        .orbit-item {
          animation: item-face-camera 35s linear infinite;
          transform-origin: center;
        }

        @keyframes orbit-rotation {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes item-face-camera {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
      `}
    </style>
    
    {/* Orbiting participant icons */}
    <g className="orbit-container">
      {/* Icon 1 */}
      <g transform="translate(250, 40)">
        <g className="orbit-item">
          <circle cx="0" cy="0" r="22" fill="#34D399" filter="url(#shadow-sm)"/>
          <text x="0" y="7" fontSize="20" fill="white" textAnchor="middle">😊</text>
        </g>
      </g>
      {/* Icon 2 */}
      <g transform="translate(460, 250)">
        <g className="orbit-item">
          <circle cx="0" cy="0" r="22" fill="#F472B6" filter="url(#shadow-sm)"/>
          <text x="0" y="7" fontSize="20" fill="white" textAnchor="middle">😎</text>
        </g>
      </g>
      {/* Icon 3 */}
      <g transform="translate(40, 250)">
        <g className="orbit-item">
          <circle cx="0" cy="0" r="22" fill="#60A5FA" filter="url(#shadow-sm)"/>
          <text x="0" y="7" fontSize="20" fill="white" textAnchor="middle">🤓</text>
        </g>
      </g>
      {/* Icon 4 */}
      <g transform="translate(120, 420)">
        <g className="orbit-item">
          <circle cx="0" cy="0" r="18" fill="#FBBF24" filter="url(#shadow-sm)"/>
          <text x="0" y="6" fontSize="16" fill="white" textAnchor="middle">🤔</text>
        </g>
      </g>
      {/* Icon 5 */}
      <g transform="translate(380, 420)">
        <g className="orbit-item">
          <circle cx="0" cy="0" r="18" fill="#818CF8" filter="url(#shadow-sm)"/>
          <text x="0" y="6" fontSize="16" fill="white" textAnchor="middle">🥳</text>
        </g>
      </g>
      {/* Icon 6 */}
      <g transform="translate(420, 120)">
        <g className="orbit-item">
          <circle cx="0" cy="0" r="20" fill="#F0ABFC" filter="url(#shadow-sm)"/>
          <text x="0" y="6" fontSize="18" fill="white" textAnchor="middle">👋</text>
        </g>
      </g>
      {/* Icon 7 */}
      <g transform="translate(80, 120)">
        <g className="orbit-item">
          <circle cx="0" cy="0" r="16" fill="#A5B4FC" filter="url(#shadow-sm)"/>
          <text x="0" y="5" fontSize="14" fill="white" textAnchor="middle">🎉</text>
        </g>
      </g>
      {/* Icon 8 */}
      <g transform="translate(80, 380)">
        <g className="orbit-item">
          <circle cx="0" cy="0" r="20" fill="#F9A8D4" filter="url(#shadow-sm)"/>
          <text x="0" y="6" fontSize="18" fill="white" textAnchor="middle">🚀</text>
        </g>
      </g>
      {/* Icon 9 */}
      <g transform="translate(420, 380)">
        <g className="orbit-item">
          <circle cx="0" cy="0" r="16" fill="#6EE7B7" filter="url(#shadow-sm)"/>
          <text x="0" y="5" fontSize="14" fill="white" textAnchor="middle">✨</text>
        </g>
      </g>
    </g>

    {/* Base platform */}
    <g className="subtle-float">
      <ellipse cx="250" cy="420" rx="180" ry="50" fill="rgba(233, 213, 255, 0.8)" />
      <ellipse cx="250" cy="420" rx="170" ry="45" fill="#F3E8FF" />
    </g>

    {/* Character */}
    <g transform="translate(195 260)">
      {/* Chair */}
      <path d="M15 80 H 95 C 100 80 105 85 105 90 V 140 C 105 145 100 150 95 150 H 15 C 10 150 5 145 5 140 V 90 C 5 85 10 80 15 80 Z" fill="#6B7280" />
      <rect x="50" y="150" width="10" height="30" fill="#4B5563" />
      <rect x="20" y="180" width="70" height="5" rx="2.5" fill="#4B5563" />

      {/* Body */}
      <rect y="30" width="110" height="90" rx="20" fill="#60A5FA" />
      {/* Head */}
      <circle cx="55" cy="0" r="35" fill="#FBBF24" />
      {/* Hair */}
      <path d="M25 -25 Q55 -50 85 -25 L 85 0 H 25 Z" fill="#A16207" />
      {/* Headphones */}
      <path d="M20 -15 C -15 45, 125 45, 90 -15" stroke="#374151" strokeWidth="6" fill="none" strokeLinecap="round" />
      <rect x="15" y="-5" width="10" height="25" rx="5" fill="#374151" />
      <rect x="85" y="-5" width="10" height="25" rx="5" fill="#374151" />
    </g>

    {/* Screen */}
    <g transform="translate(100 80)" className="subtle-float-fast">
      <rect width="300" height="180" rx="20" fill="white" filter="url(#shadow)" />
      <rect x="10" y="10" width="280" height="160" rx="15" fill="#F9FAFB" />
      
      {/* Window Header */}
      <path d="M10 25C10 16.7157 16.7157 10 25 10H275C283.284 10 290 16.7157 290 25V35H10V25Z" fill="#E5E7EB"/>
      <circle cx="25" cy="22.5" r="5" fill="#FF5F56" />
      <circle cx="45" cy="22.5" r="5" fill="#FFBD2E" />
      <circle cx="65" cy="22.5" r="5" fill="#27C93F" />

      {/* Video feeds */}
      <g className="pulse">
        <rect x="30" y="50" width="70" height="50" rx="8" fill="#A78BFA" />
        <circle cx="65" cy="70" r="10" fill="rgba(255,255,255,0.5)"/>
        <path d="M55 80 C 60 75, 70 75, 75 80" fill="rgba(255,255,255,0.5)" />
      </g>
      <g className="pulse" style={{ animationDelay: '0.5s' }}>
        <rect x="115" y="50" width="70" height="50" rx="8" fill="#C4B5FD" />
        <circle cx="150" cy="70" r="10" fill="rgba(255,255,255,0.5)"/>
        <path d="M140 80 C 145 75, 155 75, 160 80" fill="rgba(255,255,255,0.5)" />
      </g>
      <g className="pulse" style={{ animationDelay: '1s' }}>
        <rect x="200" y="50" width="70" height="50" rx="8" fill="#DDD6FE" />
        <circle cx="235" cy="70" r="10" fill="rgba(255,255,255,0.5)"/>
        <path d="M225 80 C 230 75, 240 75, 245 80" fill="rgba(255,255,255,0.5)" />
      </g>

       {/* Self view */}
       <g transform="translate(30 115)">
         <rect width="60" height="45" rx="8" fill="#FBBF24" filter="url(#shadow-sm)"/>
         <circle cx="30" cy="20" r="8" fill="#fff"/>
         <path d="M20 32 h 20 v 5 h -20 z" fill="#60A5FA" />
       </g>
    </g>

    <defs>
      <filter id="shadow" x="-5%" y="-5%" width="110%" height="120%">
        <feDropShadow dx="0" dy="5" stdDeviation="5" floodColor="rgba(0,0,0,0.1)"/>
      </filter>
      <filter id="shadow-sm" x="-5%" y="-5%" width="110%" height="110%">
        <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="rgba(0,0,0,0.1)"/>
      </filter>
    </defs>
  </svg>
)

export default AnimatedMeetingGraphic 