import { unpack, type } from '../../utils/index.js';
import { chroma } from '../../chroma.js';
import { Color } from '../../Color.js';
import input from '../input.js';

import rgb2hsv from './rgb2hsv.js';
import hsv2rgb from './hsv2rgb.js';

Color.prototype.hsv = function() {
    return rgb2hsv(this._rgb);
};

chroma.hsv = (...args) => new Color(...args, 'hsv');

input.format.hsv = hsv2rgb;

input.autodetect.push({
    p: 2,
    test: (...args) => {
        args = unpack(args, 'hsv');
        if (type(args) === 'array' && args.length === 3) {
            return 'hsv';
        }
    }
});
