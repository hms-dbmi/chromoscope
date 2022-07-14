import { SingleTrack, OverlaidTracks } from 'gosling.js/dist/src/core/gosling.schema';
import { TrackMode } from './index';

export default function cnv(
    sampleId: string,
    cnvUrl: string,
    width: number,
    height: number,
    mode: TrackMode,
    cnFields: [string, string, string]
): OverlaidTracks {
    const [total_cn, major_cn, minor_cn] = cnFields;
    return {
        id: `${sampleId}-${mode}-cnv`,
        title: mode === 'small' ? '' : 'CNV',
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
                y: { field: total_cn, type: 'quantitative', axis: 'right', grid: true },
                color: { value: 'darkgray' }
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
        size: { value: 4 },
        stroke: { value: 'darkgray' },
        strokeWidth: { value: 1 },
        opacity: { value: 0.8 },
        width,
        height
    };
}
