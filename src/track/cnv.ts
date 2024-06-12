import { SingleTrack, OverlaidTracks } from 'gosling.js/dist/src/gosling-schema';
import { TrackMode } from './index';

export default function cnv(
    sampleId: string,
    cnvUrl: string,
    width: number,
    height: number,
    mode: TrackMode,
    cnFields: [string, string, string] = ['total_cn', 'major_cn', 'minor_cn']
): OverlaidTracks {
    const [total_cn, major_cn, minor_cn] = cnFields;
    return {
        id: `${sampleId}-${mode}-cnv`,
        title: mode === 'small' ? '' : '  Copy Number Variants',
        style: { background: '#FFFFFF' },
        data: {
            separator: '\t',
            url: cnvUrl,
            type: 'csv',
            chromosomeField: 'chromosome',
            genomicFields: ['start', 'end']
        },
        mark: 'rect',
        x: { field: 'start', type: 'genomic' },
        xe: { field: 'end', type: 'genomic' },
        alignment: 'overlay',
        tracks: [
            {
                y: { field: total_cn, type: 'quantitative', axis: 'right', grid: true, range: [0 + 10, height - 10] },
                color: { value: '#808080' }
            }
            // {
            //     y: { field: 'minor_cn', type: 'quantitative', axis: 'right', grid: true },
            //     color: { value: 'red' },
            // }
        ],
        tooltip: [
            { field: total_cn, type: 'quantitative' },
            { field: major_cn, type: 'quantitative' },
            { field: minor_cn, type: 'quantitative' }
        ],
        size: { value: 5 },
        stroke: { value: '#808080' },
        strokeWidth: { value: 1 },
        opacity: { value: 0.7 },
        width,
        height
    };
}
