import { OverlaidTracks } from 'gosling.js/dist/src/gosling-schema';
import { TrackMode } from './index';

export default function indel(
    sampleId: string,
    url: string,
    indexUrl: string,
    width: number,
    height: number,
    mode: TrackMode
): OverlaidTracks {
    return {
        id: `${sampleId}-${mode}-indel`,
        style: { background: '#F6F6F6' },
        data: {
            url,
            indexUrl,
            type: 'vcf',
            sampleLength: 500
        },
        dataTransform: [
            {
                type: 'concat',
                fields: ['REF', 'ALT'],
                separator: ' → ',
                newField: 'LAB'
            },
            {
                type: 'replace',
                field: 'MUTTYPE',
                replace: [
                    { from: 'insertion', to: 'Insertion' },
                    { from: 'deletion', to: 'Deletion' }
                ],
                newField: 'MUTTYPE'
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
            }
            // {
            //     mark: 'text',
            //     text: { field: 'LAB', type: 'nominal' },
            //     xe: { field: 'POSEND', type: 'genomic', axis: 'top' },
            //     color: { value: 'white' },
            //     strokeWidth: { value: 0 },
            //     opacity: { value: 1 },
            //     visibility: [
            //         {
            //             target: 'mark',
            //             operation: 'LT',
            //             measure: 'width',
            //             transitionPadding: 30,
            //             threshold: '|xe-x|'
            //         }
            //     ]
            // }
        ],
        mark: 'rect',
        x: { field: 'POS', type: 'genomic' },
        // stroke: {
        //     field: 'MUTTYPE',
        //     type: 'nominal',
        //     legend: false,
        //     domain: ['Insertion', 'Deletion']
        // },
        // strokeWidth: { value: 1 },
        color: {
            field: 'MUTTYPE',
            type: 'nominal',
            legend: false,
            domain: ['Insertion', 'Deletion']
        },
        row: {
            field: 'MUTTYPE',
            type: 'nominal',
            legend: true,
            domain: ['Insertion', 'Deletion']
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
