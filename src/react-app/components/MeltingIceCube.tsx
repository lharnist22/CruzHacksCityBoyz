interface MeltingIceCubeProps {
  className?: string;
}

export default function MeltingIceCube({ className = "w-8 h-8" }: MeltingIceCubeProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Ice cube body with gradient */}
      <defs>
        <linearGradient id="iceGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#E0F2FE" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#7DD3FC" stopOpacity="0.7" />
        </linearGradient>
        <linearGradient id="waterGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#0EA5E9" stopOpacity="0.4" />
        </linearGradient>
      </defs>
      
      {/* Water puddle at bottom (melting effect) */}
      <ellipse 
        cx="50" 
        cy="85" 
        rx="35" 
        ry="8" 
        fill="url(#waterGradient)"
      />
      
      {/* Small water drops */}
      <circle cx="35" cy="75" r="3" fill="#0EA5E9" opacity="0.5" />
      <circle cx="65" cy="78" r="2.5" fill="#0EA5E9" opacity="0.5" />
      <circle cx="50" cy="73" r="2" fill="#0EA5E9" opacity="0.4" />
      
      {/* Main ice cube (slightly irregular to show melting) */}
      <path
        d="M 50 15 L 75 30 L 75 55 L 50 70 L 25 55 L 25 30 Z"
        fill="url(#iceGradient)"
        stroke="#BAE6FD"
        strokeWidth="2"
        opacity="0.95"
      />
      
      {/* Ice cube highlights */}
      <path
        d="M 50 15 L 60 22 L 60 40 L 50 47 Z"
        fill="white"
        opacity="0.3"
      />
      
      {/* Cracks showing melting */}
      <path
        d="M 40 35 L 45 40 M 55 30 L 60 35 M 35 45 L 40 50"
        stroke="#7DD3FC"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.5"
      />
      
      {/* Water drips from ice cube */}
      <path
        d="M 48 70 Q 48 75 48 78"
        stroke="#0EA5E9"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.6"
      />
      <circle cx="48" cy="79" r="2" fill="#0EA5E9" opacity="0.6" />
      
      <path
        d="M 52 70 Q 53 76 54 80"
        stroke="#0EA5E9"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.5"
      />
      <circle cx="54" cy="81" r="1.5" fill="#0EA5E9" opacity="0.5" />
    </svg>
  );
}
