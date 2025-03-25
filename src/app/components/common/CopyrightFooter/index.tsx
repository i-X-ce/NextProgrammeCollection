import styles from "./style.module.css";

import { GitHub, Twitter, YouTube } from "@mui/icons-material";
import Link from "next/link";

export default function CopyrightFooter({ year }: { year: number }) {
  return (
    <footer className={styles.footer}>
      © {year} by {"i-X-ce"}
      <div className={styles.linkContainer}>
        <Link href="https://www.youtube.com/@%E3%82%A2%E3%82%A4%E3%82%B9-j3p">
          <YouTube color="action" />
        </Link>
        <Link href="https://x.com/i_c_e_i_c_e_">
          <Twitter color="action" />
        </Link>
        <Link href="https://github.com/i-X-ce">
          <GitHub color="action" />
        </Link>
      </div>
    </footer>
  );
}
