import { OverlaidTracks } from 'gosling.js/dist/src/gosling-schema';
import { TrackMode } from './index';

export default function parentMapping(
    sampleId: string,
    pmUrl: string,
    width: number,
    height: number,
    mode: TrackMode
): OverlaidTracks {
    return {
        id: `${sampleId}-${mode}-parent-mapping`,
        title: mode === 'small' ? '' : 'Parent Mapping',
        style: { background: '#F6F6F6', inlineLegend: true },
        data: {
            separator: ',',
            url: pmUrl,
            type: 'csv',
            chromosomeField: 'chromosome',
            genomicFields: ['POS'],
            sampleLength: 5000
        },
        dataTransform: [
            {
                type: 'replace',
                field: 'tracks',
                replace: [
                    { from: '1', to: 'Mother | Homozygous' },
                    { from: '2', to: 'Mother | Heterozygous' },
                    { from: '4', to: 'Father | Homozygous' },
                    { from: '5', to: 'Father | Heterozygous' }
                ],
                newField: 'parental_origin'
            },
            {
                type: 'replace',
                field: 'tracks',
                replace: [
                    { from: '1', to: 'Mother' },
                    { from: '2', to: 'Mother' },
                    { from: '4', to: 'Father' },
                    { from: '5', to: 'Father' }
                ],
                newField: 'Parental Origin'
            },
            {
                type: 'replace',
                field: 'tracks',
                replace: [
                    { from: '1', to: 'Homozygous' },
                    { from: '2', to: 'Heterozygous' },
                    { from: '4', to: 'Homozygous' },
                    { from: '5', to: 'Heterozygous' }
                ],
                newField: 'Variant'
            }
        ],
        alignment: 'overlay',
        tracks: [
            {
                mark: 'rect',
                x: { field: 'POS', type: 'genomic' },
                y: { value: 0 },
                color: {
                    field: 'parental_origin',
                    type: 'nominal',
                    domain: ['Mother | Homozygous', 'Mother | Heterozygous', 'Father | Homozygous', 'Father | Heterozygous'],
                    range: ['#D55E00', '#E69F00', '#0072B2', '#56B4E9'],  // Colors representing each category
                    legend: true
                },
                stroke : {
                    field: 'parental_origin',
                    type: 'nominal',
                    domain: ['Mother | Homozygous', 'Mother | Heterozygous', 'Father | Homozygous', 'Father | Heterozygous'],
                    range: ['#D55E00', '#E69F00', '#0072B2', '#56B4E9']           
                },
                strokeWidth : { value: 3 },
                opacity : { value: 0.9 },
                size: { value: height - 5 },
                //size: {value: height / 4 },
                tooltip: [
                    { field: 'chromosome', type: 'nominal', alt: 'Chromosome'},
                    { field: 'POS', type: 'genomic', alt: 'Position' },
                    { field: 'GT', type: 'nominal', alt: 'Genotype' },
                    { field: 'Parental Origin', type: 'nominal', alt: 'Parental Origin' },
                    { field: 'Variant', type: 'nominal', alt: 'Variant' }
                ]
            }
        ],
        //row: { // delete this if all in 1 row
        //    field: 'parental_origin',
        //    type: 'nominal',
        //    legend: true,
        //    domain: ['Mother | Homozygous', 'Mother | Heterozygous', 'Father | Homozygous', 'Father | Heterozygous']
        //},
        opacity: { value: 0.9 },
        width,
        height
    };
}
