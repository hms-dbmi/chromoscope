import React from 'react';
import { CHROMOSOMES, ZOOM_DURATION } from '../constants';

type VariantViewControlsProps = {
    visPanelWidth: number;
    isMinimalMode: boolean;
    gosRef: React.MutableRefObject<any>;
    demo: any;
    genomeViewChr: string;
    showOverview: boolean;
    showSamples: boolean;
    setGenomeViewChr: (chr: string) => void;
    setShowSamples: (show: boolean) => void;
};

export const VariantViewControls = ({
    visPanelWidth,
    isMinimalMode,
    gosRef,
    demo,
    genomeViewChr,
    setGenomeViewChr,
    showOverview,
    showSamples,
    setShowSamples
}: VariantViewControlsProps) => {
    return (
        <div
            id="variant-view-controls"
            className="variant-view-controls"
            style={{ top: `${Math.min(visPanelWidth, isMinimalMode ? 650 : 600)}px` }}
        >
            <select
                id="variant-view"
                tabIndex={showSamples ? -1 : 0}
                style={{
                    pointerEvents: 'auto'
                    // !! This should be identical to how the height of circos determined.
                    // top: `${Math.min(visPanelWidth, 600)}px`
                }}
                className="nav-dropdown chromosome-select"
                onChange={e => {
                    setShowSamples(false);
                    const chr = e.currentTarget.value;
                    setTimeout(() => setGenomeViewChr(chr), 300);
                }}
                value={genomeViewChr}
                disabled={!showOverview}
            >
                {CHROMOSOMES.map(chr => {
                    return (
                        <option key={chr} value={chr}>
                            {chr}
                        </option>
                    );
                })}
            </select>
            <div className="gene-search">
                <svg
                    className="gene-search-icon"
                    viewBox="0 0 16 16"
                    style={
                        {
                            // top: `${Math.min(visPanelWidth, 600) + 6}px`
                            // visibility: demo.assembly === 'hg38' ? 'visible' : 'hidden'
                        }
                    }
                >
                    <path
                        fillRule="evenodd"
                        d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"
                    />
                </svg>
                <input
                    type="text"
                    tabIndex={showSamples ? -1 : 0}
                    className="gene-search"
                    placeholder="Search Gene (e.g., MYC)"
                    // alt={demo.assembly === 'hg38' ? 'Search Gene' : 'Not currently available for this assembly.'}
                    style={{
                        pointerEvents: 'auto'
                        // top: `${Math.min(visPanelWidth, 600)}px`
                        // cursor: demo.assembly === 'hg38' ? 'auto' : 'not-allowed',
                        // visibility: demo.assembly === 'hg38' ? 'visible' : 'hidden'
                    }}
                    // disabled={demo.assembly === 'hg38' ? false : true}
                    // onChange={(e) => {
                    //     const keyword = e.target.value;
                    //     if(keyword !== "" && !keyword.startsWith("c")) {
                    //         gosRef.current.api.suggestGene(keyword, (suggestions) => {
                    //             setGeneSuggestions(suggestions);
                    //         });
                    //         setSuggestionPosition({
                    //             left: searchBoxRef.current.getBoundingClientRect().left,
                    //             top: searchBoxRef.current.getBoundingClientRect().top + searchBoxRef.current.getBoundingClientRect().height,
                    //         });
                    //     } else {
                    //         setGeneSuggestions([]);
                    //     }
                    //     setSearchKeyword(keyword);
                    // }}
                    onKeyDown={e => {
                        const keyword = (e.target as HTMLTextAreaElement).value;
                        switch (e.key) {
                            case 'ArrowUp':
                                break;
                            case 'ArrowDown':
                                break;
                            case 'Enter':
                                // https://github.com/gosling-lang/gosling.js/blob/7555ab711023a0c3e2076a448756a9ba3eeb04f7/src/core/api.ts#L156
                                gosRef.current.hgApi.api.zoomToGene(`${demo.id}-mid-ideogram`, keyword, 10000, 1000);
                                break;
                            case 'Esc':
                            case 'Escape':
                                break;
                        }
                    }}
                />
            </div>
            <div className="directional-controls">
                <div className="control-group zoom">
                    <button
                        style={{
                            pointerEvents: 'auto'
                            // !! This should be identical to how the height of circos determined.
                            // top: `${Math.min(visPanelWidth, 600)}px`
                        }}
                        tabIndex={showSamples ? -1 : 0}
                        className="zoom-in-button control"
                        onClick={e => {
                            const trackId = `${demo.id}-mid-ideogram`;
                            const [start, end] = gosRef.current?.hgApi.api.getLocation(trackId).xDomain;
                            if (end - start < 100) return;
                            const delta = (end - start) / 3.0;
                            gosRef.current.api.zoomTo(
                                trackId,
                                `chr1:${start + delta}-${end - delta}`,
                                0,
                                ZOOM_DURATION
                            );
                        }}
                    >
                        +
                    </button>
                    <button
                        style={{
                            pointerEvents: 'auto'
                            // !! This should be identical to how the height of circos determined.
                            // top: `${Math.min(visPanelWidth, 600)}px`
                        }}
                        tabIndex={showSamples ? -1 : 0}
                        className="zoom-out-button control"
                        onClick={e => {
                            const trackId = `${demo.id}-mid-ideogram`;
                            const [start, end] = gosRef.current?.hgApi.api.getLocation(trackId).xDomain;
                            const delta = (end - start) / 2.0;
                            gosRef.current.api.zoomTo(trackId, `chr1:${start}-${end}`, delta, ZOOM_DURATION);
                        }}
                    >
                        -
                    </button>
                </div>
                <div className="control-group pan">
                    <button
                        style={{
                            pointerEvents: 'auto'
                            // !! This should be identical to how the height of circos determined.
                            // top: `${Math.min(visPanelWidth, 600)}px`
                        }}
                        tabIndex={showSamples ? -1 : 0}
                        className="zoom-left-button control"
                        onClick={e => {
                            const trackId = `${demo.id}-mid-ideogram`;
                            const [start, end] = gosRef.current?.hgApi.api.getLocation(trackId).xDomain;
                            if (end - start < 100) return;
                            const delta = (end - start) / 4.0;
                            gosRef.current.api.zoomTo(
                                trackId,
                                `chr1:${start - delta}-${end - delta}`,
                                0,
                                ZOOM_DURATION
                            );
                        }}
                    >
                        ←
                    </button>
                    <button
                        style={{
                            pointerEvents: 'auto'
                            // !! This should be identical to how the height of circos determined.
                            // top: `${Math.min(visPanelWidth, 600)}px`
                        }}
                        tabIndex={showSamples ? -1 : 0}
                        className="zoom-right-button control"
                        onClick={e => {
                            const trackId = `${demo.id}-mid-ideogram`;
                            const [start, end] = gosRef.current?.hgApi.api.getLocation(trackId).xDomain;
                            const delta = (end - start) / 4.0;
                            gosRef.current.api.zoomTo(
                                trackId,
                                `chr1:${start + delta}-${end + delta}`,
                                0,
                                ZOOM_DURATION
                            );
                        }}
                    >
                        →
                    </button>
                </div>
            </div>
        </div>
    );
};
