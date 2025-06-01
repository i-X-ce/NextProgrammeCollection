import styles from "./style.module.css";

import { ReactNode } from "react";

export default function CommonSection({
  title,
  children,
  bg,
  fullHeight = false,
}: {
  title?: string;
  children?: ReactNode;
  bg?: boolean;
  fullHeight?: boolean;
}) {
  return (
    <section
      className={`${fullHeight ? "min-h-screen" : "min-h-auto"} py-24`}
      style={{
        backgroundColor: bg ? "var(--bc-section)" : "transparent",
      }}
    >
      <div className={styles.container}>
        {title && <h2 className={styles.title}>{title}</h2>}
        <div>{children}</div>
      </div>
    </section>
  );
}
