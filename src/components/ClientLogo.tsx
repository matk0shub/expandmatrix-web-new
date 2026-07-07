import Image from 'next/image';
import clsx from 'clsx';

interface ClientLogoProps {
  logoUrl?: string | null;
  name: string;
  alt?: string;
  className?: string;
}

function getInitials(name: string) {
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word.charAt(0))
    .join('')
    .toUpperCase();

  return initials || '?';
}

export default function ClientLogo({
  logoUrl,
  name,
  alt,
  className,
}: ClientLogoProps) {
  const baseClass =
    'relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl sm:h-[72px] sm:w-[72px]';

  if (logoUrl) {
    return (
      <div className={clsx(baseClass, 'bg-white/5 ring-1 ring-white/10', className)}>
        <Image
          src={logoUrl}
          alt={alt ?? name}
          fill
          sizes="72px"
          loading="lazy"
          className="object-contain p-3"
        />
      </div>
    );
  }

  return (
    <div
      className={clsx(
        baseClass,
        'flex items-center justify-center bg-[#00d76b]/12 text-2xl font-black text-[#00d76b] ring-1 ring-[#00d76b]/25',
        className,
      )}
      aria-label={alt ?? name}
    >
      {getInitials(name)}
    </div>
  );
}
