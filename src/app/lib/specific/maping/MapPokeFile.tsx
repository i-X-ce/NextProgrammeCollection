import { PokeRomFile } from "../../common/PokeRomFile";
import { RomVersion } from "../../common/romVersion";

export class MapPokeFile extends PokeRomFile {
  private _table: TableAddress | null = null;
  private _mapData: MapInfo = createMapInfo();
  private _mapTypeInfo: MapTypeInfo = createMapTypeInfo();

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
      this._mapData = this.getMapInfo(mapId);
      this._mapTypeInfo = this.getMapTypeInfo(this._mapData.mapType);
    }
  }

  get mapData(): MapInfo {
    return this._mapData;
  }

  get mapTypeInfo(): MapTypeInfo {
    return this._mapTypeInfo;
  }

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

  getTileData(tileId: number): number[] {
    const tileData = Array.from({ length: 16 }).map((_, i) => {
      const addr =
        (this.mapTypeInfo.typeBank << 16) +
        this.mapTypeInfo.tileDataAddr +
        tileId * 16 +
        i;
      console.log(this.mapTypeInfo);
      return this.readByteBig(addr);
    });
    return tileData;
  }
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
