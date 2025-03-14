import React from "react";
import { PokeRomFile } from "../../common/PokeRomFile";
import { RomVersion } from "../../common/romVersion";
import TileImg from "@/app/components/specific/maping/TileImg";
import CellImg from "@/app/components/specific/maping/CellImg";

export class MapPokeFile extends PokeRomFile {
  private _table: TableAddress | null = null;
  // private _mapInfo: MapInfo = createMapInfo();
  // private _mapTypeInfo: MapTypeInfo = createMapTypeInfo();
  // private _mapId: number = 0;

  // private _tileImages: React.ReactNode[] = [];
  // private _cellImages: React.ReactNode[] = [];
  // private _mapImage: React.ReactNode[] = [];

  constructor(buffer: ArrayBuffer | Uint8Array, mapId: number) {
    super(buffer);
    if (!this.errorCheck().isError) {
      const tableDict = {
        [RomVersion.r0]: r0Table,
        [RomVersion.r1]: r1Table,
        [RomVersion.g0]: g0Table,
        [RomVersion.g1]: g1Table,
        [RomVersion.b]: bTable,
        [RomVersion.y0]: y0Table,
        [RomVersion.y1]: y1Table,
        [RomVersion.y2]: y2Table,
        [RomVersion.y3]: y3Table,
      };
      this._table = tableDict[this.romVersion || RomVersion.r0];
      // this._mapId = mapId;
      // this.updateMap(mapId);
    }
  }

  // get mapId(): number {
  //   return this._mapId;
  // }

  // get mapInfo(): MapInfo {
  //   return this._mapInfo;
  // }

  // get mapTypeInfo(): MapTypeInfo {
  //   return this._mapTypeInfo;
  // }

  // get tileImages(): React.ReactNode[] {
  //   return this._tileImages;
  // }

  // get cellImages(): React.ReactNode[] {
  //   return this._cellImages;
  // }

  // get mapImage(): React.ReactNode[] {
  //   return this._mapImage;
  // }

  // updateMap(mapId: number) {
  //   this._mapInfo = this.getMapInfo(mapId);
  //   this._mapTypeInfo = this.getMapTypeInfo(this._mapInfo.mapType);
  //   for (let i = 0; i < 0x100; i++) this._tileImages[i] = this.getTileImg(i);
  //   for (let i = 0; i < 0x100; i++) this._cellImages[i] = this.getCellImg(i);
  //   this._mapImage[mapId] = this.getMapImg(mapId);
  // }

  getMapBank(mapId: number): number {
    const mapBank = this.readByteBig(this._table!.mapBank + mapId);
    return mapBank;
  }

  getMapInfo(mapId: number): MapInfo {
    const mapBank = this.getMapBank(mapId);
    const mapInfoTable = this.readWordBig(
      this._table!.mapInfoTable + mapId * 2
    );
    let mapInfo: MapInfo = createMapInfo();
    {
      let i = 0;
      Object.entries(mapInfo).forEach(([key, _]) => {
        const addr = (mapBank << 16) + mapInfoTable + i;
        if (
          key === "mapDataAddr" ||
          key === "msgTableAddr" ||
          key === "eventTableAddr"
        ) {
          mapInfo[key] = this.readWordBig(addr);
          i += 2;
        } else {
          mapInfo[key as keyof MapInfo] = this.readByteBig(addr);
          i++;
        }
      });
    }
    return mapInfo;
  }

  getMapTypeInfo(mapType: number): MapTypeInfo {
    const mapTypeInfoStart = this._table!.mapTypeInfo;
    const mapTypeInfo: MapTypeInfo = createMapTypeInfo();
    {
      let i = 0;
      Object.entries(mapTypeInfo).forEach(([key, _]) => {
        const addr = mapTypeInfoStart + i + mapType * 12;
        if (key === "typeBank" || key === "kusaTile") {
          mapTypeInfo[key as keyof MapTypeInfo] = this.readByteBig(addr);
          i++;
        } else if (key === "chrTable") {
          let value = 0;
          for (let j = 0; j < 3; j++) {
            value = (value << 8) + this.readByteBig(addr + j);
          }
          mapTypeInfo[key as keyof MapTypeInfo] = value;
          i += 3;
        } else {
          mapTypeInfo[key as keyof MapTypeInfo] = this.readWordBig(addr);
          i += 2;
        }
      });
    }
    return mapTypeInfo;
  }

  // 生のタイルデータを取得(16バイト)
  getTileData(mapId: number, tileId: number): number[] {
    const typeInfo = this.getMapTypeInfo(this.getMapInfo(mapId).mapType);
    const tileData = Array.from({ length: 16 }).map((_, i) => {
      const addr =
        (typeInfo.typeBank << 16) + typeInfo.tileDataAddr + tileId * 16 + i;
      return this.readByteBig(addr);
    });
    return tileData;
  }

  // 生のタイルセルを取得(16バイト)
  getCellData(mapId: number, cellId: number): number[] {
    const typeInfo = this.getMapTypeInfo(this.getMapInfo(mapId).mapType);
    const tileCell = Array.from({ length: 16 }).map((_, i) => {
      const addr =
        (typeInfo.typeBank << 16) + typeInfo.cellTableAddr + cellId * 16 + i;
      return this.readByteBig(addr);
    });
    return tileCell;
  }

  // 生のマップデータを取得(height * widthバイト)
  getMapData(mapId: number): number[] {
    const mapInfo = this.getMapInfo(mapId);
    const bank = this.getMapBank(mapId);
    const mapData = Array.from({
      length: mapInfo.height * mapInfo.width,
    }).map((_, i) => {
      const addr = (bank << 16) + mapInfo.mapDataAddr + i;
      return this.readByteBig(addr);
    });
    return mapData;
  }

  // タイルデータからコンポーネントを生成
  // getTileImg(tileId: number): React.ReactNode {
  //   const tileData = this.getTileData(tileId);
  //   return <TileImg tileData={tileData}></TileImg>;
  // }

  // // セルデータからコンポーネントを生成(タイルデータを生成している必要がある)
  // getCellImg(cellId: number): React.ReactNode {
  //   const cellData = this.getCellData(cellId);
  //   const tiles: React.ReactNode[] = cellData.map(
  //     (value) => this.tileImages[value]
  //   );
  //   return <CellImg key={cellId} cellData={tiles} />;
  // }

  // // マップデータからコンポーネントを生成(タイルデータを生成している必要がある)
  // getMapImg(mapId: number): React.ReactNode {
  //   const mapData = this.getMapData(mapId);
  //   const cells: React.ReactNode[] = mapData.map(
  //     (value) => this.cellImages[value]
  //   );
  //   return (
  //     <CellImg
  //       key={mapId}
  //       cellData={cells}
  //       height={this.mapInfo.height}
  //       width={this.mapInfo.width}
  //     />
  //   );
  // }
}

// d2e6~のデータ
export type MapInfo = {
  mapType: number;
  height: number;
  width: number;
  mapDataAddr: number;
  msgTableAddr: number;
  eventTableAddr: number;
  linkFlg: number;
};

function createMapInfo(): MapInfo {
  return {
    mapType: 0,
    height: 0,
    width: 0,
    mapDataAddr: 0,
    msgTableAddr: 0,
    eventTableAddr: 0,
    linkFlg: 0,
  };
}

// d4aa~のデータ
export type MapTypeInfo = {
  typeBank: number;
  cellTableAddr: number;
  tileDataAddr: number;
  arukuTableAddr: number;
  chrTable: number;
  kusaTile: number;
};

function createMapTypeInfo(): MapTypeInfo {
  return {
    typeBank: 0,
    cellTableAddr: 0,
    tileDataAddr: 0,
    arukuTableAddr: 0,
    chrTable: 0,
    kusaTile: 0,
  };
}

type TableAddress = {
  mapBank: number; // マップのバンク
  mapInfoTable: number; // マップ情報テーブル(d2e6~のデータのアドレステーブル)
  mapTypeInfo: number; // マップタイプ情報(d4aa~のデータのアドレステーブル 12バイト)
};

const r0Table: TableAddress = {
  mapBank: 0x034883,
  mapInfoTable: 0x001bcb,
  mapTypeInfo: 0x034df7,
};

const r1Table: TableAddress = {
  mapBank: 0x034883,
  mapInfoTable: 0x001bb9,
  mapTypeInfo: 0x034df7,
};

const g0Table: TableAddress = {
  mapBank: 0x034883,
  mapInfoTable: 0x001bcb,
  mapTypeInfo: 0x034df7,
};

const g1Table: TableAddress = {
  mapBank: 0x034883,
  mapInfoTable: 0x001bb9,
  mapTypeInfo: 0x034df7,
};

const bTable: TableAddress = {
  mapBank: 0x034275,
  mapInfoTable: 0x000167,
  mapTypeInfo: 0x0347e9,
};

const y0Table: TableAddress = {
  mapBank: 0x3f43e4,
  mapInfoTable: 0x3f41f2,
  mapTypeInfo: 0x034554,
};

const y1Table: TableAddress = {
  mapBank: 0x3f43e4,
  mapInfoTable: 0x3f41f2,
  mapTypeInfo: 0x03454b,
};

const y2Table: TableAddress = {
  mapBank: 0x3f43e4,
  mapInfoTable: 0x3f41f2,
  mapTypeInfo: 0x03454b,
};

const y3Table: TableAddress = {
  mapBank: 0x3f43e4,
  mapInfoTable: 0x3f41f2,
  mapTypeInfo: 0x03454b,
};
