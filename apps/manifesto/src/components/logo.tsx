interface LogoProps {
  className?: string;
  size?: number;
}

export function Logo({ className, size = 20 }: LogoProps) {
  const height = size;
  const width = (36 / 32) * size;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 36 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Coscientist logo"
      role="img"
    >
      <rect
        x="0"
        y="0"
        width="8"
        height="32"
        fill="currentColor"
        fillOpacity="1"
      />
      <rect
        x="14"
        y="0"
        width="8"
        height="32"
        fill="currentColor"
        fillOpacity="0.5"
      />
      <rect
        x="28"
        y="0"
        width="8"
        height="32"
        fill="currentColor"
        fillOpacity="0.2"
      />
    </svg>
  );
}
