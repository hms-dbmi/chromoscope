import { SingleTrack, OverlaidTracks } from 'gosling.js/dist/src/gosling-schema';
import { TrackMode } from './index';
export default function baf(
    sampleId: string,
    url: string,
    width: number,
    height: number,
    mode: TrackMode
): OverlaidTracks {
    return {
        id: `${sampleId}-${mode}-baf`,
        title: mode === 'small' ? '' : 'Bi-allele Frequency',
        style: { background: '#FFFFFF' },
        data: {
            separator: '\t',
            url,
            type: 'csv',
            chromosomeField: 'chromosome',
            genomicFields: ['start', 'end']
        },
        mark: 'rect',
        x: { field: 'start', type: 'genomic', axis: 'bottom' },
        xe: { field: 'end', type: 'genomic' },
        //x1: {field: 'chromosome', type: 'genomic', "axis": "bottom"},
        alignment: 'overlay',
        tracks: [
            {
                mark: 'point',
                size: { value: 3 },
                y: { field: 'BAF', type: 'quantitative', axis: 'right', grid: true, domain: [-0.1, 1.1] },
                color: { value: '#3ebecf' }
            }
        ],
        tooltip: [
            { field: 'BAF', type: 'quantitative' },
            { field: 'REF', type: 'nominal' },
            { field: 'ALT', type: 'nominal' },
            { field: 'start', type: 'quantitative' },
            { field: 'chromosome', type: 'nominal' }
        ],
        size: { value: 5 },
        stroke: { value: '#808080' },
        strokeWidth: { value: 0 },
        opacity: { value: 0.7 },
        width,
        height
    };
}
