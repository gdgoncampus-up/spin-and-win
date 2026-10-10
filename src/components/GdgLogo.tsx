interface GdgLogoProps {
  className?: string;
}

/** The GDG brackets mark, drawn as four rounded strokes in the Google colors. */
export function GdgLogo({ className }: GdgLogoProps) {
  return (
    <svg className={className} viewBox="0 0 200 110" aria-hidden="true">
      <g fill="none" strokeLinecap="round" strokeWidth="30">
        <path d="M78 25 28 55" stroke="#EA4335" />
        <path d="M28 55 78 85" stroke="#4285F4" />
        <path d="M122 25 172 55" stroke="#34A853" />
        <path d="M172 55 122 85" stroke="#FBBC05" />
      </g>
    </svg>
  );
}
