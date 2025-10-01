import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { GoslingComponent, GoslingRef, embed } from 'gosling.js';
import { debounce, sample } from 'lodash';
import type { RouteComponentProps } from 'react-router-dom';
import * as bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min';

import generateSpec from './main-spec';
import ErrorBoundary from './error';
import _allDrivers from './data/driver.json';
import _customDrivers from './data/driver.custom.json';
import samples, { SampleType } from './data/samples';
import getOneOfSmallMultiplesSpec from './small-multiples-spec';
import { CHROMOSOMES, THEME, WHOLE_CHROMOSOME_STR } from './constants';
import { ICONS } from './icon';
import { INTERNAL_SAVED_THUMBNAILS } from './data/external-thumbnails';
import { isChrome } from './utils';
import THUMBNAIL_PLACEHOLDER from './script/img/placeholder.png';
import { Database } from './database';
import { getHtmlTemplate } from './html-template';
import { EXTERNAL_THUMBNAILS } from './data/stevens-mpnst';
import { BrowserDatabase } from './browser-log';
import legend from './legend.png';
import { ExportDropdown } from './ui/ExportDropdown';
import { GenomeViewModal } from './ui/GenomeViewModal';
import { VariantViewModal } from './ui/VariantViewModal';
import { NavigationButtons } from './ui/NavigationButtons';
import { Track, getTrackDocData } from './ui/getTrackDocData.js';
import { NavigationBar } from './ui/NavigationBar';
import { InstructionsModal } from './ui/InstructionsModal';
import { ClinicalPanel } from './ui/ClinicalPanel';
import { AboutModal } from './ui/AboutModal';
import { VisOverviewPanel } from './ui/VisOverviewPanel';
import SampleConfigForm from './ui/SampleConfigForm';

import 'bootstrap/dist/css/bootstrap.min.css';
import './css/App.css';

const db = new Database();
const log = new BrowserDatabase();

const DB_DO_NOT_SHOW_ABOUT_BY_DEFAULT = (await log.get())?.doNotShowAboutByDefault ?? false;
const DATABSE_THUMBNAILS = await db.get();
const GENERATED_THUMBNAILS = {};

const INIT_VIS_PANEL_WIDTH = window.innerWidth;
const ZOOM_PADDING = 200;
const ZOOM_DURATION = 500;

const FEEDBACK_EMAIL_ADDRESS = 'dominik_glodzik@hms.harvard.edu';

const allDrivers = [
    ...(_allDrivers as any),
    ..._customDrivers.map(d => {
        return { ...d, sample_id: 'SRR7890905' };
    }),
    ..._customDrivers.map(d => {
        return { ...d, sample_id: 'SRR7890905_Hartwig' };
    })
];

// Spacing variables
const SCROLL_BAR_WIDTH = 12;
const GOSLING_VIS_COMPONENT_PADDING = 3;
const CLINICAL_PANEL_OPEN_WIDTH = 250;
const CLINICAL_PANEL_CLOSED_WIDTH = 45;

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
    const demoIndex = useRef(+urlParams.get('demoIndex') ?? 0);
    const [showSmallMultiples, setShowSmallMultiples] = useState(externalUrl === null);
    const [ready, setReady] = useState(externalUrl === null);

    const selectedSamples = useMemo(
        () => (!exampleId ? samples.filter(d => d.group === 'default') : samples.filter(d => d.group === exampleId)),
        [exampleId]
    );

    const gosRef = useRef<GoslingRef>();

    // demo
    const [demo, setDemo] = useState(
        selectedSamples[demoIndex.current < selectedSamples.length ? demoIndex.current : 0]
    );
    const externalDemoUrl = useRef<string>();

    const currentSpec = useRef<string>();

    const [selectedCohort, setSelectedCohort] = useState<string>(null);

    // Selected Mutation
    const [selectedMutationAbsPos, setSelectedMutationAbsPos] = useState<number>(null);

    // Clinical Panel will only render in non-minimal mode and if the demo has clinical info
    const [isClinicalPanelOpen, setIsClinicalPanelOpen] = useState(false);

    // Create a ref to store clinical info across renders
    const clinicalInfoRef = useRef(null);

    // interactions
    const [showSamples, setShowSamples] = useState(urlParams.get('showSamples') !== 'false' && !xDomain);
    const [showAbout, setShowAbout] = useState(false);
    const [thumbnailForceGenerate, setThumbnailForceGenerate] = useState(false);
    const [generateThumbnails, setGenerateThumbnails] = useState(false);
    const [doneGeneratingThumbnails, setDoneGeneratingThumbnails] = useState(false);
    const [filterSampleBy, setFilterSampleBy] = useState('');
    const [filteredSamples, setFilteredSamples] = useState(selectedSamples);
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

    useEffect(() => {
        if (externalUrl) {
            fetch(externalUrl).then(response =>
                response.text().then(d => {
                    let externalDemo = JSON.parse(d);

                    // External demo is an object with samples array
                    if (externalDemo?.samples?.length > 0) {
                        setSelectedCohort(externalDemo?.name ?? 'Custom Cohort');
                        setFilteredSamples(externalDemo.samples);
                        externalDemo =
                            externalDemo?.samples[demoIndex.current < externalDemo.length ? demoIndex.current : 0];
                    }
                    // External demo contains multiple samples
                    else if (Array.isArray(externalDemo) && externalDemo.length >= 0) {
                        setFilteredSamples(externalDemo);
                        externalDemo = externalDemo[demoIndex.current < externalDemo.length ? demoIndex.current : 0];
                    } else {
                        setFilteredSamples([externalDemo]);
                    }
                    if (externalDemo) {
                        if (externalDemo?.clinicalInfo) {
                            clinicalInfoRef.current = externalDemo.clinicalInfo;
                        }
                        setDemo(externalDemo);
                    }
                    setShowSmallMultiples(true);
                    setReady(true);
                })
            );
        }
    }, []);

    useEffect(() => {
        prevJumpId.current = jumpButtonInfo?.id;
    }, [jumpButtonInfo]);

    useEffect(() => {
        setFilteredSamples(
            filterSampleBy === '' ? selectedSamples : selectedSamples.filter(d => d.id.includes(filterSampleBy))
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

    // Enable Bootstrap popovers for track tooltips, update for selected SV tracks
    useEffect(() => {
        const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]');
        const popoverList = [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl));
    }, [selectedSvId]);

    const getThumbnail = (d: SampleType) => {
        return (
            d.thumbnail ||
            INTERNAL_SAVED_THUMBNAILS[d.id] ||
            EXTERNAL_THUMBNAILS[d.id] ||
            DATABSE_THUMBNAILS.find(db => db.id === d.id)?.dataUrl ||
            GENERATED_THUMBNAILS[d.id]
        );
    };

    const AvailabilityIcon = (isAvailable: boolean) => {
        return (
            <svg className="data-availability-checkbox" viewBox="0 0 16 16">
                <title>Checkbox</title>
                {(isAvailable ? ICONS.CHECKSQUARE : ICONS.SQUARE).path.map(p => (
                    <path fill="currentColor" key={p} d={p} />
                ))}
            </svg>
        );
    };
    const smallOverviewWrapper = useMemo(() => {
        // !! Uncomment the following lines to generated specs for making thumbnails.
        // console.log(
        //     'overviewSpec',
        //     filteredSamples.map(d =>
        //         getOneOfSmallMultiplesSpec({
        //             cnvUrl: d.cnv,
        //             svUrl: d.sv,
        //             width: 1200,
        //             title: d.cancer.charAt(0).toUpperCase() + d.cancer.slice(1),
        //             subtitle: d.id, // '' + d.id.slice(0, 20) + (d.id.length >= 20 ? '...' : ''),
        //             cnFields: d.cnFields ?? ['total_cn', 'major_cn', 'minor_cn']
        //         })
        //     ),
        //     filteredSamples.map(d => `node gosling-screenshot.js output/${d.id}.json img/${d.id}.jpeg`).join('\n')
        // );
        // return [];
        /* Load image if necessary */
        const noThumbnail = filteredSamples.filter(d => !getThumbnail(d))[0];
        if (noThumbnail && generateThumbnails) {
            const { id } = noThumbnail;
            const spec = getOneOfSmallMultiplesSpec({
                cnvUrl: noThumbnail.cnv,
                svUrl: noThumbnail.sv,
                width: 600,
                title: noThumbnail.cancer.charAt(0).toUpperCase() + noThumbnail.cancer.slice(1),
                subtitle: id,
                cnFields: noThumbnail.cnFields ?? ['total_cn', 'major_cn', 'minor_cn']
            });
            const hidden = document.getElementById('hidden-gosling');
            embed(hidden, spec, { padding: 0, margin: 10 }).then(api => {
                setTimeout(() => {
                    const { canvas } = api.getCanvas();
                    const dataUrl = canvas.toDataURL('image/png');
                    GENERATED_THUMBNAILS[noThumbnail.id] = dataUrl;
                    db.add(id, dataUrl);
                    setThumbnailForceGenerate(!thumbnailForceGenerate);
                }, 10000);
            });
        }
        if (noThumbnail) {
            setDoneGeneratingThumbnails(false);
        } else {
            setDoneGeneratingThumbnails(true);
        }
        return filteredSamples.map((d, i) => (
            <div
                key={JSON.stringify(d.id)}
                onClick={() => {
                    demoIndex.current = i;
                    setShowSamples(false);
                    setTimeout(() => {
                        setDemo(d);
                    }, 300);
                }}
                className={'overview' + (demo === d ? ' selected-overview' : ' unselected-overview')}
            >
                <div style={{ fontWeight: 500 }}>
                    {d.cancer.charAt(0).toUpperCase() + d.cancer.slice(1).split(' ')[0]}
                </div>
                <div style={{ color: 'grey', fontSize: '14px' }}>
                    {'' + d.id.slice(0, 20) + (d.id.length >= 20 ? '...' : '')}
                </div>
                <div style={{ position: 'relative' }}>
                    {getThumbnail(d) ? (
                        <img src={getThumbnail(d)} style={{ width: `${420 / 2}px`, height: `${420 / 2}px` }} />
                    ) : (
                        // <div style={{ marginLeft: 'calc(50% - 105px - 10px)' }}>
                        //     <GoslingComponent
                        //         padding={0}
                        //         margin={10}
                        //         spec={getOneOfSmallMultiplesSpec({
                        //             cnvUrl: d.cnv,
                        //             svUrl: d.sv,
                        //             width: 210,
                        //             title: d.cancer.charAt(0).toUpperCase() + d.cancer.slice(1),
                        //             subtitle: d.id, // '' + d.id.slice(0, 20) + (d.id.length >= 20 ? '...' : ''),
                        //             cnFields: d.cnFields ?? ['total_cn', 'major_cn', 'minor_cn']
                        //         })}
                        //     />
                        // </div>
                        <>
                            <img
                                src={THUMBNAIL_PLACEHOLDER}
                                style={{ width: `${420 / 2}px`, height: `${420 / 2}px` }}
                            />
                            <span className="thumbnail-loading-message">
                                {generateThumbnails ? 'Loading...' : 'Thumbnail Missing'}
                            </span>
                        </>
                    )}
                    <span className="tag-assembly">{d.assembly ?? 'hg38'}</span>
                </div>
                <div className="tag-parent">
                    <div className={'tag-sv'}>{AvailabilityIcon(true)}SV</div>
                    <div className={d.vcf && d.vcfIndex ? 'tag-pm' : 'tag-disabled'}>
                        {AvailabilityIcon(!!d.vcf && !!d.vcfIndex)}Point Mutation
                    </div>
                    <div className={d.vcf2 && d.vcf2Index ? 'tag-id' : 'tag-disabled'}>
                        {AvailabilityIcon(!!d.vcf2 && !!d.vcf2Index)}Indel
                    </div>
                    <div className={d.bam && d.bai ? 'tag-ra' : 'tag-disabled'}>
                        {AvailabilityIcon(!!d.bam && !!d.bai)}Read Alignment
                    </div>
                    {d.note ? <div className="tag-note">{d.note}</div> : null}
                </div>
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
    }, [demo, filteredSamples, thumbnailForceGenerate, generateThumbnails]);

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
                experimental={{ reactive: true }}
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

    const trackTooltips = useMemo(() => {
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
        const trackPositions = tracksShown.map((t, i) => {
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
    }, [demo, visPanelWidth, selectedSvId, showSamples]);

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
                                onAdd={config => {
                                    setFilteredSamples([
                                        {
                                            ...config,
                                            group: 'default'
                                        },
                                        ...filteredSamples
                                    ]);
                                }}
                            />
                            <VisOverviewPanel
                                FEEDBACK_EMAIL_ADDRESS={FEEDBACK_EMAIL_ADDRESS}
                                showSamples={showSamples}
                                generateThumbnails={generateThumbnails}
                                smallOverviewWrapper={smallOverviewWrapper}
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
                                <div className="external-links">
                                    <nav className="external-links-nav">
                                        <button
                                            className="open-in-chromoscope-link link-button"
                                            // tabIndex={2}
                                            onClick={e => {
                                                e.preventDefault();
                                                const { xDomain } = gosRef.current.hgApi.api.getLocation(
                                                    `${demo.id}-mid-ideogram`
                                                );
                                                if (xDomain) {
                                                    // urlParams.set('demoIndex', demoIndex.current + '');
                                                    // urlParams.set('domain', xDomain.join('-'));
                                                    let newUrl =
                                                        window.location.origin + window.location.pathname + '?';
                                                    newUrl += `demoIndex=${demoIndex.current}`;
                                                    newUrl += `&domain=${xDomain.join('-')}`;
                                                    if (externalDemoUrl.current) {
                                                        newUrl += `&external=${externalDemoUrl.current}`;
                                                    } else if (externalUrl) {
                                                        newUrl += `&external=${externalUrl}`;
                                                    }
                                                    window.open(newUrl, '_blank');
                                                }
                                            }}
                                        >
                                            <div className="link-group">
                                                <span>Open in Chromoscope</span>
                                                <svg
                                                    className="external-link-icon"
                                                    width="12"
                                                    height="11"
                                                    viewBox="0 0 12 11"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        d="M9.8212 1.73104L10.6894 0.875H9.47015H7.66727C7.55064 0.875 7.46966 0.784774 7.46966 0.6875C7.46966 0.590226 7.55064 0.5 7.66727 0.5H11.1553C11.2719 0.5 11.3529 0.590226 11.3529 0.6875V4.125C11.3529 4.22227 11.2719 4.3125 11.1553 4.3125C11.0387 4.3125 10.9577 4.22228 10.9577 4.125V2.34824V1.15307L10.1067 1.9922L5.71834 6.31907C5.71831 6.3191 5.71828 6.31913 5.71825 6.31916C5.64039 6.39579 5.51053 6.39576 5.43271 6.31907C5.35892 6.24635 5.35892 6.1308 5.43271 6.05808L5.4328 6.05799L9.8212 1.73104ZM1.19116 2.40625C1.19116 1.73964 1.74085 1.1875 2.43519 1.1875H4.87682C4.99345 1.1875 5.07443 1.27773 5.07443 1.375C5.07443 1.47227 4.99345 1.5625 4.87682 1.5625H2.43519C1.97411 1.5625 1.58638 1.93419 1.58638 2.40625V9.28125C1.58638 9.75331 1.97411 10.125 2.43519 10.125H9.41129C9.87237 10.125 10.2601 9.75331 10.2601 9.28125V6.875C10.2601 6.77773 10.3411 6.6875 10.4577 6.6875C10.5743 6.6875 10.6553 6.77773 10.6553 6.875V9.28125C10.6553 9.94786 10.1056 10.5 9.41129 10.5H2.43519C1.74085 10.5 1.19116 9.94786 1.19116 9.28125V2.40625Z"
                                                        fill="black"
                                                        stroke="black"
                                                    />
                                                </svg>
                                            </div>
                                        </button>
                                        <div className="button-group">
                                            <div className="export-links">
                                                <ExportDropdown gosRef={gosRef} currentSpec={currentSpec} />
                                            </div>
                                            <div className="feedback">
                                                <a
                                                    href={`mailto:${FEEDBACK_EMAIL_ADDRESS}?subject=Chromoscope%20Feedback&body=Feedback%20Type%3A%20General%20Feedback%0D%0A%0D%0AComments%3A%0D%0A%0D%0A%0D%0A`}
                                                    className="link-button"
                                                >
                                                    <svg className="button" viewBox={ICONS.MAIL.viewBox}>
                                                        <title>Mail</title>
                                                        <path fill="currentColor" d={ICONS.MAIL.path[0]} />
                                                    </svg>
                                                    <span>Feedback</span>
                                                </a>
                                            </div>
                                        </div>
                                    </nav>
                                </div>
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
                                                    gosRef.current.hgApi.api.zoomToGene(
                                                        `${demo.id}-mid-ideogram`,
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
                                                const [start, end] =
                                                    gosRef.current?.hgApi.api.getLocation(trackId).xDomain;
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
                                                const [start, end] =
                                                    gosRef.current?.hgApi.api.getLocation(trackId).xDomain;
                                                const delta = (end - start) / 2.0;
                                                gosRef.current.api.zoomTo(
                                                    trackId,
                                                    `chr1:${start}-${end}`,
                                                    delta,
                                                    ZOOM_DURATION
                                                );
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
                                                const [start, end] =
                                                    gosRef.current?.hgApi.api.getLocation(trackId).xDomain;
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
                                                const [start, end] =
                                                    gosRef.current?.hgApi.api.getLocation(trackId).xDomain;
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
                        </div>
                        {trackTooltips}
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
