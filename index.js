import { chroma } from './src/chroma.js';

// feel free to comment out anything to rollup
// a smaller chroma.js built

// io --> convert colors
import './src/io/cmyk/index.js';
import './src/io/css/index.js';
import './src/io/gl/index.js';
import './src/io/hcg/index.js';
import './src/io/hex/index.js';
import './src/io/hsi/index.js';
import './src/io/hsl/index.js';
import './src/io/hsv/index.js';
import './src/io/lab/index.js';
import './src/io/lch/index.js';
import './src/io/named/index.js';
import './src/io/num/index.js';
import './src/io/rgb/index.js';
import './src/io/temp/index.js';
import './src/io/oklab/index.js';
import './src/io/oklch/index.js';

// operators --> modify existing Colors
import './src/ops/alpha.js';
import './src/ops/clipped.js';
import './src/ops/darken.js';
import './src/ops/get.js';
import './src/ops/luminance.js';
import './src/ops/mix.js';
import './src/ops/premultiply.js';
import './src/ops/saturate.js';
import './src/ops/set.js';

// interpolators
import './src/interpolator/rgb.js';
import './src/interpolator/lrgb.js';
import './src/interpolator/lab.js';
import './src/interpolator/lch.js';
import './src/interpolator/num.js';
import './src/interpolator/hcg.js';
import './src/interpolator/hsi.js';
import './src/interpolator/hsl.js';
import './src/interpolator/hsv.js';
import './src/interpolator/oklab.js';
import './src/interpolator/oklch.js';

import average from './src/generator/average.js';
import bezier from './src/generator/bezier.js';
import mix from './src/generator/mix.js';
import random from './src/generator/random.js';
import scale from './src/generator/scale.js';
import cubehelix from './src/generator/cubehelix.js';
import blend from './src/generator/blend.js';

import analyze from './src/utils/analyze.js'
import contrast from './src/utils/contrast.js';
import deltaE from './src/utils/delta-e.js';
import distance from './src/utils/distance.js';
import limits from './src/utils/analyze.js';
import valid from './src/utils/valid.js';

import scales from './src/utils/scales.js';

import brewer from './src/colors/colorbrewer.js';
import colors from './src/colors/w3cx11.js';

// generators -- > create new colors
chroma.average = average;
chroma.bezier = bezier;
chroma.blend = blend;
chroma.cubehelix = cubehelix;
chroma.mix = chroma.interpolate = mix;
chroma.random = random;
chroma.scale = scale;

// other utility methods
chroma.analyze = analyze.analyze;
chroma.contrast = contrast;
chroma.deltaE = deltaE;
chroma.distance = distance;
chroma.limits = limits.limits;
chroma.valid = valid;

// scale
chroma.scales = scales;

// colors
chroma.colors = colors;
chroma.brewer = brewer;

export default chroma;
