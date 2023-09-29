import { SingleTrack } from 'gosling.js/dist/src/gosling-schema';
import { TrackMode } from './index';

export default function driver(
    sampleId: string,
    url: string,
    width: number,
    height: number,
    mode: TrackMode
): SingleTrack {
    return {
        id: `${sampleId}-${mode}-driver`,
        title: 'Putative Driver',
        // TODO: click events are not supported for layered tracks
        // experimental: {
        //     mouseEvents: {
        //         click: true,
        //         mouseOver: true
        //     }
        // },
        data: {
            url,
            type: 'csv',
            separator: '\t',
            chromosomeField: 'chr',
            genomicFields: ['pos']
        },
        dataTransform: [
            {
                type: 'replace',
                field: 'biallelic',
                replace: [
                    { from: 'yes', to: '⊙ ' },
                    { from: 'no', to: '· ' },
                    { from: 'Yes', to: '⊙ ' },
                    { from: 'No', to: '· ' }
                ],
                newField: 'prefix'
            },
            { type: 'concat', fields: ['prefix', 'gene'], newField: 'geneWithPrefix', separator: '' }
            // { type: 'displace', method: 'pile', boundingBox: { startField: 'pos', endField: 'pos', padding: 100, isPaddingBP: false }, newField: 'row', maxRows: 2 }
        ],
        mark: 'text',
        x: { field: 'pos', type: 'genomic' },
        text: { field: 'geneWithPrefix', type: 'nominal' },
        color: { value: 'black' },
        row: { field: 'row', type: 'nominal' },
        style: { textFontWeight: 'normal' },
        size: { value: mode === 'top' ? 10 : 14 },
        tooltip: [
            { field: 'pos', alt: 'Position', type: 'genomic' },
            { field: 'ref', alt: 'REF', type: 'nominal' },
            { field: 'alt', alt: 'ALT', type: 'nominal' },
            { field: 'category', alt: 'Category', type: 'nominal' },
            { field: 'top_category', alt: 'Top Category', type: 'nominal' },
            { field: 'biallelic', alt: 'Biallelic', type: 'nominal' },
            { field: 'transcript_consequence', alt: 'Transcript Consequence', type: 'nominal' },
            { field: 'protein_mutation', alt: 'Protein Mutation', type: 'nominal' },
            { field: 'allele_fraction', alt: 'Allele Fraction', type: 'nominal' },
            { field: 'mutation_type', alt: 'Mutation Type', type: 'nominal' }
        ],
        width,
        height: height
    };
}
