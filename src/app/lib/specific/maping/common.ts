import { number2Hex } from "../../common/calc";
import { mapNames } from "../../common/map";

// ファイルダウンロード
export function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(url);
}

export function mapFileName(mapid: number, fileFormat: string) {
  return `${number2Hex(mapid)}_${mapNames[mapid].name}.${fileFormat}`;
}

// ファイル形式のタイプ
export type FileFormat = "png" | "jpeg";

// canvasをBlobに変換
export function canvasToBlob(
  canvas: HTMLCanvasElement,
  fileFormat: FileFormat
): Promise<Blob | null> {
  // if (fileFormat === "bmp") {
  //   // BMP形式はcanvas.toBlob()が未対応のため、自前で変換する
  //   const image = Image.fromCanvas(canvas);
  //   const bmpBuffer = image.toBMP();
  // }
  const format = `image/${fileFormat}`;
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), format);
  });
}
