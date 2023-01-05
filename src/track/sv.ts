import {
    FilterTransform,
    OverlaidTracks,
    SingleTrack,
    StrReplaceTransform,
    SvTypeTransform
} from 'gosling.js/dist/src/core/gosling.schema';
import { consistentSv } from '../constants';
import defaults from '../default-encoding';
import { TrackMode } from '.';

const svInfer: [SvTypeTransform, StrReplaceTransform] = [
    {
        type: 'svType',
        firstBp: {
            chrField: 'chrom1',
            posField: 'start1',
            strandField: 'strand1'
        },
        secondBp: {
            chrField: 'chrom2',
            posField: 'start2',
            strandField: 'strand2'
        },
        newField: 'svclass'
    },
    {
        type: 'replace',
        field: 'svclass',
        replace: [
            ...Object.entries(consistentSv).map(([from, to]) => {
                return { from, to };
            })
        ],
        newField: 'svclass'
    }
];

type SvType = 'Translocation' | 'Duplication' | 'Deletion' | 'Inversion (TtT)' | 'Inversion (HtH)';
function filterSv(oneOf: SvType[], not: boolean): FilterTransform {
    return {
        type: 'filter',
        field: 'svclass',
        oneOf,
        not
    };
}

export default function sv(
    sampleId: string,
    url: string,
    width: number,
    height: number,
    mode: TrackMode,
    selectedSvId: string
): OverlaidTracks {
    const _baselineYMap: { [k in SvType]: { y: number; ye: number } } = {
        Translocation: { y: (height / 5) * 4, ye: height },
        Deletion: { y: height / 5, ye: 1 },
        Duplication: { y: height / 5, ye: (height / 5) * 2 },
        'Inversion (TtT)': { y: (height / 5) * 3, ye: (height / 5) * 2 },
        'Inversion (HtH)': { y: (height / 5) * 3, ye: (height / 5) * 4 }
    };
    const arcs = (sv: SvType, selected: boolean): Partial<SingleTrack> => {
        const { y, ye } = _baselineYMap[sv];
        return {
            // TODO: the right end does not sometimes show the arc.
            dataTransform: [
                ...svInfer,
                {
                    type: 'filter',
                    field: 'sv_id',
                    oneOf: [selectedSvId],
                    not: !selected
                },
                filterSv([sv], false)
            ],
            x: { field: 'start1', type: 'genomic' },
            xe: { field: 'end2', type: 'genomic' },
            y: { value: y },
            ye: { value: ye },
            flipY: true,
            ...(selected ? { opacity: { value: 1 }, strokeWidth: { value: 2 } } : {}),
            ...(selected && sv === 'Translocation' ? { stroke: { value: 'grey' } } : {})
        };
    };
    const svs = [...defaults.color.svclass.domain];
    return {
        id: `${sampleId}-${mode}-sv`,
        alignment: 'overlay',
        experimental: {
            mouseEvents: {
                click: true,
                mouseOver: true,
                groupMarksByField: 'sv_id'
            },
            performanceMode: true
        },
        data: {
            url,
            type: 'csv',
            separator: '\t',
            headerNames: [
                'chrom1',
                'start1',
                'end1',
                'chrom2',
                'start2',
                'end2',
                'sv_id',
                'pe_support',
                'strand1',
                'strand2'
            ],
            genomicFieldsToConvert: [
                {
                    chromosomeField: 'chrom1',
                    genomicFields: ['start1', 'end1']
                },
                {
                    chromosomeField: 'chrom2',
                    genomicFields: ['start2', 'end2']
                }
            ]
        },
        mark: 'withinLink',
        tracks: [
            ...svs.map(d => arcs(d as any, false)),
            ...svs.map(d => arcs(d as any, true)),
            ...((mode !== 'mid'
                ? []
                : [
                      {
                          dataTransform: [
                              { type: 'filter', field: 'strand1', oneOf: ['+'] },
                              filterSv(['Translocation'], false)
                          ],
                          mark: 'triangleLeft',
                          x: { field: 'start1', type: 'genomic' },
                          size: { value: 8 },
                          y: { value: height },
                          stroke: { value: 0 },
                          style: { align: 'right' }
                      },
                      {
                          dataTransform: [
                              { type: 'filter', field: 'strand1', oneOf: ['-'] },
                              filterSv(['Translocation'], false)
                          ],
                          mark: 'triangleRight',
                          x: { field: 'start1', type: 'genomic' },
                          size: { value: 8 },
                          y: { value: height },
                          stroke: { value: 0 },
                          style: { align: 'left' }
                      },
                      {
                          dataTransform: [
                              { type: 'filter', field: 'strand2', oneOf: ['+'] },
                              filterSv(['Translocation'], false)
                          ],
                          mark: 'triangleLeft',
                          x: { field: 'end2', type: 'genomic' },
                          size: { value: 8 },
                          y: { value: height },
                          stroke: { value: 0 },
                          style: { align: 'right' }
                      },
                      {
                          dataTransform: [
                              { type: 'filter', field: 'strand2', oneOf: ['-'] },
                              filterSv(['Translocation'], false)
                          ],
                          mark: 'triangleRight',
                          x: { field: 'end2', type: 'genomic' },
                          size: { value: 8 },
                          y: { value: height },
                          stroke: { value: 0 },
                          style: { align: 'left' }
                      }
                  ]) as OverlaidTracks[]),
            ...((mode !== 'mid'
                ? []
                : [
                      {
                          dataTransform: [...svInfer, { type: 'filter', field: 'sv_id', oneOf: [selectedSvId] }],
                          mark: 'rule',
                          x: { field: 'start1', type: 'genomic' },
                          color: { value: 'black' },
                          strokeWidth: { value: 1 },
                          opacity: { value: 1 },
                          style: { dashed: [3, 3] }
                      },
                      {
                          dataTransform: [...svInfer, { type: 'filter', field: 'sv_id', oneOf: [selectedSvId] }],
                          mark: 'rule',
                          x: { field: 'end2', type: 'genomic' },
                          color: { value: 'black' },
                          strokeWidth: { value: 1 },
                          opacity: { value: 1 },
                          style: { dashed: [3, 3] }
                      }
                  ]) as OverlaidTracks[])
        ],
        y: { value: height / 5 },
        color: {
            field: 'svclass',
            type: 'nominal',
            legend: mode !== 'small',
            domain: defaults.color.svclass.domain,
            range: defaults.color.svclass.range
        },
        stroke: {
            field: 'svclass',
            type: 'nominal',
            domain: defaults.color.svclass.domain,
            range: defaults.color.svclass.range
        },
        strokeWidth: { value: 1 },
        opacity: { value: 0.7 },
        tooltip: [
            { field: 'start1', type: 'genomic' },
            { field: 'end2', type: 'genomic' },
            { field: 'strand1', type: 'nominal' },
            { field: 'strand2', type: 'nominal' },
            { field: 'svclass', type: 'nominal' },
            { field: 'sv_id', type: 'nominal' },
            { field: 'pe_support', type: 'nominal' }
        ],
        style: {
            linkStyle: 'elliptical',
            linkMinHeight: 0.7,
            mouseOver: { stroke: '#242424', strokeWidth: 1 },
            withinLinkVerticalLines: true
        },
        width,
        height
    };
}
