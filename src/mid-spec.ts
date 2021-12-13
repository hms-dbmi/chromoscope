import { GoslingSpec } from 'gosling.js';
import { SpecOption } from './spec-generator';
import { MultipleViews, SingleTrack, SingleView, View } from 'gosling.js/dist/src/core/gosling.schema';
import tracks from './track';

export default function getMidView(option: SpecOption): View[] {
    const { sampleId, cnvUrl, svUrl, width, showPutativeDriver, showOverview, xOffset, selectedSvId, drivers } = option;
    return [
        {
            linkingId: 'mid-scale',
            xDomain: { chromosome: '3' },
            layout: 'linear',
            tracks: [
                {
                    id: `${sampleId}-mid-ideogram`,
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
                    height: 18
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
                              width,
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
                    width,
                    height: 60
                },
                tracks.gain(sampleId, cnvUrl, width, 20, 'mid'),
                tracks.loh(sampleId, cnvUrl, width, 20, 'mid'),
                tracks.sv(sampleId, svUrl, width, 200, 'mid', selectedSvId),
                tracks.boundary('mid')
            ]
        }
    ];
}
