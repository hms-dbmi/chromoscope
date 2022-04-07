import { GoslingSpec } from 'gosling.js';
import { SpecOption } from './spec-generator';
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
    const { sampleId, bamUrl, baiUrl, width, svReads, crossChr, bpIntervals } = option;

    return {
        id: `${sampleId}-bottom-${isLeft ? 'left' : 'right'}-bam`,
        alignment: 'overlay',
        title: 'Alignment',
        data: { type: 'bam', url: bamUrl, indexUrl: baiUrl, loadMates: false },
        mark: 'rect',
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
                color: { value: '#C8C8C8' },
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
                color: { value: '#C8C8C8' },
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
                color: { value: '#C8C8C8' },
                x: { field: 'start', type: 'genomic' },
                style: { align: 'right' }
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
                opacity: { value: 0.8 }
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
        style: { outlineWidth: 0.5 },
        width,
        height: 500
    };
}
