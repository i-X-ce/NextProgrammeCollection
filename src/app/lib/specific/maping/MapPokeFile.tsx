import { PokeRomFile } from "../../common/PokeRomFile";
import { RomVersion } from "../../common/romVersion";

export class MapPokeFile extends PokeRomFile {
  private _table: TableAddress | null = null;
  // private _mapInfo: MapInfo = createMapInfo();
  // private _mapTypeInfo: MapTypeInfo = createMapTypeInfo();
  // private _mapId: number = 0;

  // private _tileImages: React.ReactNode[] = [];
  // private _cellImages: React.ReactNode[] = [];
  // private _mapImage: React.ReactNode[] = [];

  constructor(buffer: ArrayBuffer | Uint8Array) {
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

  // マップのバンクを取得
  getMapBank(mapId: number): number {
    const mapBank = this.readByteBig(this._table!.mapBank + mapId);
    return mapBank;
  }

  // マップ情報を取得
  getMapInfo(mapId: number): MapInfo {
    const mapBank = this.getMapBank(mapId);
    const mapInfoTable = this.readWordBig(
      this._table!.mapInfoTable + mapId * 2
    );
    const mapInfo: MapInfo = createMapInfo();
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

  // マップタイプ情報を取得
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

  // その他の情報を取得
  getAdditionalMapInfo(mapId: number): AdditionalMapInfo {
    const mapBank = this.getMapBank(mapId);
    const mapInfoTable = this.readWordBig(
      this._table!.mapInfoTable + mapId * 2
    );
    const additionalMapInfo: AdditionalMapInfo = createAdditionalMapInfo();
    {
      let addr = (mapBank << 16) + mapInfoTable + 9;
      const linkFlg = this.readByteBig(addr++);
      for (let i = 0; i < 4; i++) {
        let nextMap: NextMapInfo | null = null;
        if (linkFlg & (1 << (3 - i))) {
          nextMap = createNextMapInfo();
          nextMap.mapId = this.readByteBig(addr++);
          nextMap.mapDataAddr = this.readWordBig(addr);
          addr += 2;
          nextMap.writeAddr = this.readWordBig(addr);
          addr += 2;
          nextMap.width = this.readByteBig(addr++);
          nextMap.width2 = this.readByteBig(addr++);
          nextMap.dy = this.readByteBig(addr++);
          nextMap.dx = this.readByteBig(addr++);
          nextMap.readAddr = this.readWordBig(addr);
          addr += 2;
        }
        additionalMapInfo.nextMap.push(nextMap);
      }
      addr = (mapBank << 16) + this.readWordBig(addr);
      additionalMapInfo.clsCell = this.readByteBig(addr++);
      additionalMapInfo.warpPointCnt = this.readByteBig(addr++);
      for (let i = 0; i < additionalMapInfo.warpPointCnt; i++) {
        const warpPoint = createWorpPointInfo();
        warpPoint.y = this.readByteBig(addr++);
        warpPoint.x = this.readByteBig(addr++);
        warpPoint.pointId = this.readByteBig(addr++);
        warpPoint.mapId = this.readByteBig(addr++);
        additionalMapInfo.warpPoint.push(warpPoint);
      }
      additionalMapInfo.eventCnt = this.readByteBig(addr++);
      for (let i = 0; i < additionalMapInfo.eventCnt; i++) {
        const event = createEventInfo();
        event.y = this.readByteBig(addr++);
        event.x = this.readByteBig(addr++);
        event.eventId = this.readByteBig(addr++);
        additionalMapInfo.event.push(event);
      }
      additionalMapInfo.npcCnt = this.readByteBig(addr++);
      for (let i = 0; i < additionalMapInfo.npcCnt; i++) {
        const npc = createNpcInfo();
        npc.sprId = this.readByteBig(addr++);
        npc.y = this.readByteBig(addr++);
        npc.x = this.readByteBig(addr++);
        npc.moveType = this.readByteBig(addr++);
        npc.attr = this.readByteBig(addr++);
        npc.eventId = this.readByteBig(addr++);
        if (npc.eventId & (1 << 6)) {
          npc.monsId = this.readByteBig(addr++);
          npc.monsLv = this.readByteBig(addr++);
        } else if (npc.eventId & (1 << 7)) {
          npc.monsId = this.readByteBig(addr++);
          npc.monsLv = 0;
        } else {
          npc.monsId = 0;
          npc.monsLv = 0;
        }
        additionalMapInfo.npc.push(npc);
      }
    }
    return additionalMapInfo;
  }

  // 生のタイルデータを取得(16バイト)
  getTileData(mapId: number, tileId: number): number[] {
    const typeInfo = this.getMapTypeInfo(this.getMapInfo(mapId).mapType);
    const tileData = this.readBytesBig(
      (typeInfo.typeBank << 16) + typeInfo.tileDataAddr + tileId * 16,
      16
    );
    return [...tileData];
  }

  // 生のタイルセルを取得(16バイト)
  getCellData(mapId: number, cellId: number): number[] {
    const typeInfo = this.getMapTypeInfo(this.getMapInfo(mapId).mapType);
    const tileCell = this.readBytesBig(
      (typeInfo.typeBank << 16) + typeInfo.cellTableAddr + cellId * 16,
      16
    );
    return [...tileCell];
  }

  // 生のマップデータを取得(height * widthバイト)
  getMapData(mapId: number): number[] {
    const mapInfo = this.getMapInfo(mapId);
    const bank = this.getMapBank(mapId);
    const mapData = this.readBytesBig(
      (bank << 16) + mapInfo.mapDataAddr,
      mapInfo.height * mapInfo.width
    );
    return [...mapData];
  }

  // 生のスプライトデータを取得(0xc0 | 0x40バイト)
  getSprData(sprId: number): number[] {
    const dataAddr = this._table!.sprDataTable + (sprId - 1) * 4;
    const addr = this.readWordBig(dataAddr);
    const size = this.readByteBig(dataAddr + 2);
    const bank = this.readByteBig(dataAddr + 3);
    const sprData = this.readBytesBig((bank << 16) + addr, size);
    return [...sprData];
  }

  // 座標からタイルIDを取得
  getTileIdforMap(
    mapId: number,
    y: number,
    x: number,
    my: number = 1,
    mx: number = 0
  ): number {
    const mapInfo = this.getMapInfo(mapId);
    const mapData = this.getMapData(mapId);
    const cellAdr = Math.floor(y / 2) * mapInfo.width + Math.floor(x / 2);
    const cellId = mapData[cellAdr];
    const cellData = this.getCellData(mapId, cellId);
    const ty = y % 2;
    const tx = x % 2;
    return cellData[ty * 8 + tx * 2 + my * 4 + mx];
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

// ----------------------------------------
// 各種データタイプ
// ----------------------------------------

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

// その他の情報 d2f0~, d32c~, d463~, d483~ 等のデータ
export type AdditionalMapInfo = {
  nextMap: (NextMapInfo | null)[];
  clsCell: number; // 初期化に使うセル
  warpPointCnt: number; // ワープポイントの数
  warpPoint: WorpPointInfo[];
  eventCnt: number; // イベントの数
  event: eventInfo[];
  npcCnt: number; // NPCの数
  npc: npcInfo[];
};

function createAdditionalMapInfo(): AdditionalMapInfo {
  return {
    nextMap: [],
    clsCell: 0,
    warpPointCnt: 0,
    warpPoint: [],
    eventCnt: 0,
    event: [],
    npcCnt: 0,
    npc: [],
  };
}

// 隣のマップ情報
export type NextMapInfo = {
  mapId: number;
  mapDataAddr: number;
  writeAddr: number; // マップの書き込み先アドレス
  width: number; // 今のマップの幅
  width2: number; // 隣のマップの幅
  dy: number; // 移動後のY座標変動量
  dx: number; // 移動後のX座標変動量
  readAddr: number; // 移動後のマップの読み込み先アドレス
};

function createNextMapInfo(): NextMapInfo {
  return {
    mapId: 0,
    mapDataAddr: 0,
    writeAddr: 0,
    width: 0,
    width2: 0,
    dy: 0,
    dx: 0,
    readAddr: 0,
  };
}

// ワープポイント情報
export type WorpPointInfo = {
  y: number;
  x: number;
  pointId: number; // 出口の番号
  mapId: number; // 移動先のマップID
};

function createWorpPointInfo(): WorpPointInfo {
  return {
    y: 0,
    x: 0,
    pointId: 0,
    mapId: 0,
  };
}

// イベント情報
export type eventInfo = {
  y: number;
  x: number;
  eventId: number;
};

function createEventInfo(): eventInfo {
  return {
    y: 0,
    x: 0,
    eventId: 0,
  };
}

// npc情報
export type npcInfo = {
  sprId: number;
  y: number;
  x: number;
  moveType: number;
  attr: number; // 向きとか
  eventId: number; // イベントID(&0x3f)と bit6:戦闘NPC(2バイト) bit7:レパートリーが0確定の戦闘NPC(1バイト)
  monsId: number; // 戦闘するポケモン or トレーナーID
  monsLv: number; // 戦闘レベル or レパートリー
};

function createNpcInfo(): npcInfo {
  return {
    sprId: 0,
    y: 0,
    x: 0,
    moveType: 0,
    attr: 0,
    eventId: 0,
    monsId: 0,
    monsLv: 0,
  };
}

// ----------------------------------------
// ROMごとのテーブルアドレス
// ----------------------------------------
type TableAddress = {
  mapBank: number; // マップのバンク
  mapInfoTable: number; // マップ情報テーブル(d2e6~のデータのアドレステーブル)
  mapTypeInfo: number; // マップタイプ情報(d4aa~のデータのアドレステーブル 12バイト)
  sprDataTable: number; // スプライトデータテーブル {addr*2, size, bank} (4バイト)
};

const r0Table: TableAddress = {
  mapBank: 0x034883,
  mapInfoTable: 0x001bcb,
  mapTypeInfo: 0x034df7,
  sprDataTable: 0x057b0c,
};

const r1Table: TableAddress = {
  mapBank: 0x034883,
  mapInfoTable: 0x001bb9,
  mapTypeInfo: 0x034df7,
  sprDataTable: 0x057b0c,
};

const g0Table: TableAddress = {
  mapBank: 0x034883,
  mapInfoTable: 0x001bcb,
  mapTypeInfo: 0x034df7,
  sprDataTable: 0x057b0c,
};

const g1Table: TableAddress = {
  mapBank: 0x034883,
  mapInfoTable: 0x001bb9,
  mapTypeInfo: 0x034df7,
  sprDataTable: 0x057b0c,
};

const bTable: TableAddress = {
  mapBank: 0x034275,
  mapInfoTable: 0x000167,
  mapTypeInfo: 0x0347e9,
  sprDataTable: 0x057b27,
};

const y0Table: TableAddress = {
  mapBank: 0x3f43e4,
  mapInfoTable: 0x3f41f2,
  mapTypeInfo: 0x034554,
  sprDataTable: 0x0542a9,
};

const y1Table: TableAddress = {
  mapBank: 0x3f43e4,
  mapInfoTable: 0x3f41f2,
  mapTypeInfo: 0x03454b,
  sprDataTable: 0x0542a9,
};

const y2Table: TableAddress = {
  mapBank: 0x3f43e4,
  mapInfoTable: 0x3f41f2,
  mapTypeInfo: 0x03454b,
  sprDataTable: 0x0542a9,
};

const y3Table: TableAddress = {
  mapBank: 0x3f43e4,
  mapInfoTable: 0x3f41f2,
  mapTypeInfo: 0x03454b,
  sprDataTable: 0x0542a9,
};
