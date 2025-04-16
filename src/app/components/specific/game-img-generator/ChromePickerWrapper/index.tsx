import styles from "./style.module.css";

import { ChromePicker, ChromePickerProps } from "react-color";

export default function ChromePickerWrapper({
  props,
  open,
  onClose,
}: {
  props: ChromePickerProps;
  open: boolean;
  onClose?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}) {
  return (
    <div className={styles.popover}>
      {open && (
        <>
          <div className={styles.cover} onClick={onClose} />
          <ChromePicker {...props} />
        </>
      )}
    </div>
  );
}
