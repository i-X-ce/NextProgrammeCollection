import styles from "./style.module.css";

export default function PartsPallet({
  title,
  colors,
  onClick,
}: {
  title: string;
  colors: string[];
  onClick?: (color: string) => void;
}) {
  return (
    <div className={styles.container}>
      <div>{title}</div>
      <div className={styles.colorBoxContainer}>
        {colors.map((color, i) => (
          <div
            key={i}
            className={styles.colorBox}
            style={{ backgroundColor: color }}
            onClick={() => onClick?.(color)}
          />
        ))}
      </div>
    </div>
  );
}
