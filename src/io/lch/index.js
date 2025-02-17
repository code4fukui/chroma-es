import { unpack, type } from '../../utils/index.js';
import { chroma } from '../../chroma.js';
import { Color } from '../../Color.js';
import input from '../input.js';

import rgb2lch from './rgb2lch.js';
import lch2rgb from './lch2rgb.js';
import hcl2rgb from './hcl2rgb.js';

Color.prototype.lch = function() { return rgb2lch(this._rgb); };
Color.prototype.hcl = function() { return rgb2lch(this._rgb).reverse(); };

chroma.lch = (...args) => new Color(...args, 'lch');
chroma.hcl = (...args) => new Color(...args, 'hcl');

input.format.lch = lch2rgb;
input.format.hcl = hcl2rgb;

['lch','hcl'].forEach(m => input.autodetect.push({
    p: 2,
    test: (...args) => {
        args = unpack(args, m);
        if (type(args) === 'array' && args.length === 3) {
            return m;
        }
    }
}));

