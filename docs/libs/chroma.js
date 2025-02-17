// deno-fmt-ignore-file
// deno-lint-ignore-file
// This code was bundled using `deno bundle` and it's not recommended to edit it manually

const __default = (x, min = 0, max = 1)=>{
    return x < min ? min : x > max ? max : x;
};
const __default1 = (rgb)=>{
    rgb._clipped = false;
    rgb._unclipped = rgb.slice(0);
    for(let i = 0; i <= 3; i++){
        if (i < 3) {
            if (rgb[i] < 0 || rgb[i] > 255) rgb._clipped = true;
            rgb[i] = __default(rgb[i], 0, 255);
        } else if (i === 3) {
            rgb[i] = __default(rgb[i], 0, 1);
        }
    }
    return rgb;
};
const classToType = {};
for (let name of [
    'Boolean',
    'Number',
    'String',
    'Function',
    'Array',
    'Date',
    'RegExp',
    'Undefined',
    'Null'
]){
    classToType[`[object ${name}]`] = name.toLowerCase();
}
function __default2(obj) {
    return classToType[Object.prototype.toString.call(obj)] || "object";
}
const __default3 = (args, keyOrder = null)=>{
    if (args.length >= 3) return Array.prototype.slice.call(args);
    if (__default2(args[0]) == 'object' && keyOrder) {
        return keyOrder.split('').filter((k)=>args[0][k] !== undefined).map((k)=>args[0][k]);
    }
    return args[0];
};
const __default4 = (args)=>{
    if (args.length < 2) return null;
    const l = args.length - 1;
    if (__default2(args[l]) == 'string') return args[l].toLowerCase();
    return null;
};
const PI = Math.PI;
const TWOPI = PI * 2;
const PITHIRD = PI / 3;
const DEG2RAD = PI / 180;
const RAD2DEG = 180 / PI;
const __default5 = {
    format: {},
    autodetect: []
};
class Color {
    constructor(...args){
        const me = this;
        if (__default2(args[0]) === 'object' && args[0].constructor && args[0].constructor === this.constructor) {
            return args[0];
        }
        let mode = __default4(args);
        let autodetect = false;
        if (!mode) {
            autodetect = true;
            if (!__default5.sorted) {
                __default5.autodetect = __default5.autodetect.sort((a, b)=>b.p - a.p);
                __default5.sorted = true;
            }
            for (let chk of __default5.autodetect){
                mode = chk.test(...args);
                if (mode) break;
            }
        }
        if (__default5.format[mode]) {
            const rgb = __default5.format[mode].apply(null, autodetect ? args : args.slice(0, -1));
            me._rgb = __default1(rgb);
        } else {
            throw new Error('unknown format: ' + args);
        }
        if (me._rgb.length === 3) me._rgb.push(1);
    }
    toString() {
        if (__default2(this.hex) == 'function') return this.hex();
        return `[${this._rgb.join(',')}]`;
    }
}
const chroma = (...args)=>{
    return new chroma.Color(...args);
};
chroma.Color = Color;
chroma.version = '@@version';
const { max  } = Math;
const rgb2cmyk = (...args)=>{
    let [r, g, b] = __default3(args, 'rgb');
    r = r / 255;
    g = g / 255;
    b = b / 255;
    const k = 1 - max(r, max(g, b));
    const f = k < 1 ? 1 / (1 - k) : 0;
    const c = (1 - r - k) * f;
    const m = (1 - g - k) * f;
    const y = (1 - b - k) * f;
    return [
        c,
        m,
        y,
        k
    ];
};
const cmyk2rgb = (...args)=>{
    args = __default3(args, 'cmyk');
    const [c, m, y, k] = args;
    const alpha = args.length > 4 ? args[4] : 1;
    if (k === 1) return [
        0,
        0,
        0,
        alpha
    ];
    return [
        c >= 1 ? 0 : 255 * (1 - c) * (1 - k),
        m >= 1 ? 0 : 255 * (1 - m) * (1 - k),
        y >= 1 ? 0 : 255 * (1 - y) * (1 - k),
        alpha
    ];
};
Color.prototype.cmyk = function() {
    return rgb2cmyk(this._rgb);
};
chroma.cmyk = (...args)=>new Color(...args, 'cmyk');
__default5.format.cmyk = cmyk2rgb;
__default5.autodetect.push({
    p: 2,
    test: (...args)=>{
        args = __default3(args, 'cmyk');
        if (__default2(args) === 'array' && args.length === 4) {
            return 'cmyk';
        }
    }
});
const rnd = (a)=>Math.round(a * 100) / 100;
const hsl2css = (...args)=>{
    const hsla = __default3(args, 'hsla');
    let mode = __default4(args) || 'lsa';
    hsla[0] = rnd(hsla[0] || 0);
    hsla[1] = rnd(hsla[1] * 100) + '%';
    hsla[2] = rnd(hsla[2] * 100) + '%';
    if (mode === 'hsla' || hsla.length > 3 && hsla[3] < 1) {
        hsla[3] = hsla.length > 3 ? hsla[3] : 1;
        mode = 'hsla';
    } else {
        hsla.length = 3;
    }
    return `${mode}(${hsla.join(',')})`;
};
const rgb2hsl = (...args)=>{
    args = __default3(args, 'rgba');
    let [r, g, b] = args;
    r /= 255;
    g /= 255;
    b /= 255;
    const min = Math.min(r, g, b);
    const max = Math.max(r, g, b);
    const l = (max + min) / 2;
    let s, h;
    if (max === min) {
        s = 0;
        h = Number.NaN;
    } else {
        s = l < 0.5 ? (max - min) / (max + min) : (max - min) / (2 - max - min);
    }
    if (r == max) h = (g - b) / (max - min);
    else if (g == max) h = 2 + (b - r) / (max - min);
    else if (b == max) h = 4 + (r - g) / (max - min);
    h *= 60;
    if (h < 0) h += 360;
    if (args.length > 3 && args[3] !== undefined) return [
        h,
        s,
        l,
        args[3]
    ];
    return [
        h,
        s,
        l
    ];
};
const { round  } = Math;
const rgb2css = (...args)=>{
    const rgba = __default3(args, 'rgba');
    let mode = __default4(args) || 'rgb';
    if (mode.substr(0, 3) == 'hsl') {
        return hsl2css(rgb2hsl(rgba), mode);
    }
    rgba[0] = round(rgba[0]);
    rgba[1] = round(rgba[1]);
    rgba[2] = round(rgba[2]);
    if (mode === 'rgba' || rgba.length > 3 && rgba[3] < 1) {
        rgba[3] = rgba.length > 3 ? rgba[3] : 1;
        mode = 'rgba';
    }
    return `${mode}(${rgba.slice(0, mode === 'rgb' ? 3 : 4).join(',')})`;
};
const { round: round1  } = Math;
const hsl2rgb = (...args)=>{
    args = __default3(args, 'hsl');
    const [h, s, l] = args;
    let r, g, b;
    if (s === 0) {
        r = g = b = l * 255;
    } else {
        const t3 = [
            0,
            0,
            0
        ];
        const c = [
            0,
            0,
            0
        ];
        const t2 = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const t1 = 2 * l - t2;
        const h_ = h / 360;
        t3[0] = h_ + 1 / 3;
        t3[1] = h_;
        t3[2] = h_ - 1 / 3;
        for(let i = 0; i < 3; i++){
            if (t3[i] < 0) t3[i] += 1;
            if (t3[i] > 1) t3[i] -= 1;
            if (6 * t3[i] < 1) c[i] = t1 + (t2 - t1) * 6 * t3[i];
            else if (2 * t3[i] < 1) c[i] = t2;
            else if (3 * t3[i] < 2) c[i] = t1 + (t2 - t1) * (2 / 3 - t3[i]) * 6;
            else c[i] = t1;
        }
        [r, g, b] = [
            round1(c[0] * 255),
            round1(c[1] * 255),
            round1(c[2] * 255)
        ];
    }
    if (args.length > 3) {
        return [
            r,
            g,
            b,
            args[3]
        ];
    }
    return [
        r,
        g,
        b,
        1
    ];
};
const RE_RGB = /^rgb\(\s*(-?\d+),\s*(-?\d+)\s*,\s*(-?\d+)\s*\)$/;
const RE_RGBA = /^rgba\(\s*(-?\d+),\s*(-?\d+)\s*,\s*(-?\d+)\s*,\s*([01]|[01]?\.\d+)\)$/;
const RE_RGB_PCT = /^rgb\(\s*(-?\d+(?:\.\d+)?)%,\s*(-?\d+(?:\.\d+)?)%\s*,\s*(-?\d+(?:\.\d+)?)%\s*\)$/;
const RE_RGBA_PCT = /^rgba\(\s*(-?\d+(?:\.\d+)?)%,\s*(-?\d+(?:\.\d+)?)%\s*,\s*(-?\d+(?:\.\d+)?)%\s*,\s*([01]|[01]?\.\d+)\)$/;
const RE_HSL = /^hsl\(\s*(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)%\s*,\s*(-?\d+(?:\.\d+)?)%\s*\)$/;
const RE_HSLA = /^hsla\(\s*(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)%\s*,\s*(-?\d+(?:\.\d+)?)%\s*,\s*([01]|[01]?\.\d+)\)$/;
const { round: round2  } = Math;
const css2rgb = (css)=>{
    css = css.toLowerCase().trim();
    let m;
    if (__default5.format.named) {
        try {
            return __default5.format.named(css);
        } catch (e) {}
    }
    if (m = css.match(RE_RGB)) {
        const rgb = m.slice(1, 4);
        for(let i = 0; i < 3; i++){
            rgb[i] = +rgb[i];
        }
        rgb[3] = 1;
        return rgb;
    }
    if (m = css.match(RE_RGBA)) {
        const rgb1 = m.slice(1, 5);
        for(let i1 = 0; i1 < 4; i1++){
            rgb1[i1] = +rgb1[i1];
        }
        return rgb1;
    }
    if (m = css.match(RE_RGB_PCT)) {
        const rgb2 = m.slice(1, 4);
        for(let i2 = 0; i2 < 3; i2++){
            rgb2[i2] = round2(rgb2[i2] * 2.55);
        }
        rgb2[3] = 1;
        return rgb2;
    }
    if (m = css.match(RE_RGBA_PCT)) {
        const rgb3 = m.slice(1, 5);
        for(let i3 = 0; i3 < 3; i3++){
            rgb3[i3] = round2(rgb3[i3] * 2.55);
        }
        rgb3[3] = +rgb3[3];
        return rgb3;
    }
    if (m = css.match(RE_HSL)) {
        const hsl = m.slice(1, 4);
        hsl[1] *= 0.01;
        hsl[2] *= 0.01;
        const rgb4 = hsl2rgb(hsl);
        rgb4[3] = 1;
        return rgb4;
    }
    if (m = css.match(RE_HSLA)) {
        const hsl1 = m.slice(1, 4);
        hsl1[1] *= 0.01;
        hsl1[2] *= 0.01;
        const rgb5 = hsl2rgb(hsl1);
        rgb5[3] = +m[4];
        return rgb5;
    }
};
css2rgb.test = (s)=>{
    return RE_RGB.test(s) || RE_RGBA.test(s) || RE_RGB_PCT.test(s) || RE_RGBA_PCT.test(s) || RE_HSL.test(s) || RE_HSLA.test(s);
};
Color.prototype.css = function(mode) {
    return rgb2css(this._rgb, mode);
};
chroma.css = (...args)=>new Color(...args, 'css');
__default5.format.css = css2rgb;
__default5.autodetect.push({
    p: 5,
    test: (h, ...rest)=>{
        if (!rest.length && __default2(h) === 'string' && css2rgb.test(h)) {
            return 'css';
        }
    }
});
__default5.format.gl = (...args)=>{
    const rgb = __default3(args, 'rgba');
    rgb[0] *= 255;
    rgb[1] *= 255;
    rgb[2] *= 255;
    return rgb;
};
chroma.gl = (...args)=>new Color(...args, 'gl');
Color.prototype.gl = function() {
    const rgb = this._rgb;
    return [
        rgb[0] / 255,
        rgb[1] / 255,
        rgb[2] / 255,
        rgb[3]
    ];
};
const rgb2hcg = (...args)=>{
    const [r, g, b] = __default3(args, 'rgb').map((x)=>x / 255);
    const min = Math.min(r, g, b);
    const max = Math.max(r, g, b);
    const delta = max - min;
    const _g = min / (1 - delta);
    let h;
    if (delta === 0) {
        h = Number.NaN;
    } else {
        if (r === max) h = (g - b) / delta;
        if (g === max) h = 2 + (b - r) / delta;
        if (b === max) h = 4 + (r - g) / delta;
        h *= 60;
        if (h < 0) h += 360;
    }
    return [
        h,
        delta,
        _g
    ];
};
const { floor  } = Math;
const hcg2rgb = (...args)=>{
    args = __default3(args, 'hcg');
    let [h, c, _g] = args;
    let r, g, b;
    _g = _g * 255;
    const _c = c * 255;
    if (c === 0) {
        r = g = b = _g;
    } else {
        if (h === 360) h = 0;
        if (h > 360) h -= 360;
        if (h < 0) h += 360;
        h /= 60;
        const i = floor(h);
        const f = h - i;
        const p = _g * (1 - c);
        const q = p + _c * (1 - f);
        const t = p + _c * f;
        const v = p + _c;
        switch(i){
            case 0:
                [r, g, b] = [
                    v,
                    t,
                    p
                ];
                break;
            case 1:
                [r, g, b] = [
                    q,
                    v,
                    p
                ];
                break;
            case 2:
                [r, g, b] = [
                    p,
                    v,
                    t
                ];
                break;
            case 3:
                [r, g, b] = [
                    p,
                    q,
                    v
                ];
                break;
            case 4:
                [r, g, b] = [
                    t,
                    p,
                    v
                ];
                break;
            case 5:
                [r, g, b] = [
                    v,
                    p,
                    q
                ];
                break;
        }
    }
    return [
        r,
        g,
        b,
        args.length > 3 ? args[3] : 1
    ];
};
Color.prototype.hcg = function() {
    return rgb2hcg(this._rgb);
};
chroma.hcg = (...args)=>new Color(...args, 'hcg');
__default5.format.hcg = hcg2rgb;
__default5.autodetect.push({
    p: 1,
    test: (...args)=>{
        args = __default3(args, 'hcg');
        if (__default2(args) === 'array' && args.length === 3) {
            return 'hcg';
        }
    }
});
const { round: round3  } = Math;
const rgb2hex = (...args)=>{
    let [r, g, b, a] = __default3(args, 'rgba');
    let mode = __default4(args) || 'auto';
    if (a === undefined) a = 1;
    if (mode === 'auto') {
        mode = a < 1 ? 'rgba' : 'rgb';
    }
    r = round3(r);
    g = round3(g);
    b = round3(b);
    const u = r << 16 | g << 8 | b;
    let str = "000000" + u.toString(16);
    str = str.substr(str.length - 6);
    let hxa = '0' + round3(a * 255).toString(16);
    hxa = hxa.substr(hxa.length - 2);
    switch(mode.toLowerCase()){
        case 'rgba':
            return `#${str}${hxa}`;
        case 'argb':
            return `#${hxa}${str}`;
        default:
            return `#${str}`;
    }
};
const RE_HEX = /^#?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
const RE_HEXA = /^#?([A-Fa-f0-9]{8}|[A-Fa-f0-9]{4})$/;
const hex2rgb = (hex)=>{
    if (hex.match(RE_HEX)) {
        if (hex.length === 4 || hex.length === 7) {
            hex = hex.substr(1);
        }
        if (hex.length === 3) {
            hex = hex.split('');
            hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
        }
        const u = parseInt(hex, 16);
        const r = u >> 16;
        const g = u >> 8 & 0xFF;
        const b = u & 0xFF;
        return [
            r,
            g,
            b,
            1
        ];
    }
    if (hex.match(RE_HEXA)) {
        if (hex.length === 5 || hex.length === 9) {
            hex = hex.substr(1);
        }
        if (hex.length === 4) {
            hex = hex.split('');
            hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
        }
        const u1 = parseInt(hex, 16);
        const r1 = u1 >> 24 & 0xFF;
        const g1 = u1 >> 16 & 0xFF;
        const b1 = u1 >> 8 & 0xFF;
        const a = Math.round((u1 & 0xFF) / 0xFF * 100) / 100;
        return [
            r1,
            g1,
            b1,
            a
        ];
    }
    throw new Error(`unknown hex color: ${hex}`);
};
Color.prototype.hex = function(mode) {
    return rgb2hex(this._rgb, mode);
};
chroma.hex = (...args)=>new Color(...args, 'hex');
__default5.format.hex = hex2rgb;
__default5.autodetect.push({
    p: 4,
    test: (h, ...rest)=>{
        if (!rest.length && __default2(h) === 'string' && [
            3,
            4,
            5,
            6,
            7,
            8,
            9
        ].indexOf(h.length) >= 0) {
            return 'hex';
        }
    }
});
const { min , sqrt , acos  } = Math;
const rgb2hsi = (...args)=>{
    let [r, g, b] = __default3(args, 'rgb');
    r /= 255;
    g /= 255;
    b /= 255;
    let h;
    const min_ = min(r, g, b);
    const i = (r + g + b) / 3;
    const s = i > 0 ? 1 - min_ / i : 0;
    if (s === 0) {
        h = NaN;
    } else {
        h = (r - g + (r - b)) / 2;
        h /= sqrt((r - g) * (r - g) + (r - b) * (g - b));
        h = acos(h);
        if (b > g) {
            h = TWOPI - h;
        }
        h /= TWOPI;
    }
    return [
        h * 360,
        s,
        i
    ];
};
const { cos  } = Math;
const hsi2rgb = (...args)=>{
    args = __default3(args, 'hsi');
    let [h, s, i] = args;
    let r, g, b;
    if (isNaN(h)) h = 0;
    if (isNaN(s)) s = 0;
    if (h > 360) h -= 360;
    if (h < 0) h += 360;
    h /= 360;
    if (h < 1 / 3) {
        b = (1 - s) / 3;
        r = (1 + s * cos(TWOPI * h) / cos(PITHIRD - TWOPI * h)) / 3;
        g = 1 - (b + r);
    } else if (h < 2 / 3) {
        h -= 1 / 3;
        r = (1 - s) / 3;
        g = (1 + s * cos(TWOPI * h) / cos(PITHIRD - TWOPI * h)) / 3;
        b = 1 - (r + g);
    } else {
        h -= 2 / 3;
        g = (1 - s) / 3;
        b = (1 + s * cos(TWOPI * h) / cos(PITHIRD - TWOPI * h)) / 3;
        r = 1 - (g + b);
    }
    r = __default(i * r * 3);
    g = __default(i * g * 3);
    b = __default(i * b * 3);
    return [
        r * 255,
        g * 255,
        b * 255,
        args.length > 3 ? args[3] : 1
    ];
};
Color.prototype.hsi = function() {
    return rgb2hsi(this._rgb);
};
chroma.hsi = (...args)=>new Color(...args, 'hsi');
__default5.format.hsi = hsi2rgb;
__default5.autodetect.push({
    p: 2,
    test: (...args)=>{
        args = __default3(args, 'hsi');
        if (__default2(args) === 'array' && args.length === 3) {
            return 'hsi';
        }
    }
});
Color.prototype.hsl = function() {
    return rgb2hsl(this._rgb);
};
chroma.hsl = (...args)=>new Color(...args, 'hsl');
__default5.format.hsl = hsl2rgb;
__default5.autodetect.push({
    p: 2,
    test: (...args)=>{
        args = __default3(args, 'hsl');
        if (__default2(args) === 'array' && args.length === 3) {
            return 'hsl';
        }
    }
});
const { min: min1 , max: max1  } = Math;
const rgb2hsl1 = (...args)=>{
    args = __default3(args, 'rgb');
    let [r, g, b] = args;
    const min_ = min1(r, g, b);
    const max_ = max1(r, g, b);
    const delta = max_ - min_;
    let h, s, v;
    v = max_ / 255.0;
    if (max_ === 0) {
        h = Number.NaN;
        s = 0;
    } else {
        s = delta / max_;
        if (r === max_) h = (g - b) / delta;
        if (g === max_) h = 2 + (b - r) / delta;
        if (b === max_) h = 4 + (r - g) / delta;
        h *= 60;
        if (h < 0) h += 360;
    }
    return [
        h,
        s,
        v
    ];
};
const { floor: floor1  } = Math;
const hsv2rgb = (...args)=>{
    args = __default3(args, 'hsv');
    let [h, s, v] = args;
    let r, g, b;
    v *= 255;
    if (s === 0) {
        r = g = b = v;
    } else {
        if (h === 360) h = 0;
        if (h > 360) h -= 360;
        if (h < 0) h += 360;
        h /= 60;
        const i = floor1(h);
        const f = h - i;
        const p = v * (1 - s);
        const q = v * (1 - s * f);
        const t = v * (1 - s * (1 - f));
        switch(i){
            case 0:
                [r, g, b] = [
                    v,
                    t,
                    p
                ];
                break;
            case 1:
                [r, g, b] = [
                    q,
                    v,
                    p
                ];
                break;
            case 2:
                [r, g, b] = [
                    p,
                    v,
                    t
                ];
                break;
            case 3:
                [r, g, b] = [
                    p,
                    q,
                    v
                ];
                break;
            case 4:
                [r, g, b] = [
                    t,
                    p,
                    v
                ];
                break;
            case 5:
                [r, g, b] = [
                    v,
                    p,
                    q
                ];
                break;
        }
    }
    return [
        r,
        g,
        b,
        args.length > 3 ? args[3] : 1
    ];
};
Color.prototype.hsv = function() {
    return rgb2hsl1(this._rgb);
};
chroma.hsv = (...args)=>new Color(...args, 'hsv');
__default5.format.hsv = hsv2rgb;
__default5.autodetect.push({
    p: 2,
    test: (...args)=>{
        args = __default3(args, 'hsv');
        if (__default2(args) === 'array' && args.length === 3) {
            return 'hsv';
        }
    }
});
const __default6 = {
    Kn: 18,
    Xn: 0.950470,
    Yn: 1,
    Zn: 1.088830,
    t0: 0.137931034,
    t1: 0.206896552,
    t2: 0.12841855,
    t3: 0.008856452
};
const { pow  } = Math;
const rgb2lab = (...args)=>{
    const [r, g, b] = __default3(args, 'rgb');
    const [x, y, z] = rgb2xyz(r, g, b);
    const l = 116 * y - 16;
    return [
        l < 0 ? 0 : l,
        500 * (x - y),
        200 * (y - z)
    ];
};
const rgb_xyz = (r)=>{
    if ((r /= 255) <= 0.04045) return r / 12.92;
    return pow((r + 0.055) / 1.055, 2.4);
};
const xyz_lab = (t)=>{
    if (t > __default6.t3) return pow(t, 1 / 3);
    return t / __default6.t2 + __default6.t0;
};
const rgb2xyz = (r, g, b)=>{
    r = rgb_xyz(r);
    g = rgb_xyz(g);
    b = rgb_xyz(b);
    const x = xyz_lab((0.4124564 * r + 0.3575761 * g + 0.1804375 * b) / __default6.Xn);
    const y = xyz_lab((0.2126729 * r + 0.7151522 * g + 0.0721750 * b) / __default6.Yn);
    const z = xyz_lab((0.0193339 * r + 0.1191920 * g + 0.9503041 * b) / __default6.Zn);
    return [
        x,
        y,
        z
    ];
};
const { pow: pow1  } = Math;
const lab2rgb = (...args)=>{
    args = __default3(args, 'lab');
    const [l, a, b] = args;
    let x, y, z, r, g, b_;
    y = (l + 16) / 116;
    x = isNaN(a) ? y : y + a / 500;
    z = isNaN(b) ? y : y - b / 200;
    y = __default6.Yn * lab_xyz(y);
    x = __default6.Xn * lab_xyz(x);
    z = __default6.Zn * lab_xyz(z);
    r = xyz_rgb(3.2404542 * x - 1.5371385 * y - 0.4985314 * z);
    g = xyz_rgb(-0.9692660 * x + 1.8760108 * y + 0.0415560 * z);
    b_ = xyz_rgb(0.0556434 * x - 0.2040259 * y + 1.0572252 * z);
    return [
        r,
        g,
        b_,
        args.length > 3 ? args[3] : 1
    ];
};
const xyz_rgb = (r)=>{
    return 255 * (r <= 0.00304 ? 12.92 * r : 1.055 * pow1(r, 1 / 2.4) - 0.055);
};
const lab_xyz = (t)=>{
    return t > __default6.t1 ? t * t * t : __default6.t2 * (t - __default6.t0);
};
Color.prototype.lab = function() {
    return rgb2lab(this._rgb);
};
chroma.lab = (...args)=>new Color(...args, 'lab');
__default5.format.lab = lab2rgb;
__default5.autodetect.push({
    p: 2,
    test: (...args)=>{
        args = __default3(args, 'lab');
        if (__default2(args) === 'array' && args.length === 3) {
            return 'lab';
        }
    }
});
const { sqrt: sqrt1 , atan2 , round: round4  } = Math;
const lab2lch = (...args)=>{
    const [l, a, b] = __default3(args, 'lab');
    const c = sqrt1(a * a + b * b);
    let h = (atan2(b, a) * RAD2DEG + 360) % 360;
    if (round4(c * 10000) === 0) h = Number.NaN;
    return [
        l,
        c,
        h
    ];
};
const rgb2lch = (...args)=>{
    const [r, g, b] = __default3(args, 'rgb');
    const [l, a, b_] = rgb2lab(r, g, b);
    return lab2lch(l, a, b_);
};
const { sin , cos: cos1  } = Math;
const lch2lab = (...args)=>{
    let [l, c, h] = __default3(args, 'lch');
    if (isNaN(h)) h = 0;
    h = h * DEG2RAD;
    return [
        l,
        cos1(h) * c,
        sin(h) * c
    ];
};
const lch2rgb = (...args)=>{
    args = __default3(args, 'lch');
    const [l, c, h] = args;
    const [L, a, b_] = lch2lab(l, c, h);
    const [r, g, b] = lab2rgb(L, a, b_);
    return [
        r,
        g,
        b,
        args.length > 3 ? args[3] : 1
    ];
};
const hcl2rgb = (...args)=>{
    const hcl = __default3(args, 'hcl').reverse();
    return lch2rgb(...hcl);
};
Color.prototype.lch = function() {
    return rgb2lch(this._rgb);
};
Color.prototype.hcl = function() {
    return rgb2lch(this._rgb).reverse();
};
chroma.lch = (...args)=>new Color(...args, 'lch');
chroma.hcl = (...args)=>new Color(...args, 'hcl');
__default5.format.lch = lch2rgb;
__default5.format.hcl = hcl2rgb;
[
    'lch',
    'hcl'
].forEach((m)=>__default5.autodetect.push({
        p: 2,
        test: (...args)=>{
            args = __default3(args, m);
            if (__default2(args) === 'array' && args.length === 3) {
                return m;
            }
        }
    }));
const w3cx11 = {
    aliceblue: '#f0f8ff',
    antiquewhite: '#faebd7',
    aqua: '#00ffff',
    aquamarine: '#7fffd4',
    azure: '#f0ffff',
    beige: '#f5f5dc',
    bisque: '#ffe4c4',
    black: '#000000',
    blanchedalmond: '#ffebcd',
    blue: '#0000ff',
    blueviolet: '#8a2be2',
    brown: '#a52a2a',
    burlywood: '#deb887',
    cadetblue: '#5f9ea0',
    chartreuse: '#7fff00',
    chocolate: '#d2691e',
    coral: '#ff7f50',
    cornflowerblue: '#6495ed',
    cornsilk: '#fff8dc',
    crimson: '#dc143c',
    cyan: '#00ffff',
    darkblue: '#00008b',
    darkcyan: '#008b8b',
    darkgoldenrod: '#b8860b',
    darkgray: '#a9a9a9',
    darkgreen: '#006400',
    darkgrey: '#a9a9a9',
    darkkhaki: '#bdb76b',
    darkmagenta: '#8b008b',
    darkolivegreen: '#556b2f',
    darkorange: '#ff8c00',
    darkorchid: '#9932cc',
    darkred: '#8b0000',
    darksalmon: '#e9967a',
    darkseagreen: '#8fbc8f',
    darkslateblue: '#483d8b',
    darkslategray: '#2f4f4f',
    darkslategrey: '#2f4f4f',
    darkturquoise: '#00ced1',
    darkviolet: '#9400d3',
    deeppink: '#ff1493',
    deepskyblue: '#00bfff',
    dimgray: '#696969',
    dimgrey: '#696969',
    dodgerblue: '#1e90ff',
    firebrick: '#b22222',
    floralwhite: '#fffaf0',
    forestgreen: '#228b22',
    fuchsia: '#ff00ff',
    gainsboro: '#dcdcdc',
    ghostwhite: '#f8f8ff',
    gold: '#ffd700',
    goldenrod: '#daa520',
    gray: '#808080',
    green: '#008000',
    greenyellow: '#adff2f',
    grey: '#808080',
    honeydew: '#f0fff0',
    hotpink: '#ff69b4',
    indianred: '#cd5c5c',
    indigo: '#4b0082',
    ivory: '#fffff0',
    khaki: '#f0e68c',
    laserlemon: '#ffff54',
    lavender: '#e6e6fa',
    lavenderblush: '#fff0f5',
    lawngreen: '#7cfc00',
    lemonchiffon: '#fffacd',
    lightblue: '#add8e6',
    lightcoral: '#f08080',
    lightcyan: '#e0ffff',
    lightgoldenrod: '#fafad2',
    lightgoldenrodyellow: '#fafad2',
    lightgray: '#d3d3d3',
    lightgreen: '#90ee90',
    lightgrey: '#d3d3d3',
    lightpink: '#ffb6c1',
    lightsalmon: '#ffa07a',
    lightseagreen: '#20b2aa',
    lightskyblue: '#87cefa',
    lightslategray: '#778899',
    lightslategrey: '#778899',
    lightsteelblue: '#b0c4de',
    lightyellow: '#ffffe0',
    lime: '#00ff00',
    limegreen: '#32cd32',
    linen: '#faf0e6',
    magenta: '#ff00ff',
    maroon: '#800000',
    maroon2: '#7f0000',
    maroon3: '#b03060',
    mediumaquamarine: '#66cdaa',
    mediumblue: '#0000cd',
    mediumorchid: '#ba55d3',
    mediumpurple: '#9370db',
    mediumseagreen: '#3cb371',
    mediumslateblue: '#7b68ee',
    mediumspringgreen: '#00fa9a',
    mediumturquoise: '#48d1cc',
    mediumvioletred: '#c71585',
    midnightblue: '#191970',
    mintcream: '#f5fffa',
    mistyrose: '#ffe4e1',
    moccasin: '#ffe4b5',
    navajowhite: '#ffdead',
    navy: '#000080',
    oldlace: '#fdf5e6',
    olive: '#808000',
    olivedrab: '#6b8e23',
    orange: '#ffa500',
    orangered: '#ff4500',
    orchid: '#da70d6',
    palegoldenrod: '#eee8aa',
    palegreen: '#98fb98',
    paleturquoise: '#afeeee',
    palevioletred: '#db7093',
    papayawhip: '#ffefd5',
    peachpuff: '#ffdab9',
    peru: '#cd853f',
    pink: '#ffc0cb',
    plum: '#dda0dd',
    powderblue: '#b0e0e6',
    purple: '#800080',
    purple2: '#7f007f',
    purple3: '#a020f0',
    rebeccapurple: '#663399',
    red: '#ff0000',
    rosybrown: '#bc8f8f',
    royalblue: '#4169e1',
    saddlebrown: '#8b4513',
    salmon: '#fa8072',
    sandybrown: '#f4a460',
    seagreen: '#2e8b57',
    seashell: '#fff5ee',
    sienna: '#a0522d',
    silver: '#c0c0c0',
    skyblue: '#87ceeb',
    slateblue: '#6a5acd',
    slategray: '#708090',
    slategrey: '#708090',
    snow: '#fffafa',
    springgreen: '#00ff7f',
    steelblue: '#4682b4',
    tan: '#d2b48c',
    teal: '#008080',
    thistle: '#d8bfd8',
    tomato: '#ff6347',
    turquoise: '#40e0d0',
    violet: '#ee82ee',
    wheat: '#f5deb3',
    white: '#ffffff',
    whitesmoke: '#f5f5f5',
    yellow: '#ffff00',
    yellowgreen: '#9acd32'
};
Color.prototype.name = function() {
    const hex = rgb2hex(this._rgb, 'rgb');
    for (let n of Object.keys(w3cx11)){
        if (w3cx11[n] === hex) return n.toLowerCase();
    }
    return hex;
};
__default5.format.named = (name)=>{
    name = name.toLowerCase();
    if (w3cx11[name]) return hex2rgb(w3cx11[name]);
    throw new Error('unknown color name: ' + name);
};
__default5.autodetect.push({
    p: 5,
    test: (h, ...rest)=>{
        if (!rest.length && __default2(h) === 'string' && w3cx11[h.toLowerCase()]) {
            return 'named';
        }
    }
});
const rgb2num = (...args)=>{
    const [r, g, b] = __default3(args, 'rgb');
    return (r << 16) + (g << 8) + b;
};
const num2rgb = (num)=>{
    if (__default2(num) == "number" && num >= 0 && num <= 0xFFFFFF) {
        const r = num >> 16;
        const g = num >> 8 & 0xFF;
        const b = num & 0xFF;
        return [
            r,
            g,
            b,
            1
        ];
    }
    throw new Error("unknown num color: " + num);
};
Color.prototype.num = function() {
    return rgb2num(this._rgb);
};
chroma.num = (...args)=>new Color(...args, 'num');
__default5.format.num = num2rgb;
__default5.autodetect.push({
    p: 5,
    test: (...args)=>{
        if (args.length === 1 && __default2(args[0]) === 'number' && args[0] >= 0 && args[0] <= 0xFFFFFF) {
            return 'num';
        }
    }
});
const { round: round5  } = Math;
Color.prototype.rgb = function(rnd = true) {
    if (rnd === false) return this._rgb.slice(0, 3);
    return this._rgb.slice(0, 3).map(round5);
};
Color.prototype.rgba = function(rnd = true) {
    return this._rgb.slice(0, 4).map((v, i)=>{
        return i < 3 ? rnd === false ? v : round5(v) : v;
    });
};
chroma.rgb = (...args)=>new Color(...args, 'rgb');
__default5.format.rgb = (...args)=>{
    const rgba = __default3(args, 'rgba');
    if (rgba[3] === undefined) rgba[3] = 1;
    return rgba;
};
__default5.autodetect.push({
    p: 3,
    test: (...args)=>{
        args = __default3(args, 'rgba');
        if (__default2(args) === 'array' && (args.length === 3 || args.length === 4 && __default2(args[3]) == 'number' && args[3] >= 0 && args[3] <= 1)) {
            return 'rgb';
        }
    }
});
const { log  } = Math;
const temperature2rgb = (kelvin)=>{
    const temp = kelvin / 100;
    let r, g, b;
    if (temp < 66) {
        r = 255;
        g = temp < 6 ? 0 : -155.25485562709179 - 0.44596950469579133 * (g = temp - 2) + 104.49216199393888 * log(g);
        b = temp < 20 ? 0 : -254.76935184120902 + 0.8274096064007395 * (b = temp - 10) + 115.67994401066147 * log(b);
    } else {
        r = 351.97690566805693 + 0.114206453784165 * (r = temp - 55) - 40.25366309332127 * log(r);
        g = 325.4494125711974 + 0.07943456536662342 * (g = temp - 50) - 28.0852963507957 * log(g);
        b = 255;
    }
    return [
        r,
        g,
        b,
        1
    ];
};
const { round: round6  } = Math;
const rgb2temperature = (...args)=>{
    const rgb = __default3(args, 'rgb');
    const r = rgb[0], b = rgb[2];
    let minTemp = 1000;
    let maxTemp = 40000;
    let temp;
    while(maxTemp - minTemp > 0.4){
        temp = (maxTemp + minTemp) * 0.5;
        const rgb1 = temperature2rgb(temp);
        if (rgb1[2] / rgb1[0] >= b / r) {
            maxTemp = temp;
        } else {
            minTemp = temp;
        }
    }
    return round6(temp);
};
Color.prototype.temp = Color.prototype.kelvin = Color.prototype.temperature = function() {
    return rgb2temperature(this._rgb);
};
chroma.temp = chroma.kelvin = chroma.temperature = (...args)=>new Color(...args, 'temp');
__default5.format.temp = __default5.format.kelvin = __default5.format.temperature = temperature2rgb;
const { cbrt , pow: pow2 , sign  } = Math;
const rgb2oklab = (...args)=>{
    const [r, g, b] = __default3(args, 'rgb');
    const [lr, lg, lb] = [
        rgb2lrgb(r / 255),
        rgb2lrgb(g / 255),
        rgb2lrgb(b / 255)
    ];
    const l = cbrt(0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb);
    const m = cbrt(0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb);
    const s = cbrt(0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb);
    return [
        0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
        1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
        0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s
    ];
};
function rgb2lrgb(c) {
    const abs = Math.abs(c);
    if (abs < 0.04045) {
        return c / 12.92;
    }
    return (sign(c) || 1) * pow2((abs + 0.055) / 1.055, 2.4);
}
const { pow: pow3 , sign: sign1  } = Math;
const oklab2rgb = (...args)=>{
    args = __default3(args, 'lab');
    const [L, a, b] = args;
    const l = pow3(L + 0.3963377774 * a + 0.2158037573 * b, 3);
    const m = pow3(L - 0.1055613458 * a - 0.0638541728 * b, 3);
    const s = pow3(L - 0.0894841775 * a - 1.291485548 * b, 3);
    return [
        255 * lrgb2rgb(+4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
        255 * lrgb2rgb(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
        255 * lrgb2rgb(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s),
        args.length > 3 ? args[3] : 1
    ];
};
function lrgb2rgb(c) {
    const abs = Math.abs(c);
    if (abs > 0.0031308) {
        return (sign1(c) || 1) * (1.055 * pow3(abs, 1 / 2.4) - 0.055);
    }
    return c * 12.92;
}
Color.prototype.oklab = function() {
    return rgb2oklab(this._rgb);
};
chroma.oklab = (...args)=>new Color(...args, 'oklab');
__default5.format.oklab = oklab2rgb;
__default5.autodetect.push({
    p: 3,
    test: (...args)=>{
        args = __default3(args, 'oklab');
        if (__default2(args) === 'array' && args.length === 3) {
            return 'oklab';
        }
    }
});
const rgb2oklch = (...args)=>{
    const [r, g, b] = __default3(args, 'rgb');
    const [l, a, b_] = rgb2oklab(r, g, b);
    return lab2lch(l, a, b_);
};
const oklch2rgb = (...args)=>{
    args = __default3(args, 'lch');
    const [l, c, h] = args;
    const [L, a, b_] = lch2lab(l, c, h);
    const [r, g, b] = oklab2rgb(L, a, b_);
    return [
        r,
        g,
        b,
        args.length > 3 ? args[3] : 1
    ];
};
Color.prototype.oklch = function() {
    return rgb2oklch(this._rgb);
};
chroma.oklch = (...args)=>new Color(...args, 'oklch');
__default5.format.oklch = oklch2rgb;
__default5.autodetect.push({
    p: 3,
    test: (...args)=>{
        args = __default3(args, 'oklch');
        if (__default2(args) === 'array' && args.length === 3) {
            return 'oklch';
        }
    }
});
Color.prototype.alpha = function(a, mutate = false) {
    if (a !== undefined && __default2(a) === 'number') {
        if (mutate) {
            this._rgb[3] = a;
            return this;
        }
        return new Color([
            this._rgb[0],
            this._rgb[1],
            this._rgb[2],
            a
        ], 'rgb');
    }
    return this._rgb[3];
};
Color.prototype.clipped = function() {
    return this._rgb._clipped || false;
};
Color.prototype.darken = function(amount = 1) {
    const me = this;
    const lab = me.lab();
    lab[0] -= __default6.Kn * amount;
    return new Color(lab, 'lab').alpha(me.alpha(), true);
};
Color.prototype.brighten = function(amount = 1) {
    return this.darken(-amount);
};
Color.prototype.darker = Color.prototype.darken;
Color.prototype.brighter = Color.prototype.brighten;
Color.prototype.get = function(mc) {
    const [mode, channel] = mc.split('.');
    const src = this[mode]();
    if (channel) {
        const i = mode.indexOf(channel) - (mode.substr(0, 2) === 'ok' ? 2 : 0);
        if (i > -1) return src[i];
        throw new Error(`unknown channel ${channel} in mode ${mode}`);
    } else {
        return src;
    }
};
const { pow: pow4  } = Math;
const EPS = 1e-7;
const MAX_ITER = 20;
Color.prototype.luminance = function(lum) {
    if (lum !== undefined && __default2(lum) === 'number') {
        if (lum === 0) {
            return new Color([
                0,
                0,
                0,
                this._rgb[3]
            ], 'rgb');
        }
        if (lum === 1) {
            return new Color([
                255,
                255,
                255,
                this._rgb[3]
            ], 'rgb');
        }
        let cur_lum = this.luminance();
        let mode = 'rgb';
        let max_iter = MAX_ITER;
        const test = (low, high)=>{
            const mid = low.interpolate(high, 0.5, mode);
            const lm = mid.luminance();
            if (Math.abs(lum - lm) < EPS || !max_iter--) {
                return mid;
            }
            return lm > lum ? test(low, mid) : test(mid, high);
        };
        const rgb = (cur_lum > lum ? test(new Color([
            0,
            0,
            0
        ]), this) : test(this, new Color([
            255,
            255,
            255
        ]))).rgb();
        return new Color([
            ...rgb,
            this._rgb[3]
        ]);
    }
    return rgb2luminance(...this._rgb.slice(0, 3));
};
const rgb2luminance = (r, g, b)=>{
    r = luminance_x(r);
    g = luminance_x(g);
    b = luminance_x(b);
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const luminance_x = (x)=>{
    x /= 255;
    return x <= 0.03928 ? x / 12.92 : pow4((x + 0.055) / 1.055, 2.4);
};
const __default7 = {};
const __default8 = (col1, col2, f = 0.5, ...rest)=>{
    let mode = rest[0] || 'lrgb';
    if (!__default7[mode] && !rest.length) {
        mode = Object.keys(__default7)[0];
    }
    if (!__default7[mode]) {
        throw new Error(`interpolation mode ${mode} is not defined`);
    }
    if (__default2(col1) !== 'object') col1 = new Color(col1);
    if (__default2(col2) !== 'object') col2 = new Color(col2);
    return __default7[mode](col1, col2, f).alpha(col1.alpha() + f * (col2.alpha() - col1.alpha()));
};
Color.prototype.mix = Color.prototype.interpolate = function(col2, f = 0.5, ...rest) {
    return __default8(this, col2, f, ...rest);
};
Color.prototype.premultiply = function(mutate = false) {
    const rgb = this._rgb;
    const a = rgb[3];
    if (mutate) {
        this._rgb = [
            rgb[0] * a,
            rgb[1] * a,
            rgb[2] * a,
            a
        ];
        return this;
    } else {
        return new Color([
            rgb[0] * a,
            rgb[1] * a,
            rgb[2] * a,
            a
        ], 'rgb');
    }
};
Color.prototype.saturate = function(amount = 1) {
    const me = this;
    const lch = me.lch();
    lch[1] += __default6.Kn * amount;
    if (lch[1] < 0) lch[1] = 0;
    return new Color(lch, 'lch').alpha(me.alpha(), true);
};
Color.prototype.desaturate = function(amount = 1) {
    return this.saturate(-amount);
};
Color.prototype.set = function(mc, value, mutate = false) {
    const [mode, channel] = mc.split('.');
    const src = this[mode]();
    if (channel) {
        const i = mode.indexOf(channel) - (mode.substr(0, 2) === 'ok' ? 2 : 0);
        if (i > -1) {
            if (__default2(value) == 'string') {
                switch(value.charAt(0)){
                    case '+':
                        src[i] += +value;
                        break;
                    case '-':
                        src[i] += +value;
                        break;
                    case '*':
                        src[i] *= +value.substr(1);
                        break;
                    case '/':
                        src[i] /= +value.substr(1);
                        break;
                    default:
                        src[i] = +value;
                }
            } else if (__default2(value) === 'number') {
                src[i] = value;
            } else {
                throw new Error(`unsupported value for Color.set`);
            }
            const out = new Color(src, mode);
            if (mutate) {
                this._rgb = out._rgb;
                return this;
            }
            return out;
        }
        throw new Error(`unknown channel ${channel} in mode ${mode}`);
    } else {
        return src;
    }
};
const _rgb = (col1, col2, f)=>{
    const xyz0 = col1._rgb;
    const xyz1 = col2._rgb;
    return new Color(xyz0[0] + f * (xyz1[0] - xyz0[0]), xyz0[1] + f * (xyz1[1] - xyz0[1]), xyz0[2] + f * (xyz1[2] - xyz0[2]), 'rgb');
};
__default7.rgb = _rgb;
const { sqrt: sqrt2 , pow: pow5  } = Math;
const lrgb = (col1, col2, f)=>{
    const [x1, y1, z1] = col1._rgb;
    const [x2, y2, z2] = col2._rgb;
    return new Color(sqrt2(pow5(x1, 2) * (1 - f) + pow5(x2, 2) * f), sqrt2(pow5(y1, 2) * (1 - f) + pow5(y2, 2) * f), sqrt2(pow5(z1, 2) * (1 - f) + pow5(z2, 2) * f), 'rgb');
};
__default7.lrgb = lrgb;
const _lab = (col1, col2, f)=>{
    const xyz0 = col1.lab();
    const xyz1 = col2.lab();
    return new Color(xyz0[0] + f * (xyz1[0] - xyz0[0]), xyz0[1] + f * (xyz1[1] - xyz0[1]), xyz0[2] + f * (xyz1[2] - xyz0[2]), 'lab');
};
__default7.lab = _lab;
const __default9 = (col1, col2, f, m)=>{
    let xyz0, xyz1;
    if (m === 'hsl') {
        xyz0 = col1.hsl();
        xyz1 = col2.hsl();
    } else if (m === 'hsv') {
        xyz0 = col1.hsv();
        xyz1 = col2.hsv();
    } else if (m === 'hcg') {
        xyz0 = col1.hcg();
        xyz1 = col2.hcg();
    } else if (m === 'hsi') {
        xyz0 = col1.hsi();
        xyz1 = col2.hsi();
    } else if (m === 'lch' || m === 'hcl') {
        m = 'hcl';
        xyz0 = col1.hcl();
        xyz1 = col2.hcl();
    } else if (m === 'oklch') {
        xyz0 = col1.oklch().reverse();
        xyz1 = col2.oklch().reverse();
    }
    let hue0, hue1, sat0, sat1, lbv0, lbv1;
    if (m.substr(0, 1) === 'h' || m === 'oklch') {
        [hue0, sat0, lbv0] = xyz0;
        [hue1, sat1, lbv1] = xyz1;
    }
    let sat, hue, lbv, dh;
    if (!isNaN(hue0) && !isNaN(hue1)) {
        if (hue1 > hue0 && hue1 - hue0 > 180) {
            dh = hue1 - (hue0 + 360);
        } else if (hue1 < hue0 && hue0 - hue1 > 180) {
            dh = hue1 + 360 - hue0;
        } else {
            dh = hue1 - hue0;
        }
        hue = hue0 + f * dh;
    } else if (!isNaN(hue0)) {
        hue = hue0;
        if ((lbv1 == 1 || lbv1 == 0) && m != 'hsv') sat = sat0;
    } else if (!isNaN(hue1)) {
        hue = hue1;
        if ((lbv0 == 1 || lbv0 == 0) && m != 'hsv') sat = sat1;
    } else {
        hue = Number.NaN;
    }
    if (sat === undefined) sat = sat0 + f * (sat1 - sat0);
    lbv = lbv0 + f * (lbv1 - lbv0);
    return m === 'oklch' ? new Color([
        lbv,
        sat,
        hue
    ], m) : new Color([
        hue,
        sat,
        lbv
    ], m);
};
const lch = (col1, col2, f)=>{
    return __default9(col1, col2, f, 'lch');
};
__default7.lch = lch;
__default7.hcl = lch;
const num = (col1, col2, f)=>{
    const c1 = col1.num();
    const c2 = col2.num();
    return new Color(c1 + f * (c2 - c1), 'num');
};
__default7.num = num;
const hcg = (col1, col2, f)=>{
    return __default9(col1, col2, f, 'hcg');
};
__default7.hcg = hcg;
const hsi = (col1, col2, f)=>{
    return __default9(col1, col2, f, 'hsi');
};
__default7.hsi = hsi;
const hsl = (col1, col2, f)=>{
    return __default9(col1, col2, f, 'hsl');
};
__default7.hsl = hsl;
const hsv = (col1, col2, f)=>{
    return __default9(col1, col2, f, 'hsv');
};
__default7.hsv = hsv;
const oklab = (col1, col2, f)=>{
    const xyz0 = col1.oklab();
    const xyz1 = col2.oklab();
    return new Color(xyz0[0] + f * (xyz1[0] - xyz0[0]), xyz0[1] + f * (xyz1[1] - xyz0[1]), xyz0[2] + f * (xyz1[2] - xyz0[2]), 'oklab');
};
__default7.oklab = oklab;
const oklch = (col1, col2, f)=>{
    return __default9(col1, col2, f, 'oklch');
};
__default7.oklch = oklch;
const { pow: pow6 , sqrt: sqrt3 , PI: PI1 , cos: cos2 , sin: sin1 , atan2: atan21  } = Math;
const _average_lrgb = (colors, weights)=>{
    const l = colors.length;
    const xyz = [
        0,
        0,
        0,
        0
    ];
    for(let i = 0; i < colors.length; i++){
        const col = colors[i];
        const f = weights[i] / l;
        const rgb = col._rgb;
        xyz[0] += pow6(rgb[0], 2) * f;
        xyz[1] += pow6(rgb[1], 2) * f;
        xyz[2] += pow6(rgb[2], 2) * f;
        xyz[3] += rgb[3] * f;
    }
    xyz[0] = sqrt3(xyz[0]);
    xyz[1] = sqrt3(xyz[1]);
    xyz[2] = sqrt3(xyz[2]);
    if (xyz[3] > 0.9999999) xyz[3] = 1;
    return new Color(__default1(xyz));
};
const __default10 = (colors, mode = 'lrgb', weights = null)=>{
    const l = colors.length;
    if (!weights) weights = Array.from(new Array(l)).map(()=>1);
    const k = l / weights.reduce(function(a, b) {
        return a + b;
    });
    weights.forEach((w, i)=>{
        weights[i] *= k;
    });
    colors = colors.map((c)=>new Color(c));
    if (mode === 'lrgb') {
        return _average_lrgb(colors, weights);
    }
    const first = colors.shift();
    const xyz = first.get(mode);
    const cnt = [];
    let dx = 0;
    let dy = 0;
    for(let i = 0; i < xyz.length; i++){
        xyz[i] = (xyz[i] || 0) * (mode.charAt(i) === 'h' ? 1 : weights[0]);
        cnt.push(isNaN(xyz[i]) ? 0 : weights[0]);
        if (mode.charAt(i) === 'h' && !isNaN(xyz[i])) {
            const A = xyz[i] / 180 * PI1;
            dx += cos2(A) * weights[0];
            dy += sin1(A) * weights[0];
        }
    }
    let alpha = first.alpha() * weights[0];
    colors.forEach((c, ci)=>{
        const xyz2 = c.get(mode);
        alpha += c.alpha() * weights[ci + 1];
        for(let i = 0; i < xyz.length; i++){
            if (!isNaN(xyz2[i])) {
                cnt[i] += weights[ci + 1];
                if (mode.charAt(i) === 'h') {
                    const A = xyz2[i] / 180 * PI1;
                    dx += cos2(A) * weights[ci + 1];
                    dy += sin1(A) * weights[ci + 1];
                } else {
                    xyz[i] += xyz2[i] * weights[ci + 1];
                }
            }
        }
    });
    for(let i1 = 0; i1 < xyz.length; i1++){
        if (mode.charAt(i1) === 'h') {
            let A1 = atan21(dy / cnt[i1], dx / cnt[i1]) / PI1 * 180;
            while(A1 < 0)A1 += 360;
            while(A1 >= 360)A1 -= 360;
            xyz[i1] = A1;
        } else {
            xyz[i1] = xyz[i1] / cnt[i1];
        }
    }
    alpha /= l;
    return new Color(xyz, mode).alpha(alpha > 0.99999 ? 1 : alpha, true);
};
const { pow: pow7  } = Math;
function __default11(colors) {
    let _mode = 'rgb';
    let _nacol = chroma('#ccc');
    let _spread = 0;
    let _domain = [
        0,
        1
    ];
    let _pos = [];
    let _padding = [
        0,
        0
    ];
    let _classes = false;
    let _colors = [];
    let _out = false;
    let _min = 0;
    let _max = 1;
    let _correctLightness = false;
    let _colorCache = {};
    let _useCache = true;
    let _gamma = 1;
    const setColors = function(colors) {
        colors = colors || [
            '#fff',
            '#000'
        ];
        if (colors && __default2(colors) === 'string' && chroma.brewer && chroma.brewer[colors.toLowerCase()]) {
            colors = chroma.brewer[colors.toLowerCase()];
        }
        if (__default2(colors) === 'array') {
            if (colors.length === 1) {
                colors = [
                    colors[0],
                    colors[0]
                ];
            }
            colors = colors.slice(0);
            for(let c = 0; c < colors.length; c++){
                colors[c] = chroma(colors[c]);
            }
            _pos.length = 0;
            for(let c1 = 0; c1 < colors.length; c1++){
                _pos.push(c1 / (colors.length - 1));
            }
        }
        resetCache();
        return _colors = colors;
    };
    const getClass = function(value) {
        if (_classes != null) {
            const n = _classes.length - 1;
            let i = 0;
            while(i < n && value >= _classes[i]){
                i++;
            }
            return i - 1;
        }
        return 0;
    };
    let tMapLightness = (t)=>t;
    let tMapDomain = (t)=>t;
    const getColor = function(val, bypassMap) {
        let col, t;
        if (bypassMap == null) {
            bypassMap = false;
        }
        if (isNaN(val) || val === null) {
            return _nacol;
        }
        if (!bypassMap) {
            if (_classes && _classes.length > 2) {
                const c = getClass(val);
                t = c / (_classes.length - 2);
            } else if (_max !== _min) {
                t = (val - _min) / (_max - _min);
            } else {
                t = 1;
            }
        } else {
            t = val;
        }
        t = tMapDomain(t);
        if (!bypassMap) {
            t = tMapLightness(t);
        }
        if (_gamma !== 1) {
            t = pow7(t, _gamma);
        }
        t = _padding[0] + t * (1 - _padding[0] - _padding[1]);
        t = Math.min(1, Math.max(0, t));
        const k = Math.floor(t * 10000);
        if (_useCache && _colorCache[k]) {
            col = _colorCache[k];
        } else {
            if (__default2(_colors) === 'array') {
                for(let i = 0; i < _pos.length; i++){
                    const p = _pos[i];
                    if (t <= p) {
                        col = _colors[i];
                        break;
                    }
                    if (t >= p && i === _pos.length - 1) {
                        col = _colors[i];
                        break;
                    }
                    if (t > p && t < _pos[i + 1]) {
                        t = (t - p) / (_pos[i + 1] - p);
                        col = chroma.interpolate(_colors[i], _colors[i + 1], t, _mode);
                        break;
                    }
                }
            } else if (__default2(_colors) === 'function') {
                col = _colors(t);
            }
            if (_useCache) {
                _colorCache[k] = col;
            }
        }
        return col;
    };
    var resetCache = ()=>_colorCache = {};
    setColors(colors);
    const f = function(v) {
        const c = chroma(getColor(v));
        if (_out && c[_out]) {
            return c[_out]();
        } else {
            return c;
        }
    };
    f.classes = function(classes) {
        if (classes != null) {
            if (__default2(classes) === 'array') {
                _classes = classes;
                _domain = [
                    classes[0],
                    classes[classes.length - 1]
                ];
            } else {
                const d = chroma.analyze(_domain);
                if (classes === 0) {
                    _classes = [
                        d.min,
                        d.max
                    ];
                } else {
                    _classes = chroma.limits(d, 'e', classes);
                }
            }
            return f;
        }
        return _classes;
    };
    f.domain = function(domain) {
        if (!arguments.length) {
            return _domain;
        }
        _min = domain[0];
        _max = domain[domain.length - 1];
        _pos = [];
        const k = _colors.length;
        if (domain.length === k && _min !== _max) {
            for (let d of Array.from(domain)){
                _pos.push((d - _min) / (_max - _min));
            }
        } else {
            for(let c = 0; c < k; c++){
                _pos.push(c / (k - 1));
            }
            if (domain.length > 2) {
                const tOut = domain.map((d, i)=>i / (domain.length - 1));
                const tBreaks = domain.map((d)=>(d - _min) / (_max - _min));
                if (!tBreaks.every((val, i)=>tOut[i] === val)) {
                    tMapDomain = (t)=>{
                        if (t <= 0 || t >= 1) return t;
                        let i = 0;
                        while(t >= tBreaks[i + 1])i++;
                        const f = (t - tBreaks[i]) / (tBreaks[i + 1] - tBreaks[i]);
                        const out = tOut[i] + f * (tOut[i + 1] - tOut[i]);
                        return out;
                    };
                }
            }
        }
        _domain = [
            _min,
            _max
        ];
        return f;
    };
    f.mode = function(_m) {
        if (!arguments.length) {
            return _mode;
        }
        _mode = _m;
        resetCache();
        return f;
    };
    f.range = function(colors, _pos) {
        setColors(colors, _pos);
        return f;
    };
    f.out = function(_o) {
        _out = _o;
        return f;
    };
    f.spread = function(val) {
        if (!arguments.length) {
            return _spread;
        }
        _spread = val;
        return f;
    };
    f.correctLightness = function(v) {
        if (v == null) {
            v = true;
        }
        _correctLightness = v;
        resetCache();
        if (_correctLightness) {
            tMapLightness = function(t) {
                const L0 = getColor(0, true).lab()[0];
                const L1 = getColor(1, true).lab()[0];
                const pol = L0 > L1;
                let L_actual = getColor(t, true).lab()[0];
                const L_ideal = L0 + (L1 - L0) * t;
                let L_diff = L_actual - L_ideal;
                let t0 = 0;
                let t1 = 1;
                let max_iter = 20;
                while(Math.abs(L_diff) > 1e-2 && max_iter-- > 0){
                    (function() {
                        if (pol) {
                            L_diff *= -1;
                        }
                        if (L_diff < 0) {
                            t0 = t;
                            t += (t1 - t) * 0.5;
                        } else {
                            t1 = t;
                            t += (t0 - t) * 0.5;
                        }
                        L_actual = getColor(t, true).lab()[0];
                        return L_diff = L_actual - L_ideal;
                    })();
                }
                return t;
            };
        } else {
            tMapLightness = (t)=>t;
        }
        return f;
    };
    f.padding = function(p) {
        if (p != null) {
            if (__default2(p) === 'number') {
                p = [
                    p,
                    p
                ];
            }
            _padding = p;
            return f;
        } else {
            return _padding;
        }
    };
    f.colors = function(numColors, out) {
        if (arguments.length < 2) {
            out = 'hex';
        }
        let result = [];
        if (arguments.length === 0) {
            result = _colors.slice(0);
        } else if (numColors === 1) {
            result = [
                f(0.5)
            ];
        } else if (numColors > 1) {
            const dm = _domain[0];
            const dd = _domain[1] - dm;
            result = __range__(0, numColors, false).map((i)=>f(dm + i / (numColors - 1) * dd));
        } else {
            colors = [];
            let samples = [];
            if (_classes && _classes.length > 2) {
                for(let i = 1, end = _classes.length, asc = 1 <= end; asc ? i < end : i > end; asc ? i++ : i--){
                    samples.push((_classes[i - 1] + _classes[i]) * 0.5);
                }
            } else {
                samples = _domain;
            }
            result = samples.map((v)=>f(v));
        }
        if (chroma[out]) {
            result = result.map((c)=>c[out]());
        }
        return result;
    };
    f.cache = function(c) {
        if (c != null) {
            _useCache = c;
            return f;
        } else {
            return _useCache;
        }
    };
    f.gamma = function(g) {
        if (g != null) {
            _gamma = g;
            return f;
        } else {
            return _gamma;
        }
    };
    f.nodata = function(d) {
        if (d != null) {
            _nacol = chroma(d);
            return f;
        } else {
            return _nacol;
        }
    };
    return f;
}
function __range__(left, right, inclusive) {
    let range = [];
    let ascending = left < right;
    let end = !inclusive ? right : ascending ? right + 1 : right - 1;
    for(let i = left; ascending ? i < end : i > end; ascending ? i++ : i--){
        range.push(i);
    }
    return range;
}
const binom_row = function(n) {
    let row = [
        1,
        1
    ];
    for(let i = 1; i < n; i++){
        let newrow = [
            1
        ];
        for(let j = 1; j <= row.length; j++){
            newrow[j] = (row[j] || 0) + row[j - 1];
        }
        row = newrow;
    }
    return row;
};
const bezier = function(colors) {
    let I, lab0, lab1, lab2;
    colors = colors.map((c)=>new Color(c));
    if (colors.length === 2) {
        [lab0, lab1] = colors.map((c)=>c.lab());
        I = function(t) {
            const linearInterpolation = (x0, x1)=>x0 + t * (x1 - x0);
            const lab = [
                0,
                1,
                2
            ].map((i)=>linearInterpolation(lab0[i], lab1[i]));
            const alpha = linearInterpolation(colors[0].alpha(), colors[1].alpha());
            return new Color(lab, 'lab').alpha(alpha);
        };
    } else if (colors.length === 3) {
        [lab0, lab1, lab2] = colors.map((c)=>c.lab());
        I = function(t) {
            const quadraticInterpolation = (x0, x1, x2)=>(1 - t) * (1 - t) * x0 + 2 * (1 - t) * t * x1 + t * t * x2;
            const lab = [
                0,
                1,
                2
            ].map((i)=>quadraticInterpolation(lab0[i], lab1[i], lab2[i]));
            const alpha = quadraticInterpolation(colors[0].alpha(), colors[1].alpha(), colors[2].alpha());
            return new Color(lab, 'lab').alpha(alpha);
        };
    } else if (colors.length === 4) {
        let lab3;
        [lab0, lab1, lab2, lab3] = colors.map((c)=>c.lab());
        I = function(t) {
            const cubicInterpolation = (x0, x1, x2, x3)=>(1 - t) * (1 - t) * (1 - t) * x0 + 3 * (1 - t) * (1 - t) * t * x1 + 3 * (1 - t) * t * t * x2 + t * t * t * x3;
            const lab = [
                0,
                1,
                2
            ].map((i)=>cubicInterpolation(lab0[i], lab1[i], lab2[i], lab3[i]));
            const alpha = cubicInterpolation(colors[0].alpha(), colors[1].alpha(), colors[2].alpha(), colors[3].alpha());
            return new Color(lab, 'lab').alpha(alpha);
        };
    } else if (colors.length >= 5) {
        let labs, row, n;
        labs = colors.map((c)=>c.lab());
        n = colors.length - 1;
        row = binom_row(n);
        I = function(t) {
            const u = 1 - t;
            const lab = [
                0,
                1,
                2
            ].map((i)=>labs.reduce((sum, el, j)=>sum + row[j] * u ** (n - j) * t ** j * el[i], 0));
            return new Color(lab, 'lab');
        };
    } else {
        throw new RangeError("No point in running bezier with only one color.");
    }
    return I;
};
const __default12 = (colors)=>{
    const f = bezier(colors);
    f.scale = ()=>__default11(f);
    return f;
};
const digits = '0123456789abcdef';
const { floor: floor2 , random  } = Math;
const __default13 = ()=>{
    let code = '#';
    for(let i = 0; i < 6; i++){
        code += digits.charAt(floor2(random() * 16));
    }
    return new Color(code, 'hex');
};
const { pow: pow8 , sin: sin2 , cos: cos3  } = Math;
function __default14(start = 300, rotations = -1.5, hue = 1, gamma = 1, lightness = [
    0,
    1
]) {
    let dh = 0, dl;
    if (__default2(lightness) === 'array') {
        dl = lightness[1] - lightness[0];
    } else {
        dl = 0;
        lightness = [
            lightness,
            lightness
        ];
    }
    const f = function(fract) {
        const a = TWOPI * ((start + 120) / 360 + rotations * fract);
        const l = pow8(lightness[0] + dl * fract, gamma);
        const h = dh !== 0 ? hue[0] + fract * dh : hue;
        const amp = h * l * (1 - l) / 2;
        const cos_a = cos3(a);
        const sin_a = sin2(a);
        const r = l + amp * (-0.14861 * cos_a + 1.78277 * sin_a);
        const g = l + amp * (-0.29227 * cos_a - 0.90649 * sin_a);
        const b = l + amp * (+1.97294 * cos_a);
        return chroma(__default1([
            r * 255,
            g * 255,
            b * 255,
            1
        ]));
    };
    f.start = function(s) {
        if (s == null) {
            return start;
        }
        start = s;
        return f;
    };
    f.rotations = function(r) {
        if (r == null) {
            return rotations;
        }
        rotations = r;
        return f;
    };
    f.gamma = function(g) {
        if (g == null) {
            return gamma;
        }
        gamma = g;
        return f;
    };
    f.hue = function(h) {
        if (h == null) {
            return hue;
        }
        hue = h;
        if (__default2(hue) === 'array') {
            dh = hue[1] - hue[0];
            if (dh === 0) {
                hue = hue[1];
            }
        } else {
            dh = 0;
        }
        return f;
    };
    f.lightness = function(h) {
        if (h == null) {
            return lightness;
        }
        if (__default2(h) === 'array') {
            lightness = h;
            dl = h[1] - h[0];
        } else {
            lightness = [
                h,
                h
            ];
            dl = 0;
        }
        return f;
    };
    f.scale = ()=>chroma.scale(f);
    f.hue(hue);
    return f;
}
const blend = (bottom, top, mode)=>{
    if (!blend[mode]) {
        throw new Error('unknown blend mode ' + mode);
    }
    return blend[mode](bottom, top);
};
const blend_f = (f)=>(bottom, top)=>{
        const c0 = chroma(top).rgb();
        const c1 = chroma(bottom).rgb();
        return chroma.rgb(f(c0, c1));
    };
const each = (f)=>(c0, c1)=>{
        const out = [];
        out[0] = f(c0[0], c1[0]);
        out[1] = f(c0[1], c1[1]);
        out[2] = f(c0[2], c1[2]);
        return out;
    };
const normal = (a)=>a;
const multiply = (a, b)=>a * b / 255;
const darken = (a, b)=>a > b ? b : a;
const lighten = (a, b)=>a > b ? a : b;
const screen = (a, b)=>255 * (1 - (1 - a / 255) * (1 - b / 255));
const overlay = (a, b)=>b < 128 ? 2 * a * b / 255 : 255 * (1 - 2 * (1 - a / 255) * (1 - b / 255));
const burn = (a, b)=>255 * (1 - (1 - b / 255) / (a / 255));
const dodge = (a, b)=>{
    if (a === 255) return 255;
    a = 255 * (b / 255) / (1 - a / 255);
    return a > 255 ? 255 : a;
};
blend.normal = blend_f(each(normal));
blend.multiply = blend_f(each(multiply));
blend.screen = blend_f(each(screen));
blend.overlay = blend_f(each(overlay));
blend.darken = blend_f(each(darken));
blend.lighten = blend_f(each(lighten));
blend.dodge = blend_f(each(dodge));
blend.burn = blend_f(each(burn));
const { log: log1 , pow: pow9 , floor: floor3 , abs  } = Math;
const analyze = (data, key = null)=>{
    const r = {
        min: Number.MAX_VALUE,
        max: Number.MAX_VALUE * -1,
        sum: 0,
        values: [],
        count: 0
    };
    if (__default2(data) === 'object') {
        data = Object.values(data);
    }
    data.forEach((val)=>{
        if (key && __default2(val) === 'object') val = val[key];
        if (val !== undefined && val !== null && !isNaN(val)) {
            r.values.push(val);
            r.sum += val;
            if (val < r.min) r.min = val;
            if (val > r.max) r.max = val;
            r.count += 1;
        }
    });
    r.domain = [
        r.min,
        r.max
    ];
    r.limits = (mode, num)=>limits(r, mode, num);
    return r;
};
const limits = (data, mode = 'equal', num = 7)=>{
    if (__default2(data) == 'array') {
        data = analyze(data);
    }
    const { min , max  } = data;
    const values = data.values.sort((a, b)=>a - b);
    if (num === 1) {
        return [
            min,
            max
        ];
    }
    const limits = [];
    if (mode.substr(0, 1) === 'c') {
        limits.push(min);
        limits.push(max);
    }
    if (mode.substr(0, 1) === 'e') {
        limits.push(min);
        for(let i = 1; i < num; i++){
            limits.push(min + i / num * (max - min));
        }
        limits.push(max);
    } else if (mode.substr(0, 1) === 'l') {
        if (min <= 0) {
            throw new Error('Logarithmic scales are only possible for values > 0');
        }
        const min_log = Math.LOG10E * log1(min);
        const max_log = Math.LOG10E * log1(max);
        limits.push(min);
        for(let i1 = 1; i1 < num; i1++){
            limits.push(pow9(10, min_log + i1 / num * (max_log - min_log)));
        }
        limits.push(max);
    } else if (mode.substr(0, 1) === 'q') {
        limits.push(min);
        for(let i2 = 1; i2 < num; i2++){
            const p = (values.length - 1) * i2 / num;
            const pb = floor3(p);
            if (pb === p) {
                limits.push(values[pb]);
            } else {
                const pr = p - pb;
                limits.push(values[pb] * (1 - pr) + values[pb + 1] * pr);
            }
        }
        limits.push(max);
    } else if (mode.substr(0, 1) === 'k') {
        let cluster;
        const n = values.length;
        const assignments = new Array(n);
        const clusterSizes = new Array(num);
        let repeat = true;
        let nb_iters = 0;
        let centroids = null;
        centroids = [];
        centroids.push(min);
        for(let i3 = 1; i3 < num; i3++){
            centroids.push(min + i3 / num * (max - min));
        }
        centroids.push(max);
        while(repeat){
            for(let j = 0; j < num; j++){
                clusterSizes[j] = 0;
            }
            for(let i4 = 0; i4 < n; i4++){
                const value = values[i4];
                let mindist = Number.MAX_VALUE;
                let best;
                for(let j1 = 0; j1 < num; j1++){
                    const dist = abs(centroids[j1] - value);
                    if (dist < mindist) {
                        mindist = dist;
                        best = j1;
                    }
                    clusterSizes[best]++;
                    assignments[i4] = best;
                }
            }
            const newCentroids = new Array(num);
            for(let j2 = 0; j2 < num; j2++){
                newCentroids[j2] = null;
            }
            for(let i5 = 0; i5 < n; i5++){
                cluster = assignments[i5];
                if (newCentroids[cluster] === null) {
                    newCentroids[cluster] = values[i5];
                } else {
                    newCentroids[cluster] += values[i5];
                }
            }
            for(let j3 = 0; j3 < num; j3++){
                newCentroids[j3] *= 1 / clusterSizes[j3];
            }
            repeat = false;
            for(let j4 = 0; j4 < num; j4++){
                if (newCentroids[j4] !== centroids[j4]) {
                    repeat = true;
                    break;
                }
            }
            centroids = newCentroids;
            nb_iters++;
            if (nb_iters > 200) {
                repeat = false;
            }
        }
        const kClusters = {};
        for(let j5 = 0; j5 < num; j5++){
            kClusters[j5] = [];
        }
        for(let i6 = 0; i6 < n; i6++){
            cluster = assignments[i6];
            kClusters[cluster].push(values[i6]);
        }
        let tmpKMeansBreaks = [];
        for(let j6 = 0; j6 < num; j6++){
            tmpKMeansBreaks.push(kClusters[j6][0]);
            tmpKMeansBreaks.push(kClusters[j6][kClusters[j6].length - 1]);
        }
        tmpKMeansBreaks = tmpKMeansBreaks.sort((a, b)=>a - b);
        limits.push(tmpKMeansBreaks[0]);
        for(let i7 = 1; i7 < tmpKMeansBreaks.length; i7 += 2){
            const v = tmpKMeansBreaks[i7];
            if (!isNaN(v) && limits.indexOf(v) === -1) {
                limits.push(v);
            }
        }
    }
    return limits;
};
const __default15 = {
    analyze,
    limits
};
const __default16 = (a, b)=>{
    a = new Color(a);
    b = new Color(b);
    const l1 = a.luminance();
    const l2 = b.luminance();
    return l1 > l2 ? (l1 + 0.05) / (l2 + 0.05) : (l2 + 0.05) / (l1 + 0.05);
};
const { sqrt: sqrt4 , pow: pow10 , min: min2 , max: max2 , atan2: atan22 , abs: abs1 , cos: cos4 , sin: sin3 , exp , PI: PI2  } = Math;
function __default17(a, b, Kl = 1, Kc = 1, Kh = 1) {
    var rad2deg = function(rad) {
        return 360 * rad / (2 * PI2);
    };
    var deg2rad = function(deg) {
        return 2 * PI2 * deg / 360;
    };
    a = new Color(a);
    b = new Color(b);
    const [L1, a1, b1] = Array.from(a.lab());
    const [L2, a2, b2] = Array.from(b.lab());
    const avgL = (L1 + L2) / 2;
    const C1 = sqrt4(pow10(a1, 2) + pow10(b1, 2));
    const C2 = sqrt4(pow10(a2, 2) + pow10(b2, 2));
    const avgC = (C1 + C2) / 2;
    const G = 0.5 * (1 - sqrt4(pow10(avgC, 7) / (pow10(avgC, 7) + pow10(25, 7))));
    const a1p = a1 * (1 + G);
    const a2p = a2 * (1 + G);
    const C1p = sqrt4(pow10(a1p, 2) + pow10(b1, 2));
    const C2p = sqrt4(pow10(a2p, 2) + pow10(b2, 2));
    const avgCp = (C1p + C2p) / 2;
    const arctan1 = rad2deg(atan22(b1, a1p));
    const arctan2 = rad2deg(atan22(b2, a2p));
    const h1p = arctan1 >= 0 ? arctan1 : arctan1 + 360;
    const h2p = arctan2 >= 0 ? arctan2 : arctan2 + 360;
    const avgHp = abs1(h1p - h2p) > 180 ? (h1p + h2p + 360) / 2 : (h1p + h2p) / 2;
    const T = 1 - 0.17 * cos4(deg2rad(avgHp - 30)) + 0.24 * cos4(deg2rad(2 * avgHp)) + 0.32 * cos4(deg2rad(3 * avgHp + 6)) - 0.2 * cos4(deg2rad(4 * avgHp - 63));
    let deltaHp = h2p - h1p;
    deltaHp = abs1(deltaHp) <= 180 ? deltaHp : h2p <= h1p ? deltaHp + 360 : deltaHp - 360;
    deltaHp = 2 * sqrt4(C1p * C2p) * sin3(deg2rad(deltaHp) / 2);
    const deltaL = L2 - L1;
    const deltaCp = C2p - C1p;
    const sl = 1 + 0.015 * pow10(avgL - 50, 2) / sqrt4(20 + pow10(avgL - 50, 2));
    const sc = 1 + 0.045 * avgCp;
    const sh = 1 + 0.015 * avgCp * T;
    const deltaTheta = 30 * exp(-pow10((avgHp - 275) / 25, 2));
    const Rc = 2 * sqrt4(pow10(avgCp, 7) / (pow10(avgCp, 7) + pow10(25, 7)));
    const Rt = -Rc * sin3(2 * deg2rad(deltaTheta));
    const result = sqrt4(pow10(deltaL / (Kl * sl), 2) + pow10(deltaCp / (Kc * sc), 2) + pow10(deltaHp / (Kh * sh), 2) + Rt * (deltaCp / (Kc * sc)) * (deltaHp / (Kh * sh)));
    return max2(0, min2(100, result));
}
function __default18(a, b, mode = 'lab') {
    a = new Color(a);
    b = new Color(b);
    const l1 = a.get(mode);
    const l2 = b.get(mode);
    let sum_sq = 0;
    for(let i in l1){
        const d = (l1[i] || 0) - (l2[i] || 0);
        sum_sq += d * d;
    }
    return Math.sqrt(sum_sq);
}
const __default19 = (...args)=>{
    try {
        new Color(...args);
        return true;
    } catch (e) {
        return false;
    }
};
const __default20 = {
    cool () {
        return __default11([
            chroma.hsl(180, 1, .9),
            chroma.hsl(250, .7, .4)
        ]);
    },
    hot () {
        return __default11([
            '#000',
            '#f00',
            '#ff0',
            '#fff'
        ], [
            0,
            .25,
            .75,
            1
        ]).mode('rgb');
    }
};
const colorbrewer = {
    OrRd: [
        '#fff7ec',
        '#fee8c8',
        '#fdd49e',
        '#fdbb84',
        '#fc8d59',
        '#ef6548',
        '#d7301f',
        '#b30000',
        '#7f0000'
    ],
    PuBu: [
        '#fff7fb',
        '#ece7f2',
        '#d0d1e6',
        '#a6bddb',
        '#74a9cf',
        '#3690c0',
        '#0570b0',
        '#045a8d',
        '#023858'
    ],
    BuPu: [
        '#f7fcfd',
        '#e0ecf4',
        '#bfd3e6',
        '#9ebcda',
        '#8c96c6',
        '#8c6bb1',
        '#88419d',
        '#810f7c',
        '#4d004b'
    ],
    Oranges: [
        '#fff5eb',
        '#fee6ce',
        '#fdd0a2',
        '#fdae6b',
        '#fd8d3c',
        '#f16913',
        '#d94801',
        '#a63603',
        '#7f2704'
    ],
    BuGn: [
        '#f7fcfd',
        '#e5f5f9',
        '#ccece6',
        '#99d8c9',
        '#66c2a4',
        '#41ae76',
        '#238b45',
        '#006d2c',
        '#00441b'
    ],
    YlOrBr: [
        '#ffffe5',
        '#fff7bc',
        '#fee391',
        '#fec44f',
        '#fe9929',
        '#ec7014',
        '#cc4c02',
        '#993404',
        '#662506'
    ],
    YlGn: [
        '#ffffe5',
        '#f7fcb9',
        '#d9f0a3',
        '#addd8e',
        '#78c679',
        '#41ab5d',
        '#238443',
        '#006837',
        '#004529'
    ],
    Reds: [
        '#fff5f0',
        '#fee0d2',
        '#fcbba1',
        '#fc9272',
        '#fb6a4a',
        '#ef3b2c',
        '#cb181d',
        '#a50f15',
        '#67000d'
    ],
    RdPu: [
        '#fff7f3',
        '#fde0dd',
        '#fcc5c0',
        '#fa9fb5',
        '#f768a1',
        '#dd3497',
        '#ae017e',
        '#7a0177',
        '#49006a'
    ],
    Greens: [
        '#f7fcf5',
        '#e5f5e0',
        '#c7e9c0',
        '#a1d99b',
        '#74c476',
        '#41ab5d',
        '#238b45',
        '#006d2c',
        '#00441b'
    ],
    YlGnBu: [
        '#ffffd9',
        '#edf8b1',
        '#c7e9b4',
        '#7fcdbb',
        '#41b6c4',
        '#1d91c0',
        '#225ea8',
        '#253494',
        '#081d58'
    ],
    Purples: [
        '#fcfbfd',
        '#efedf5',
        '#dadaeb',
        '#bcbddc',
        '#9e9ac8',
        '#807dba',
        '#6a51a3',
        '#54278f',
        '#3f007d'
    ],
    GnBu: [
        '#f7fcf0',
        '#e0f3db',
        '#ccebc5',
        '#a8ddb5',
        '#7bccc4',
        '#4eb3d3',
        '#2b8cbe',
        '#0868ac',
        '#084081'
    ],
    Greys: [
        '#ffffff',
        '#f0f0f0',
        '#d9d9d9',
        '#bdbdbd',
        '#969696',
        '#737373',
        '#525252',
        '#252525',
        '#000000'
    ],
    YlOrRd: [
        '#ffffcc',
        '#ffeda0',
        '#fed976',
        '#feb24c',
        '#fd8d3c',
        '#fc4e2a',
        '#e31a1c',
        '#bd0026',
        '#800026'
    ],
    PuRd: [
        '#f7f4f9',
        '#e7e1ef',
        '#d4b9da',
        '#c994c7',
        '#df65b0',
        '#e7298a',
        '#ce1256',
        '#980043',
        '#67001f'
    ],
    Blues: [
        '#f7fbff',
        '#deebf7',
        '#c6dbef',
        '#9ecae1',
        '#6baed6',
        '#4292c6',
        '#2171b5',
        '#08519c',
        '#08306b'
    ],
    PuBuGn: [
        '#fff7fb',
        '#ece2f0',
        '#d0d1e6',
        '#a6bddb',
        '#67a9cf',
        '#3690c0',
        '#02818a',
        '#016c59',
        '#014636'
    ],
    Viridis: [
        '#440154',
        '#482777',
        '#3f4a8a',
        '#31678e',
        '#26838f',
        '#1f9d8a',
        '#6cce5a',
        '#b6de2b',
        '#fee825'
    ],
    Spectral: [
        '#9e0142',
        '#d53e4f',
        '#f46d43',
        '#fdae61',
        '#fee08b',
        '#ffffbf',
        '#e6f598',
        '#abdda4',
        '#66c2a5',
        '#3288bd',
        '#5e4fa2'
    ],
    RdYlGn: [
        '#a50026',
        '#d73027',
        '#f46d43',
        '#fdae61',
        '#fee08b',
        '#ffffbf',
        '#d9ef8b',
        '#a6d96a',
        '#66bd63',
        '#1a9850',
        '#006837'
    ],
    RdBu: [
        '#67001f',
        '#b2182b',
        '#d6604d',
        '#f4a582',
        '#fddbc7',
        '#f7f7f7',
        '#d1e5f0',
        '#92c5de',
        '#4393c3',
        '#2166ac',
        '#053061'
    ],
    PiYG: [
        '#8e0152',
        '#c51b7d',
        '#de77ae',
        '#f1b6da',
        '#fde0ef',
        '#f7f7f7',
        '#e6f5d0',
        '#b8e186',
        '#7fbc41',
        '#4d9221',
        '#276419'
    ],
    PRGn: [
        '#40004b',
        '#762a83',
        '#9970ab',
        '#c2a5cf',
        '#e7d4e8',
        '#f7f7f7',
        '#d9f0d3',
        '#a6dba0',
        '#5aae61',
        '#1b7837',
        '#00441b'
    ],
    RdYlBu: [
        '#a50026',
        '#d73027',
        '#f46d43',
        '#fdae61',
        '#fee090',
        '#ffffbf',
        '#e0f3f8',
        '#abd9e9',
        '#74add1',
        '#4575b4',
        '#313695'
    ],
    BrBG: [
        '#543005',
        '#8c510a',
        '#bf812d',
        '#dfc27d',
        '#f6e8c3',
        '#f5f5f5',
        '#c7eae5',
        '#80cdc1',
        '#35978f',
        '#01665e',
        '#003c30'
    ],
    RdGy: [
        '#67001f',
        '#b2182b',
        '#d6604d',
        '#f4a582',
        '#fddbc7',
        '#ffffff',
        '#e0e0e0',
        '#bababa',
        '#878787',
        '#4d4d4d',
        '#1a1a1a'
    ],
    PuOr: [
        '#7f3b08',
        '#b35806',
        '#e08214',
        '#fdb863',
        '#fee0b6',
        '#f7f7f7',
        '#d8daeb',
        '#b2abd2',
        '#8073ac',
        '#542788',
        '#2d004b'
    ],
    Set2: [
        '#66c2a5',
        '#fc8d62',
        '#8da0cb',
        '#e78ac3',
        '#a6d854',
        '#ffd92f',
        '#e5c494',
        '#b3b3b3'
    ],
    Accent: [
        '#7fc97f',
        '#beaed4',
        '#fdc086',
        '#ffff99',
        '#386cb0',
        '#f0027f',
        '#bf5b17',
        '#666666'
    ],
    Set1: [
        '#e41a1c',
        '#377eb8',
        '#4daf4a',
        '#984ea3',
        '#ff7f00',
        '#ffff33',
        '#a65628',
        '#f781bf',
        '#999999'
    ],
    Set3: [
        '#8dd3c7',
        '#ffffb3',
        '#bebada',
        '#fb8072',
        '#80b1d3',
        '#fdb462',
        '#b3de69',
        '#fccde5',
        '#d9d9d9',
        '#bc80bd',
        '#ccebc5',
        '#ffed6f'
    ],
    Dark2: [
        '#1b9e77',
        '#d95f02',
        '#7570b3',
        '#e7298a',
        '#66a61e',
        '#e6ab02',
        '#a6761d',
        '#666666'
    ],
    Paired: [
        '#a6cee3',
        '#1f78b4',
        '#b2df8a',
        '#33a02c',
        '#fb9a99',
        '#e31a1c',
        '#fdbf6f',
        '#ff7f00',
        '#cab2d6',
        '#6a3d9a',
        '#ffff99',
        '#b15928'
    ],
    Pastel2: [
        '#b3e2cd',
        '#fdcdac',
        '#cbd5e8',
        '#f4cae4',
        '#e6f5c9',
        '#fff2ae',
        '#f1e2cc',
        '#cccccc'
    ],
    Pastel1: [
        '#fbb4ae',
        '#b3cde3',
        '#ccebc5',
        '#decbe4',
        '#fed9a6',
        '#ffffcc',
        '#e5d8bd',
        '#fddaec',
        '#f2f2f2'
    ]
};
for (let key of Object.keys(colorbrewer)){
    colorbrewer[key.toLowerCase()] = colorbrewer[key];
}
chroma.average = __default10;
chroma.bezier = __default12;
chroma.blend = blend;
chroma.cubehelix = __default14;
chroma.mix = chroma.interpolate = __default8;
chroma.random = __default13;
chroma.scale = __default11;
chroma.analyze = __default15.analyze;
chroma.contrast = __default16;
chroma.deltaE = __default17;
chroma.distance = __default18;
chroma.limits = __default15.limits;
chroma.valid = __default19;
chroma.scales = __default20;
chroma.colors = w3cx11;
chroma.brewer = colorbrewer;
export { chroma as default };

