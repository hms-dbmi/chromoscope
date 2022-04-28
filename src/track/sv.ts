import { OverlaidTracks, StrConcatTransform, StrReplaceTransform } from 'gosling.js/dist/src/core/gosling.schema';
import { consistentSv } from '../sanitize';
import defaults from '../default-encoding';
import { TrackMode } from '.';

const svInfer = [
    {
        type: 'concat',
        separator: ',',
        fields: ['strand1', 'strand2'],
        newField: 'svclass'
    },
    {
        type: 'replace',
        field: 'svclass',
        replace: [
            { from: '+,-', to: 'Deletion' },
            { from: '-,-', to: 'Inversion (TtT)' },
            { from: '+,+', to: 'Inversion (HtH)' },
            { from: '-,+', to: 'Duplication' }
        ],
        newField: 'svclass'
    }
] as [StrConcatTransform, StrReplaceTransform];

const replace = {
    type: 'replace',
    field: 'svclass',
    replace: [
        ...Object.entries(consistentSv).map(([from, to]) => {
            return { from, to };
        })
    ],
    newField: 'svclass'
} as StrReplaceTransform;

export default function sv(
    sampleId: string,
    url: string,
    width: number,
    height: number,
    mode: TrackMode,
    selectedSvId: string
): OverlaidTracks {
    return {
        id: `${sampleId}-${mode}-sv`,
        title: mode === 'small' ? '' : 'Structural Variant',
        alignment: 'overlay',
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
            {
                dataTransform: [
                    ...svInfer,
                    replace,
                    {
                        type: 'filter',
                        field: 'sv_id',
                        oneOf: [selectedSvId],
                        not: true
                    },
                    {
                        type: 'filter',
                        field: 'svclass',
                        oneOf: ['Translocation'],
                        not: false
                    }
                ],
                x: { field: 'start1', type: 'genomic' },
                xe: { field: 'end2', type: 'genomic' },
                baselineY: height / 2.0
            },
            // {
            //     dataTransform: [
            //         replace,
            //         {
            //             type: 'filter',
            //             field: 'sv_id',
            //             oneOf: [selectedSvId],
            //             not: true
            //         },
            //         {
            //             type: 'filter',
            //             field: 'svclass',
            //             oneOf: ['Translocation'],
            //             not: false
            //         }
            //     ],
            //     x: { field: 'start1', type: 'genomic' },
            //     xe: { field: 'end2', type: 'genomic' },
            //     baselineY: height / 2.0
            // },
            ...((mode !== 'mid'
                ? []
                : [
                      {
                          mark: 'bar',
                          dataTransform: [
                              ...svInfer,
                              replace,
                              //   {
                              //       type: 'filter',
                              //       field: 'sv_id',
                              //       oneOf: [selectedSvId],
                              //       not: true
                              //   },
                              {
                                  type: 'filter',
                                  field: 'svclass',
                                  oneOf: ['Translocation'],
                                  not: false
                              }
                          ],
                          x: { field: 'start1', type: 'genomic' },
                          size: { value: 2 }
                      },
                      {
                          mark: 'bar',
                          dataTransform: [
                              ...svInfer,
                              replace,
                              //   {
                              //       type: 'filter',
                              //       field: 'sv_id',
                              //       oneOf: [selectedSvId],
                              //       not: true
                              //   },
                              {
                                  type: 'filter',
                                  field: 'svclass',
                                  oneOf: ['Translocation'],
                                  not: false
                              }
                          ],
                          x: { field: 'end2', type: 'genomic' },
                          size: { value: 2 }
                      }
                  ]) as OverlaidTracks[]),
            {
                dataTransform: [
                    ...svInfer,
                    replace,
                    {
                        type: 'filter',
                        field: 'sv_id',
                        oneOf: [selectedSvId],
                        not: true
                    },
                    {
                        type: 'filter',
                        field: 'svclass',
                        oneOf: ['Translocation'],
                        not: true
                    }
                ],
                x: { field: 'start1', type: 'genomic' },
                xe: { field: 'end2', type: 'genomic' }
            },
            {
                dataTransform: [
                    ...svInfer,
                    replace,
                    { type: 'filter', field: 'sv_id', oneOf: [selectedSvId] },
                    {
                        type: 'filter',
                        field: 'svclass',
                        oneOf: ['Translocation']
                    }
                ],
                x: { field: 'start1', type: 'genomic' },
                xe: { field: 'end2', type: 'genomic' },
                strokeWidth: { value: 3 },
                opacity: { value: 1 },
                baselineY: height / 2.0
            },
            {
                dataTransform: [
                    ...svInfer,
                    replace,
                    { type: 'filter', field: 'sv_id', oneOf: [selectedSvId] },
                    {
                        type: 'filter',
                        field: 'svclass',
                        oneOf: ['Translocation'],
                        not: true
                    }
                ],
                x: { field: 'start1', type: 'genomic' },
                xe: { field: 'end2', type: 'genomic' },
                strokeWidth: { value: 3 },
                opacity: { value: 1 }
            }
        ],
        y: { value: height / 2.0 },
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
        strokeWidth: { value: mode === 'small' ? 0.5 : mode === 'mid' ? 2 : 1 },
        opacity: { value: 0.4 },
        tooltip: [
            { field: 'start1', type: 'genomic' },
            { field: 'end2', type: 'genomic' },
            { field: 'strand1', type: 'nominal' },
            { field: 'strand2', type: 'nominal' },
            { field: 'svclass', type: 'nominal' },
            { field: 'sv_id', type: 'nominal' },
            // { field: 'svmethod', type: 'nominal' },
            { field: 'pe_support', type: 'nominal' }
        ],
        style: { linkStyle: 'elliptical', linkMinHeight: 0.7 },
        width,
        height
    };
}
