"use client";
import { PokeRomFile } from "@/app/lib/common/PokeRomFile";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

export default function PokeRomDrop({
  setRom,
}: {
  setRom: (rom: PokeRomFile) => void;
}) {
  const [fileData, setFileData] = useState<Uint8Array | null>(null);
  const onDrop = useCallback((acceptFiles: File[]) => {
    if (acceptFiles.length === 0) return;
    const file = acceptFiles[0];

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        const arrayBuffer = e.target.result as ArrayBuffer;
        setFileData(new Uint8Array(arrayBuffer));
        setRom(new PokeRomFile(arrayBuffer));
      }
    };
    reader.readAsArrayBuffer(file);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "application/octec-stream": [".gb"] },
    multiple: false,
  });

  return (
    <div {...getRootProps()} style={{ border: "1px solid black", padding: 20 }}>
      <input {...getInputProps()} />
      <p>ファイルをここにドロップ</p>

      {fileData && (
        <div>
          <p>ファイルサイズ: {fileData.length} バイト</p>
          <p>
            先頭16バイト:{" "}
            {Array.from(fileData.slice(0, 16))
              .map((b) => b.toString(16).padStart(2, "0").toLocaleUpperCase())
              .join(" ")}
          </p>
        </div>
      )}
    </div>
  );
}
