import { mod } from "../../common/calc";
import { ButtonType } from "./ButtonType";
import { pokemoji } from "../../common/pokemoji";
import { isKatakana, toHiragana, toKatakana } from "wanakana";

export class HayamojiSearch {
  private map: HayamojiMap = new HayamojiMap();
  static readonly DAKUTEN_CONVERSION: { [key: string]: string } = {
    カ: "ガ",
    キ: "ギ",
    ク: "グ",
    ケ: "ゲ",
    コ: "ゴ",
    サ: "ザ",
    シ: "ジ",
    ス: "ズ",
    セ: "ゼ",
    ソ: "ゾ",
    タ: "ダ",
    チ: "ヂ",
    ツ: "ヅ",
    テ: "デ",
    ト: "ド",
    ハ: "バ",
    ヒ: "ビ",
    フ: "ブ",
    ヘ: "ベ",
    ホ: "ボ",
    か: "が",
    き: "ぎ",
    く: "ぐ",
    け: "げ",
    こ: "ご",
    さ: "ざ",
    し: "じ",
    す: "ず",
    せ: "ぜ",
    そ: "ぞ",
    た: "だ",
    ち: "ぢ",
    つ: "づ",
    て: "で",
    と: "ど",
    は: "ば",
    ひ: "び",
    ふ: "ぶ",
    へ: "べ",
    ほ: "ぼ",
  };
  static readonly HANDAKUTEN_CONVERSION: { [key: string]: string } = {
    ハ: "パ",
    ヒ: "ピ",
    フ: "プ",
    ヘ: "ペ",
    ホ: "ポ",
    は: "ぱ",
    ひ: "ぴ",
    ふ: "ぷ",
    へ: "ぺ",
    ほ: "ぽ",
  };

  public search(value: string) {
    const array = this.string2array(value);
    if (!array) return null;
    const charList = ["ア"].concat(array);

    let name = "";
    let ret = [];
    let iskata = true;
    for (let i = 0; i < charList.length - 1; i++) {
      const startChar = charList[i];
      const endChar = charList[i + 1];
      let changedType = false;
      if (endChar !== "゛" && endChar !== "゜") {
        const preKata: boolean = iskata;
        iskata = isKatakana(endChar);
        if (preKata != iskata) changedType = true;
      }

      const result = this.map.bfsSearch(
        startChar === "En" ? "En" : toKatakana(startChar),
        toKatakana(endChar),
        iskata ? "katakana" : "hiragana",
        changedType
      );
      if (endChar === "゛" || endChar === "゜") {
        name = name.substring(0, name.length - 1);
        if (endChar === "゛") {
          name += HayamojiSearch.DAKUTEN_CONVERSION[charList[i]] || "";
        } else {
          name += HayamojiSearch.HANDAKUTEN_CONVERSION[charList[i]] || "";
        }
      } else {
        name += endChar;
      }
      // console.log(startChar, endChar, result);
      if (!result) return null;
      ret.push(result.path);
    }
    console.log(name);
    return ret;
  }

  private string2array(str: string): string[] | null {
    const formatRIHEBEPE: { [key: string]: string } = {
      り: "リ",
      へ: "ヘ",
      べ: "ベ",
      ぺ: "ペ",
    };

    let spl = str.split("");
    spl = spl.map((s) => formatRIHEBEPE[s] || s);
    if (
      spl.length !==
      spl.filter((s) => {
        const p = pokemoji.find((p) => p.char === s);
        return p && p.possible;
      }).length
    )
      return null;

    let ret = [];
    for (let i = 0; i < spl.length; i++) {
      const p = pokemoji.find((p) => p.char === spl[i])!;
      if (p.dakuten) {
        ret.push(p.initchar);
        ret.push(p.dakuten);
      } else ret.push(p.char);
    }

    return ret;
  }
}

class HayamojiMap {
  static readonly CHARS = [
    ["ア", "イ", "ウ", "エ", "オ", "ャ"],
    ["カ", "キ", "ク", "ケ", "コ", "ュ"],
    ["サ", "シ", "ス", "セ", "ソ", "ョ"],
    ["タ", "チ", "ツ", "テ", "ト", "ッ"],
    ["ナ", "ニ", "ヌ", "ネ", "ノ", "゛"],
    ["ハ", "ヒ", "フ", "ヘ", "ホ", "゜"],
    ["マ", "ミ", "ム", "メ", "モ", "ー"],
    ["ヤ", "ユ", "ヨ", "ワ", "ン", "　"],
    ["ラ", "リ", "ル", "レ", "ロ", "En"],
  ];
  private map: Node[][];
  private nodeMap: Map<string, Node> = new Map();

  constructor() {
    this.map = new Array(HayamojiMap.CHARS.length);
    for (let i = 0; i < HayamojiMap.CHARS.length; i++) {
      this.map[i] = new Array(HayamojiMap.CHARS[i].length);
      for (let j = 0; j < HayamojiMap.CHARS[i].length; j++) {
        this.map[i][j] = new Node(HayamojiMap.CHARS[i][j]);
        this.nodeMap.set(HayamojiMap.CHARS[i][j], this.map[i][j]);
      }
    }

    const kana: Node = new Node("かな");
    for (let i = 0; i < HayamojiMap.CHARS.length; i++) {
      for (let j = 0; j < HayamojiMap.CHARS[i].length; j++) {
        const target: Node = this.map[i][j];
        if (j > 0) {
          target.addChild(ButtonType.Up, this.map[i][j - 1]);
          this.map[i][j - 1].addChild(ButtonType.Down, target);
        } else {
          target.addChild(ButtonType.Up, kana);
        }
        target.addChild(
          ButtonType.Left,
          this.map[mod(i - 1, HayamojiMap.CHARS.length)][j]
        );
        this.map[mod(i - 1, HayamojiMap.CHARS.length)][j].addChild(
          ButtonType.Right,
          target
        );
      }
    }
    kana.addChild(ButtonType.Down, this.nodeMap.get("ア")!);
    kana.addChild(ButtonType.Up, this.nodeMap.get("ャ")!);
  }

  public bfsSearch(
    start: string,
    goal: string,
    type: "katakana" | "hiragana",
    changedType: boolean
  ): {
    cost: number;
    path: { char: string; button: ButtonType }[];
  } | null {
    const bfs = (
      reverse: boolean
    ): {
      cost: number;
      path: { char: string; button: ButtonType }[];
    } | null => {
      const startNode: Node | undefined = this.nodeMap.get(start),
        goalNode: Node | undefined = this.nodeMap.get(goal);
      if (!startNode || !goalNode) return null;

      // map(通った場所)に使うデータ型
      type VisitedData = {
        node: Node | null;
        predata: { node: Node; button: ButtonType } | null; // どのボタンでどのノードから来たか
        cost: number;
      };

      const queue: VisitedData[] = [
        { node: startNode, predata: null, cost: 0 },
      ];
      // const queue = new TinyQueue<VisitedData>([], (a, b) => a.cost - b.cost);
      queue.push({ node: startNode, predata: null, cost: 0 });
      const visitedData: Map<Node, VisitedData> = new Map();
      visitedData.set(startNode, {
        cost: 0,
        node: startNode,
        predata: null,
      });

      while (queue.length > 0) {
        const currentData: VisitedData = queue.pop()!;
        const currentNode: Node = currentData.node!;
        const pastData: VisitedData = visitedData.get(currentNode)!;
        if (pastData && currentData.cost > pastData.cost) continue;
        visitedData.set(currentNode, currentData);

        // if (currentNode === goalNode) break;

        const children = reverse
          ? currentNode.children.reverse()
          : currentNode.children;
        children.forEach((child) => {
          const cost =
            currentData.cost +
            (currentData.predata?.button === child.button ? 2 : 1);
          if (
            !visitedData.has(child.node) ||
            visitedData.get(child.node)!.cost > cost
          ) {
            queue.push({
              node: child.node,
              predata: { node: currentNode, button: child.button },
              cost,
            });
          }
        });
      }

      {
        let target: VisitedData = visitedData.get(goalNode)!;
        if (!target) return null;
        let path: { char: string; button: ButtonType }[] = [];
        while (target.predata) {
          path.push({
            char: target.node!.char,
            button: target.predata.button!,
          });
          target = visitedData.get(target.predata.node)!;
        }
        // ret.push({ char: start, button: ButtonType.A });

        const formatKana = (s: string) => {
          if (type === "katakana") return toKatakana(s);
          else return toHiragana(s);
        };
        path = path.map((p) => {
          return { char: formatKana(p.char), button: p.button };
        });
        if (changedType) path.push({ char: start, button: ButtonType.Select });
        path = path.reverse();
        path.push({ char: formatKana(goal), button: ButtonType.A });
        return {
          cost: visitedData.get(goalNode)?.cost || -1,
          path,
        };
      }
    };

    const result = bfs(false);
    const result2 = bfs(true);
    if (!result || !result2) return null;
    return result.cost < result2.cost ? result : result2;
  }
}

class Node {
  public children: { button: ButtonType; node: Node }[] = [];
  constructor(public char: string) {}

  public addChild(button: ButtonType, node: Node) {
    this.children.push({ button, node });
  }
}
