import { SingleTrack } from 'gosling.js/dist/src/core/gosling.schema';
import { TrackMode } from './index';

export default function loh(
    sampleId: string,
    cnvUrl: string,
    width: number,
    height: number,
    mode: TrackMode,
    cnFields: [string, string, string] = ['total_cn', 'major_cn', 'minor_cn']
): SingleTrack {
    const [total_cn, major_cn, minor_cn] = cnFields;
    return {
        id: `${sampleId}-${mode}-loh`,
        title: mode !== 'small' ? 'LOH' : '',
        style: { background: '#F6F6F6' },
        data: {
            separator: '\t',
            url: cnvUrl,
            type: 'csv',
            chromosomeField: 'chromosome',
            genomicFields: ['start', 'end']
        },
        dataTransform: [
            { type: 'filter', field: minor_cn, inRange: [0, 0.01] },
            { type: 'filter', field: total_cn, oneOf: ['0'], not: true }
        ],
        mark: 'rect',
        x: { field: 'start', type: 'genomic' },
        xe: { field: 'end', type: 'genomic' },
        color: { value: '#FB6A4B' },
        width,
        height
    };
}
