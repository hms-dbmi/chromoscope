import { SingleTrack } from 'gosling.js/dist/src/gosling-schema';
import { SpecOption } from '../main-spec';

export default function coverage(option: SpecOption, isLeft: boolean): Partial<SingleTrack> {
    const { id, bam, bai, width, svReads, crossChr, bpIntervals } = option;
    return {
        id: `${id}-bottom-${isLeft ? 'left' : 'right'}-coverage`,
        title: '  Coverage',
        data: {
            type: 'bam',
            url: bam,
            indexUrl: bai
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
        width,
        height: 80
    };
}
