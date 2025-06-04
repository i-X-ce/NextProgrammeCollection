"use client";

import styles from "./style.module.css";

import CommonSection from "@/app/components/common/CommonSection";
import ProgramCard from "@/app/components/specific/top/ProgramCard";

export default function ProgramCardsSection() {
  return (
    <CommonSection title="プロダクト" fullHeight bg>
      <div className={styles.cards}>
        <ProgramCard
          key={"game-img-generator"}
          title="ゲーム機風イラスト"
          subTitle={"game-img-generator"}
          img="img/specific/top/card/game-img-generator.png"
          url={"./pages/game-img-generator"}
          description={"ゲーム機風のイラストを生成します。"}
          tags={["イラスト", "ツール", "Next.js"]}
          date={{ start: "2025-4", end: "2025-4" }}
          period="2週間"
          detailDescription="懐かしのゲーム機をモチーフにしたオリジナルイラストを作ってみませんか？「ゲーム機風イラスト」は、GB、GBP、GBC、GBA、GC、SFC、3DSといった歴代ゲーム機のイラストを自由にカスタマイズしてダウンロードできるツールです。本体の色を細かく変更できるだけでなく、背景の大きさや形も調整可能。作成したイラストはPNG、JPG、SVGのいずれかの形式で保存できます。個人のSNSアイコンやブログの挿絵など、様々な用途で活用できますが、ご利用の際は利用規約をよくお読みください。"
        />

        <ProgramCard
          key={"mapimg"}
          title="マップイメージ"
          subTitle={"mapimg"}
          img="img/specific/top/card/mapimg.png"
          url={"./pages/mapimg"}
          description={"ポケモンのマップを画像として表示します。"}
          tags={["ポケモン", "ツール", "Next.js"]}
          date={{ start: "2025-3", end: "2025-3" }}
          period="2週間"
          detailDescription="ポケモンの世界をより深く探索したい方に。「マップイメージ」は、ポケモンのマップを画像として表示し、自由にカスタマイズできるツールです。マップ上のスプライト（キャラクターやアイテムなど）を消したり表示したりできる他、パレットを変更してマップの雰囲気を変えることも可能。特定の場所の構造を確認したり、マップの詳細情報を確認したりできます。もちろん、作成したマップ画像はダウンロードできるので、資料作成や友人との共有にも活用いただけます。"
        />

        <ProgramCard
          key={"badappletas"}
          title="Bad Apple! TAS"
          subTitle="bad-Apple-TAS"
          img="img/specific/top/card/badappletas.png"
          url={"https://tasvideos.org/9565S"}
          description="「Bad Apple!」のTAS動画を作成しました。"
          tags={["ポケモン", "TAS", "lua", "ffmpeg", "Python"]}
          date={{ start: "2025-2", end: "2025-3" }}
          period="1ヶ月間"
          detailDescription="「Bad Apple!」のTAS動画を作成しました。ポケモンのバグを駆使して、初代ポケモンのゲーム内で「Bad Apple!」のアニメーションを再現しています。TAS（Tool-Assisted Speedrun）ならではの精密な操作と、ポケモンのバグを利用した手法で、まるでゲームがアニメーションを再生しているかのような映像を実現しました。制作にあたって、ffmpegやPythonを駆使して動画の編集やエンコードを行い、Luaスクリプトでポケモンの動きを細かく制御しています。"
        />

        <ProgramCard
          key={"hayamoji"}
          title="はやもじ"
          subTitle={"hayamoji"}
          img="img/specific/top/card/hayamoji.png"
          url={"./pages/hayamoji"}
          description={"初代ポケモンのキーボードでの最短経路を探します。"}
          tags={["ポケモン", "ツール", "Next.js"]}
          date={{ start: "2025-1", end: "2025-1" }}
          period="1週間"
          detailDescription="初代ポケモンのニックネーム入力、もっと効率的にしたいと思いませんか？「はやもじ」は、キーボード入力での最短経路を導き出すツールです。一般的なプレイヤー向けの人間用モードと、フレーム単位の最適化を目指すTAS向けのTAS用モードを選択可能。無駄な動きを省き、素早く、そして正確にニックネームを設定できるため、時間短縮にも繋がります。シンプルな操作で、あなたのポケモン育成をサポートします。"
        />

        <ProgramCard
          key={"bugpokequiz"}
          title="バグポケクイズ"
          subTitle={"bugpokequiz"}
          img="img/specific/top/card/bugpokequiz.png"
          imgpos2="center center"
          url={"https://bugpokequiz.vercel.app/"}
          description="ポケモンのバグに関するクイズを集めたサイトです。"
          tags={["ポケモン", "Webアプリ", "Next.js"]}
          date={{ start: "2024-8", end: "2025-1" }}
          period="5ヶ月間"
          detailDescription="ポケモンのバグに関するクイズを専門に扱うサイトです。デザインから開発、運営まで全て自ら手掛けています。特に、UIアニメーションや配色にはこだわり、楽しく快適にクイズを楽しめるよう工夫しました。サイトには面白いクイズを多数集めています。ポケモンにまつわる珍しいバグや、意外と知られていない現象に関するクイズなど、マニアックな問題が盛りだくさんです。ぜひ、あなたの知っているバグクイズをどんどん投稿して、サイトを一緒に盛り上げてください！"
        />

        <ProgramCard
          key={"chienozu"}
          title="知恵の図"
          subTitle={"chienozu"}
          img="img/specific/top/card/chienozu.png"
          imgpos2="center center"
          url={"https://unityroom.com/games/chienozu"}
          description="Unityで作成したパズルゲームです。"
          tags={["ゲーム制作", "C#", "Unity"]}
          date={{ start: "2024-8", end: "2025-8" }}
          period="1ヶ月間"
          detailDescription="「知恵の図」は、Unityで制作したパズルゲームです。プレイヤーはダイヤルやスイッチを動かし、バラバラになった図形を元の形へと近づけていきます。UIアニメーションやサウンドにもこだわり、操作するたびに心地よいフィードバックが得られます。全体的に落ち着いた配色で、ゆったりとリラックスして楽しめる、まさに「チルい」雰囲気のパズルゲームです。思考力を使いながらも、穏やかな時間を過ごしたい方におすすめです。"
        />

        <ProgramCard
          key="mypage"
          title="マイページ"
          subTitle="mypage"
          img="img/specific/top/card/mypage.png"
          url="https://i-x-ce.github.io/"
          description="初めて作成した自分のWebページです。"
          tags={["Webページ", "html", "css", "JavaScript"]}
          date={{ start: "2024-4" }}
          detailDescription="初めて作成した自分のWebページです。HTML、CSS、JavaScriptを使用して、シンプルながらも自分の情報を整理して掲載しています。まだGitHubの使い方にも慣れていなころに作ったので、コミットも内容も雑ですが、当時持っているすべての知識を持って作りました。初めてのレスポンシブ対応のWebページの作成でもありました。"
        />

        <ProgramCard
          key="gbemulator"
          title="GBエミュレーター"
          subTitle="gbemulator"
          img="img/specific/top/card/gbemulator.png"
          imgpos="center center"
          imgpos2="center center"
          description="ゲームボーイのエミュレーターを作成しました。"
          tags={["GB", "C#", "Unity"]}
          date={{ start: "2024-1", end: "2024-2" }}
          period="1ヶ月間"
          detailDescription="ゲームボーイのエミュレーターをUnityで作成しました。音声出力、通信機能までは実装できていませんが、ある程度GBのゲームが動きます。この経験によってC#とUnity、ゲームボーイへの理解がより一層深まり、今後の活動の役に立っています。アセンブリ言語の理解を見直すきっかけにもなりました。楽しかったです。"
        />

        <ProgramCard
          key="dotgamecollection"
          title="Dot Game Collection"
          subTitle="Dot Game Collection"
          img="img/specific/top/card/dotgamecollection.png"
          description="Processingで作成したドット絵ゲームのコレクションです。"
          tags={["ゲーム制作", "Processing"]}
          date={{ start: "2023-9", end: "2024-12" }}
          period="3ヶ月間"
          detailDescription="「Dot Game Collection」は、Processingを使用して制作したドット絵ゲームのコレクションです。各ゲームはシンプルながらもUIに工夫を加え、ユーザーに操作の心地よさを与えます。ドット絵の魅力を存分に引き出しています。操作は直感的で、誰でもすぐに楽しむことができます。ドット絵の温かみと、ゲームプレイの楽しさを両立させた作品群です。"
        />

        <ProgramCard
          key="rayblitz"
          title="Rayblitz"
          subTitle="Rayblitz"
          img="img/specific/top/card/rayblitz.png"
          description="初めてのUnityでのゲーム制作です。"
          tags={["ゲーム制作", "C#", "Unity"]}
          date={{ start: "2023-8", end: "2023-8" }}
          period="1ヶ月間"
          detailDescription="初めてUnityで開発したゲームです。サークルのゲームジャムで出された「1分間で遊べるゲーム」というお題に対し、プレイヤーを次々と襲う光線を1分間避け続けるシンプルなゲームを制作しました。Unityの基礎を学びながら、一つ一つの要素を丁寧に実装していきました。このゲームでは、いかにプレイヤーを飽きさせずに長く遊んでもらうかに工夫を凝らしています。1分間という短い時間ながらも、時を止めるアクションや、徐々にスパンが短くなる光線でプレイヤーを飽きさせないように調整しました。また、やり込み要素として実績システムを導入。特定条件を達成することで解除される実績は、プレイヤーの挑戦意欲を刺激し、「もう一度プレイしたい」と思わせる魅力になっています。"
        />

        <ProgramCard
          key={"youtube"}
          title="YouTube動画"
          subTitle={"YouTube"}
          img="img/specific/top/card/youtube.png"
          url={
            "https://youtube.com/channel/UCqMBNDLJeljK0eFKpHcMjEw?si=HAxg-H-OKlGAfD8u"
          }
          description="運営しているYouTubeチャンネルです。"
          tags={["ポケモン", "YouTube", "動画編集", "YMM4"]}
          date={{ start: "2021-6" }}
          detailDescription="運営するYouTubeチャンネルでは、初代ポケモンに特化した「バグ」と「任意コード実行」の世界を深く掘り下げています。単にバグを再現するだけでなく、なぜそのバグが発生するのか、どのようなメカニズムで成り立っているのかを多角的な視点から考察。ゲーム内の挙動からメモリの仕組み、さらにはプログラミング的な視点まで、幅広い角度からバグの「真の姿」を解き明かします。また、バグを利用してゲーム内で任意のプログラムを動かす「任意コード実行」にも注力。ポケモンが持つ可能性を最大限に引き出し、常識では考えられないようなプログラムを動かしたり、新たな遊び方を創造したりしています。まるでゲーム自体がプログラミングツールであるかのように、自由な発想でポケモンの世界を遊び尽くしています。視聴者の皆様には、単なるゲームプレイ動画では味わえない、知的好奇心を刺激するディープなポケモンの世界をお届けします。バグの奥深さ、任意コード実行の面白さを一緒に探求し、ポケモンの新たな魅力を発見していきましょう。"
        />
      </div>
    </CommonSection>
  );
}
