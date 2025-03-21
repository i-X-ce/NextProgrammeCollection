import { useRef, useState } from "react";
import styles from "./style.module.css";
import { Dialog, IconButton } from "@mui/material";
import { Add, Edit } from "@mui/icons-material";
import { GBcolorPalettes } from "@/app/lib/common/colorPalettes";

export default function ColorPalettes({
  pallets,
  palletIndex,
  maxPalettes = 30,
  onClick,
  setPalettes,
}: {
  pallets: string[][];
  palletIndex?: number;
  maxPalettes?: number;
  onClick?: (value: number) => void;
  setPalettes?: (pallets: string[][]) => void;
}) {
  const [index, setIndex] = useState<number>(palletIndex || 0);
  const [openEdit, setOpenEdit] = useState<boolean>(false);
  const [editNum, setEditNum] = useState<number>(0);
  const editFinalColor = useRef<string | null>(null);

  return (
    <div className={styles.palletsContainer}>
      {[...pallets].map(
        (colors: string[], paletteI: number) =>
          colors.length === 4 && (
            <div
              key={paletteI}
              className={`${styles.palletWrapper} ${
                index === paletteI ? styles.selected : ""
              }`}
            >
              <div
                className={styles.editButton}
                onClick={() => {
                  setEditNum(paletteI);
                  setOpenEdit(true);
                }}
              >
                <Edit sx={{ fontSize: "0.9rem" }} color="action" />
              </div>
              <div
                key={paletteI}
                className={styles.pallet}
                onClick={() => {
                  setIndex(paletteI);
                  onClick?.(paletteI);
                }}
              >
                {colors.map((color: string, colorI: number) => (
                  <div key={colorI} style={{ backgroundColor: color }} />
                ))}
              </div>
            </div>
          )
      )}
      {pallets.length <= maxPalettes && (
        <div className={styles.palletWrapper}>
          <IconButton
            onClick={() => {
              setPalettes?.([...pallets, [...GBcolorPalettes[0]]]);
            }}
          >
            <Add />
          </IconButton>
        </div>
      )}

      {/* 編集ダイアログ */}
      <Dialog open={openEdit} onClose={() => setOpenEdit(false)}>
        <div className={styles.editDialog}>
          {/* <h2 className={styles.editDialogTitle}>パレット編集</h2> */}
          <Edit color="action" />
          <div className={styles.editDialogInputContainer}>
            {pallets[editNum || 0].map((color: string, i: number) => (
              <input
                key={i}
                type="color"
                className={styles.editDialogInput}
                value={editFinalColor.current || color}
                onChange={(e) => {
                  editFinalColor.current = e.target.value;
                }}
                onBlur={() => {
                  const newPalettes = [...pallets];
                  newPalettes[editNum || 0][i] =
                    editFinalColor.current || color;
                  setPalettes?.(newPalettes);
                  editFinalColor.current = null;
                }}
              />
            ))}
          </div>
        </div>
      </Dialog>
    </div>
  );
}
