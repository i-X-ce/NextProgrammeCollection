import { memo, useState } from "react";
import styles from "./style.module.css";
import { Add } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import ChromePickerWrapper from "../ChromePickerWrapper";

type PartsPalletProps = {
  title: string;
  colors: string[];
  color: string;
  onChange?: (color: string) => void;
};

const PartsPallet = memo(function PartsPallet({
  title,
  colors,
  color,
  onChange,
}: PartsPalletProps) {
  colors.sort().reverse();
  const [selectedColorIndex, setSelectedColorIndex] = useState(
    colors.indexOf(color)
  );
  const [createColor, setCreateColor] = useState("#ffffff");
  const [pickerVisible, setPickerVisible] = useState(false);
  // const colorInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className={styles.container}>
      <div>{title}</div>
      <ChromePickerWrapper
        props={{
          onChange: (color) => {
            const rgba = `rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${color.rgb.a})`;
            setCreateColor(rgba);
            onChange?.(rgba);
          },
          color: createColor,
        }}
        open={pickerVisible}
        onClose={(e) => {
          e.stopPropagation();
          setPickerVisible(false);
        }}
      />
      <div className={styles.colorBoxContainer}>
        <Tooltip title="カラーピッカーを開く" arrow>
          <div
            className={`${styles.colorBox} ${
              selectedColorIndex === -1 ? styles.selected : ""
            }`}
            onClick={() => {
              setSelectedColorIndex(-1);
              setPickerVisible(!pickerVisible);
              onChange?.(createColor);
            }}
            style={{ backgroundColor: createColor }}
          >
            <Add color="action" />
          </div>
        </Tooltip>
        {colors.map((color, i) => (
          <Tooltip key={i} title={color} arrow>
            <div
              key={i}
              className={`${styles.colorBox} ${
                selectedColorIndex === i ? styles.selected : ""
              }`}
              style={{ backgroundColor: color }}
              onClick={() => {
                setSelectedColorIndex(i);
                onChange?.(color);
              }}
            />
          </Tooltip>
        ))}
      </div>
    </div>
  );
});

export default PartsPallet;
