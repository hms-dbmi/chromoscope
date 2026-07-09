import { Assembly } from 'gosling.js/dist/src/gosling-schema';
import { OptionValue, Primitive } from './ui/VisOverviewPanel/OverviewPanel';

export const CHROM_SIZE_HG38 = {
    chr1: 248956422,
    chr2: 242193529,
    chr3: 198295559,
    chr4: 190214555,
    chr5: 181538259,
    chr6: 170805979,
    chr7: 159345973,
    chr8: 145138636,
    chr9: 138394717,
    chr10: 133797422,
    chr11: 135086622,
    chr12: 133275309,
    chr13: 114364328,
    chr14: 107043718,
    chr15: 101991189,
    chr16: 90338345,
    chr17: 83257441,
    chr18: 80373285,
    chr19: 58617616,
    chr20: 64444167,
    chr21: 46709983,
    chr22: 50818468,
    chrX: 156040895,
    chrY: 57227415
};

export const CHROM_SIZE_HG19 = {
    chr1: 249250621,
    chr2: 243199373,
    chr3: 198022430,
    chr4: 191154276,
    chr5: 180915260,
    chr6: 171115067,
    chr7: 159138663,
    chr8: 146364022,
    chr9: 141213431,
    chr10: 135534747,
    chr11: 135006516,
    chr12: 133851895,
    chr13: 115169878,
    chr14: 107349540,
    chr15: 102531392,
    chr16: 90354753,
    chr17: 81195210,
    chr18: 78077248,
    chr19: 59128983,
    chr20: 63025520,
    chr21: 48129895,
    chr22: 51304566,
    chrX: 155270560,
    chrY: 59373566,
    chrM: 16571
};

export const getAbsoluteMutationPosition = (
    assembly: Assembly,
    chromosome: string,
    relativeMutationPosition: number
): number => {
    const chrIntervals = getChromInterval(assembly === 'hg19' ? CHROM_SIZE_HG19 : CHROM_SIZE_HG38); // assembly is defined in the Data Config of Chromoscope.
    const [start, end] = chrIntervals[chromosome]; // start is the offset of chr10 in the linearlized genomic coordinates

    return start + relativeMutationPosition; // information from the clinical data config
};

export function getChromInterval(chromSize: { [k: string]: number }) {
    const interval: { [k: string]: [number, number] } = {};

    Object.keys(chromSize).reduce((sum, k) => {
        interval[k] = [sum, sum + chromSize[k]];
        return sum + chromSize[k];
    }, 0);

    return interval;
}

export function getRelativeGenomicPosition(absPos: number, assembly: 'hg38' | 'hg19') {
    const [chromosome, absInterval] = Object.entries(
        getChromInterval(assembly === 'hg19' ? CHROM_SIZE_HG19 : CHROM_SIZE_HG38)
    ).find(d => {
        const [start, end] = d[1];
        return start <= absPos && absPos < end;
    }) ?? [null, null];

    if (!chromosome || !absInterval) {
        // The number is out of range
        return { chromosome: 'unknown', position: absPos };
    }

    return { chromosome, position: absPos - absInterval[0] };
}

export function isChrome() {
    return window.navigator.userAgent.toLowerCase().indexOf('chrome') !== -1;
}

export function driversToTsvUrl(drivers: string | { [k: string]: string | number }[]) {
    if (typeof drivers === 'string') return drivers;

    const keys = [];
    drivers.forEach(d => keys.push(...Object.keys(d)));
    const uniqueKeys = Array.from(new Set(keys));
    const text = [uniqueKeys.join('\t'), ...drivers.map(d => uniqueKeys.map(k => d[k]).join('\t'))].join('\n');
    const tsv = new Blob([text], { type: 'text/tsv' });
    const url = URL.createObjectURL(tsv);
    return url;
}

// Check if a value is a primitive type
export const isJsonPrimitive = (value: unknown): value is string | number | boolean | null => {
    return value === null || typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean';
};

// Get the index of the bin that a value belongs to
export const getBinIndex = (value: number, bins: OptionValue[]) => {
    // Check if the value is within the bin range
    for (let i = 0; i < bins.length; i++) {
        const { start, end } = bins[i];
        const isLastBin = i === bins.length - 1;

        if ((value >= start && value < end) || (isLastBin && value <= end)) {
            return i;
        }
    }

    return -1;
};

// Format a number to a string with 2 decimal places
const format = (n: number) => (Number.isInteger(n) ? n.toString() : n.toFixed(2));

// Normalize a number to avoid floating point precision issues
const normalize = (n: number) => Number(n.toFixed(10));

/**
 * Transforms array of values into bins
 * @param rawValues array of values to be binned
 * @returns bins associated with the values
 */
export const getBinnedValues = (rawValues: OptionValue[], numBins = 5): OptionValue[] => {
    // Typecast to Number
    const numbers: number[] = rawValues
        .map(v => (typeof v.value === 'number' ? v.value : Number(v.value)))
        .filter(v => !Number.isNaN(v));

    // If no values, don't add filter
    if (numbers.length === 0) {
        return [];
    }

    // Get the min and max values
    const min = Math.min(...numbers);
    const max = Math.max(...numbers);

    // Calculate the bin size
    const range = max - min || 1;
    const binSize = range / numBins;

    // Create bins
    const bins = Array.from({ length: numBins }, (_, i) => {
        const start = normalize(min + i * binSize);
        const end = i === numBins - 1 ? max : min + (i + 1) * binSize;

        return {
            start,
            end,
            // Only round for display
            value: `${format(start)}-${format(end)}`,
            count: 0
        };
    });

    // Update counts
    rawValues.forEach(value => {
        const n = typeof value.value === 'number' ? value.value : Number(value.value);
        if (Number.isNaN(n)) return;
        const index = getBinIndex(n, bins);
        if (index !== -1) bins[index].count += value?.count || 1;
    });

    return bins;
};

// Helper function to access a nested field in a sample object
export const accessNestedField = (sample: unknown = null, path = ''): string | number | boolean | null => {
    if (path === '' || typeof sample !== 'object' || sample === null) {
        return null;
    }

    // Split the path into parts
    const parts = path.split('.');
    let current = sample;

    // Traverse the object using the path
    for (let i = 0; i < parts.length; i++) {
        if (typeof current !== 'object' || current === null) return null;

        // If the current value is an array, find the object with the matching label
        if (Array.isArray(current)) {
            current = current.find(d => d.label.toLowerCase() === parts[i].toLowerCase())?.value;
        } else {
            current = current[parts[i]];
        }
    }

    return isJsonPrimitive(current) ? current : null;
};
