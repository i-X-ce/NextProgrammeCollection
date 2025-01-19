import TinyQueue from "tinyqueue";
import { mod } from "../../common/calc";
import { ButtonType } from "./ButtonType";
import { reverse } from "dns";

export class HayamojiSearch {
  private map: HayamojiMap = new HayamojiMap();

  public search(start: string, goal: string) {
    return this.map.bfsSearch(start, goal);
  }

  private string2array(str: string): string[] {
    let ret = str.split("").map((s) => {});
  }
}

class HayamojiMap {
  static readonly chars = [
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
    this.map = new Array(HayamojiMap.chars.length);
    for (let i = 0; i < HayamojiMap.chars.length; i++) {
      this.map[i] = new Array(HayamojiMap.chars[i].length);
      for (let j = 0; j < HayamojiMap.chars[i].length; j++) {
        this.map[i][j] = new Node(HayamojiMap.chars[i][j]);
        this.nodeMap.set(HayamojiMap.chars[i][j], this.map[i][j]);
      }
    }

    const kana: Node = new Node("かな");
    for (let i = 0; i < HayamojiMap.chars.length; i++) {
      for (let j = 0; j < HayamojiMap.chars[i].length; j++) {
        const target: Node = this.map[i][j];
        if (j > 0) {
          target.addChild(ButtonType.Up, this.map[i][j - 1]);
          this.map[i][j - 1].addChild(ButtonType.Down, target);
        } else {
          target.addChild(ButtonType.Up, kana);
        }
        target.addChild(
          ButtonType.Left,
          this.map[mod(i - 1, HayamojiMap.chars.length)][j]
        );
        this.map[mod(i - 1, HayamojiMap.chars.length)][j].addChild(
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
    goal: string
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
        let ret: { char: string; button: ButtonType }[] = [];
        while (target.predata) {
          ret.push({ char: target.node!.c, button: target.predata.button! });
          target = visitedData.get(target.predata.node)!;
        }
        // ret.push({ char: start, button: ButtonType.A });
        return {
          cost: visitedData.get(goalNode)?.cost || -1,
          path: ret.reverse(),
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
  constructor(public c: string) {}

  public addChild(button: ButtonType, node: Node) {
    this.children.push({ button, node });
  }
}
