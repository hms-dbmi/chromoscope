import { SpecOption } from './main-spec';
import { SingleTrack, View } from 'gosling.js/dist/src/core/gosling.schema';
import tracks from './track';

export default function getMidView(option: SpecOption): View[] {
    const {
        sampleId,
        assembly,
        vcfUrl,
        cnvUrl,
        svUrl,
        width,
        showPutativeDriver,
        showOverview,
        xOffset,
        selectedSvId,
        drivers,
        cnFields
    } = option;
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
                        url:
                            assembly === 'hg38'
                                ? 'https://raw.githubusercontent.com/sehilyi/gemini-datasets/master/data/UCSC.HG38.Human.CytoBandIdeogram.csv'
                                : 'https://raw.githubusercontent.com/sehilyi/gemini-datasets/master/data/UCSC.HG19.Human.CytoBandIdeogram.csv',
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
                              tooltip: [
                                  { field: 'pos', alt: 'Position', type: 'genomic' },
                                  { field: 'ref', alt: 'REF', type: 'nominal' },
                                  { field: 'alt', alt: 'ALT', type: 'nominal' },
                                  { field: 'category', alt: 'Category', type: 'nominal' },
                                  { field: 'top_category', alt: 'Top Category', type: 'nominal' },
                                  { field: 'biallelic', alt: 'Biallelic', type: 'nominal' }
                              ],
                              width,
                              height: 20
                          } as SingleTrack
                      ]),
                tracks.boundary('driver', 'mid'),
                {
                    id: `${sampleId}-mid-gene`,
                    alignment: 'overlay',
                    title: 'Genes',
                    template: 'gene',
                    data: {
                        url:
                            assembly === 'hg19'
                                ? // TODO: change to gosling's one
                                  'https://resgen.io/api/v1/tileset_info/?d=NCifnbrKQu6j-ohVWJLoJw'
                                : 'https://server.gosling-lang.org/api/v1/tileset_info/?d=gene-annotation',
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
                ...(!vcfUrl
                    ? []
                    : [
                          tracks.mutation(sampleId, width, 60, 'mid'),
                          tracks.boundary('mutation', 'mid'),
                          tracks.indel(sampleId, width, 40, 'mid'),
                          tracks.boundary('indel', 'mid')
                      ]),
                tracks.cnv(sampleId, cnvUrl, width, 60, 'mid', cnFields),
                tracks.boundary('cnv', 'mid'),
                tracks.gain(sampleId, cnvUrl, width, 20, 'mid', cnFields),
                tracks.boundary('gain', 'mid'),
                tracks.loh(sampleId, cnvUrl, width, 20, 'mid', cnFields),
                tracks.boundary('loh', 'mid'),
                tracks.sv(sampleId, svUrl, width, 250, 'mid', selectedSvId)
            ]
        }
    ];
}
