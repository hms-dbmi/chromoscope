import { SingleTrack } from '../../gosling.js/dist/src/core/gosling.schema';

export function verticalGuide(start: number, end: number) {
    return {
        data: {
            type: 'json',
            values: [
                {
                    chr: 'chr1',
                    from: start,
                    to: end
                }
            ],
            chromosomeField: 'chr',
            genomicFields: ['from', 'to']
        },
        mark: 'rect',
        x: { field: 'from', type: 'genomic' },
        xe: { field: 'to', type: 'genomic' },
        color: { value: 'none' },
        stroke: { value: 'gray' },
        strokeWidth: { value: 1 },
        overlayOnPreviousTrack: true
    } as Partial<SingleTrack>;
}
