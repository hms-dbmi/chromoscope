import { SingleTrack } from 'gosling.js/dist/src/core/gosling.schema';
import { TrackMode } from './index';

export default function vcf(
    sampleId: string,
    vcfUrl: string,
    vciUrl: string,
    width: number,
    height: number,
    mode: TrackMode
): SingleTrack {
    return {
        id: `${sampleId}-${mode}-vcf`,
        title: 'Point Mutation',
        data: {
            url: vcfUrl,
            type: 'vcf',
            indexUrl: vciUrl,
            sampleLength: 5000
        },
        dataTransform: [{ type: 'filter', field: 'DISTPREV', oneOf: [0], not: true }],
        tooltip: [
            { field: 'DISTPREVLOGE', type: 'quantitative', format: '.4' },
            { field: 'POS', type: 'genomic' }
        ],
        mark: 'point',
        x: { field: 'POS', type: 'genomic' },
        color: { field: 'SUBTYPE', type: 'nominal', legend: true, domain: ['C>A', 'C>G', 'C>T', 'T>A', 'T>C', 'T>G'] },
        y: { field: 'DISTPREVLOGE', type: 'quantitative', axis: 'left' },
        opacity: { value: 0.9 },
        width,
        height
    };
}
