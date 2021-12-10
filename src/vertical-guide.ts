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
            genomicFields: ['p']
        },
        mark: 'rule',
        x: { field: 'p', type: 'genomic' },
        color: { value: 'black' },
        strokeWidth: { value: 1 },
        overlayOnPreviousTrack: true
    } as Partial<SingleTrack>;
}
