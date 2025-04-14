import { useRef, useState } from "react";
import styles from "./style.module.css";

export default function PartsPallet({
  title,
  colors,
  color,
  onClick,
}: {
  title: string;
  colors: string[];
  color: string;
  onClick?: (color: string) => void;
}) {
  colors.sort().reverse();
  const [selectedColorIndex, setSelectedColorIndex] = useState(
    colors.indexOf(color)
  );
  const [createColor, setCreateColor] = useState("#ffffff");
  const colorInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className={styles.container}>
      <div>{title}</div>
      <input
        type="color"
        style={{ display: "none" }}
        ref={colorInputRef}
        onChange={(e) => {
          setCreateColor(e.target.value);
          onClick?.(e.target.value);
        }}
        value={createColor}
      />
      <div className={styles.colorBoxContainer}>
        <div
          className={`${styles.colorBox} ${
            selectedColorIndex === -1 ? styles.selected : ""
          }`}
          onClick={() => {
            setSelectedColorIndex(-1);
            if (!colorInputRef.current) return;
            colorInputRef.current.click();
            // ピッカーの位置を調整する
            onClick?.(createColor);
          }}
          style={{ backgroundColor: createColor }}
        />
        {colors.map((color, i) => (
          <div
            key={i}
            className={`${styles.colorBox} ${
              selectedColorIndex === i ? styles.selected : ""
            }`}
            style={{ backgroundColor: color }}
            onClick={() => {
              setSelectedColorIndex(i);
              onClick?.(color);
            }}
          />
        ))}
      </div>
    </div>
  );
}
