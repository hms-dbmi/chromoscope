import { OverlaidTracks } from 'gosling.js/dist/src/core/gosling.schema';
import { TrackMode } from './index';

export default function indel(sampleId: string, width: number, height: number, mode: TrackMode): OverlaidTracks {
    return {
        id: `${sampleId}-${mode}-indel`,
        style: { background: '#F6F6F6' },
        data: {
            url: 'https://s3.amazonaws.com/gosling-lang.org/data/SV/INDEL_test_tumor_normal_with_panel.vcf.gz',
            indexUrl: 'https://s3.amazonaws.com/gosling-lang.org/data/SV/INDEL_test_tumor_normal_with_panel.vcf.gz.tbi',
            type: 'vcf',
            sampleLength: 5000
        },
        dataTransform: [
            {
                type: 'concat',
                fields: ['REF', 'ALT'],
                separator: ' → ',
                newField: 'LAB'
            }
        ],
        alignment: 'overlay',
        tracks: [
            {
                size: { value: height / 2 - 1 },
                visibility: [
                    {
                        target: 'track',
                        operation: 'GT',
                        measure: 'zoomLevel',
                        threshold: 1000
                    }
                ]
            },
            {
                xe: { field: 'POSEND', type: 'genomic', axis: 'top' },
                visibility: [
                    {
                        target: 'track',
                        operation: 'LTET',
                        measure: 'zoomLevel',
                        threshold: 1000
                    }
                ]
            },
            {
                mark: 'text',
                text: { field: 'LAB', type: 'nominal' },
                xe: { field: 'POSEND', type: 'genomic', axis: 'top' },
                color: { value: 'white' },
                strokeWidth: { value: 0 },
                opacity: { value: 1 },
                visibility: [
                    {
                        target: 'mark',
                        operation: 'LT',
                        measure: 'width',
                        transitionPadding: 30,
                        threshold: '|xe-x|'
                    }
                ]
            }
        ],
        mark: 'rect',
        x: { field: 'POS', type: 'genomic' },
        stroke: {
            field: 'MUTTYPE',
            type: 'nominal',
            legend: true,
            domain: ['insertion', 'deletion']
        },
        strokeWidth: { value: 1 },
        color: {
            field: 'MUTTYPE',
            type: 'nominal',
            legend: true,
            domain: ['insertion', 'deletion']
        },
        row: {
            field: 'MUTTYPE',
            type: 'nominal',
            legend: true,
            domain: ['insertion', 'deletion']
        },
        tooltip: [
            { field: 'POS', type: 'genomic' },
            { field: 'POSEND', type: 'genomic' },
            { field: 'MUTTYPE', type: 'nominal' },
            { field: 'ALT', type: 'nominal' },
            { field: 'REF', type: 'nominal' },
            { field: 'QUAL', type: 'quantitative' }
        ],
        opacity: { value: 0.9 },
        width,
        height
    };
}
