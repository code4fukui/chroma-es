import { chroma } from './src/chroma.js';

// feel free to comment out anything to rollup
// a smaller chroma.js built

// io --> convert colors
import './src/io/css/index.js';
import './src/io/hex/index.js';
import './src/io/hsl/index.js';
import './src/io/lab/index.js';
import './src/io/oklab/index.js';
import './src/io/rgb/index.js';

// operators --> modify existing Colors
import './src/ops/alpha.js';
import './src/ops/darken.js';
import './src/ops/get.js';
import './src/ops/mix.js';
import './src/ops/set.js';

// interpolators
import './src/interpolator/lrgb.js';
import './src/interpolator/oklab.js';

import mix from './src/generator/mix.js';
import valid from './src/utils/valid.js';

// generators -- > create new colors
chroma.mix = chroma.interpolate = mix;

// other utility methods
chroma.valid = valid;

export default chroma;
