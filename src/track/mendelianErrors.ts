import { OverlaidTracks, Track, FilterTransform, Tooltip, IsOneOfFilter } from 'gosling.js/dist/src/gosling-schema';
import { TrackMode } from './index';
import { filters } from 'pixi.js';

export default function mendelianErrors(
    sampleId: string,
    meUrl1: string,
    meUrl2: string,
    width: number,
    height: number,
    mode: TrackMode,
    cnFields: [string, string, string] = ['trio', 'fat', 'mot']
): OverlaidTracks {
    const [trioError, fatherError, motherError] = cnFields;

    // Helper function to create a track if the field is provided
    const createTrack = (field: string, color: string): Partial<Track>[] => [
        {
            mark: 'area',
            data: {
                separator: ',',
                url: meUrl1,
                type: 'csv',
                chromosomeField: 'seqnames',
                genomicFields: ['start'],
                sampleLength: 5000
            },
            x: { field: 'start', type: 'genomic' },
            size: { value: 1 },
            y: { field: field, type: 'quantitative', axis: 'right', grid: true, range: [0, height - 10] },
            color: { value: color },
            stroke: { field: field, type: 'quantitative'},
            strokeWidth: { value : 1 },
            opacity: { value: 0.7 },
            visibility: [{
                        threshold: 1000000,
                        target: 'track',
                        operation: 'GT',
                        measure: 'zoomLevel'
                        }]
        },
    ];

    // Helper function to create a track if the field is provided
    const createPointTrack = (field: string, color: string, rowIndex: number): Partial<Track> => ({
        mark: 'point',
        data: {
            separator: ',',
            url: meUrl2,
            type: 'csv',
            chromosomeField: 'CHROM',
            genomicFields: ['POS'],
            sampleLength: 1000,
        },
        dataTransform : [{
            type: "filter",
            field: field,
            oneOf: [0],
            not: true
        }],
        x: { field: 'POS', type: 'genomic' },
        size: { field: field, type: 'quantitative' }, 
        y: { value: rowIndex * (height / 3) }, // Place points on different rows
        color: { value: color },
        strokeWidth: { value: 1 },
        opacity: { value: 0.7 },
        visibility: [{
            threshold: 1100000,
            target: 'track',
            operation: 'LT',
            measure: 'zoomLevel'
        }]
    });

    return {
        id: `${sampleId}-${mode}-mendelian-errors`,
        title: mode === 'small' ? '' : 'Mendelian Errors',
        style: { background: '#FFFFFF', inlineLegend: true },
        alignment: 'overlay',
        tracks: [
            {
            mark: 'point',
            x: { value: 0 },
            y: { value: 0 },
            color: {
                type: 'nominal',
                domain: ['Trio Error', 'Father Error', 'Mother Error'],
                range: ['#F0E442', '#56B4E9', '#D55E00'],  // Colors representing each category
                legend: true
                }
            },
            ...(trioError ? createTrack(trioError, '#F0E442') : []),
            ...(fatherError ? createTrack(fatherError, '#56B4E9') : []),
            ...(motherError ? createTrack(motherError, '#D55E00') : []),
            ...(trioError ? [createPointTrack(trioError, '#F0E442', 0)] : []),
            ...(fatherError ? [createPointTrack(fatherError, '#56B4E9', 1)] : []),
            ...(motherError ? [createPointTrack(motherError, '#D55E00', 2)] : [])
        ],
        tooltip: [
            { field: 'start', type: 'genomic', alt: 'Start Position' },
            { field: 'end', type: 'genomic', alt: 'End Position' },
            { field: trioError, type: 'quantitative', alt: 'Trio Errors' },
            { field: fatherError, type: 'quantitative', alt: 'Father Errors' },
            { field: motherError, type: 'quantitative', alt: 'Mother Errors' }
        ],

        width,
        height
    };
}
