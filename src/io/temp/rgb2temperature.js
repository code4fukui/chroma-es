/*
 * Based on implementation by Neil Bartlett
 * https://github.com/neilbartlett/color-temperature
 **/

import temperature2rgb from './temperature2rgb.js';
import { unpack } from '../../utils/index.js';
const { round } = Math;

const rgb2temperature = (...args) => {
    const rgb = unpack(args, 'rgb');
    const r = rgb[0], b = rgb[2];
    let minTemp = 1000;
    let maxTemp = 40000;
    const eps = 0.4;
    let temp;
    while (maxTemp - minTemp > eps) {
        temp = (maxTemp + minTemp) * 0.5;
        const rgb = temperature2rgb(temp);
        if ((rgb[2] / rgb[0]) >= (b / r)) {
            maxTemp = temp;
        } else {
            minTemp = temp;
        }
    }
    return round(temp);
}

export default rgb2temperature;
