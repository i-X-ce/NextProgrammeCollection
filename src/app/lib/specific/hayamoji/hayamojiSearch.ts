import { mod } from "../../common/calc";
import { ButtonType } from "./ButtonType";
import { pokemoji } from "../../common/pokemoji";
import { isKatakana, toHiragana, toKatakana } from "wanakana";

export class HayamojiSearch {
  private map: HayamojiMap = new HayamojiMap();
  public static readonly DAKUTEN_CONVERSION: { [key: string]: string } = {
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
  public static readonly HANDAKUTEN_CONVERSION: { [key: string]: string } = {
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

  public search(
    value: string,
    searchType: "HUMAN" | "TAS"
  ):
    | {
        goal: string;
        path: {
          char: string;
          button: ButtonType;
          name: string;
          isKata: boolean;
        }[];
      }[]
    | null {
    const array = this.string2array(value);
    if (!array) return null;
    const charList = ["ア"].concat(array);

    let name = "";
    const ret = [];
    let iskata = true;
    for (let i = 0; i < charList.length - 1; i++) {
      const startChar = charList[i];
      const endChar = charList[i + 1];
      let changedType = false;
      if (endChar !== "゛" && endChar !== "゜") {
        const preKata: boolean = iskata;
        if (!["リ", "ヘ", "ベ", "ペ", "ー", "　"].includes(toKatakana(endChar)))
          iskata = isKatakana(endChar);
        if (preKata != iskata) changedType = true;
      }

      const result = this.map.bfsSearch(
        name.length >= 5 ? "ED" : toKatakana(startChar),
        toKatakana(endChar),
        iskata ? "katakana" : "hiragana",
        changedType,
        name,
        searchType
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
      if (!result) return null;
      ret.push({ goal: charList[i + 1], path: result.path });
    }
    return ret;
  }

  private string2array(str: string): string[] | null {
    const formatRIHEBEPE: { [key: string]: string } = {
      り: "リ",
      へ: "ヘ",
      べ: "ベ",
      ぺ: "ペ",
      " ": "　",
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

    const ret = [];
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

export class HayamojiMap {
  public static readonly CHARS = [
    ["ア", "イ", "ウ", "エ", "オ", "ャ"],
    ["カ", "キ", "ク", "ケ", "コ", "ュ"],
    ["サ", "シ", "ス", "セ", "ソ", "ョ"],
    ["タ", "チ", "ツ", "テ", "ト", "ッ"],
    ["ナ", "ニ", "ヌ", "ネ", "ノ", "゛"],
    ["ハ", "ヒ", "フ", "ヘ", "ホ", "゜"],
    ["マ", "ミ", "ム", "メ", "モ", "ー"],
    ["ヤ", "ユ", "ヨ", "ワ", "ン", "　"],
    ["ラ", "リ", "ル", "レ", "ロ", "ED"],
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
        if (j >= HayamojiMap.CHARS[i].length - 1) {
          target.addChild(ButtonType.Down, kana);
        }
      }
    }
    kana.addChild(ButtonType.Down, this.nodeMap.get("ア")!);
    kana.addChild(ButtonType.Up, this.nodeMap.get("ャ")!);
  }

  public bfsSearch(
    start: string,
    goal: string,
    type: "katakana" | "hiragana",
    changedType: boolean,
    name: string,
    searchType: "HUMAN" | "TAS"
  ): {
    cost: number;
    path: { char: string; button: ButtonType; name: string; isKata: boolean }[];
  } | null {
    type PathData = {
      node: Node;
      button: ButtonType;
      name: string;
    };
    // map(通った場所)に使うデータ型
    type VisitedData = {
      node: Node | null;
      path: PathData[]; // どのボタンでどのノードから来たか
      cost: number;
    };

    // キーボードタイプに合わせて文字を変換する
    const formatKana = (s: string, kanatype: "katakana" | "hiragana") => {
      if (s === "ED" || s === "かな") return s;
      if (kanatype === "katakana") return toKatakana(s);
      else return toHiragana(s);
    };

    const addCost = searchType === "TAS" ? 2 : 1;

    const bfs = (
      reverse: boolean
    ): {
      cost: number;
      path: {
        char: string;
        button: ButtonType;
        name: string;
        isKata: boolean;
      }[];
    } | null => {
      const startNode: Node | undefined = this.nodeMap.get(start),
        goalNode: Node | undefined = this.nodeMap.get(goal);
      if (!startNode || !goalNode) return null;

      const queue: VisitedData[] = [{ node: startNode, path: [], cost: 0 }];

      const visitedData: Map<Node, VisitedData> = new Map();

      // 5文字未満の場合、Aを押してEnに戻った場合のパスまで計算する
      if (name.length < 5) {
        // ゛か゜かEnだったら、最初に上ボタンを押す
        const pushNode: Node =
          start === "゛" || start === "゜" || start === "ED"
            ? startNode.children.find((c) => c.button === ButtonType.Up)!.node
            : startNode;
        const beforePath: PathData[] =
          start === "゛" || start === "゜" || start === "ED"
            ? [
                {
                  node: pushNode,
                  button: ButtonType.Up,
                  name,
                },
              ]
            : [];
        // namesにはAボタンを押すたびにname + pushNode * 回数の文字が追加される
        let names: string[] = Array(5 - name.length)
          .fill("")
          .map((_, i) => {
            return name + formatKana(pushNode.char, type).repeat(i + 1);
          });

        const middlePath: PathData[] = names.map((n, i) => {
          return {
            node: i === names.length - 1 ? this.nodeMap.get("ED")! : pushNode,
            button: ButtonType.A,
            name: n,
          };
        });
        names.pop();
        names = names.reverse();
        names.push(name);
        const afterPath: PathData[] = names.map((n) => {
          return {
            node: this.nodeMap.get("ED")!,
            button: ButtonType.B,
            name: n,
          };
        });
        const path = beforePath.concat(middlePath, afterPath);
        let preButton: ButtonType | null = null;
        const cost = path.reduce((acc, cur) => {
          const add = cur.button === preButton ? addCost : 1;
          preButton = cur.button;
          return acc + add;
        }, 1);
        queue.push({
          node: this.nodeMap.get("ED")!,
          path,
          cost,
        });
      }

      visitedData.set(startNode, {
        cost: 0,
        node: startNode,
        path: [],
      });

      while (queue.length > 0) {
        const currentData: VisitedData = queue.pop()!;
        const currentNode: Node = currentData.node!;
        const pastData: VisitedData = visitedData.get(currentNode)!;
        if (pastData && currentData.cost > pastData.cost) continue;
        visitedData.set(currentNode, currentData);

        // if (currentNode === goalNode) break;

        const children = reverse
          ? [...currentNode.children].reverse()
          : [...currentNode.children];
        children.forEach((child) => {
          const cost =
            currentData.cost +
            (currentData.path.length > 0 &&
            currentData.path[currentData.path.length - 1].button ===
              child.button
              ? addCost
              : 1);
          if (
            !visitedData.has(child.node) ||
            visitedData.get(child.node)!.cost > cost
          ) {
            const newPath = currentData ? Array.from(currentData.path) : [];
            newPath.push({
              node: child.node,
              button: child.button,
              name: currentData.path[currentData.path.length - 1]?.name || name,
            });
            queue.push({
              node: child.node,
              path: newPath,
              cost,
            });
          }
        });
      }

      {
        const target: VisitedData = visitedData.get(goalNode)!;
        if (!target) return null;
        // パスの文字を変換する
        let path: {
          char: string;
          button: ButtonType;
          name: string;
          isKata: boolean;
        }[] = target.path.map((p) => {
          return {
            char: formatKana(p.node.char, type),
            button: p.button,
            name: p.name,
            isKata: type === "katakana",
          };
        });

        // path = path.map((p) => {
        //   return {
        //     char: formatKana(p.char, type),
        //     button: p.button,
        //     name: p.name,
        //     isKata: type === "katakana",
        //   };
        // });

        // キーボードの切り替え
        if (changedType)
          path = [
            {
              char: formatKana(
                start,
                type === "hiragana" ? "katakana" : "hiragana"
              ),
              button: ButtonType.Select,
              name,
              isKata: type === "katakana",
            },
          ].concat(path);

        // 最後にAボタンを押す
        let newName = name + formatKana(goal, type);
        if (goal === "゛" || goal === "゜") {
          newName = name.substring(0, name.length - 1);
          if (goal === "゛") {
            newName += HayamojiSearch.DAKUTEN_CONVERSION[name.at(-1)!];
          } else {
            newName += HayamojiSearch.HANDAKUTEN_CONVERSION[name.at(-1)!];
          }
        }
        const newChar = newName.length >= 5 ? "ED" : formatKana(goal, type);
        path.push({
          char: newChar,
          button: ButtonType.A,
          name: newName,
          isKata: type === "katakana",
        });
        return {
          cost: visitedData.get(goalNode)?.cost || -1,
          path,
        };
      }
    };

    const result = bfs(false);
    const result2 = bfs(true);
    if (!result || !result2) return null;
    if (result.cost < result2.cost) return result;
    else if (result.cost > result2.cost) return result2;
    else return result.path.length < result2.path.length ? result : result2;
  }
}

class Node {
  public children: { button: ButtonType; node: Node }[] = [];
  constructor(public char: string) {}

  public addChild(button: ButtonType, node: Node) {
    this.children.push({ button, node });
    this.children.sort((a, b) => b.button - a.button);
  }
}
