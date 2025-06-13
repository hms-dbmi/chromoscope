import { GoslingSpec } from 'gosling.js';
import { Assembly, MultipleViews, SingleTrack, SingleView, View } from 'gosling.js/dist/src/core/gosling.schema';
import getMidView from './mid-spec';
import { alignment } from './alignment';
import { verticalGuide } from './vertical-guide';
import tracks from './track';
import { SampleType } from './data/samples';
import { driversToTsvUrl } from './utils';

export interface SpecOption extends SampleType {
    showOverview: boolean;
    showPutativeDriver: boolean;
    xDomain?: [number, number];
    xOffset: number;
    width: number;
    drivers: { [k: string]: string | number }[] | string;
    selectedSvId: string;
    breakpoints: [number, number, number, number];
    svReads: { name: string; type: string }[];
    crossChr: boolean;
    bpIntervals: [number, number, number, number] | undefined;
    spacing: number;
    selectedMutationAbsPos: number;
}

function generateSpec(opt: SpecOption): GoslingSpec {
    const { assembly, id, bam, bai, width, selectedSvId, breakpoints, bpIntervals, spacing, selectedMutationAbsPos } =
        opt;

    const topViewWidth = Math.min(width, 600);
    const midViewWidth = width;
    const bottomViewGap = 19;
    const bottomViewWidth = width / 2.0 - bottomViewGap / 2.0;
    const topViewXOffset = (width - topViewWidth) / 2.0;
    // console.log(getOverviewSpec({
    //     ...option,
    //     width: topViewWidth,
    //     xOffset: topViewXOffset
    // }));
    return {
        layout: 'linear',
        arrangement: 'vertical',
        centerRadius: 0.5,
        assembly,
        spacing,
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
                        ...opt,
                        width: topViewWidth,
                        xOffset: topViewXOffset
                    }),
                    ...getMidView({
                        ...opt,
                        width: midViewWidth,
                        selectedMutationAbsPos
                    })
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
                                  zoomLimits: [50, 1000],
                                  layout: 'linear',
                                  centerRadius: 0.05,
                                  xDomain: { interval: [breakpoints[0], breakpoints[1]] },
                                  spacing: 0.01,
                                  linkingId: 'detail-scale-1',
                                  tracks: [
                                      ...(opt.bam && opt.bai
                                          ? [
                                                {
                                                    ...tracks.coverage({ ...opt, width: bottomViewWidth }, true)
                                                },
                                                ...(bpIntervals ? [verticalGuide(bpIntervals[0], bpIntervals[1])] : [])
                                            ]
                                          : []),
                                      {
                                          id: `${id}-bottom-left-sequence`,
                                          title: '  Sequence',
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
                                      ...(opt.bam && opt.bai
                                          ? [
                                                {
                                                    ...alignment({ ...opt, width: bottomViewWidth }, true)
                                                }
                                            ]
                                          : []),
                                      ...(bpIntervals ? [verticalGuide(bpIntervals[0], bpIntervals[1])] : [])
                                  ]
                              },
                              {
                                  static: false,
                                  zoomLimits: [50, 1000],
                                  layout: 'linear',
                                  centerRadius: 0.05,
                                  xDomain: { interval: [breakpoints[2], breakpoints[3]] },
                                  spacing: 0.01,
                                  linkingId: 'detail-scale-2',
                                  tracks: [
                                      ...(opt.bam && opt.bai
                                          ? [
                                                {
                                                    ...tracks.coverage({ ...opt, width: bottomViewWidth }, false)
                                                },
                                                ...(bpIntervals ? [verticalGuide(bpIntervals[2], bpIntervals[3])] : [])
                                            ]
                                          : []),
                                      {
                                          id: `${id}-bottom-right-sequence`,
                                          title: ' Sequence',
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
                                      ...(opt.bam && opt.bai
                                          ? [
                                                {
                                                    ...alignment({ ...opt, width: bottomViewWidth }, false)
                                                }
                                            ]
                                          : []),
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
    const { assembly, id, cnv, sv, width, showPutativeDriver, showOverview, selectedSvId, xOffset, drivers, cnFields } =
        option;

    if (!showOverview) return [];

    return [
        {
            xOffset,
            static: true,
            layout: 'circular',
            spacing: 1,
            style: {
                outlineWidth: 1,
                outline: 'lightgray'
            },
            tracks: [
                {
                    name: 'Ideogram',
                    id: `${id}-top-ideogram`,
                    alignment: 'overlay',
                    data: {
                        url:
                            assembly === 'hg38'
                                ? 'https://raw.githubusercontent.com/sehilyi/gemini-datasets/master/data/UCSC.HG38.Human.CytoBandIdeogram.csv'
                                : 'https://raw.githubusercontent.com/sehilyi/gemini-datasets/master/data/UCSC.HG19.Human.CytoBandIdeogram.csv',
                        type: 'csv',
                        chromosomeField: 'Chromosome',
                        genomicFields: ['chromStart', 'chromEnd']
                    },
                    tracks: [
                        { mark: 'rect' },
                        {
                            mark: 'brush',
                            x: { linkingId: 'mid-scale' },
                            strokeWidth: { value: 1 },
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
                    strokeWidth: { value: 0 },
                    width,
                    height: 100
                },
                tracks.driver(id, driversToTsvUrl(drivers), width, 40, 'top'),
                tracks.boundary('driver', 'top'),
                ...(cnv ? [tracks.gain(id, cnv, width, 40, 'top', cnFields)] : []),
                tracks.boundary('gain', 'top'),
                ...(cnv ? [tracks.loh(id, cnv, width, 40, 'top', cnFields)] : []),
                tracks.boundary('loh', 'top'),
                tracks.sv(id, sv, width, 80, 'top', selectedSvId)
            ]
        }
    ];
}

export default generateSpec;
