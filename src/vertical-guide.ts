import { SingleTrack } from 'gosling.js/dist/src/core/gosling.schema';
export function verticalGuide(start: number, end: number): Partial<SingleTrack> {
    return {
        style: { dashed: [3, 3] },
        data: {
            type: 'json',
            values: [
                {
                    chr: 'chr1',
                    p: start
                },
                {
                    chr: 'chr1',
                    p: end
                }
            ],
            chromosomeField: 'chr',
            genomicFields: ['from', 'to']
        },
        mark: 'rule',
        x: { field: 'p', type: 'genomic' },
        color: { value: 'none' },
        stroke: { value: 'gray' },
        strokeWidth: { value: 1 },
        overlayOnPreviousTrack: true
    } as Partial<SingleTrack>;
}
