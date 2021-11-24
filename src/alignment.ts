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
                color: { value: '#C8C8C8' }
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
                        oneOf: svReads.filter(d => d.type === 'duplication (-+)').map(d => d.name)
                    }
                ],
                color: { value: defaultEncodings.color.svclass['duplication (-+)'] }
            }
        ],
        x: { field: 'start', type: 'genomic' },
        xe: { field: 'end', type: 'genomic' },
        row: { field: 'pileup-row', type: 'nominal', padding: 0.2 },
        tooltip: [
            { field: 'id', type: 'nominal' },
            { field: 'name', type: 'nominal' },
            { field: 'start', type: 'genomic' },
            { field: 'end', type: 'genomic' },
            { field: 'cigar', type: 'nominal' },
            { field: 'strand', type: 'nominal' }
        ],
        style: { outlineWidth: 0.5 },
        width,
        height: 500
    };
}
