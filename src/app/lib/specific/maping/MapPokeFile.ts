import { PokeRomFile } from "../../common/PokeRomFile";
import { RomVersion } from "../../common/romVersion";

export class MapPokeFile extends PokeRomFile {
  private _table: TableAddress | null = null;

  constructor(buffer: ArrayBuffer) {
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
    }
  }

  getMapData(mapId: number) {}

  getMapBank(mapId: number): number {
    const mapBank = this.readByteBig(this._table!.mapBank + mapId);
    return mapBank;
  }
}

type TableAddress = {
  mapBank: number;
};

const r0Table: TableAddress = {
  mapBank: 0x034883,
};

const r1Table: TableAddress = {
  mapBank: 0x034883,
};

const g0Table: TableAddress = {
  mapBank: 0x034883,
};

const g1Table: TableAddress = {
  mapBank: 0x034883,
};

const bTable: TableAddress = {
  mapBank: 0x034275,
};

const y0Table: TableAddress = {
  mapBank: 0x3f43e4,
};

const y1Table: TableAddress = {
  mapBank: 0x3f43e4,
};

const y2Table: TableAddress = {
  mapBank: 0x3f43e4,
};

const y3Table: TableAddress = {
  mapBank: 0x3f43e4,
};
