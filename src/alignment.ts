import { GoslingSpec } from 'gosling.js';
import { SpecOption } from './spec-generator';
import defaultEncodings from './default-encoding';

export function alignment(option: SpecOption, isLeft: boolean): GoslingSpec {
    const { sampleId, bamUrl, baiUrl, width, svReads, crossChr, bpIntervals } = option;
    return {
        id: `${sampleId}-bottom-${isLeft ? 'left' : 'right'}-bam`,
        alignment: 'overlay',
        title: 'Alignment',
        data: { type: 'bam', url: bamUrl, indexUrl: baiUrl, loadMates: false },
        mark: 'rect',
        tracks: [
            {
                // This is just a track to show legend as a work around.
                dataTransform: [{ type: 'filter', field: 'start', oneOf: [] }],
                color: {
                    field: 'start',
                    type: 'nominal',
                    legend: true,
                    domain: [...defaultEncodings.color.svclass.domain, 'Hard/Soft Clipping'],
                    range: [...defaultEncodings.color.svclass.range, '#414141']
                },
                x: { field: 'start', type: 'genomic' },
                xe: { field: 'end', type: 'genomic' }
            },
            {
                // Regular reads
                dataTransform: [
                    {
                        type: 'displace',
                        method: 'pile',
                        boundingBox: {
                            startField: 'start',
                            endField: 'end',
                            padding: 5,
                            isPaddingBP: true
                        },
                        newField: 'pileup-row',
                        maxRows: 300
                    }
                ],
                color: { value: '#C8C8C8' },
                x: { field: 'start', type: 'genomic' },
                xe: { field: 'end', type: 'genomic' }
            },
            // {
            //     // Regular reads plus triangle
            //     dataTransform: [
            //         {
            //             type: 'displace',
            //             method: 'pile',
            //             boundingBox: {
            //                 startField: 'start',
            //                 endField: 'end',
            //                 padding: 5,
            //                 isPaddingBP: true
            //             },
            //             newField: 'pileup-row',
            //             maxRows: 300
            //         },
            //         {
            //             type: 'filter',
            //             field: 'strand',
            //             oneOf: ['+']
            //         }
            //     ],
            //     mark: 'triangleRight',
            //     color: { value: '#C8C8C8' },
            //     x: { field: 'end', type: 'genomic' },
            // },
            // {
            //     // Regular reads plus triangle
            //     dataTransform: [
            //         {
            //             type: 'displace',
            //             method: 'pile',
            //             boundingBox: {
            //                 startField: 'start',
            //                 endField: 'end',
            //                 padding: 5,
            //                 isPaddingBP: true
            //             },
            //             newField: 'pileup-row',
            //             maxRows: 300
            //         },
            //         {
            //             type: 'filter',
            //             field: 'strand',
            //             oneOf: ['-']
            //         }
            //     ],
            //     mark: 'triangleLeft',
            //     color: { value: '#C8C8C8' },
            //     x: { field: 'start', type: 'genomic' },
            //     style: { align: 'right' }
            // },
            {
                dataTransform: [
                    {
                        type: 'displace',
                        method: 'pile',
                        boundingBox: {
                            startField: 'start',
                            endField: 'end',
                            padding: 5,
                            isPaddingBP: true
                        },
                        newField: 'pileup-row',
                        maxRows: 300
                    },
                    {
                        type: 'subjson',
                        field: 'substitutions',
                        genomicField: 'pos',
                        baseGenomicField: 'start',
                        genomicLengthField: 'length'
                    },
                    { type: 'filter', field: 'type', oneOf: ['S', 'H'] }
                ],
                x: { field: 'pos_start', type: 'genomic' },
                xe: { field: 'pos_end', type: 'genomic' },
                color: { value: '#414141' }
            },
            {
                dataTransform: [
                    {
                        type: 'displace',
                        method: 'pile',
                        boundingBox: {
                            startField: 'start',
                            endField: 'end',
                            padding: 5,
                            isPaddingBP: true
                        },
                        newField: 'pileup-row',
                        maxRows: 300
                    },
                    {
                        type: 'filter',
                        field: 'name',
                        oneOf: svReads.filter(d => d.type === 'Translocation').map(d => d.name)
                    }
                ],
                color: { value: defaultEncodings.color.svclass['Translocation'] },
                x: { field: 'start', type: 'genomic' },
                xe: { field: 'end', type: 'genomic' }
            },

            {
                dataTransform: [
                    {
                        type: 'displace',
                        method: 'pile',
                        boundingBox: {
                            startField: 'start',
                            endField: 'end',
                            padding: 5,
                            isPaddingBP: true
                        },
                        newField: 'pileup-row',
                        maxRows: 300
                    },
                    {
                        type: 'filter',
                        field: 'name',
                        oneOf: svReads.filter(d => d.type === 'Deletion').map(d => d.name)
                    }
                ],
                color: { value: defaultEncodings.color.svclass['Deletion'] },
                x: { field: 'start', type: 'genomic' },
                xe: { field: 'end', type: 'genomic' }
            },
            {
                dataTransform: [
                    {
                        type: 'displace',
                        method: 'pile',
                        boundingBox: {
                            startField: 'start',
                            endField: 'end',
                            padding: 5,
                            isPaddingBP: true
                        },
                        newField: 'pileup-row',
                        maxRows: 300
                    },
                    {
                        type: 'filter',
                        field: 'name',
                        oneOf: svReads.filter(d => d.type === 'Inversion (TtT)').map(d => d.name)
                    }
                ],
                color: { value: defaultEncodings.color.svclass['Inversion (TtT)'] },
                x: { field: 'start', type: 'genomic' },
                xe: { field: 'end', type: 'genomic' }
            },
            {
                dataTransform: [
                    {
                        type: 'displace',
                        method: 'pile',
                        boundingBox: {
                            startField: 'start',
                            endField: 'end',
                            padding: 5,
                            isPaddingBP: true
                        },
                        newField: 'pileup-row',
                        maxRows: 300
                    },
                    {
                        type: 'filter',
                        field: 'name',
                        oneOf: svReads.filter(d => d.type === 'Inversion (HtH)').map(d => d.name)
                    }
                ],
                color: { value: defaultEncodings.color.svclass['Inversion (HtH)'] },
                x: { field: 'start', type: 'genomic' },
                xe: { field: 'end', type: 'genomic' }
            },
            {
                dataTransform: [
                    {
                        type: 'displace',
                        method: 'pile',
                        boundingBox: {
                            startField: 'start',
                            endField: 'end',
                            padding: 5,
                            isPaddingBP: true
                        },
                        newField: 'pileup-row',
                        maxRows: 300
                    },
                    {
                        type: 'filter',
                        field: 'name',
                        oneOf: svReads.filter(d => d.type === 'Duplication').map(d => d.name)
                    }
                ],
                color: { value: defaultEncodings.color.svclass['Duplication'] },
                x: { field: 'start', type: 'genomic' },
                xe: { field: 'end', type: 'genomic' }
            }
        ],
        row: { field: 'pileup-row', type: 'nominal', padding: 0.2 },
        tooltip: [
            { field: 'id', type: 'nominal' },
            { field: 'name', type: 'nominal' },
            { field: 'start', type: 'genomic' },
            { field: 'end', type: 'genomic' },
            { field: 'cigar', type: 'nominal' },
            { field: 'strand', type: 'nominal' },
            { field: 'mapq', type: 'quantitative', alt: 'Mapping Quality (MAPQ)' },
            { field: 'substitutions', type: 'nominal' }
        ],
        style: { outlineWidth: 0.5 },
        width,
        height: 500
    };
}