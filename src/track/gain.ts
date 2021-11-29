import { SingleTrack } from 'gosling.js/dist/src/core/gosling.schema';
import { TrackMode } from './index';

export default function gain(
    sampleId: string,
    cnvUrl: string,
    width: number,
    height: number,
    mode: TrackMode
): SingleTrack {
    return {
        id: `${sampleId}-${mode}-gain`,
        title: mode === 'small' ? '' : 'Gain',
        style: { background: '#F6F6F6' },
        data: {
            separator: '\t',
            url: cnvUrl,
            type: 'csv',
            chromosomeField: 'chromosome',
            genomicFields: ['start', 'end']
        },
        dataTransform: [
            {
                type: 'filter',
                field: 'aceseq_copy_number',
                inRange: [4.5, 900]
            }
        ],
        mark: 'rect',
        x: { field: 'start', type: 'genomic' },
        xe: { field: 'end', type: 'genomic' },
        color: { value: '#73C475' },
        width,
        height
    };
}
