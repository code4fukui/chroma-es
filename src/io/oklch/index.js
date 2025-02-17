import { unpack, type } from '../../utils/index.js';
import { chroma } from '../../chroma.js';
import { Color } from '../../Color.js';
import input from '../input.js';

import rgb2oklch from './rgb2oklch.js';
import oklch2rgb from './oklch2rgb.js';

Color.prototype.oklch = function () {
    return rgb2oklch(this._rgb);
};

chroma.oklch = (...args) => new Color(...args, 'oklch');

input.format.oklch = oklch2rgb;

input.autodetect.push({
    p: 3,
    test: (...args) => {
        args = unpack(args, 'oklch');
        if (type(args) === 'array' && args.length === 3) {
            return 'oklch';
        }
    }
});
