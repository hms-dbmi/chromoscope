import { SingleTrack } from 'gosling.js/dist/src/core/gosling.schema';
import { TrackMode } from './index';

export default function mutation(
    sampleId: string,
    url: string,
    indexUrl: string,
    width: number,
    height: number,
    mode: TrackMode
): SingleTrack {
    return {
        id: `${sampleId}-${mode}-mutation`,
        title: 'Point Mutation',
        style: { background: '#FFFFFF', inlineLegend: true },
        data: {
            type: 'vcf',
            url,
            indexUrl,
            sampleLength: 1000
        },
        dataTransform: [{ field: 'DISTPREV', type: 'filter', oneOf: [0], not: true }],
        mark: 'point',
        x: { field: 'POS', type: 'genomic' },
        color: { field: 'SUBTYPE', type: 'nominal', legend: true, domain: ['C>A', 'C>G', 'C>T', 'T>A', 'T>C', 'T>G'] },
        y: { field: 'DISTPREVLOGE', type: 'quantitative', axis: 'left', range: [10, height - 10] },
        opacity: { value: 0.9 },
        tooltip: [
            { field: 'DISTPREV', type: 'nominal', format: 's1', alt: 'Distance To Previous Mutation (BP)' },
            { field: 'POS', type: 'genomic' },
            { field: 'SUBTYPE', type: 'nominal' }
        ],
        width,
        height
    };
}
