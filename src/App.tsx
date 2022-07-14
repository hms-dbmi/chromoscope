import React, { useEffect, useMemo, useRef, useState } from 'react';
import { GoslingComponent } from 'gosling.js';
import { debounce } from 'lodash';
import generateSpec from './main-spec';
import type { RouteComponentProps } from 'react-router-dom';
import ErrorBoundary from './error';
import drivers from './data/driver.json';
import samples from './data/samples';
import getOneOfSmallMultiplesSpec from './small-multiples-spec';
import './App.css';

const WHOLE_CHROMOSOME_STR = 'Whole Genome';
const INIT_VIS_PANEL_WIDTH = window.innerWidth;
const VIS_PADDING = 60;
const CHROMOSOMES = [
    'chr1',
    'chr2',
    'chr3',
    'chr4',
    'chr5',
    'chr6',
    'chr7',
    'chr8',
    'chr9',
    'chr10',
    'chr11',
    'chr12',
    'chr13',
    'chr14',
    'chr15',
    'chr16',
    'chr17',
    'chr18',
    'chr19',
    'chr20',
    'chr21',
    'chr22',
    'chrX',
    'chrY'
];
const ZOOM_PADDING = 200;
const ZOOM_DURATION = 1000;
const theme = {
    base: 'light',
    root: {
        background: 'white',
        titleAlign: 'middle',
        titleColor: 'black',
        titleFontSize: 18,
        titleFontWeight: 'normal',
        subtitleAlign: 'middle',
        subtitleColor: 'gray',
        subtitleFontSize: 14,
        subtitleFontWeight: 'normal'
    }
} as const;

function App(props: RouteComponentProps) {
    // URL parameters
    const urlParams = new URLSearchParams(props.location.search);
    const exampleId = urlParams.get('example');
    const selectedSamples = useMemo(
        () => (!exampleId ? samples.filter(d => d.group === 'default') : samples.filter(d => d.group === exampleId)),
        [exampleId]
    );

    const gosRef = useRef<any>();

    // TODO: We could just use sampleId to get detailed info. not to update all info as states.
    // demo
    const [demoIdx, setDemoIdx] = useState(0);
    const [sampleId, setSampleId] = useState(selectedSamples[demoIdx].id);
    const [cancer, setCancer] = useState(selectedSamples[demoIdx].cancer);
    const [assembly, setAssembly] = useState(selectedSamples[demoIdx].assembly);
    const [svUrl, setSvUrl] = useState(selectedSamples[demoIdx].sv);
    const [cnvUrl, setCnvUrl] = useState(selectedSamples[demoIdx].cnv);
    const [bamUrl, setBamUrl] = useState(selectedSamples[demoIdx].bam);
    const [baiUrl, setBaiUrl] = useState(selectedSamples[demoIdx].bai);
    const [vcfUrl, setVcfUrl] = useState(selectedSamples[demoIdx].vcf);
    const [cnFields, setCnFields] = useState<[string, string, string]>(
        selectedSamples[demoIdx].cnFields ?? ['total_cn', 'major_cn', 'minor_cn']
    );

    // interactions
    const [showSamples, setShowSamples] = useState(false);
    const [filterSampleBy, setFilterSampleBy] = useState('');
    const [filteredSamples, setFilteredSamples] = useState(selectedSamples);
    const [showOverview, setShowOverview] = useState(true);
    const [showPutativeDriver, setShowPutativeDriver] = useState(true);
    const [interactiveMode, setInteractiveMode] = useState(false);
    const [visPanelWidth, setVisPanelWidth] = useState(INIT_VIS_PANEL_WIDTH - VIS_PADDING * 2);
    const [overviewChr, setOverviewChr] = useState('');
    const [genomeViewChr, setGenomeViewChr] = useState('');
    const [filteredDrivers, setFilteredDrivers] = useState(
        (drivers as any).filter((d: any) => d.sample_id === sampleId && +d.chr && +d.pos)
    );
    const [selectedSvId, setSelectedSvId] = useState<string>('');
    const [breakpoints, setBreakpoints] = useState<[number, number, number, number]>([1, 100, 1, 100]);
    const [bpIntervals, setBpIntervals] = useState<[number, number, number, number] | undefined>();
    const [mouseOnVis, setMouseOnVis] = useState(false);

    // SV data
    const leftReads = useRef<{ [k: string]: number | string }[]>([]);
    const rightReads = useRef<{ [k: string]: number | string }[]>([]);
    const [svReads, setSvReads] = useState<{ name: string; type: string }[]>([]);

    // update demo
    useEffect(() => {
        setSampleId(selectedSamples[demoIdx].id);
        setCancer(selectedSamples[demoIdx].cancer);
        setAssembly(selectedSamples[demoIdx].assembly);
        setSvUrl(selectedSamples[demoIdx].sv);
        setCnvUrl(selectedSamples[demoIdx].cnv);
        setBamUrl(selectedSamples[demoIdx].bam);
        setBaiUrl(selectedSamples[demoIdx].bai);
        setVcfUrl(selectedSamples[demoIdx].vcf);
        setCnFields(selectedSamples[demoIdx].cnFields ?? ['total_cn', 'major_cn', 'minor_cn']);
        setFilteredDrivers(
            (drivers as any).filter((d: any) => d.sample_id === selectedSamples[demoIdx].id && +d.chr && +d.pos)
        );
        setOverviewChr('');
        setGenomeViewChr('');
        leftReads.current = [];
        rightReads.current = [];
    }, [demoIdx]);

    useEffect(() => {
        setFilteredSamples(
            filterSampleBy === '' ? selectedSamples : selectedSamples.filter(d => d.id.includes(filterSampleBy))
        );
    }, [filterSampleBy]);

    useEffect(() => {
        if (!gosRef.current) return;

        gosRef.current.api.subscribe('click', (type, e) => {
            const zoom = false;
            if (zoom) {
                // start and end positions are already cumulative values
                gosRef.current.api.zoomTo(
                    `${sampleId}-bottom-left-coverage`,
                    `chr1:${e.data.start1}-${e.data.end1}`,
                    ZOOM_PADDING,
                    ZOOM_DURATION
                );
                gosRef.current.api.zoomTo(
                    `${sampleId}-bottom-right-coverage`,
                    `chr1:${e.data.start2}-${e.data.end2}`,
                    ZOOM_PADDING,
                    ZOOM_DURATION
                );
            } else {
                let x = +e.data[0].start1;
                let xe = +e.data[0].end1;
                let x1 = +e.data[0].start2;
                let x1e = +e.data[0].end2;

                // safetly swap
                if (x > x1) {
                    x = +e.data[0].start2;
                    xe = +e.data[0].end2;
                    x1 = +e.data[0].start1;
                    x1e = +e.data[0].end1;
                }

                const padding = (x1e - x) / 4.0;
                gosRef.current.api.zoomTo(`${sampleId}-mid-ideogram`, `chr1:${x}-${x1e}`, padding, 500);

                // we will show the bam files, so set the initial positions
                setBreakpoints([+x - ZOOM_PADDING, +xe + ZOOM_PADDING, +x1 - ZOOM_PADDING, +x1e + ZOOM_PADDING]);
                setBpIntervals([x, xe, x1, x1e]);
            }

            // Move to the bottom
            setTimeout(
                () => document.getElementById('gosling-panel')?.scrollTo({ top: 1000000, behavior: 'smooth' }),
                2000
            );

            setSelectedSvId(e.data[0].sv_id + '');
            leftReads.current = [];
            rightReads.current = [];
        });

        // gosRef.current.api.subscribe('mouseover', (type: string, e: CommonEventData) => {
        // setHoveredSvId(e.data.sv_id + '');
        // });

        return () => {
            gosRef.current.api.unsubscribe('click');
            // gosRef.current.api.unsubscribe('mouseover');
        };
    }, [gosRef, svReads, sampleId]);

    useEffect(() => {
        if (!gosRef.current || !baiUrl || !bamUrl) return;

        gosRef.current.api.subscribe('rawData', (type: string, e: any) => {
            if (e.id.includes('bam') && (leftReads.current.length === 0 || rightReads.current.length === 0)) {
                const isThisPotentiallyJsonRuleData = typeof e.data[0]?.name === 'undefined';
                if (isThisPotentiallyJsonRuleData) {
                    return;
                }

                /// DEBUG
                // console.log(e.id, e.data);
                ///

                // This means we just received a BAM data that is just rendered
                if (e.id.includes('left') && leftReads.current.length === 0) {
                    leftReads.current = e.data;
                } else if (e.id.includes('right') && rightReads.current.length === 0) {
                    rightReads.current = e.data;
                }

                // !! This is to drop duplicated data records.
                // Multiple tracks overlaid on alignment tracks makes duplicated data records.
                leftReads.current = Array.from(new Set(leftReads.current.map(d => JSON.stringify(d)))).map(d =>
                    JSON.parse(d)
                );
                rightReads.current = Array.from(new Set(rightReads.current.map(d => JSON.stringify(d)))).map(d =>
                    JSON.parse(d)
                );

                // Reads on both views prepared?
                if (leftReads.current.length !== 0 && rightReads.current.length !== 0) {
                    const mates = leftReads.current
                        .filter(l => rightReads.current.filter(r => r.name === l.name && r.id !== l.id).length !== 0)
                        .map(d => d.name as string);

                    const matesWithSv = mates.map(name => {
                        const matesOnLeft = leftReads.current.filter(d => d.name === name);
                        const matesOnRight = rightReads.current.filter(d => d.name === name);

                        if (matesOnLeft.length !== 1 || matesOnRight.length !== 1) {
                            // We do not do anything for this case for now.
                            return { name, type: 'unknown' };
                        }

                        // console.log(matesOnLeft[0], matesOnRight[0]);
                        const ld = matesOnLeft[0].strand;
                        const rd = matesOnRight[0].strand;

                        if (matesOnLeft[0].chrName !== matesOnRight[0].chrName) return { name, type: 'Translocation' };
                        if (ld === '+' && rd === '-') return { name, type: 'Deletion' };
                        if (ld === '-' && rd === '-') return { name, type: 'Inversion (TtT)' };
                        if (ld === '+' && rd === '+') return { name, type: 'Inversion (HtH)' };
                        if (ld === '-' && rd === '+') return { name, type: 'Duplication' };
                        return { name, type: 'unknown' };
                    });

                    if (
                        matesWithSv
                            .map(d => d.name)
                            .sort()
                            .join() !==
                        svReads
                            .map(d => d.name)
                            .sort()
                            .join()
                    ) {
                        setSvReads(matesWithSv);
                    }
                }
            }
        });

        return () => {
            gosRef.current.api.unsubscribe('rawdata');
        };
    }, [gosRef, svReads, sampleId, baiUrl, bamUrl]);

    useEffect(() => {
        if (!overviewChr) return;

        if (overviewChr.includes('chr')) {
            gosRef.current?.api.zoomTo(`${sampleId}-top-ideogram`, overviewChr, 0, 0);
            setTimeout(() => setGenomeViewChr(overviewChr), 0);
        } else {
            gosRef.current?.api.zoomToExtent(`${sampleId}-top-ideogram`, ZOOM_DURATION);
        }
    }, [overviewChr]);

    useEffect(() => {
        if (!genomeViewChr) return;

        if (genomeViewChr.includes('chr')) {
            gosRef.current?.api.zoomTo(`${sampleId}-mid-ideogram`, genomeViewChr, 0, ZOOM_DURATION);
        } else {
            gosRef.current?.api.zoomToExtent(`${sampleId}-mid-ideogram`, ZOOM_DURATION);
        }
    }, [genomeViewChr]);

    // Change the width of the visualization panel
    useEffect(() => {
        window.addEventListener(
            'resize',
            debounce(() => {
                setVisPanelWidth(window.innerWidth - VIS_PADDING * 2);
            }, 500)
        );
    }, []);

    const smallOverviewWrapper = useMemo(() => {
        // console.log(
        //     'overviewSpec',
        //     filteredSamples.map(d =>
        //         getSmallOverviewSpec({
        //             cnvUrl: d.cnv,
        //             svUrl: d.sv,
        //             width: 100,
        //             title: d.cancer.charAt(0).toUpperCase() + d.cancer.slice(1),
        //             subtitle: d.id, // '' + d.id.slice(0, 20) + (d.id.length >= 20 ? '...' : ''),
        //             cnFields: d.cnFields ?? ['total_cn', 'major_cn', 'minor_cn']
        //         })
        //     ),
        //     filteredSamples.map(d => `node gosling-screenshot.js output/${d.id}.json img/${d.id}.jpeg`).join('\n')
        // );
        return filteredSamples.map((d, i) => (
            <div
                key={JSON.stringify(d.id)}
                onClick={() => {
                    setShowSamples(false);
                    setTimeout(() => {
                        setDemoIdx(selectedSamples.indexOf(d));
                        setSelectedSvId('');
                    }, 300);
                }}
                className={demoIdx === i ? 'selected-overview' : 'unselected-overview'}
            >
                <div style={{}}>
                    <b>{d.cancer.charAt(0).toUpperCase() + d.cancer.slice(1).split(' ')[0]}</b>
                </div>
                <div style={{ color: 'grey', fontSize: '12px' }}>
                    {'' + d.id.slice(0, 20) + (d.id.length >= 20 ? '...' : '')}
                </div>
                <img src={d.thumbnail} style={{ width: `${420 / 2}px`, height: `${420 / 2}px` }} />
            </div>
        ));
        // smallOverviewGoslingComponents.map(([component, spec], i) => (
        //     <div
        //         key={JSON.stringify(spec)}
        //         onClick={() => {
        //             setShowSamples(false);
        //             setTimeout(() => {
        //                 setDemoIdx(i);
        //                 setSelectedSvId('');
        //             }, 300);
        //         }}
        //         className={demoIdx === i ? 'selected-overview' : 'unselected-overview'}
        //     >
        //         {component}
        //     </div>
        // ));
    }, [demoIdx, filteredSamples]);

    const goslingComponent = useMemo(() => {
        const spec = generateSpec({
            assembly,
            sampleId,
            svUrl,
            cnvUrl,
            bamUrl,
            baiUrl,
            vcfUrl,
            showOverview,
            xOffset: 0,
            showPutativeDriver,
            width: visPanelWidth,
            drivers: filteredDrivers,
            selectedSvId,
            breakpoints: breakpoints,
            crossChr: false,
            bpIntervals,
            svReads,
            cnFields
        });
        // console.log('spec', spec);
        return (
            <GoslingComponent
                ref={gosRef}
                spec={spec}
                padding={0}
                margin={0}
                experimental={{ reactive: true }}
                theme={theme}
            />
        );
    }, [
        visPanelWidth,
        filteredDrivers,
        showOverview,
        showPutativeDriver,
        svUrl,
        cnvUrl,
        selectedSvId,
        breakpoints,
        svReads
    ]);

    return (
        <ErrorBoundary>
            <div
                style={{ width: '100%', height: '100%' }}
                onMouseMove={e => {
                    const top = e.clientY;
                    const left = e.clientX;
                    const width = window.innerWidth;
                    const height = window.innerHeight;
                    if (
                        VIS_PADDING < top &&
                        top < height - VIS_PADDING &&
                        VIS_PADDING < left &&
                        left < width - VIS_PADDING
                    ) {
                        setMouseOnVis(true);
                    } else {
                        setMouseOnVis(false);
                    }
                }}
                onClick={() => {
                    if (!mouseOnVis && interactiveMode) setInteractiveMode(false);
                    else if (mouseOnVis && !interactiveMode) setInteractiveMode(true);
                }}
            >
                <svg
                    className="config-button"
                    viewBox="0 0 16 16"
                    onClick={() => {
                        setShowSamples(true);
                    }}
                >
                    <title>Menu</title>
                    <path
                        fillRule="evenodd"
                        d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"
                    />
                </svg>
                <div className="sample-label">
                    {cancer.charAt(0).toUpperCase() + cancer.slice(1) + ' • ' + sampleId}
                    <span className="title-btn" onClick={() => gosRef.current?.api.exportPng()}>
                        <svg className="button" viewBox="0 0 16 16">
                            <title>Export Image</title>
                            <path
                                fill="currentColor"
                                d="M0 8a8 8 0 1 0 16 0A8 8 0 0 0 0 8zm5.904 2.803a.5.5 0 1 1-.707-.707L9.293 6H6.525a.5.5 0 1 1 0-1H10.5a.5.5 0 0 1 .5.5v3.975a.5.5 0 0 1-1 0V6.707l-4.096 4.096z"
                            />
                        </svg>
                    </span>
                </div>
                {bamUrl && baiUrl ? (
                    <div className="help-label">
                        <span style={{ border: '2px solid gray', borderRadius: 10, padding: '0px 4px', margin: '6px' }}>
                            {'?'}
                        </span>
                        {'Click on a SV to see alignment around breakpoints'}
                    </div>
                ) : null}
                <div id="vis-panel" className="vis-panel">
                    <div className={'vis-overview-panel ' + (!showSamples ? 'hide' : '')}>
                        <div className="title">
                            Samples
                            <small>{` (${filteredSamples.length} out of ${selectedSamples.length} shown)`}</small>
                            <input
                                type="text"
                                className="sample-text-box"
                                placeholder="Search samples by ID"
                                onChange={e => setFilterSampleBy(e.target.value)}
                            />
                            <svg
                                className="button"
                                viewBox="0 0 16 16"
                                onClick={() => {
                                    setShowSamples(false);
                                }}
                            >
                                <title>Close</title>
                                <path
                                    d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"
                                    fill="currentColor"
                                ></path>
                            </svg>
                        </div>
                        <div className="overview-container">{smallOverviewWrapper}</div>
                    </div>
                    <div
                        id="gosling-panel"
                        className="gosling-panel"
                        style={{
                            width: `calc(100% - ${VIS_PADDING * 2}px)`,
                            height: `calc(100% - ${VIS_PADDING * 2}px)`,
                            padding: VIS_PADDING
                        }}
                    >
                        {goslingComponent}
                        <div
                            style={{
                                width: '100%',
                                height: '100%',
                                boxShadow: `inset 0 0 0 3px ${
                                    interactiveMode && mouseOnVis
                                        ? '#2399DB'
                                        : !interactiveMode && mouseOnVis
                                        ? 'lightgray'
                                        : !interactiveMode && !mouseOnVis
                                        ? '#00000000'
                                        : 'lightgray'
                                }`,
                                top: VIS_PADDING,
                                left: VIS_PADDING,
                                opacity: 0.9,
                                pointerEvents: interactiveMode ? 'none' : 'auto'
                            }}
                        />
                        <div
                            style={{
                                pointerEvents: 'none',
                                width: '100%',
                                height: '100%',
                                position: 'relative',
                                zIndex: 998
                            }}
                        >
                            <select
                                style={{
                                    pointerEvents: 'auto',
                                    top: '3px'
                                }}
                                className="nav-dropdown"
                                onChange={e => {
                                    setShowSamples(false);
                                    const chr = e.currentTarget.value;
                                    setTimeout(() => setOverviewChr(chr), 300);
                                }}
                                value={overviewChr}
                                disabled={!showOverview}
                            >
                                {[WHOLE_CHROMOSOME_STR, ...CHROMOSOMES].map(chr => {
                                    return (
                                        <option key={chr} value={chr}>
                                            {chr}
                                        </option>
                                    );
                                })}
                            </select>
                            <select
                                style={{
                                    pointerEvents: 'auto',
                                    // !! This should be identical to how the height of circos determined.
                                    top: `${Math.min(visPanelWidth, 600)}px`
                                }}
                                className="nav-dropdown"
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
                            <svg
                                className="gene-search-icon"
                                viewBox="0 0 16 16"
                                style={{
                                    top: `${Math.min(visPanelWidth, 600) + 6}px`,
                                    visibility: assembly === 'hg38' ? 'visible' : 'collapse'
                                }}
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"
                                />
                            </svg>
                            <input
                                type="text"
                                className="gene-search"
                                placeholder="Search Gene (e.g., MYC)"
                                style={{
                                    pointerEvents: 'auto',
                                    top: `${Math.min(visPanelWidth, 600)}px`,
                                    visibility: assembly === 'hg38' ? 'visible' : 'collapse'
                                }}
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
                                            gosRef.current.api.zoomToGene(
                                                `${sampleId}-mid-ideogram`,
                                                keyword,
                                                10000,
                                                1000
                                            );
                                            break;
                                        case 'Esc':
                                        case 'Escape':
                                            break;
                                    }
                                }}
                            />
                        </div>
                    </div>
                </div>
                <div
                    style={{
                        visibility:
                            ((!interactiveMode && mouseOnVis) || (interactiveMode && !mouseOnVis)) && !showSamples
                                ? 'visible'
                                : 'collapse',
                        position: 'absolute',
                        right: `${VIS_PADDING}px`,
                        top: '60px',
                        background: 'lightgray',
                        color: 'black',
                        padding: '6px',
                        pointerEvents: 'none',
                        zIndex: 9999,
                        boxShadow: '0 0 20px 2px rgba(0, 0, 0, 0.2)'
                    }}
                >
                    {!interactiveMode
                        ? 'Click inside to use interactions on visualizations'
                        : 'Click outside to deactivate interactions'}
                </div>
                <div
                    style={{
                        width: '100%',
                        height: '100%',
                        visibility: 'collapse',
                        boxShadow: interactiveMode ? 'inset 0 0 4px 2px #2399DB' : 'none',
                        zIndex: 9999,
                        background: 'none',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        pointerEvents: 'none'
                    }}
                />
                <div
                    className="move-to-top-btn"
                    onClick={() => {
                        setTimeout(
                            () => document.getElementById('gosling-panel')?.scrollTo({ top: 0, behavior: 'smooth' }),
                            0
                        );
                    }}
                >
                    <svg className="button" viewBox="0 0 16 16">
                        <title>Scroll To Top</title>
                        <path
                            fill="currentColor"
                            d="M2 16a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2zm6.5-4.5V5.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 1 0 .708.708L7.5 5.707V11.5a.5.5 0 0 0 1 0z"
                        />
                    </svg>
                </div>
            </div>
        </ErrorBoundary>
    );
}

export default App;
