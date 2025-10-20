import React, { useState, useMemo } from 'react';
import { Track, getTrackDocData } from '../ui/getTrackDocData';
import { ICONS } from '../icon';

type TrackTooltipsProps = {
    visPanelWidth: number;
    isMinimalMode: boolean;
    demo: any;
    selectedSvId: string;
    showSamples: boolean;
};

export const TrackTooltips = ({
    visPanelWidth,
    isMinimalMode,
    demo,
    selectedSvId,
    showSamples
}: TrackTooltipsProps) => {
    const trackPositions = useMemo(() => {
        // calculate the offset by the Genome View
        const genomeViewHeight = Math.min(600, visPanelWidth);
        const TRACK_DATA = getTrackDocData(isMinimalMode);
        const offset = genomeViewHeight + (isMinimalMode ? 100 : 40) - 2;

        // Infer the tracks shown
        const tracksShown: Track[] = ['ideogram', 'driver', 'gene'];
        if (demo.vcf && demo.vcfIndex) tracksShown.push('mutation');
        if (demo.vcf2 && demo.vcf2Index) tracksShown.push('indel');
        if (demo.cnv) tracksShown.push('cnv', 'gain', 'loh');
        // Pushing this after the others to match order of tracks in UI
        tracksShown.push('sv');
        if (selectedSvId !== '') tracksShown.push('sequence');
        if (demo.bam && demo.bai && selectedSvId !== '') tracksShown.push('coverage', 'alignment');
        const HEIGHTS_OF_TRACKS_SHOWN = TRACK_DATA.filter(d => tracksShown.includes(d.type));

        // Calculate the positions of the tracks
        return tracksShown.map((t, i) => {
            const indexOfTrack = HEIGHTS_OF_TRACKS_SHOWN.findIndex(d => d.type === t);
            const cumHeight = HEIGHTS_OF_TRACKS_SHOWN.slice(0, indexOfTrack).reduce((acc, d) => acc + d.height, 0);
            const position = {
                y: offset + cumHeight - 100,
                type: t,
                title: HEIGHTS_OF_TRACKS_SHOWN[indexOfTrack].title,
                popover_content: HEIGHTS_OF_TRACKS_SHOWN[indexOfTrack].popover_content
            };
            return position;
        });
    }, [demo, visPanelWidth, selectedSvId, showSamples]);

    return (
        <div className="track-tooltips-container">
            {trackPositions?.map((d, i) => {
                return (
                    <a
                        key={i}
                        id={`track-tooltip-${d.type}`}
                        tabIndex={showSamples ? -1 : 0}
                        role="button"
                        className="track-tooltip"
                        data-bs-trigger="focus"
                        data-bs-toggle="popover"
                        data-bs-template={`
                            <div class="popover" role="tooltip">
                            <div class="popover-arrow">
                            </div>
                            <h2 class="popover-header">
                            </h2>
                            <div class="popover-body">
                            </div>
                            </div>
                        `}
                        data-bs-title={d.title}
                        data-bs-custom-class={'track-tooltip-popover popover-for-' + d.type}
                        data-bs-html="true"
                        data-bs-content={d.popover_content}
                        style={{
                            position: 'absolute',
                            top: d.y + (d.type === 'ideogram' ? 32 : 0) + 5,
                            left: 10
                        }}
                    >
                        <svg className="button question-mark" viewBox={ICONS.QUESTION_CIRCLE_FILL.viewBox}>
                            <title>Question Mark</title>
                            {ICONS.QUESTION_CIRCLE_FILL.path.map(p => (
                                <path fill="black" key={p} d={p} />
                            ))}
                        </svg>
                    </a>
                );
            })}
        </div>
    );
};
