export function SoccerField() {
    return (
      <svg
        viewBox="0 0 1050 680"
        className="absolute inset-0 w-full h-full pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Field outline */}
        <rect x="5" y="5" width="1040" height="670" fill="#4CAF50" stroke="white" strokeWidth="5" />
  
        {/* Center line */}
        <line x1="525" y1="5" x2="525" y2="675" stroke="white" strokeWidth="5" />
  
        {/* Center circle */}
        <circle cx="525" cy="340" r="91.5" fill="none" stroke="white" strokeWidth="5" />
  
        {/* Center spot */}
        <circle cx="525" cy="340" r="5" fill="white" />
  
        {/* Left penalty area */}
        <rect x="5" y="170" width="165" height="340" fill="none" stroke="white" strokeWidth="5" />
  
        {/* Right penalty area */}
        <rect x="880" y="170" width="165" height="340" fill="none" stroke="white" strokeWidth="5" />
  
        {/* Left goal area */}
        <rect x="5" y="255" width="55" height="170" fill="none" stroke="white" strokeWidth="5" />
  
        {/* Right goal area */}
        <rect x="990" y="255" width="55" height="170" fill="none" stroke="white" strokeWidth="5" />
  
        {/* Left goal */}
        <rect x="-15" y="280" width="20" height="120" fill="none" stroke="white" strokeWidth="5" />
  
        {/* Right goal */}
        <rect x="1045" y="280" width="20" height="120" fill="none" stroke="white" strokeWidth="5" />
  
        {/* Left penalty spot */}
        <circle cx="110" cy="340" r="5" fill="white" />
  
        {/* Right penalty spot */}
        <circle cx="940" cy="340" r="5" fill="white" />
  
        {/* Left penalty arc */}
        <path d="M 172,255 A 91.5,91.5 0 0 1 172,425" fill="none" stroke="white" strokeWidth="5" />
  
        {/* Right penalty arc */}
        <path d="M 878,255 A 91.5,91.5 0 0 0 878,425" fill="none" stroke="white" strokeWidth="5" />
  
        {/* Corner arcs */}
        <path d="M 25,675 A 20,20 0 0 0 5,655" fill="none" stroke="white" strokeWidth="5" />
        <path d="M 1025,5 A 20,20 0 0 0 1045,25" fill="none" stroke="white" strokeWidth="5" />
        <path d="M 25,5 A 20,20 0 0 1 5,25" fill="none" stroke="white" strokeWidth="5" />
        <path d="M 1025,675 A 20,20 0 0 1 1045,655" fill="none" stroke="white" strokeWidth="5" />
      </svg>
    )
  }
  