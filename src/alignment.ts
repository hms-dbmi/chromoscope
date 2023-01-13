import { GoslingSpec } from 'gosling.js';
import { SpecOption } from './main-spec';
import defaultEncodings from './default-encoding';
import { SingleTrack } from 'gosling.js/dist/src/core/gosling.schema';

function drawSvReads(option: SpecOption, sv: string): Partial<SingleTrack>[] {
    const { svReads } = option;
    return [
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
                    oneOf: svReads.filter(d => d.type === sv).map(d => d.name)
                }
            ],
            color: { value: defaultEncodings.color.svclass[sv] },
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
                    oneOf: svReads.filter(d => d.type === sv).map(d => d.name)
                },
                {
                    type: 'filter',
                    field: 'strand',
                    oneOf: ['+']
                }
            ],
            mark: 'triangleRight',
            color: { value: defaultEncodings.color.svclass[sv] },
            x: { field: 'end', type: 'genomic' }
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
                    oneOf: svReads.filter(d => d.type === sv).map(d => d.name)
                },
                {
                    type: 'filter',
                    field: 'strand',
                    oneOf: ['-']
                }
            ],
            mark: 'triangleLeft',
            color: { value: defaultEncodings.color.svclass[sv] },
            x: { field: 'start', type: 'genomic' },
            style: { align: 'right' }
        }
    ];
}

export function alignment(option: SpecOption, isLeft: boolean): GoslingSpec {
    const { id, bam, bai, width, svReads, crossChr, bpIntervals } = option;

    return {
        id: `${id}-bottom-${isLeft ? 'left' : 'right'}-bam`,
        alignment: 'overlay',
        title: 'Alignment',
        data: { type: 'bam', url: bam, indexUrl: bai, loadMates: false },
        mark: 'rect',
        experimental: {
            mouseEvents: { mouseOver: true, groupMarksByField: 'id' }
        },
        tracks: [
            /**
             * Regular Reads
             */
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
                    }
                ],
                color: { value: '#E5E5E5' },
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
                        field: 'strand',
                        oneOf: ['+']
                    }
                ],
                mark: 'triangleRight',
                color: { value: '#E5E5E5' },
                x: { field: 'end', type: 'genomic' }
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
                        field: 'strand',
                        oneOf: ['-']
                    }
                ],
                mark: 'triangleLeft',
                color: { value: '#E5E5E5' },
                x: { field: 'start', type: 'genomic' },
                style: { align: 'right' }
            },
            /**
             * Mutations
             */
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
                    // { type: 'filter', field: 'type', oneOf: ['sub'] },
                    { type: 'filter', field: 'type', oneOf: ['A', 'T', 'G', 'C', 'X', 'I', 'D'] }
                ],
                x: { field: 'pos_start', type: 'genomic' },
                xe: { field: 'pos_end', type: 'genomic' },
                color: {
                    field: 'variant',
                    type: 'nominal',
                    domain: ['A', 'T', 'G', 'C', 'X', 'I', 'D'],
                    legend: true
                }
            },
            /**
             * Soft and Hard Clipping Reads
             */
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
                color: { value: '#414141' },
                opacity: { value: 1 }
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
                        type: 'subjson',
                        field: 'substitutions',
                        genomicField: 'pos',
                        baseGenomicField: 'start',
                        genomicLengthField: 'length'
                    },
                    { type: 'filter', field: 'type', oneOf: ['S', 'H'] },
                    {
                        type: 'filter',
                        field: 'substitutions',
                        include: '-',
                        // !! TODO: not seems to be working oposite way?
                        not: true
                    },
                    {
                        type: 'filter',
                        field: 'strand',
                        oneOf: ['-']
                    }
                ],
                mark: 'triangleLeft',
                x: { field: 'pos_start', type: 'genomic' },
                color: { value: '#414141' },
                opacity: { value: 1 },
                style: { align: 'right' }
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
                        type: 'subjson',
                        field: 'substitutions',
                        genomicField: 'pos',
                        baseGenomicField: 'start',
                        genomicLengthField: 'length'
                    },
                    { type: 'filter', field: 'type', oneOf: ['S', 'H'] },
                    {
                        type: 'filter',
                        field: 'substitutions',
                        include: '-',
                        not: false
                    },
                    {
                        type: 'filter',
                        field: 'strand',
                        oneOf: ['+']
                    }
                ],
                mark: 'triangleRight',
                x: { field: 'pos_end', type: 'genomic' },
                color: { value: '#414141' },
                opacity: { value: 1 }
            },
            ...drawSvReads(option, 'Translocation'),
            ...drawSvReads(option, 'Deletion'),
            ...drawSvReads(option, 'Inversion (TtT)'),
            ...drawSvReads(option, 'Inversion (HtH)'),
            ...drawSvReads(option, 'Duplication')
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
        style: { outlineWidth: 0.5, mouseOver: { stroke: 'black' } },
        width,
        height: 500
    };
}
