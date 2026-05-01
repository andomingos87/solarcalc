type LogoProps = {
  className?: string;
  withText?: boolean;
};

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      aria-hidden="true"
      className={className}
    >
      <g fill="#FF6B00">
        <polygon points="33,8 36,22 30,22" />
        <polygon points="48,4 50,18 46,18" />
        <polygon points="63,8 60,22 66,22" />
        <polygon points="20,18 26,28 22,32" />
        <polygon points="76,18 70,28 74,32" />
        <polygon points="12,32 24,36 22,40" />
      </g>
      <path
        d="M 22 44 A 24 24 0 0 1 70 44"
        stroke="#FF6B00"
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
      />
      <g fill="#0B3C5D">
        <rect x="38" y="38" width="14" height="11" rx="2" transform="skewX(-12)" />
        <rect x="55" y="38" width="14" height="11" rx="2" transform="skewX(-12)" />
        <rect x="72" y="38" width="14" height="11" rx="2" transform="skewX(-12)" />
        <rect x="36" y="51" width="14" height="11" rx="2" transform="skewX(-12)" />
        <rect x="53" y="51" width="14" height="11" rx="2" transform="skewX(-12)" />
        <rect x="70" y="51" width="14" height="11" rx="2" transform="skewX(-12)" />
        <rect x="34" y="64" width="14" height="11" rx="2" transform="skewX(-12)" />
      </g>
      <rect x="46" y="60" width="38" height="34" rx="5" fill="#0B3C5D" />
      <rect x="50" y="64" width="30" height="7" rx="2" fill="white" />
      <rect x="50" y="74" width="8" height="6" rx="1.5" fill="white" />
      <rect x="60" y="74" width="8" height="6" rx="1.5" fill="white" />
      <rect x="70" y="74" width="8" height="6" rx="1.5" fill="white" />
      <rect x="50" y="82" width="8" height="6" rx="1.5" fill="white" />
      <rect x="60" y="82" width="8" height="6" rx="1.5" fill="white" />
      <rect x="70" y="82" width="8" height="6" rx="1.5" fill="#FF6B00" />
    </svg>
  );
}

export function Logo({ className, withText = true }: LogoProps) {
  return (
    <a
      href="#"
      className={`group inline-flex items-center gap-2.5 transition-transform hover:scale-[1.02] ${className ?? ""}`}
    >
      <LogoMark className="h-9 w-9 transition-transform group-hover:rotate-3" />
      {withText && (
        <span className="font-heading text-[22px] font-bold tracking-tight">
          <span className="text-deep">solar</span>
          <span className="text-solar">calc</span>
        </span>
      )}
    </a>
  );
}
