import { SingleTrack } from 'gosling.js/dist/src/core/gosling.schema';
import { TrackMode } from './index';

export default function gain(
    sampleId: string,
    cnvUrl: string,
    width: number,
    height: number,
    mode: TrackMode,
    cnFields: [string, string, string] = ['total_cn', 'major_cn', 'minor_cn']
): SingleTrack {
    const [total_cn, major_cn, minor_cn] = cnFields;
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
            // https://cancer.sanger.ac.uk/cosmic/help/cnv/overview
            {
                type: 'filter',
                field: total_cn,
                inRange: [5, 999]
            }
        ],
        mark: 'rect',
        x: { field: 'start', type: 'genomic' },
        xe: { field: 'end', type: 'genomic' },
        color: { value: '#5CB6EA' },
        width,
        height
    };
}
