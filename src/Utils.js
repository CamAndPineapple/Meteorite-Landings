const Utils = {
    normalize (value, min, max) {
        return (value - min) / (max - min);
    },

    denormalizeValue (val, min, max) {
         return Math.round(val/100 * (max - min) + min);
    },

    denormalizeMassValue (val, min, max) {
        let denorm = val/100 * (max - min) + min;
        return Math.round(Math.pow(2, denorm));
    },

    getMinMax (data, property) {
        let lowest = Number.POSITIVE_INFINITY;
        let highest = Number.NEGATIVE_INFINITY;
        let tmp;
        let len = data.length - 1;
        for (let i=len; i>=0; i--) {
            tmp = data[i][property];
            if (tmp < lowest) lowest = tmp;
            if (tmp > highest) highest = tmp;
        }

        return {
            min: lowest,
            max: highest
        };
    }
};

export default Utils;