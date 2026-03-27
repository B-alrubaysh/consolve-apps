export default function ConsolveIcon({ className = "w-8 h-8", color = "currentColor" }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill={color} xmlns="http://www.w3.org/2000/svg">
      {/* C shape */}
      <path d="M40 15C22.3 15 8 29.3 8 47s14.3 32 32 32c8.8 0 16.8-3.6 22.6-9.4l-8.5-8.5C49.8 65.4 45.1 67.5 40 67.5c-11.3 0-20.5-9.2-20.5-20.5S28.7 26.5 40 26.5c5.1 0 9.8 1.9 13.4 5l8.5-8.5C56 17.1 48.3 15 40 15z" />
      {/* Asterisk / star burst */}
      <line x1="65" y1="27" x2="65" y2="47" stroke={color} strokeWidth="7" strokeLinecap="round" />
      <line x1="65" y1="47" x2="82" y2="37" stroke={color} strokeWidth="7" strokeLinecap="round" />
      <line x1="65" y1="47" x2="82" y2="57" stroke={color} strokeWidth="7" strokeLinecap="round" />
      <line x1="65" y1="47" x2="65" y2="67" stroke={color} strokeWidth="7" strokeLinecap="round" />
      <line x1="65" y1="47" x2="52" y2="37" stroke={color} strokeWidth="7" strokeLinecap="round" />
      <line x1="65" y1="47" x2="52" y2="57" stroke={color} strokeWidth="7" strokeLinecap="round" />
    </svg>
  );
}