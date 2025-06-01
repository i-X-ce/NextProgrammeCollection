import styles from "./style.module.css";

import MyIcon from "../MyIcon";

export default function TopContent({
  title,
  subTitle,
  description,
  date,
  children,
}: {
  title: string;
  subTitle?: string;
  description?: string;
  date?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className={styles.container}>
      <div className={styles.textContainer}>
        <p className={styles.title}>{title}</p>
        <p className={styles.subTitle}>{subTitle}</p>
        {description && <p className={styles.description}>{description}</p>}
        {date && <p className={styles.date}>{date}</p>}
      </div>
      <div className={styles.iconContainer}>
        {children ? (
          children
        ) : (
          <MyIcon
            className="w-[200px] lg:w-[300px] shadow-md rounded-full"
            variant={4}
          />
        )}
      </div>
    </section>
  );
}
