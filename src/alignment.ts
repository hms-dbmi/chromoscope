import { GoslingSpec } from '../../gosling.js/dist/src';
import { SpecOption } from './spec-generator';
import defaultEncodings from './default-encoding';

export function alignment(option: SpecOption, isLeft: boolean): GoslingSpec {
    const { sampleId, bamUrl, baiUrl, width, svReads, crossChr, bpIntervals } = option;
    return {
        static: true,
        id: `${sampleId}-bottom-${isLeft ? 'left' : 'right'}-bam`,
        alignment: 'overlay',
        title: 'Alignment',
        data: {
            type: 'bam',
            url: bamUrl,
            indexUrl: baiUrl,
            loadMates: true
        },
        mark: 'rect',
        tracks: [
            {
                dataTransform: [
                    {
                        type: 'displace',
                        method: 'pile',
                        boundingBox: {
                            startField: 'from',
                            endField: 'to',
                            padding: 5,
                            isPaddingBP: true
                        },
                        newField: 'pileup-row',
                        maxRows: 300
                    },
                    {
                        type: 'filter',
                        field: 'svType',
                        oneOf: [
                            // only refer to two views
                            // "duplication (-+)",
                            // "deletion (+-)",
                            // "inversion (++)",
                            // "inversion (--)",
                            // "clipping",
                        ]
                    }
                ],
                color: {
                    field: 'svType',
                    type: 'nominal',
                    legend: true,
                    domain: [
                        crossChr ? 'translocation (-+)' : 'duplication (-+)',
                        'deletion (+-)',
                        'inversion (++)',
                        'inversion (--)',
                        'clipping'
                    ],
                    range: ['#569C4D', '#DA5456', '#EA8A2A', '#ECC949', '#414141']
                }
            },
            {
                dataTransform: [
                    {
                        type: 'displace',
                        method: 'pile',
                        boundingBox: {
                            startField: 'from',
                            endField: 'to',
                            padding: 5,
                            isPaddingBP: true
                        },
                        newField: 'pileup-row',
                        maxRows: 300
                    },
                    {
                        type: 'filter',
                        field: 'svType',
                        oneOf: ['normal read', 'more than two mates', 'mates not found within chromosome']
                    }
                ],
                color: { value: '#C8C8C8' }
            },
            {
                dataTransform: [
                    {
                        type: 'displace',
                        method: 'pile',
                        boundingBox: {
                            startField: 'from',
                            endField: 'to',
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
                        baseGenomicField: 'from',
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
                            startField: 'from',
                            endField: 'to',
                            padding: 5,
                            isPaddingBP: true
                        },
                        newField: 'pileup-row',
                        maxRows: 300
                    },
                    {
                        type: 'filter',
                        field: 'name',
                        oneOf: svReads.filter(d => d.type === 'deletion (+-)').map(d => d.name)
                    }
                ],
                color: { value: defaultEncodings.color.svclass['deletion (+-)'] }
            },
            {
                dataTransform: [
                    {
                        type: 'displace',
                        method: 'pile',
                        boundingBox: {
                            startField: 'from',
                            endField: 'to',
                            padding: 5,
                            isPaddingBP: true
                        },
                        newField: 'pileup-row',
                        maxRows: 300
                    },
                    {
                        type: 'filter',
                        field: 'name',
                        oneOf: svReads.filter(d => d.type === 'inversion (++)').map(d => d.name)
                    }
                ],
                color: { value: defaultEncodings.color.svclass['inversion (++)'] }
            },
            {
                dataTransform: [
                    {
                        type: 'displace',
                        method: 'pile',
                        boundingBox: {
                            startField: 'from',
                            endField: 'to',
                            padding: 5,
                            isPaddingBP: true
                        },
                        newField: 'pileup-row',
                        maxRows: 300
                    },
                    {
                        type: 'filter',
                        field: 'name',
                        oneOf: svReads.filter(d => d.type === 'inversion (--)').map(d => d.name)
                    }
                ],
                color: { value: defaultEncodings.color.svclass['inversion (--)'] }
            },
            {
                dataTransform: [
                    {
                        type: 'displace',
                        method: 'pile',
                        boundingBox: {
                            startField: 'from',
                            endField: 'to',
                            padding: 5,
                            isPaddingBP: true
                        },
                        newField: 'pileup-row',
                        maxRows: 300
                    },
                    {
                        type: 'filter',
                        field: 'name',
                        oneOf: svReads.filter(d => d.type === 'duplication (-+)').map(d => d.name)
                    }
                ],
                color: { value: defaultEncodings.color.svclass['duplication (-+)'] }
            }
        ],
        x: { field: 'from', type: 'genomic' },
        xe: { field: 'to', type: 'genomic' },
        row: { field: 'pileup-row', type: 'nominal', padding: 0.2 },
        tooltip: [
            { field: 'id', type: 'nominal' },
            { field: 'name', type: 'nominal' },
            { field: 'from', type: 'genomic' },
            { field: 'to', type: 'genomic' },
            { field: 'cigar', type: 'nominal' },
            { field: 'strand', type: 'nominal' }
        ],
        style: { outlineWidth: 0.5 },
        width,
        height: 500
    };
}
