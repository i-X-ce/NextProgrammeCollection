import { number2Hex } from "../../common/calc";
import { mapNames } from "../../common/map";

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
