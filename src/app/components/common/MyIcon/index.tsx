// import styles from './style.module.css';

export default function MyIcon({
  variant = 0,
  className,
}: {
  variant?: number;
  className?: string;
}) {
  return (
    <img
      className={className}
      alt="icon"
      src={`/icon/me/Icon${(variant % 6).toString().padStart(2, "0")}.svg`}
    />
  );
}
