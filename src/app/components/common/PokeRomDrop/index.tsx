"use client";
import { Alert, Card, Snackbar } from "@mui/material";
import styles from "./style.module.css";
import { useCallback, useState } from "react";
import { FileRejection, useDropzone } from "react-dropzone";
import { PokeRomFile } from "@/app/lib/common/PokeRomFile";
import { FileOpen, InsertDriveFile } from "@mui/icons-material";
import { RomVersion } from "@/app/lib/common/romVersion";

export default function PokeRomDrop({
  setRom,
}: {
  setRom: (arryaBuffer: ArrayBuffer) => void;
}) {
  const [fileData, setFileData] = useState<Uint8Array | null>(null);
  const [romName, setRomName] = useState<string | null>(null);
  const [romColor, setRomColor] = useState<string | null>(null);
  const [errorMes, setErrorMes] = useState<string | null>(null);
  const [errorOpen, setErrorOpen] = useState(false);

  const onDrop = useCallback((acceptFiles: File[]) => {
    if (acceptFiles.length === 0) return;
    const file = acceptFiles[0];

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        const arrayBuffer = e.target.result as ArrayBuffer;
        const newPokeRom = new PokeRomFile(arrayBuffer);
        const error = newPokeRom.errorCheck();
        if (error.isError) {
          setErrorMes(error.message);
          setErrorOpen(true);
          return;
        }
        setRomName(file.name);
        setFileData(new Uint8Array(arrayBuffer));
        setRom(arrayBuffer);
        if (newPokeRom.romVersion !== null) {
          const rv = newPokeRom.romVersion;
          if (rv <= RomVersion.r1) setRomColor("red");
          else if (rv <= RomVersion.g1) setRomColor("green");
          else if (rv <= RomVersion.b) setRomColor("blue");
          else setRomColor("yellow");
        }
      }
    };
    reader.readAsArrayBuffer(file);
  }, []);

  const onDropRejected = useCallback((fileRejections: FileRejection[]) => {
    let message = "";
    fileRejections.forEach(({ file, errors }) => {
      message += `Rejected file: ${file.name}\n`;
      errors.forEach((error) => {
        message += `Reason: ${error.message}\n`;
      });
    });
    setErrorMes(message);
    setErrorOpen(true);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    onDropRejected,
    accept: { "application/octec-stream": [".gb"] },
    multiple: false,
  });

  if (romName) {
    return (
      <div
        {...getRootProps()}
        style={{ display: "flex", justifyContent: "center" }}
      >
        <input {...getInputProps()} />
        <Card className={styles.fillDropZone}>
          <div
            className={styles.fillDropZoneIcon}
            style={{ backgroundColor: `var(--bc-${romColor})` }}
          >
            <InsertDriveFile
              color="inherit"
              sx={{ color: "var(--background)" }}
            />
          </div>
          <p className={styles.romName}>{romName}</p>
        </Card>
      </div>
    );
  }

  return (
    <div className={styles.dropZone} {...getRootProps()}>
      <input {...getInputProps()} />
      <span {...getRootProps()}>
        <FileOpen fontSize="large" color="action" />
      </span>
      <p style={{ color: "var(--bc-action)" }}>ROMをドロップ</p>
      <p style={{ color: "var(--bc-action)", fontSize: "0.7rem" }}>
        ※ROMデータがサーバーにアップロードされることはありません。
      </p>

      <Snackbar
        open={errorOpen}
        autoHideDuration={6000}
        onClose={() => setErrorOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="error">{errorMes}</Alert>
      </Snackbar>
      {/* {errorMes && <p style={{ color: "red" }}>{errorMes}</p>} */}

      {/* {fileData && (
        <div>
          <p>ファイルサイズ: {fileData.length} バイト</p>
          <p>
            先頭16バイト:{" "}
            {Array.from(fileData.slice(0, 16))
              .map((b) => b.toString(16).padStart(2, "0").toLocaleUpperCase())
              .join(" ")}
          </p>
        </div>
      )} */}
    </div>
  );
}
