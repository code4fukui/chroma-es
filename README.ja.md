# chroma-es

あらゆる種類の色変換やカラースケールに対応した人気の [Chroma.js](https://vis4.net/chromajs/) ライブラリのESモジュール移植版です。このバージョンは、DenoやESモジュールをサポートするブラウザなど、モダンなJavaScript環境向けに設計されています。

## 機能

- **モダンなESモジュール**: ブラウザやDenoでの `import` をネイティブサポート。
- **ゼロ依存**: 軽量で自己完結型（フルバージョンで[14.8kB（Minify済み）](https://bundlephobia.com/result?p=chroma-js)）。
- **包括的な色変換**: RGB、HSL、HSV、Lab、LCh、HSI、HCG、CMYK、Oklab、Oklch、Hex、および名前付き色（Named colors）をサポート。
- **柔軟なカラースケール**: カスタムドメインを使用して、線形、対数、または分位（quantile）スケールを作成可能。
- **知覚的に均一な補間**: Lab、LCh、Oklab色空間を使用して、より滑らかで正確なグラデーションを実現。
- **軽量版**: より小さなフットプリントを必要とするプロジェクト向けに `chroma-light.js` ビルドを同梱。
- **豊富なユーティリティ**: Color Brewerパレット、色のブレンド、距離計算、コントラストチェック機能を搭載。

## デモ

- [Luminance](https://code4fukui.github.io/chroma-es/test/html/luminance.html)
- [Blend](https://code4fukui.github.io/chroma-es/test/html/blend.html)
- [Bezier](https://code4fukui.github.io/chroma-es/test/html/bezier.html)
- [Color Scales](https://code4fukui.github.io/chroma-es/test/html/colorscales.html)
- [Cubehelix](https://code4fukui.github.io/chroma-es/test/html/cubehelix.html)

## 使い方

ESモジュールをサポートする環境であれば、CDNから直接 `chroma-es` をインポートできます。

### フルバージョン

フルバージョンには、すべての色空間とユーティリティが含まれています。

```javascript
import chroma from 'https://code4fukui.github.io/chroma-es/index.js';
```

### 軽量版

バンドルサイズを小さく抑えたい場合向けに、コアとなる色空間（RGB、Hex、HSL、Lab、Oklab）と必須の操作のみを含んだ軽量版を利用できます。

```javascript
import chroma from 'https://code4fukui.github.io/chroma-es/index-light.js';
```

## 例

#### 色の操作

```javascript
// 色の初期化と操作
chroma('#D4F880').darken().hex();  // #a1c550
```

#### カラースケールの作成

```javascript
// 基本的な2色のスケール
const scale = chroma.scale(['white', 'red']);
scale(0.5).hex(); // #FF7F7F

// より知覚的に優れたグラデーションにするため、補間モードを変更
chroma.scale(['white', 'red']).mode('lab');
```

#### 高度なスケール

```javascript
// Color Brewerのパレットを使用し、分位（quantiles）に基づいてデータにマッピング
chroma.scale('RdYlBu').domain(myValues, 7, 'quantiles');

// 対数スケールの作成
chroma.scale(['lightyellow', 'navy']).domain([1, 100000], 7, 'log');
```

## APIドキュメント

本ライブラリは移植版であり、オリジナルのChroma.jsとのAPI互換性を維持しています。完全なAPIリファレンスについては、公式の**[Chroma.jsインタラクティブドキュメント](http://gka.github.io/chroma.js/)**を参照してください。

## ソースからのビルド

ソースからバンドルおよびMinifyされたバージョンをビルドするには、[Deno](https://deno.land/)と[Terser](https://github.com/terser/terser)がインストールされている必要があります。

1. Terserをグローバルにインストールします:
    ```bash
    npm install -g terser
    ```

2. ビルドスクリプトを実行します:
    ```bash
    sh make.sh
    ```

## クレジット

このプロジェクトは、[Gregor Aisch](http://driven-by-data.net)氏によって作成されたオリジナルの[Chroma.js](https://vis4.net/chromajs/)のESモジュール版です。

## ライセンス

MIT License — [LICENSE](LICENSE)を参照してください。
