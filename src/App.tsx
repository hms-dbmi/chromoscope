import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { GoslingComponent, GoslingRef, embed } from 'gosling.js';
import { debounce, sample } from 'lodash';
import type { RouteComponentProps } from 'react-router-dom';
import * as bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min';

import generateSpec from './main-spec';
import ErrorBoundary from './error';
import _allDrivers from './data/driver.json';
import _customDrivers from './data/driver.custom.json';
import samples from './data/samples';
import { ICONS } from './icon';
import { isChrome } from './utils';
import { getHtmlTemplate } from './html-template';
import legend from './legend.png';
import { GenomeViewModal } from './ui/GenomeViewModal';
import { VariantViewModal } from './ui/VariantViewModal';
import { NavigationButtons } from './ui/NavigationButtons';
import { NavigationBar } from './ui/NavigationBar';
import { InstructionsModal } from './ui/InstructionsModal';
import { ClinicalPanel } from './ui/ClinicalPanel';
import { AboutModal } from './ui/AboutModal';
import { VisOverviewPanel } from './ui/VisOverviewPanel';
import SampleConfigForm from './ui/SampleConfigForm';
import { VariantViewControls } from './ui/VariantViewControls';
import { TrackTooltips } from './ui/TrackTooltips';
import { MinimalModeExternalLinks } from './ui/MinimalMode/MinimalModeExternalLinks';

// Import constants
import {
    ZOOM_PADDING,
    ZOOM_DURATION,
    SCROLL_BAR_WIDTH,
    GOSLING_VIS_COMPONENT_PADDING,
    CLINICAL_PANEL_OPEN_WIDTH,
    CLINICAL_PANEL_CLOSED_WIDTH,
    FEEDBACK_EMAIL_ADDRESS,
    THEME
} from './constants';

import 'bootstrap/dist/css/bootstrap.min.css';
import './css/App.css';

const INIT_VIS_PANEL_WIDTH = window.innerWidth;

const allDrivers = [
    ...(_allDrivers as any),
    ..._customDrivers.map(d => {
        return { ...d, sample_id: 'SRR7890905' };
    }),
    ..._customDrivers.map(d => {
        return { ...d, sample_id: 'SRR7890905_Hartwig' };
    })
];

export type Cohorts = {
    [key: string]: Cohort;
};

export type Cohort = {
    name?: string;
    samples: any;
};

// Initialize with preloaded PCAWG cohort data
export const COHORTS: Cohorts = {
    'PCAWG: Cancer Cohort': {
        name: 'PCAWG: Cancer Cohort',
        samples: samples.map((d, i) => ({
            ...d,
            originalIndex: i // Store original index for reference
        })) // All PCAWG samples
    }
};

function App(props: RouteComponentProps) {
    // URL parameters
    const urlParams = new URLSearchParams(props.location.search);
    const isMinimalMode = urlParams.get('minimal_mode') === 'true';
    const VIS_PADDING = {
        top: isMinimalMode ? 0 : 60,
        right: isMinimalMode ? 0 : 100,
        bottom: isMinimalMode ? 0 : 60,
        left: isMinimalMode ? 0 : 100
    };

    // !! instead of using `urlParams.get('external')`, we directly parse the external URL in order to include
    // any inlined parameters of the external link (e.g., private AWS link with authentication info.)
    let externalUrl = null;
    if (props.location.search.includes('external=')) {
        externalUrl = props.location.search.split('external=')[1];
        // remove known parameters
        externalUrl = externalUrl.split('&demoIndex')[0];
        externalUrl = externalUrl.split('&example')[0];
        externalUrl = externalUrl.split('&domain')[0];
    }
    const exampleId = urlParams.get('example');
    const xDomain = urlParams.get('domain')
        ? urlParams
              .get('domain')
              .split('-')
              .map(d => +d)
        : null;
    const demoIndex = useRef(+urlParams.get('demoIndex') || 0);
    const [showSmallMultiples, setShowSmallMultiples] = useState(externalUrl === null);
    const [ready, setReady] = useState(externalUrl === null);

    const gosRef = useRef<GoslingRef>();

    const externalDemoUrl = useRef<string>();

    const currentSpec = useRef<string>();

    // Set default cohort state
    const [cohorts, setCohorts] = useState<Cohorts>(COHORTS);
    const [selectedCohort, setSelectedCohort] = useState<string>('PCAWG: Cancer Cohort');

    // Selected Samples
    // Use `exampleId` for default samples
    const selectedSamples = useMemo(
        () =>
            exampleId
                ? cohorts[selectedCohort]?.samples.filter(d => d?.group === exampleId)
                : samples.filter(d => d.group === 'default'),
        [exampleId]
    );

    // demo
    const [demo, setDemo] = useState(
        cohorts[selectedCohort].samples[
            demoIndex.current < cohorts[selectedCohort].samples.length ? demoIndex.current : 0
        ]
    );
    const [externalError, setExternalError] = useState<string>('');

    // Selected Mutation
    const [selectedMutationAbsPos, setSelectedMutationAbsPos] = useState<number>(null);

    // Clinical Panel will only render in non-minimal mode and if the demo has clinical info
    const [isClinicalPanelOpen, setIsClinicalPanelOpen] = useState(false);

    // Create a ref to store clinical info across renders
    const clinicalInfoRef = useRef(null);

    // Interactions
    const [showSamples, setShowSamples] = useState(urlParams.get('showSamples') !== 'false' && !xDomain);
    const [showAbout, setShowAbout] = useState(false);
    const [generateThumbnails, setGenerateThumbnails] = useState(false);
    const [doneGeneratingThumbnails, setDoneGeneratingThumbnails] = useState(false);
    const [filterSampleBy, setFilterSampleBy] = useState('');
    const [filteredSamples, setFilteredSamples] = useState(cohorts[selectedCohort]?.samples || []);
    const [showOverview, setShowOverview] = useState(true);
    const [showPutativeDriver, setShowPutativeDriver] = useState(true);
    const [interactiveMode, setInteractiveMode] = useState(isMinimalMode ?? false);
    const [visPanelWidth, setVisPanelWidth] = useState(
        INIT_VIS_PANEL_WIDTH -
            (isMinimalMode
                ? 0
                : VIS_PADDING.left +
                  VIS_PADDING.right +
                  (clinicalInfoRef.current
                      ? isClinicalPanelOpen
                          ? CLINICAL_PANEL_OPEN_WIDTH
                          : CLINICAL_PANEL_CLOSED_WIDTH
                      : 0))
    );
    const [overviewChr, setOverviewChr] = useState('');
    const [genomeViewChr, setGenomeViewChr] = useState('');
    const [drivers, setDrivers] = useState(
        typeof demo.drivers === 'string' && demo.drivers.split('.').pop() === 'json' ? [] : getFilteredDrivers(demo.id)
    );
    const [selectedSvId, setSelectedSvId] = useState<string>('');
    const [breakpoints, setBreakpoints] = useState<[number, number, number, number]>([1, 100, 1, 100]);
    const [bpIntervals, setBpIntervals] = useState<[number, number, number, number] | undefined>();
    const [mouseOnVis, setMouseOnVis] = useState(isMinimalMode ?? false);
    const [jumpButtonInfo, setJumpButtonInfo] =
        useState<{ id: string; x: number; y: number; direction: 'leftward' | 'rightward'; zoomTo: () => void }>();
    const mousePos = useRef({ x: -100, y: -100 });
    const prevJumpId = useRef('');

    // SV data
    const leftReads = useRef<{ [k: string]: number | string }[]>([]);
    const rightReads = useRef<{ [k: string]: number | string }[]>([]);
    const [svReads, setSvReads] = useState<{ name: string; type: string }[]>([]);

    function getFilteredDrivers(demoId: string) {
        return (allDrivers as any).filter((d: any) => d.sample_id === demoId && +d.pos);
    }

    useEffect(() => {
        // Initial padding for the visualization
        let totalPadding = 0;

        if (isMinimalMode) {
            setVisPanelWidth(window.innerWidth);
        } else {
            totalPadding = VIS_PADDING.left + VIS_PADDING.right;

            // Update the clinical info reference based on the current demo
            clinicalInfoRef.current = demo.clinicalInfo ?? null;

            // Add padding when clinical panel available
            if (clinicalInfoRef.current) {
                totalPadding += isClinicalPanelOpen ? CLINICAL_PANEL_OPEN_WIDTH : CLINICAL_PANEL_CLOSED_WIDTH;
            }

            setVisPanelWidth(window.innerWidth - totalPadding);
        }
    }, [demo, isClinicalPanelOpen, selectedMutationAbsPos]);

    // update demo
    useEffect(() => {
        if (typeof demo.drivers === 'string' && demo.drivers.split('.').pop() === 'json') {
            // we want to change this json file to json value
            fetch(demo.drivers).then(response =>
                response.text().then(d => {
                    const customDrivers = JSON.parse(d);
                    // TODO: these need to be supported in other types of data
                    customDrivers.forEach(d => {
                        const optionalFields = [
                            'ref',
                            'alt',
                            'category',
                            'top_category',
                            'transcript_consequence',
                            'protein-mutation',
                            'allele_fraction',
                            'mutation_type',
                            'biallelic'
                        ];
                        optionalFields.forEach(f => {
                            if (!d[f]) {
                                d[f] = '';
                            }
                        });
                        if (typeof d['biallelic'] === 'string' && d['biallelic'].toUpperCase() === 'YES') {
                            d['biallelic'] = 'yes';
                        }
                        if (typeof d['biallelic'] === 'string' && d['biallelic'].toUpperCase() === 'NO') {
                            d['biallelic'] = 'no';
                        }
                    });

                    setDrivers(customDrivers);
                })
            );
        } else {
            const filteredDrivers = getFilteredDrivers(demo.id);
            setDrivers(filteredDrivers);
        }

        setOverviewChr('');
        setGenomeViewChr('');
        setSelectedSvId('');
        leftReads.current = [];
        rightReads.current = [];

        // Update the appearance of the clinical panel
        setIsClinicalPanelOpen(!!demo?.clinicalInfo && isClinicalPanelOpen);
    }, [demo]);

    // Add external demo cohort once MSK SPECTRUM cohort is available
    useEffect(() => {
        const cohortIdFromUrl = urlParams.get('cohortId');

        // If a newly added cohort is the one specified in the URL param
        // `cohortId`, use it for the proper demo
        if (selectedCohort !== cohortIdFromUrl && cohortIdFromUrl && cohorts[cohortIdFromUrl]) {
            const indexToSet = demoIndex.current < cohorts[cohortIdFromUrl].samples.length ? demoIndex.current : 0;
            setSelectedCohort(cohortIdFromUrl);
            setDemo(cohorts[cohortIdFromUrl].samples[indexToSet]);
        }

        // Check that the first two default samples were added
        if (cohorts['MSK SPECTRUM'] && Object.keys(cohorts).length < 3 && externalUrl) {
            fetch(externalUrl)
                .then(response =>
                    response.text().then(d => {
                        const externalDemo = JSON.parse(d);

                        // externalDemo is an object with samples array or an array
                        if (
                            externalDemo?.samples?.length > 0 ||
                            (Array.isArray(externalDemo) && externalDemo.length >= 0)
                        ) {
                            // Create new cohort for available samples
                            let cohortId = externalDemo?.name ?? 'External Cohort';
                            const samples = externalDemo?.samples || externalDemo;
                            const indexFromUrl = demoIndex.current < samples.length ? demoIndex.current : 0;

                            // If cohort already exists, update name
                            if (cohorts?.[cohortId]) {
                                cohortId = cohortId + '_1';
                            }

                            // Create new cohort
                            setCohorts({
                                ...cohorts,
                                [cohortId]: {
                                    name: cohortId,
                                    samples: samples?.map((sample: any, index: number) => ({
                                        ...sample,
                                        originalIndex: index
                                    }))
                                }
                            });

                            // use demoIndex form URL or first otherwise
                            if (cohortIdFromUrl === cohortId && samples[indexFromUrl]) {
                                if (samples[indexFromUrl]?.clinicalInfo) {
                                    clinicalInfoRef.current = externalDemo.clinicalInfo;
                                }
                                setDemo(samples[samples[indexFromUrl] ? indexFromUrl : 0]);
                            }
                            // Select the cohort from URL if provided
                            setSelectedCohort(cohortIdFromUrl ?? cohortId);
                        }

                        setShowSmallMultiples(true);
                        setReady(true);
                    })
                )
                .catch(error => {
                    console.error('Error fetching external demo:', error);
                    setExternalError(error.message);
                });
        }
    }, [cohorts]);

    useEffect(() => {
        prevJumpId.current = jumpButtonInfo?.id;
    }, [jumpButtonInfo]);

    useEffect(() => {
        setFilteredSamples(
            filterSampleBy === ''
                ? cohorts[selectedCohort].samples
                : cohorts[selectedCohort].samples.filter(d => d.id.includes(filterSampleBy))
            // filterSampleBy === '' ? selectedSamples : selectedSamples.filter(d => d.id.includes(filterSampleBy))
        );
    }, [filterSampleBy]);

    useEffect(() => {
        if (!gosRef.current || !demo.bai || !demo.bam) return;

        gosRef.current.api.subscribe('rawData', (type: string, e: any) => {
            if (e.id.includes('bam') && (leftReads.current.length === 0 || rightReads.current.length === 0)) {
                const isThisPotentiallyJsonRuleData = typeof e.data[0]?.name === 'undefined';
                if (isThisPotentiallyJsonRuleData) {
                    return;
                }

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
            gosRef.current.api.unsubscribe('rawData');
        };
    }, [gosRef, svReads, demo]);

    useEffect(() => {
        if (!overviewChr) return;

        if (overviewChr.includes('chr')) {
            gosRef.current?.api.zoomTo(`${demo.id}-top-ideogram`, overviewChr, 0, 0);
            setTimeout(() => setGenomeViewChr(overviewChr), 0);
        } else {
            gosRef.current?.api.zoomToExtent(`${demo.id}-top-ideogram`, ZOOM_DURATION);
        }
    }, [overviewChr]);

    useEffect(() => {
        if (!genomeViewChr) return;

        if (genomeViewChr.includes('chr')) {
            gosRef.current?.api.zoomTo(`${demo.id}-mid-ideogram`, genomeViewChr, ZOOM_PADDING, ZOOM_DURATION);
        } else {
            gosRef.current?.api.zoomToExtent(`${demo.id}-mid-ideogram`, ZOOM_DURATION);
        }
    }, [genomeViewChr]);

    // change the width of the visualization panel and register intersection observer
    useEffect(() => {
        // Define a function to handle the resize event
        const handleResize = debounce(() => {
            setVisPanelWidth(
                window.innerWidth -
                    (isMinimalMode
                        ? 0
                        : VIS_PADDING.left +
                          VIS_PADDING.right +
                          (clinicalInfoRef.current
                              ? isClinicalPanelOpen
                                  ? CLINICAL_PANEL_OPEN_WIDTH
                                  : CLINICAL_PANEL_CLOSED_WIDTH
                              : 0))
            );
        }, 500);

        window.addEventListener('resize', handleResize);

        // Lower opacity of legend image as it leaves viewport in minimal mode
        let legendElement: HTMLElement | null = null;

        let observer: IntersectionObserver | null = null;

        if (isMinimalMode) {
            legendElement = document.querySelector<HTMLElement>('.genome-view-legend');

            const options: IntersectionObserverInit = {
                root: document.querySelector('.minimal_mode'),
                rootMargin: '-250px 0px 0px 0px',
                threshold: [0.9, 0.75, 0.5, 0.25, 0]
            };

            observer = new IntersectionObserver(entry => {
                // Set intersection ratio as opacity (round up to one decimal place)
                legendElement.style.opacity = '' + Math.ceil(10 * entry[0].intersectionRatio) / 10;
            }, options);

            observer.observe(legendElement);
        }

        // Clean up the event listener on component unmount
        return () => {
            window.removeEventListener('resize', handleResize);
            handleResize.cancel?.(); // cancel lodash rebounce

            if (observer && legendElement) {
                observer.unobserve(legendElement); // unobserve the legend element
            }
        };
    }, [isClinicalPanelOpen]);

    // Enable Bootstrap popovers for track tooltips, re-run for selected SV tracks
    useEffect(() => {
        const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]');
        [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl));
    }, [selectedSvId]);

    const goslingComponent = useMemo(() => {
        const loadingCustomJSONDrivers = typeof demo.drivers === 'string' && demo.drivers.split('.').pop() === 'json';
        const isStillLoadingDrivers = loadingCustomJSONDrivers && drivers.length == 0;
        if (!ready || isStillLoadingDrivers) return null;

        const useCustomDrivers = loadingCustomJSONDrivers || !demo.drivers;
        const spec = generateSpec({
            ...demo,
            showOverview,
            xDomain: xDomain as [number, number],
            xOffset: 0,
            showPutativeDriver,
            width: visPanelWidth - (isMinimalMode ? SCROLL_BAR_WIDTH + GOSLING_VIS_COMPONENT_PADDING : 0),
            drivers: useCustomDrivers ? drivers : demo.drivers,
            selectedSvId,
            breakpoints: breakpoints,
            crossChr: false,
            bpIntervals,
            svReads,
            spacing: isMinimalMode ? 100 : 40,
            selectedMutationAbsPos
        });
        currentSpec.current = JSON.stringify(spec);

        return (
            <GoslingComponent
                ref={gosRef}
                spec={spec}
                padding={GOSLING_VIS_COMPONENT_PADDING}
                margin={0}
                reactive={true}
                theme={THEME}
            />
        );
        // !! Removed `demo` not to update twice since `drivers` are updated right after a demo update.
    }, [
        ready,
        xDomain,
        visPanelWidth,
        drivers,
        showOverview,
        showPutativeDriver,
        selectedSvId,
        breakpoints,
        svReads,
        isClinicalPanelOpen,
        selectedMutationAbsPos
    ]);

    useLayoutEffect(() => {
        if (!gosRef.current) return;

        gosRef.current.api.subscribe('click', (_, e) => {
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

            let zoomStart = x;
            let zoomEnd = x1e;
            let padding = (zoomEnd - zoomStart) / 4.0;
            if (e.data[0].svclass === 'Translocation') {
                zoomStart = x;
                zoomEnd = xe;
                padding = 10000;
            }

            gosRef.current.api.zoomTo(
                `${demo.id}-mid-ideogram`,
                `chr1:${zoomStart}-${zoomEnd}`,
                padding,
                ZOOM_DURATION
            );

            // we will show the bam files, so set the initial positions
            setBreakpoints([+x - ZOOM_PADDING, +xe + ZOOM_PADDING, +x1 - ZOOM_PADDING, +x1e + ZOOM_PADDING]);
            setBpIntervals([x, xe, x1, x1e]);
            setSelectedSvId(e.data[0].sv_id + '');

            // move to the bottom
            setTimeout(
                () => document.getElementById('gosling-panel')?.scrollTo({ top: 1000000, behavior: 'smooth' }),
                2000
            );

            leftReads.current = [];
            rightReads.current = [];
        });

        gosRef.current.api.subscribe('mouseOver', (_, e) => {
            const sanitizedChr = (c: string | number) => {
                return `${c}`.replace('chr', '');
            };
            const calDir = (c1: string | number, c2: string | number) => {
                c1 = sanitizedChr(c1);
                c2 = sanitizedChr(c2);
                if (+c1 && +c1 <= 9) {
                    c1 = '0' + c1;
                }
                if (+c2 && +c2 <= 9) {
                    c2 = '0' + c2;
                }
                return c1 < c2 ? 'rightward' : 'leftward';
            };
            if (e.id.includes('-mid-sv') && e.data[0].svclass === 'Translocation') {
                const { chromosome: c, position: p } = e.genomicPosition;
                const padding = 100000;
                if (sanitizedChr(c) === sanitizedChr(e.data[0].chrom1)) {
                    const direction = calDir(c, e.data[0].chrom2);
                    const id = e.data[0].sv_id + '-' + direction;
                    if (id === prevJumpId.current) return;
                    const { start2, end2 } = e.data[0];
                    setJumpButtonInfo({
                        id,
                        x: mousePos.current.x,
                        y: mousePos.current.y,
                        direction,
                        zoomTo: () => gosRef.current.api.zoomTo(e.id, `chr1:${start2}-${end2}`, padding, ZOOM_DURATION)
                    });
                } else {
                    const direction = calDir(c, e.data[0].chrom1);
                    const id = e.data[0].sv_id + '-' + direction;
                    if (id === prevJumpId.current) return;
                    const { start1, end1 } = e.data[0];
                    setJumpButtonInfo({
                        id,
                        x: mousePos.current.x,
                        y: mousePos.current.y,
                        direction,
                        zoomTo: () => gosRef.current.api.zoomTo(e.id, `chr1:${start1}-${end1}`, padding, ZOOM_DURATION)
                    });
                }
            } else {
                setJumpButtonInfo(undefined);
            }
        });

        return () => {
            gosRef.current?.api.unsubscribe('click');
            gosRef.current?.api.unsubscribe('mouseOver');
        };
    });

    return (
        <ErrorBoundary>
            <div
                className={isMinimalMode ? 'minimal_mode' : ''}
                style={{ width: '100%', height: '100%' }}
                onMouseMove={e => {
                    const top = e.clientY;
                    const left = e.clientX;
                    const width = window.innerWidth;
                    const height = window.innerHeight;
                    if (!isMinimalMode) {
                        if (
                            VIS_PADDING.top < top && // past top margin
                            top < height - VIS_PADDING.top && // before bottom margin
                            VIS_PADDING.left < left && // past left margin
                            left <
                                width -
                                    (VIS_PADDING.right +
                                        (isClinicalPanelOpen ? CLINICAL_PANEL_OPEN_WIDTH : CLINICAL_PANEL_CLOSED_WIDTH)) // before right margin
                        ) {
                            setMouseOnVis(true);
                        } else {
                            setMouseOnVis(false);
                        }
                    }
                    mousePos.current = { x: left, y: top };
                }}
                onWheel={() => setJumpButtonInfo(undefined)}
                onClick={() => {
                    if (!mouseOnVis && interactiveMode) setInteractiveMode(false);
                    else if (mouseOnVis && !interactiveMode) setInteractiveMode(true);
                    setJumpButtonInfo(undefined);
                }}
            >
                {!isMinimalMode && (
                    <NavigationBar
                        demo={demo}
                        setShowAbout={setShowAbout}
                        showSmallMultiples={showSmallMultiples}
                        showSamples={showSamples}
                        setShowSamples={setShowSamples}
                        gosRef={gosRef}
                        selectedCohort={selectedCohort}
                        currentSpec={currentSpec}
                        getHtmlTemplate={getHtmlTemplate}
                        demoIndex={demoIndex}
                        externalDemoUrl={externalDemoUrl}
                        externalUrl={externalUrl}
                        isChrome={isChrome}
                        FEEDBACK_EMAIL_ADDRESS={FEEDBACK_EMAIL_ADDRESS}
                    />
                )}
                <div id="vis-panel" className="vis-panel">
                    {!isMinimalMode && (
                        <>
                            {/* Make SampleConfigForm available to trigger from VisOverviewPanel */}
                            <SampleConfigForm
                                demoIndex={demoIndex}
                                setDemo={setDemo}
                                cohorts={cohorts}
                                setCohorts={setCohorts}
                                selectedCohort={selectedCohort}
                                setSelectedCohort={setSelectedCohort}
                            />
                            <VisOverviewPanel
                                cohorts={cohorts}
                                setCohorts={setCohorts}
                                showSamples={showSamples}
                                generateThumbnails={generateThumbnails}
                                demo={demo}
                                demoIndex={demoIndex}
                                externalDemoUrl={externalDemoUrl}
                                filteredSamples={filteredSamples}
                                doneGeneratingThumbnails={doneGeneratingThumbnails}
                                setShowSamples={setShowSamples}
                                setShowAbout={setShowAbout}
                                setFilterSampleBy={setFilterSampleBy}
                                setFilteredSamples={setFilteredSamples}
                                setGenerateThumbnails={setGenerateThumbnails}
                                setDemo={setDemo}
                                selectedCohort={selectedCohort}
                                setSelectedCohort={setSelectedCohort}
                                externalError={externalError}
                            />
                        </>
                    )}
                    <div
                        id="gosling-panel"
                        className="gosling-panel"
                        style={{
                            width: isMinimalMode
                                ? `calc(100% - ${VIS_PADDING.left + VIS_PADDING.right}px)`
                                : `calc(100% - ${
                                      VIS_PADDING.left +
                                      VIS_PADDING.right +
                                      // Additional padding for Clinical Panel
                                      (clinicalInfoRef.current
                                          ? isClinicalPanelOpen
                                              ? CLINICAL_PANEL_OPEN_WIDTH
                                              : CLINICAL_PANEL_CLOSED_WIDTH
                                          : 0)
                                  }px)`,
                            height: `calc(100% - ${VIS_PADDING.top * 2}px)`,
                            padding: `${VIS_PADDING.top}px ${VIS_PADDING.right}px ${VIS_PADDING.bottom}px ${VIS_PADDING.left}px`
                        }}
                    >
                        {goslingComponent}
                        {jumpButtonInfo ? (
                            <button
                                className="jump-to-bp-btn"
                                style={{
                                    position: 'fixed',
                                    left: `${
                                        jumpButtonInfo.x + 20 + (jumpButtonInfo.direction === 'leftward' ? -60 : 0)
                                    }px`,
                                    top: `${jumpButtonInfo.y}px`
                                }}
                                onClick={() => jumpButtonInfo.zoomTo()}
                            >
                                {jumpButtonInfo.direction === 'leftward' ? '←' : '→'}
                            </button>
                        ) : null}
                        {!isMinimalMode && (
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
                                    top: VIS_PADDING.top,
                                    left: VIS_PADDING.left,
                                    opacity: 0.9,
                                    pointerEvents: interactiveMode ? 'none' : 'auto'
                                }}
                            />
                        )}
                        <NavigationButtons isMinimalMode={isMinimalMode} selectedSvId={selectedSvId} />
                        {
                            // External links and export buttons
                            isMinimalMode ? (
                                <MinimalModeExternalLinks
                                    gosRef={gosRef}
                                    demo={demo}
                                    demoIndex={demoIndex}
                                    externalDemoUrl={externalDemoUrl}
                                    externalUrl={externalUrl}
                                    currentSpec={currentSpec}
                                />
                            ) : null
                        }
                        <div
                            style={{
                                pointerEvents: 'none',
                                width: '100%',
                                height: '100%',
                                position: 'relative'
                            }}
                        >
                            <img
                                id="genome-view-legend"
                                className="genome-view-legend"
                                src={legend}
                                style={{
                                    position: 'absolute',
                                    right: `${GOSLING_VIS_COMPONENT_PADDING}px`,
                                    top: isMinimalMode ? '350px' : '3px',
                                    width: '120px'
                                }}
                            />
                            <VariantViewControls
                                visPanelWidth={visPanelWidth}
                                isMinimalMode={isMinimalMode}
                                gosRef={gosRef}
                                demo={demo}
                                genomeViewChr={genomeViewChr}
                                setGenomeViewChr={setGenomeViewChr}
                                showOverview={showOverview}
                                showSamples={showSamples}
                                setShowSamples={setShowSamples}
                            />
                        </div>
                        <TrackTooltips
                            visPanelWidth={visPanelWidth}
                            isMinimalMode={isMinimalMode}
                            demo={demo}
                            selectedSvId={selectedSvId}
                            showSamples={showSamples}
                        />
                    </div>
                </div>
                {!isMinimalMode && (
                    <div
                        style={{
                            visibility:
                                ((!interactiveMode && !mouseOnVis) || (interactiveMode && mouseOnVis)) && !showSamples
                                    ? 'visible'
                                    : 'collapse',
                            position: 'absolute',
                            right: `${
                                VIS_PADDING.right +
                                (!isMinimalMode && clinicalInfoRef.current
                                    ? isClinicalPanelOpen
                                        ? CLINICAL_PANEL_OPEN_WIDTH
                                        : CLINICAL_PANEL_CLOSED_WIDTH
                                    : 0)
                            }px`,
                            top: '60px',
                            background: 'lightgray',
                            color: 'black',
                            padding: '6px',
                            pointerEvents: 'none',
                            boxShadow: '0 0 20px 2px rgba(0, 0, 0, 0.2)'
                        }}
                    >
                        {!interactiveMode
                            ? 'Click inside to use interactions on visualizations'
                            : 'Click outside to deactivate interactions and scroll the page'}
                    </div>
                )}
                {!isMinimalMode && (
                    <div
                        style={{
                            width: '100%',
                            height: '100%',
                            visibility: 'collapse',
                            boxShadow: interactiveMode ? 'inset 0 0 4px 2px #2399DB' : 'none',
                            background: 'none',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            pointerEvents: 'none'
                        }}
                    />
                )}
                <div
                    style={{
                        background: 'none',
                        position: 'absolute',
                        bottom: 20,
                        left: VIS_PADDING.left,
                        pointerEvents: 'none',
                        visibility: demo.bam ? 'collapse' : 'visible'
                    }}
                >
                    {'ⓘ No read alignment data available for this sample.'}
                </div>
                <div
                    className={showAbout ? 'about-modal-container' : 'about-modal-container-hidden'}
                    onClick={() => setShowAbout(false)}
                />
                {!isMinimalMode && <AboutModal showAbout={showAbout} setShowAbout={setShowAbout} />}
                <button
                    className="move-to-top-btn"
                    tabIndex={showSamples ? -1 : 0}
                    aria-label="Scroll to top."
                    style={{
                        right: `${
                            VIS_PADDING.right +
                            (isMinimalMode
                                ? SCROLL_BAR_WIDTH
                                : clinicalInfoRef.current
                                ? isClinicalPanelOpen
                                    ? CLINICAL_PANEL_OPEN_WIDTH
                                    : CLINICAL_PANEL_CLOSED_WIDTH
                                : 0)
                        }px`
                    }}
                    onClick={() => {
                        setTimeout(
                            () => document.getElementById('gosling-panel')?.scrollTo({ top: 0, behavior: 'smooth' }),
                            0
                        );
                    }}
                >
                    <svg className="button" viewBox={ICONS.ARROW_UP.viewBox}>
                        <title>Arrow Up</title>
                        <path fill="currentColor" d={ICONS.ARROW_UP.path[0]} />
                    </svg>
                </button>
                <div id="hidden-gosling" style={{ visibility: 'collapse', position: 'fixed' }} />
                <div className={`instructions-modals-container ${isMinimalMode ? 'minimal' : 'vanilla'}`}>
                    {isMinimalMode ? (
                        <>
                            <GenomeViewModal />
                            <VariantViewModal />
                        </>
                    ) : (
                        <InstructionsModal />
                    )}
                </div>
                {!isMinimalMode && !!clinicalInfoRef.current && (
                    <ClinicalPanel
                        demo={demo}
                        gosRef={gosRef}
                        filteredSamples={filteredSamples}
                        clinicalInfoRef={clinicalInfoRef}
                        isClinicalPanelOpen={isClinicalPanelOpen}
                        setIsClinicalPanelOpen={setIsClinicalPanelOpen}
                        setSelectedSvId={setSelectedSvId}
                        setSelectedMutationAbsPos={setSelectedMutationAbsPos}
                    />
                )}
            </div>
        </ErrorBoundary>
    );
}

export default App;
