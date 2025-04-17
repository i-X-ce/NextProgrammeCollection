import styles from "./style.module.css";

export default function PopoverWrapper({
  children,
  open = true,
  onClose,
}: {
  children: React.ReactNode;
  open?: boolean;
  onClose?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}) {
  return (
    <div className={styles.popover}>
      {open && (
        <>
          <div className={styles.cover} onClick={onClose} />
          {children}
        </>
      )}
    </div>
  );
}
