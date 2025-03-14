import styles from "./style.module.css";

export default function CellImg({
  cellData,
  width = 4,
  height = 4,
}: {
  cellData: React.ReactNode[];
  width?: number;
  height?: number;
}) {
  if (cellData.length !== width * height) {
    return <div>セルデータが不正です</div>;
  }

  return (
    <div
      className={styles.cell}
      style={{
        gridTemplateColumns: `repeat(${width}, 1fr)`,
        gridTemplateRows: `repeat(${height}, 1fr)`,
      }}
    >
      {cellData.map((value, i) => (
        <div key={i}>{value}</div>
      ))}
    </div>
  );
}
