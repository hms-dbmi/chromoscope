import { SingleTrack } from 'gosling.js/dist/src/core/gosling.schema';
import { TrackMode } from './index';

export default function loh(
    sampleId: string,
    cnvUrl: string,
    width: number,
    height: number,
    mode: TrackMode
): SingleTrack {
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
        dataTransform: [{ type: 'filter', field: 'minor_cn', oneOf: ['0'] }],
        mark: 'rect',
        x: { field: 'start', type: 'genomic' },
        xe: { field: 'end', type: 'genomic' },
        color: { value: '#FB6A4B' },
        width,
        height
    };
}
