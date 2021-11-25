import { GoslingSpec } from 'gosling.js';
import { MultipleViews, OverlaidTracks, SingleTrack, SingleView, View } from 'gosling.js/dist/src/core/gosling.schema';
import { alignment } from './alignment';
import { verticalGuide } from './vertical-guide';
import tracks from './track';

export interface SpecOption {
    sampleId: string;
    showOverview: boolean;
    showPutativeDriver: boolean;
    xOffset: number;
    width: number;
    svUrl: string;
    cnvUrl: string;
    bamUrl: string;
    baiUrl: string;
    drivers: { [k: string]: string | number }[];
    selectedSvId: string;
    breakpoints: [number, number, number, number];
    svReads: { name: string; type: string }[];
    crossChr: boolean;
    bpIntervals: [number, number, number, number] | undefined;
}

function generateSpec(option: SpecOption): GoslingSpec {
    const {
        sampleId,
        svUrl,
        cnvUrl,
        bamUrl,
        baiUrl,
        showPutativeDriver,
        showOverview,
        width,
        drivers,
        selectedSvId,
        breakpoints,
        crossChr,
        svReads,
        bpIntervals
    } = option;

    const topViewWidth = Math.min(width, 600);
    const midViewWidth = width;
    const bottomViewGap = 19;
    const bottomViewWidth = width / 2.0 - bottomViewGap / 2.0;
    const topViewXOffset = (width - topViewWidth) / 2.0;

    return {
        layout: 'linear',
        arrangement: 'vertical',
        centerRadius: 0.5,
        assembly: 'hg19',
        spacing: 40,
        style: {
            outlineWidth: 1,
            outline: 'lightgray',
            enableSmoothPath: false
        },
        views: [
            {
                arrangement: 'vertical',
                views: [
                    ...getOverviewSpec({
                        ...option,
                        width: topViewWidth,
                        xOffset: topViewXOffset
                    }),
                    {
                        linkingId: 'mid-scale',
                        xDomain: { chromosome: '1' },
                        layout: 'linear',
                        tracks: [
                            {
                                id: `${sampleId}-mid-ideogram`,
                                style: {
                                    background: '#D7EBFF',
                                    outline: '#8DC1F2',
                                    outlineWidth: 5
                                },
                                title: 'Ideogram',
                                alignment: 'overlay',
                                data: {
                                    url: 'https://raw.githubusercontent.com/sehilyi/gemini-datasets/master/data/UCSC.HG38.Human.CytoBandIdeogram.csv',
                                    type: 'csv',
                                    chromosomeField: 'Chromosome',
                                    genomicFields: ['chromStart', 'chromEnd']
                                },
                                tracks: [
                                    {
                                        mark: 'rect',
                                        dataTransform: [
                                            {
                                                type: 'filter',
                                                field: 'Stain',
                                                oneOf: ['acen'],
                                                not: true
                                            }
                                        ]
                                    },
                                    {
                                        mark: 'triangleRight',
                                        dataTransform: [
                                            { type: 'filter', field: 'Stain', oneOf: ['acen'] },
                                            { type: 'filter', field: 'Name', include: 'q' }
                                        ]
                                    },
                                    {
                                        mark: 'triangleLeft',
                                        dataTransform: [
                                            { type: 'filter', field: 'Stain', oneOf: ['acen'] },
                                            { type: 'filter', field: 'Name', include: 'p' }
                                        ]
                                    },
                                    {
                                        mark: 'text',
                                        dataTransform: [
                                            {
                                                type: 'filter',
                                                field: 'Stain',
                                                oneOf: ['acen'],
                                                not: true
                                            }
                                        ],
                                        size: { value: 12 },
                                        color: {
                                            field: 'Stain',
                                            type: 'nominal',
                                            domain: ['gneg', 'gpos25', 'gpos50', 'gpos75', 'gpos100', 'gvar'],
                                            range: ['black', 'black', 'black', 'black', 'white', 'black']
                                        },
                                        visibility: [
                                            {
                                                operation: 'less-than',
                                                measure: 'width',
                                                threshold: '|xe-x|',
                                                transitionPadding: 10,
                                                target: 'mark'
                                            }
                                        ]
                                    }
                                ],
                                color: {
                                    field: 'Stain',
                                    type: 'nominal',
                                    domain: ['gneg', 'gpos25', 'gpos50', 'gpos75', 'gpos100', 'gvar', 'acen'],
                                    range: ['white', 'lightgray', 'gray', 'gray', 'black', '#7B9CC8', '#DC4542']
                                },
                                size: { value: 18 },
                                x: { field: 'chromStart', type: 'genomic' },
                                xe: { field: 'chromEnd', type: 'genomic' },
                                text: { field: 'Name', type: 'nominal' },
                                stroke: { value: 'gray' },
                                strokeWidth: { value: 0.3 },
                                width: midViewWidth,
                                height: 30
                            },
                            ...(!showPutativeDriver
                                ? []
                                : [
                                      {
                                          id: `${sampleId}-mid-driver`,
                                          title: 'Putative Driver',
                                          data: {
                                              values: drivers,
                                              type: 'json',
                                              chromosomeField: 'chr',
                                              genomicFields: ['pos']
                                          },
                                          // dataTransform: [
                                          //   { type: 'displace', method: 'pile', boundingBox: { startField: 'pos', endField: 'pos', padding: 100} }
                                          // ],
                                          mark: 'text',
                                          x: { field: 'pos', type: 'genomic' },
                                          text: { field: 'gene', type: 'nominal' },
                                          color: { value: 'black' },
                                          style: { textFontWeight: 'normal', dx: -10 },
                                          width: midViewWidth,
                                          height: 20
                                      } as SingleTrack
                                  ]),
                            {
                                id: `${sampleId}-mid-gene`,
                                alignment: 'overlay',
                                title: 'Genes',
                                template: 'gene',
                                data: {
                                    url: 'https://higlass.io/api/v1/tileset_info/?d=OHJakQICQD6gTD7skx4EWA',
                                    type: 'beddb',
                                    genomicFields: [
                                        { index: 1, name: 'start' },
                                        { index: 2, name: 'end' }
                                    ],
                                    valueFields: [
                                        { index: 5, name: 'strand', type: 'nominal' },
                                        { index: 3, name: 'name', type: 'nominal' }
                                    ],
                                    exonIntervalFields: [
                                        { index: 12, name: 'start' },
                                        { index: 13, name: 'end' }
                                    ]
                                },
                                encoding: {
                                    startPosition: { field: 'start' },
                                    endPosition: { field: 'end' },
                                    strandColor: { field: 'strand', range: ['gray'] },
                                    strandRow: { field: 'strand' },
                                    opacity: { value: 0.4 },
                                    geneHeight: { value: 60 / 3.0 },
                                    geneLabel: { field: 'name' },
                                    geneLabelFontSize: { value: 60 / 3.0 },
                                    geneLabelColor: { field: 'strand', range: ['black'] },
                                    geneLabelStroke: { value: 'white' },
                                    geneLabelStrokeThickness: { value: 4 },
                                    geneLabelOpacity: { value: 1 },
                                    type: { field: 'type' }
                                },
                                width: midViewWidth,
                                height: 60
                            },
                            tracks.gain(sampleId, cnvUrl, midViewWidth, 20, 'mid'),
                            tracks.loh(sampleId, cnvUrl, midViewWidth, 20, 'mid'),
                            tracks.sv(sampleId, svUrl, midViewWidth, 200, 'mid', selectedSvId)
                        ]
                    }
                ]
            },
            ...(selectedSvId === ''
                ? []
                : ([
                      {
                          arrangement: 'horizontal',
                          spacing: bottomViewGap,
                          views: [
                              {
                                  static: false,
                                  layout: 'linear',
                                  centerRadius: 0.05,
                                  xDomain: { interval: [breakpoints[0], breakpoints[1]] },
                                  spacing: 0.01,
                                  linkingId: 'detail-scale-1',
                                  tracks: [
                                      {
                                          id: `${sampleId}-bottom-left-coverage`,
                                          title: 'Coverage',
                                          data: {
                                              type: 'bam',
                                              url: bamUrl,
                                              indexUrl: baiUrl
                                          },
                                          dataTransform: [
                                              {
                                                  type: 'coverage',
                                                  startField: 'start',
                                                  endField: 'end'
                                              }
                                          ],
                                          mark: 'bar',
                                          x: { field: 'start', type: 'genomic' },
                                          xe: { field: 'end', type: 'genomic' },
                                          y: {
                                              field: 'coverage',
                                              type: 'quantitative',
                                              axis: 'right',
                                              grid: true
                                          },
                                          color: { value: 'lightgray' },
                                          stroke: { value: 'gray' },
                                          width: bottomViewWidth,
                                          height: 80
                                      },
                                      ...(bpIntervals ? [verticalGuide(bpIntervals[0], bpIntervals[1])] : []),
                                      // {
                                      //   id: `${sampleId}-bottom-left-gene`,
                                      //   alignment: "overlay",
                                      //   title: "hg19 | Genes",
                                      //   template: "gene",
                                      //   data: {
                                      //     url: "https://higlass.io/api/v1/tileset_info/?d=OHJakQICQD6gTD7skx4EWA",
                                      //     // 'url': 'https://server.gosling-lang.org/api/v1/tileset_info/?d=gene-annotation',
                                      //     type: "beddb",
                                      //     genomicFields: [
                                      //       { index: 1, name: "start" },
                                      //       { index: 2, name: "end" },
                                      //     ],
                                      //     valueFields: [
                                      //       { index: 5, name: "strand", type: "nominal" },
                                      //       { index: 3, name: "name", type: "nominal" },
                                      //     ],
                                      //     exonIntervalFields: [
                                      //       { index: 12, name: "start" },
                                      //       { index: 13, name: "end" },
                                      //     ],
                                      //   },
                                      //   encoding: {
                                      //     startPosition: { field: "start" },
                                      //     endPosition: { field: "end" },
                                      //     strandColor: { field: "strand", range: ["gray"] },
                                      //     strandRow: { field: "strand" },
                                      //     opacity: { value: 0.4 },
                                      //     geneHeight: { value: 60 / 3.0 },
                                      //     geneLabel: { field: "name" },
                                      //     geneLabelFontSize: { value: 60 / 3.0 },
                                      //     geneLabelColor: { field: "strand", range: ["black"] },
                                      //     geneLabelStroke: { value: "white" },
                                      //     geneLabelStrokeThickness: { value: 4 },
                                      //     geneLabelOpacity: { value: 1 },
                                      //     type: { field: "type" },
                                      //   },
                                      //   width: bottomViewWidth,
                                      //   height: 60,
                                      // },
                                      {
                                          id: `${sampleId}-bottom-left-sequence`,
                                          title: 'Sequence',
                                          alignment: 'overlay',
                                          data: {
                                              url: 'https://server.gosling-lang.org/api/v1/tileset_info/?d=sequence-multivec',
                                              type: 'multivec',
                                              row: 'base',
                                              column: 'position',
                                              value: 'count',
                                              categories: ['A', 'T', 'G', 'C'],
                                              start: 'start',
                                              end: 'end'
                                          },
                                          tracks: [
                                              {
                                                  mark: 'bar',
                                                  y: {
                                                      field: 'count',
                                                      type: 'quantitative',
                                                      axis: 'none'
                                                  }
                                              },
                                              {
                                                  dataTransform: [
                                                      {
                                                          type: 'filter',
                                                          field: 'count',
                                                          oneOf: [0],
                                                          not: true
                                                      }
                                                  ],
                                                  mark: 'text',
                                                  x: { field: 'start', type: 'genomic' },
                                                  xe: { field: 'end', type: 'genomic' },
                                                  size: { value: 24 },
                                                  color: { value: 'white' },
                                                  visibility: [
                                                      {
                                                          operation: 'less-than',
                                                          measure: 'width',
                                                          threshold: '|xe-x|',
                                                          transitionPadding: 30,
                                                          target: 'mark'
                                                      },
                                                      {
                                                          operation: 'LT',
                                                          measure: 'zoomLevel',
                                                          threshold: 10,
                                                          target: 'track'
                                                      }
                                                  ]
                                              }
                                          ],
                                          x: { field: 'position', type: 'genomic' },
                                          color: {
                                              field: 'base',
                                              type: 'nominal',
                                              domain: ['A', 'T', 'G', 'C'],
                                              legend: true
                                          },
                                          text: { field: 'base', type: 'nominal' },
                                          style: { inlineLegend: true },
                                          width: bottomViewWidth,
                                          height: 40
                                      },
                                      {
                                          ...alignment({ ...option, width: bottomViewWidth }, true)
                                      },
                                      ...(bpIntervals ? [verticalGuide(bpIntervals[0], bpIntervals[1])] : [])
                                  ]
                              },
                              {
                                  static: false,
                                  layout: 'linear',
                                  centerRadius: 0.05,
                                  xDomain: { interval: [breakpoints[2], breakpoints[3]] },
                                  spacing: 0.01,
                                  linkingId: 'detail-scale-2',
                                  tracks: [
                                      {
                                          id: `${sampleId}-bottom-right-coverage`,
                                          title: 'Coverage',
                                          data: {
                                              type: 'bam',
                                              url: bamUrl,
                                              indexUrl: baiUrl
                                          },
                                          dataTransform: [
                                              {
                                                  type: 'coverage',
                                                  startField: 'start',
                                                  endField: 'end'
                                              }
                                          ],
                                          mark: 'bar',
                                          x: { field: 'start', type: 'genomic' },
                                          xe: { field: 'end', type: 'genomic' },
                                          y: {
                                              field: 'coverage',
                                              type: 'quantitative',
                                              axis: 'right',
                                              grid: true
                                          },
                                          color: { value: 'lightgray' },
                                          stroke: { value: 'gray' },
                                          width: bottomViewWidth,
                                          height: 80
                                      },
                                      ...(bpIntervals ? [verticalGuide(bpIntervals[2], bpIntervals[3])] : []),
                                      // {
                                      //   id: `${sampleId}-bottom-right-gene`,
                                      //   alignment: "overlay",
                                      //   title: "hg19 | Genes",
                                      //   template: "gene",
                                      //   data: {
                                      //     url: "https://server.gosling-lang.org/api/v1/tileset_info/?d=gene-annotation",
                                      //     type: "beddb",
                                      //     genomicFields: [
                                      //       { index: 1, name: "start" },
                                      //       { index: 2, name: "end" },
                                      //     ],
                                      //     valueFields: [
                                      //       { index: 5, name: "strand", type: "nominal" },
                                      //       { index: 3, name: "name", type: "nominal" },
                                      //     ],
                                      //     exonIntervalFields: [
                                      //       { index: 12, name: "start" },
                                      //       { index: 13, name: "end" },
                                      //     ],
                                      //   },
                                      //   encoding: {
                                      //     startPosition: { field: "start" },
                                      //     endPosition: { field: "end" },
                                      //     strandColor: { field: "strand", range: ["gray"] },
                                      //     strandRow: { field: "strand" },
                                      //     opacity: { value: 0.4 },
                                      //     geneHeight: { value: 60 / 3.0 },
                                      //     geneLabel: { field: "name" },
                                      //     geneLabelFontSize: { value: 60 / 3.0 },
                                      //     geneLabelColor: { field: "strand", range: ["black"] },
                                      //     geneLabelStroke: { value: "white" },
                                      //     geneLabelStrokeThickness: { value: 4 },
                                      //     geneLabelOpacity: { value: 1 },
                                      //     type: { field: "type" },
                                      //   },
                                      //   width: bottomViewWidth,
                                      //   height: 60,
                                      // },
                                      {
                                          id: `${sampleId}-bottom-right-sequence`,
                                          title: 'Sequence',
                                          alignment: 'overlay',
                                          data: {
                                              url: 'https://server.gosling-lang.org/api/v1/tileset_info/?d=sequence-multivec',
                                              type: 'multivec',
                                              row: 'base',
                                              column: 'position',
                                              value: 'count',
                                              categories: ['A', 'T', 'G', 'C'],
                                              start: 'start',
                                              end: 'end'
                                          },
                                          tracks: [
                                              {
                                                  mark: 'bar',
                                                  y: {
                                                      field: 'count',
                                                      type: 'quantitative',
                                                      axis: 'none'
                                                  }
                                              },
                                              {
                                                  dataTransform: [
                                                      {
                                                          type: 'filter',
                                                          field: 'count',
                                                          oneOf: [0],
                                                          not: true
                                                      }
                                                  ],
                                                  mark: 'text',
                                                  x: { field: 'start', type: 'genomic' },
                                                  xe: { field: 'end', type: 'genomic' },
                                                  size: { value: 24 },
                                                  color: { value: 'white' },
                                                  visibility: [
                                                      {
                                                          operation: 'less-than',
                                                          measure: 'width',
                                                          threshold: '|xe-x|',
                                                          transitionPadding: 30,
                                                          target: 'mark'
                                                      },
                                                      {
                                                          operation: 'LT',
                                                          measure: 'zoomLevel',
                                                          threshold: 10,
                                                          target: 'track'
                                                      }
                                                  ]
                                              }
                                          ],
                                          x: { field: 'position', type: 'genomic' },
                                          color: {
                                              field: 'base',
                                              type: 'nominal',
                                              domain: ['A', 'T', 'G', 'C'],
                                              legend: true
                                          },
                                          text: { field: 'base', type: 'nominal' },
                                          style: { inlineLegend: true },
                                          width: bottomViewWidth,
                                          height: 40
                                      },
                                      {
                                          ...alignment({ ...option, width: bottomViewWidth }, false)
                                      },
                                      ...(bpIntervals ? [verticalGuide(bpIntervals[2], bpIntervals[3])] : [])
                                  ]
                              }
                          ]
                      }
                  ] as (SingleView | MultipleViews)[]))
        ]
    };
}

function getOverviewSpec(option: SpecOption): View[] {
    const { sampleId, cnvUrl, svUrl, width, showPutativeDriver, showOverview, xOffset, drivers } = option;

    if (!showOverview) return [];

    return [
        {
            xOffset,
            layout: 'circular',
            spacing: 1,
            style: {
                outlineWidth: 1,
                outline: 'lightgray'
            },
            tracks: [
                {
                    id: `${sampleId}-top-ideogram`,
                    title: 'Ideogram',
                    alignment: 'overlay',
                    data: {
                        url: 'https://raw.githubusercontent.com/sehilyi/gemini-datasets/master/data/UCSC.HG38.Human.CytoBandIdeogram.csv',
                        type: 'csv',
                        chromosomeField: 'Chromosome',
                        genomicFields: ['chromStart', 'chromEnd']
                    },
                    tracks: [
                        { mark: 'rect' },
                        {
                            mark: 'brush',
                            x: { linkingId: 'mid-scale' },
                            strokeWidth: { value: 2 },
                            stroke: { value: '#0070DC' },
                            color: { value: '#AFD8FF' },
                            opacity: { value: 0.5 }
                        }
                    ],
                    color: {
                        field: 'Stain',
                        type: 'nominal',
                        domain: ['gneg', 'gpos25', 'gpos50', 'gpos75', 'gpos100', 'gvar', 'acen'],
                        range: ['white', 'lightgray', 'gray', 'gray', 'black', '#7B9CC8', '#DC4542']
                    },
                    size: { value: 18 },
                    x: { field: 'chromStart', type: 'genomic' },
                    xe: { field: 'chromEnd', type: 'genomic' },
                    stroke: { value: 'gray' },
                    strokeWidth: { value: 0.3 },
                    width,
                    height: 100
                },
                ...(!showPutativeDriver
                    ? []
                    : [
                          {
                              id: `${sampleId}-top-driver`,
                              title: 'Putative Driver',
                              alignment: 'overlay',
                              data: {
                                  values: drivers,
                                  type: 'json',
                                  chromosomeField: 'chr',
                                  genomicFields: ['pos']
                              },
                              tracks: [
                                  { mark: 'text', size: { value: 6 } }
                                  // {'mark': 'triangleBottom', 'size': {'value': 5}}
                              ],
                              x: { field: 'pos', type: 'genomic' },
                              text: { field: 'gene', type: 'nominal' },
                              color: { value: 'black' },
                              style: {
                                  textFontWeight: 'normal',
                                  dx: -10,
                                  outlineWidth: 0
                              },
                              width,
                              height: 40
                          } as OverlaidTracks
                      ]),
                tracks.gain(sampleId, cnvUrl, width, 40, 'top'),
                tracks.loh(sampleId, cnvUrl, width, 40, 'top'),
                tracks.sv(sampleId, svUrl, width, 80, 'top', '')
            ]
        }
    ];
}

export default generateSpec;
