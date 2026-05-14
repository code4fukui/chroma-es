# chroma-es

> 日本語のREADMEはこちらです: [README.ja.md](README.ja.md)

An ES module port of the popular [Chroma.js](https://vis4.net/chromajs/) library for all kinds of color conversions and color scales. This version is designed for modern JavaScript environments like Deno and browsers that support ES modules.

## Features

-   **Modern ES Module**: Native support for `import` in browsers and Deno.
-   **Zero-Dependency**: Small and self-contained ([14.8kB minified](https://bundlephobia.com/result?p=chroma-js) for the full version).
-   **Comprehensive Color Conversions**: Supports RGB, HSL, HSV, Lab, LCh, HSI, HCG, CMYK, Oklab, Oklch, Hex, and named colors.
-   **Flexible Color Scales**: Create linear, logarithmic, or quantile scales with custom domains.
-   **Perceptually-Uniform Interpolation**: Use Lab, LCh, and Oklab color spaces for smoother, more accurate gradients.
-   **Lightweight Version**: Includes a `chroma-light.js` build for projects needing a smaller footprint.
-   **Rich Utilities**: Includes Color Brewer palettes, color blending, distance calculation, and contrast checking.

## Demo

-   [Luminance](https://code4fukui.github.io/chroma-es/test/html/luminance.html)
-   [Blend](https://code4fukui.github.io/chroma-es/test/html/blend.html)
-   [Bezier](https://code4fukui.github.io/chroma-es/test/html/bezier.html)
-   [Color Scales](https://code4fukui.github.io/chroma-es/test/html/colorscales.html)
-   [Cubehelix](https://code4fukui.github.io/chroma-es/test/html/cubehelix.html)

## Usage

You can import `chroma-es` directly from the CDN in any environment that supports ES modules.

### Full Version

The full version includes all color spaces and utilities.

```javascript
import chroma from 'https://code4fukui.github.io/chroma-es/index.js';
```

### Lightweight Version

For a smaller bundle size, the light version includes core color spaces (RGB, Hex, HSL, Lab, Oklab) and essential operations.

```javascript
import chroma from 'https://code4fukui.github.io/chroma-es/index-light.js';
```

## Examples

#### Manipulate Colors

```javascript
// Initiate and manipulate colors
chroma('#D4F880').darken().hex();  // #a1c550
```

#### Create Color Scales

```javascript
// Basic two-color scale
const scale = chroma.scale(['white', 'red']);
scale(0.5).hex(); // #FF7F7F

// Use a better interpolation mode for more perceptual gradients
chroma.scale(['white', 'red']).mode('lab');
```

#### Advanced Scales

```javascript
// Use Color Brewer palettes and map to data using quantiles
chroma.scale('RdYlBu').domain(myValues, 7, 'quantiles');

// Create a logarithmic scale
chroma.scale(['lightyellow', 'navy']).domain([1, 100000], 7, 'log');
```

## API Documentation

This library is a port and maintains API compatibility with the original Chroma.js. For a complete API reference, please see the official **[Chroma.js interactive documentation](http://gka.github.io/chroma.js/)**.

## Building from Source

To build the bundled and minified versions from source, you need [Deno](https://deno.land/) and [Terser](https://github.com/terser/terser) installed.

1.  Install Terser globally:
    ```bash
    npm install -g terser
    ```

2.  Run the build script:
    ```bash
    sh make.sh
    ```

## Credits

This project is an ES module version of the original [Chroma.js](https://vis4.net/chromajs/), created by [Gregor Aisch](http://driven-by-data.net).

## License

MIT License — see [LICENSE](LICENSE).