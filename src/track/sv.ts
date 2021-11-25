import { OverlaidTracks, StrReplaceTransform } from 'gosling.js/dist/src/core/gosling.schema';
import { consistentSv } from '../sanitize';
import defaults from '../default-encoding';
import { TrackMode } from '.';

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
        title:
            mode === 'small'
                ? ''
                : 'Structural Variant' + (mode === 'mid' ? ' (Click on a SV to see alignment around breakpoints)' : ''),
        alignment: 'overlay',
        data: {
            url,
            type: 'csv',
            separator: '\t',
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
        tracks:
            mode !== 'mid'
                ? [{ mark: 'withinLink', dataTransform: [replace] }]
                : [
                      {
                          mark: 'withinLink',
                          dataTransform: [
                              replace,
                              {
                                  type: 'filter',
                                  field: 'sv_id',
                                  oneOf: [selectedSvId],
                                  not: true
                              }
                          ]
                      },
                      {
                          mark: 'withinLink',
                          dataTransform: [replace, { type: 'filter', field: 'sv_id', oneOf: [selectedSvId] }],
                          strokeWidth: { value: 3 },
                          opacity: { value: 1 }
                      }
                  ],
        x: { field: 'start1', type: 'genomic' },
        xe: { field: 'end2', type: 'genomic' },
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
        strokeWidth: { value: mode === 'small' ? 0.5 : 1 },
        opacity: { value: 0.3 },
        tooltip: [
            { field: 'start1', type: 'genomic' },
            { field: 'end2', type: 'genomic' },
            { field: 'svclass', type: 'nominal' },
            { field: 'sv_id', type: 'nominal' },
            { field: 'svmethod', type: 'nominal' },
            { field: 'pe_support', type: 'nominal' }
        ],
        style: { bazierLink: true },
        width,
        height
    };
}
