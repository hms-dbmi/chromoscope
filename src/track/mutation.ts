import { SingleTrack } from 'gosling.js/dist/src/core/gosling.schema';
import { TrackMode } from './index';

export default function mutation(
    sampleId: string,
    cnvUrl: string,
    width: number,
    height: number,
    mode: TrackMode,
    cnFields: [string, string, string]
): SingleTrack {
    return {
        id: `${sampleId}-${mode}-mutation`,
        title: 'Point Mutation',
        style: { background: '#FFFFFF', inlineLegend: true },
        data: {
            type: 'vcf',
            url: 'https://s3.amazonaws.com/gosling-lang.org/data/SV/bc0dee07-de20-44d6-be65-05af7e63ac96.consensus.20160830.somatic.snv_mnv.vcf.gz',
            indexUrl:
                'https://s3.amazonaws.com/gosling-lang.org/data/SV/bc0dee07-de20-44d6-be65-05af7e63ac96.consensus.20160830.somatic.snv_mnv.vcf.gz.tbi',
            sampleLength: 1000
        },
        dataTransform: [{ field: 'DISTPREV', type: 'filter', oneOf: [0], not: true }],
        mark: 'point',
        x: { field: 'POS', type: 'genomic' },
        color: { field: 'SUBTYPE', type: 'nominal', legend: true, domain: ['C>A', 'C>G', 'C>T', 'T>A', 'T>C', 'T>G'] },
        y: { field: 'DISTPREVLOGE', type: 'quantitative', axis: 'left' },
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
