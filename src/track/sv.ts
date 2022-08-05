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
    const _baselineYMap: { [k in SvType]: number } = {
        Translocation: (height / 4) * 3,
        Deletion: height / 4,
        Duplication: height / 4,
        'Inversion (TtT)': (height / 4) * 2,
        'Inversion (HtH)': (height / 4) * 2
    };
    const arcs = (sv: SvType, selected: boolean): Partial<SingleTrack> => {
        const _flipYMap: { [k in SvType]: boolean } = {
            Translocation: true,
            Deletion: false,
            Duplication: true,
            'Inversion (TtT)': false,
            'Inversion (HtH)': true
        };
        const flipY = _flipYMap[sv];
        const baselineY = _baselineYMap[sv];
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
            baselineY,
            flipY,
            ...(selected ? { opacity: { value: 1 }, strokeWidth: { value: 2 } } : {}),
            ...(selected && sv === 'Translocation' ? { stroke: { value: 'grey' } } : {})
        };
    };
    const verticalBars = (sv: SvType, selected: boolean): Partial<SingleTrack>[] => {
        const y = { value: height / 2.0 + height - _baselineYMap[sv] };
        return [
            {
                mark: 'rect',
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
                xe: { field: 'start1', type: 'genomic' },
                y,
                strokeWidth: { value: 1 },
                flipY: false
            },
            {
                mark: 'rect',
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
                x: { field: 'end2', type: 'genomic' },
                xe: { field: 'end2', type: 'genomic' },
                y,
                strokeWidth: { value: 1 },
                flipY: false
            }
        ];
    };
    return {
        id: `${sampleId}-${mode}-sv`,
        alignment: 'overlay',
        experimental: {
            mouseEvents: {
                click: true,
                mouseOver: true,
                groupMarksByField: 'sv_id'
            }
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
            ...(mode !== 'mid' ? [] : defaults.color.svclass.domain.map(d => verticalBars(d as any, false)).flat()),
            ...defaults.color.svclass.domain.map(d => arcs(d as any, false)),
            ...(mode !== 'mid' ? [] : defaults.color.svclass.domain.map(d => verticalBars(d as any, true)).flat()),
            ...defaults.color.svclass.domain.map(d => arcs(d as any, true)),
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
            // {
            //     mark: 'point',
            //     size: { value: -1 },
            //     x: { field: 'end2', type: 'genomic' },
            //     row: { field: "svclass", type: "nominal", domain: ['1', '2', '3'], grid: true}
            // }
        ],
        y: { value: height / 4 / 2 },
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
        style: { linkStyle: 'elliptical', linkMinHeight: 0.7, mouseOver: { stroke: 'darkgrey', strokeWidth: 1 } },
        width,
        height
    };
}
