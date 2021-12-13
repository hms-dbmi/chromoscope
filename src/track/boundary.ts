import { SingleTrack } from 'gosling.js/dist/src/core/gosling.schema';
import { TrackMode } from '.';

const hex = 'lightgray';

export default function boundary(mode: TrackMode = 'top'): SingleTrack {
    return {
        data: {
            type: 'json',
            chromosomeField: 'c',
            genomicFields: ['p'],
            values: [
                { c: 'chr2', p: 0 },
                { c: 'chr3', p: 0 },
                { c: 'chr4', p: 0 },
                { c: 'chr5', p: 0 },
                { c: 'chr6', p: 0 },
                { c: 'chr7', p: 0 },
                { c: 'chr8', p: 0 },
                { c: 'chr9', p: 0 },
                { c: 'chr10', p: 0 },
                { c: 'chr11', p: 0 },
                { c: 'chr12', p: 0 },
                { c: 'chr13', p: 0 },
                { c: 'chr14', p: 0 },
                { c: 'chr15', p: 0 },
                { c: 'chr16', p: 0 },
                { c: 'chr17', p: 0 },
                { c: 'chr18', p: 0 },
                { c: 'chr19', p: 0 },
                { c: 'chr20', p: 0 },
                { c: 'chr21', p: 0 },
                { c: 'chrX', p: 0 },
                { c: 'chrY', p: 0 }
            ]
        },
        mark: mode === 'mid' ? 'rule' : 'rect',
        x: { field: 'p', type: 'genomic' },
        color: { value: hex },
        opacity: { value: 0.5 },
        height: 20,
        width: 400,
        overlayOnPreviousTrack: true
    };
}
