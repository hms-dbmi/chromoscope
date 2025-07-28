import React, { useState, useRef, useEffect } from 'react';

import { ICONS } from '../../icon';
import { OverviewFilter } from './OverviewFilter';

import { samples, SampleType } from '../../data/samples';

// Store example samples
export const PCAWG_SAMPLES = [
    {
        name: '[Liver-HCC] Liver Hepatocellular Carcinoma',
        url: 'https://chromoscope.bio/app/?showSamples=true&external=https://somatic-browser-test.s3.amazonaws.com/PCAWG/Liver-HCC/configs/Liver-HCC.all.config.json',
        count: 327
    },
    {
        name: '[Prost-AdenoCA] Prostate Adenocarcinoma',
        url: 'https://chromoscope.bio/app/?showSamples=true&external=https://somatic-browser-test.s3.amazonaws.com/PCAWG/Prost-AdenoCA/configs/Prost-AdenoCA.all.config.json',
        count: 286
    },
    {
        name: '[Panc-AdenoCA] Pancreas Adenocarcinoma',
        url: 'https://chromoscope.bio/app/?showSamples=true&external=https://somatic-browser-test.s3.amazonaws.com/PCAWG/Panc-AdenoCA/configs/Panc-AdenoCA.all.config.json',
        count: 241
    },
    {
        name: '[Breast-AdenoCA] Breast Adenocarcinoma',
        url: 'https://chromoscope.bio/app/?showSamples=true&external=https://somatic-browser-test.s3.amazonaws.com/PCAWG/Breast-AdenoCA/configs/Breast-AdenoCA.all.config.json',
        count: 198
    },
    {
        name: '[CNS-Medullo] CNS Medulloblastoma',
        url: 'https://chromoscope.bio/app/?showSamples=true&external=https://somatic-browser-test.s3.amazonaws.com/PCAWG/CNS-Medullo/configs/CNS-Medullo.all.config.json',
        count: 146
    },
    {
        name: '[Kidney-RCC] Kidney Renal Cell Carcinoma (Proximal Tubules)',
        url: 'https://chromoscope.bio/app/?showSamples=true&external=https://somatic-browser-test.s3.amazonaws.com/PCAWG/Kidney-RCC/configs/Kidney-RCC.all.config.json',
        count: 144
    },
    {
        name: '[Ovary-AdenoCA] Ovary Adenocarcinoma',
        url: 'https://chromoscope.bio/app/?showSamples=true&external=https://somatic-browser-test.s3.amazonaws.com/PCAWG/Ovary-AdenoCA/configs/Ovary-AdenoCA.all.config.json',
        count: 113
    },
    {
        name: '[Skin-Melanoma] Skin Melanoma',
        url: 'https://chromoscope.bio/app/?showSamples=true&external=https://somatic-browser-test.s3.amazonaws.com/PCAWG/Skin-Melanoma/configs/Skin-Melanoma.all.config.json',
        count: 107
    },
    {
        name: '[Lymph-BNHL] Lymphoid Mature B-Cell Lymphoma',
        url: 'https://chromoscope.bio/app/?showSamples=true&external=https://somatic-browser-test.s3.amazonaws.com/PCAWG/Lymph-BNHL/configs/Lymph-BNHL.all.config.json',
        count: 105
    },
    {
        name: '[Eso-AdenoCA] Esophagus Adenocarcinoma',
        url: 'https://chromoscope.bio/app/?showSamples=true&external=https://somatic-browser-test.s3.amazonaws.com/PCAWG/Eso-AdenoCA/configs/Eso-AdenoCA.all.config.json',
        count: 98
    },
    {
        name: '[Lymph-CLL] Lymphoid Chronic Lymphocytic Leukemia',
        url: 'https://chromoscope.bio/app/?showSamples=true&external=https://somatic-browser-test.s3.amazonaws.com/PCAWG/Lymph-CLL/configs/Lymph-CLL.all.config.json',
        count: 95
    },
    {
        name: '[CNS-PiloAstro] CNS Non-Diffuse Glioma',
        url: 'https://chromoscope.bio/app/?showSamples=true&external=https://somatic-browser-test.s3.amazonaws.com/PCAWG/CNS-PiloAstro/configs/CNS-PiloAstro.all.config.json',
        count: 89
    },
    {
        name: '[Panc-Endocrine] Pancreas Neuroendocrine Tumor',
        url: 'https://chromoscope.bio/app/?showSamples=true&external=https://somatic-browser-test.s3.amazonaws.com/PCAWG/Panc-Endocrine/configs/Panc-Endocrine.all.config.json',
        count: 85
    },
    {
        name: '[Stomach-AdenoCA] Stomach Adenocarcinoma',
        url: 'https://chromoscope.bio/app/?showSamples=true&external=https://somatic-browser-test.s3.amazonaws.com/PCAWG/Stomach-AdenoCA/configs/Stomach-AdenoCA.all.config.json',
        count: 75
    },
    {
        name: '[ColoRect-AdenoCA] Colon/Rectum Adenocarcinoma',
        url: 'https://chromoscope.bio/app/?showSamples=true&external=https://somatic-browser-test.s3.amazonaws.com/PCAWG/ColoRect-AdenoCA/configs/ColoRect-AdenoCA.all.config.json',
        count: 60
    },
    {
        name: '[Head-SCC] Head/Neck Squamous Cell Carcinoma',
        url: 'https://chromoscope.bio/app/?showSamples=true&external=https://somatic-browser-test.s3.amazonaws.com/PCAWG/Head-SCC/configs/Head-SCC.all.config.json',
        count: 57
    },
    {
        name: '[Myeloid-MPN] Myeloid Myeloproliferative Neoplasm',
        url: 'https://chromoscope.bio/app/?showSamples=true&external=https://somatic-browser-test.s3.amazonaws.com/PCAWG/Myeloid-MPN/configs/Myeloid-MPN.all.config.json',
        count: 51
    },
    {
        name: '[Uterus-AdenoCA] Uterus Adenocarcinoma',
        url: 'https://chromoscope.bio/app/?showSamples=true&external=https://somatic-browser-test.s3.amazonaws.com/PCAWG/Uterus-AdenoCA/configs/Uterus-AdenoCA.all.config.json',
        count: 51
    },
    {
        name: '[Lung-SCC] Lung Squamous Cell Carcinoma',
        url: 'https://chromoscope.bio/app/?showSamples=true&external=https://somatic-browser-test.s3.amazonaws.com/PCAWG/Lung-SCC/configs/Lung-SCC.all.config.json',
        count: 48
    },
    {
        name: '[Thy-AdenoCA] Thyroid Adenocarcinoma',
        url: 'https://chromoscope.bio/app/?showSamples=true&external=https://somatic-browser-test.s3.amazonaws.com/PCAWG/Thy-AdenoCA/configs/Thy-AdenoCA.all.config.json',
        count: 48
    },
    {
        name: '[Kidney-ChRCC] Kidney Renal Cell Carcinoma (Distal Tubules)',
        url: 'https://chromoscope.bio/app/?showSamples=true&external=https://somatic-browser-test.s3.amazonaws.com/PCAWG/Kidney-ChRCC/configs/Kidney-ChRCC.all.config.json',
        count: 45
    },
    {
        name: '[CNS-GBM] CNS Glioblastoma',
        url: 'https://chromoscope.bio/app/?showSamples=true&external=https://somatic-browser-test.s3.amazonaws.com/PCAWG/CNS-GBM/configs/CNS-GBM.all.config.json',
        count: 41
    },
    {
        name: '[Bone-Osteosarc] Bone/Softtissue Osteosarcoma',
        url: 'https://chromoscope.bio/app/?showSamples=true&external=https://somatic-browser-test.s3.amazonaws.com/PCAWG/Bone-Osteosarc/configs/Bone-Osteosarc.all.config.json',
        count: 39
    },
    {
        name: '[Lung-AdenoCA] Lung Adenocarcinoma',
        url: 'https://chromoscope.bio/app/?showSamples=true&external=https://somatic-browser-test.s3.amazonaws.com/PCAWG/Lung-AdenoCA/configs/Lung-AdenoCA.all.config.json',
        count: 38
    },
    {
        name: '[Biliary-AdenoCA] Biliary Adenocarcinoma',
        url: 'https://chromoscope.bio/app/?showSamples=true&external=https://somatic-browser-test.s3.amazonaws.com/PCAWG/Biliary-AdenoCA/configs/Biliary-AdenoCA.all.config.json',
        count: 34
    },
    {
        name: '[Bone-Leiomyo] Bone/Softtissue Leiomyosarcoma',
        url: 'https://chromoscope.bio/app/?showSamples=true&external=https://somatic-browser-test.s3.amazonaws.com/PCAWG/Bone-Leiomyo/configs/Bone-Leiomyo.all.config.json',
        count: 34
    },
    {
        name: '[Bladder-TCC] Bladder Transitional Cell Carcinoma',
        url: 'https://chromoscope.bio/app/?showSamples=true&external=https://somatic-browser-test.s3.amazonaws.com/PCAWG/Bladder-TCC/configs/Bladder-TCC.all.config.json',
        count: 23
    },
    {
        name: '[Cervix-SCC] Cervix Squamous Cell Carcinoma',
        url: 'https://chromoscope.bio/app/?showSamples=true&external=https://somatic-browser-test.s3.amazonaws.com/PCAWG/Cervix-SCC/configs/Cervix-SCC.all.config.json',
        count: 18
    },
    {
        name: '[CNS-Oligo] CNS Oligodendroglioma',
        url: 'https://chromoscope.bio/app/?showSamples=true&external=https://somatic-browser-test.s3.amazonaws.com/PCAWG/CNS-Oligo/configs/CNS-Oligo.all.config.json',
        count: 18
    },
    {
        name: '[Myeloid-AML] Myeloid Acute Myeloid Leukemia',
        url: 'https://chromoscope.bio/app/?showSamples=true&external=https://somatic-browser-test.s3.amazonaws.com/PCAWG/Myeloid-AML/configs/Myeloid-AML.all.config.json',
        count: 16
    },
    {
        name: '[Breast-LobularCA] Breast Lobular Carcinoma',
        url: 'https://chromoscope.bio/app/?showSamples=true&external=https://somatic-browser-test.s3.amazonaws.com/PCAWG/Breast-LobularCA/configs/Breast-LobularCA.all.config.json',
        count: 13
    },
    {
        name: '[Bone-Epith] Bone Neoplasm Epithelioid',
        url: 'https://chromoscope.bio/app/?showSamples=true&external=https://somatic-browser-test.s3.amazonaws.com/PCAWG/Bone-Epith/configs/Bone-Epith.all.config.json',
        count: 10
    },
    {
        name: '[Bone-Cart] Bone/Softtissue Chondroblastoma',
        url: 'https://chromoscope.bio/app/?showSamples=true&external=https://somatic-browser-test.s3.amazonaws.com/PCAWG/Bone-Cart/configs/Bone-Cart.all.config.json',
        count: 9
    },
    {
        name: '[Bone-Osteoblast] Bone/Softtissue Osteoblastoma',
        url: 'https://chromoscope.bio/app/?showSamples=true&external=https://somatic-browser-test.s3.amazonaws.com/PCAWG/Bone-Osteoblast/configs/Bone-Osteoblast.all.config.json',
        count: 5
    },
    {
        name: '[Breast-DCIS] Breast In Situ Adenocarcinoma',
        url: 'https://chromoscope.bio/app/?showSamples=true&external=https://somatic-browser-test.s3.amazonaws.com/PCAWG/Breast-DCIS/configs/Breast-DCIS.all.config.json',
        count: 3
    },
    {
        name: '[Myeloid-MDS] Myeloid Myelodysplastic Syndrome',
        url: 'https://chromoscope.bio/app/?showSamples=true&external=https://somatic-browser-test.s3.amazonaws.com/PCAWG/Myeloid-MDS/configs/Myeloid-MDS.all.config.json',
        count: 3
    },
    {
        name: '[Cervix-AdenoCA] Cervix Adenocarcinoma',
        url: 'https://chromoscope.bio/app/?showSamples=true&external=https://somatic-browser-test.s3.amazonaws.com/PCAWG/Cervix-AdenoCA/configs/Cervix-AdenoCA.all.config.json',
        count: 2
    },
    {
        name: '[Lymph-NOS] Lymphoid Lymphoma NOS',
        url: 'https://chromoscope.bio/app/?showSamples=true&external=https://somatic-browser-test.s3.amazonaws.com/PCAWG/Lymph-NOS/configs/Lymph-NOS.all.config.json',
        count: 2
    },
    {
        name: '[Bone-Benign] Bone/Softtissue Osteofibrous Dysplasia',
        url: 'https://chromoscope.bio/app/?showSamples=true&external=https://somatic-browser-test.s3.amazonaws.com/PCAWG/Bone-Benign/configs/Bone-Benign.all.config.json',
        count: 1
    }
];

export const CURATED_SAMPLE_SETS = [
    {
        name: 'Pan-cancer Examples',
        count: 13,
        url: 'https://chromoscope.bio/app/?showSamples=true&external=https://somatic-browser-test.s3.us-east-1.amazonaws.com/browserExamples/configs/default_config.json'
    },
    {
        name: 'Pathogenic BRCA1/2 mutations',
        count: 44,
        url: 'https://chromoscope.bio/app/?showSamples=true&external=https://somatic-browser-test.s3.amazonaws.com/pathogenicBrca/configs/pathogenicBrca.all.config.json'
    },
    {
        name: 'Breast cancer co-amplifications',
        count: 23,
        url: 'https://chromoscope.bio/app/?showSamples=true&external=https://somatic-browser-test.s3.amazonaws.com/coamps/configs/coamps.all.config.withnotes.json'
    },
    {
        name: 'Bi-allelic loss of CDK12',
        count: 12,
        url: 'https://chromoscope.bio/app/?showSamples=true&external=https://somatic-browser-test.s3.amazonaws.com/configs/allCDK12_fine.json'
    },
    {
        name: 'CCNE1 amplifications',
        count: 58,
        url: 'https://chromoscope.bio/app/?showSamples=true&external=https://somatic-browser-test.s3.amazonaws.com/ccne1_amp/configs/ccne1_amp.all.config.json'
    },
    {
        name: 'Bi-allelic ATM mutations',
        count: 21,
        url: 'https://chromoscope.bio/app/?showSamples=true&external=https://somatic-browser-test.s3.amazonaws.com/atm_bi/configs/atm_bi.all.config.json'
    }
];

export type FilterOption = {
    name: string;
    url?: string;
    count?: number;
    samples?: SampleType[]; // Optionally pass samples directly
};

export type Filter = {
    nullValue?: string;
    title: string;
    options: Array<FilterOption>;
    active: boolean;
};

type FilterGroup = {
    [key: string]: Filter;
};

const defaultFilters: FilterGroup = {
    curatedSampleSets: {
        title: 'Curated Sample Sets',
        options: CURATED_SAMPLE_SETS,
        active: true, // Show this filter selected by default
        nullValue: 'Pan-cancer Examples'
    },
    cancerType: {
        title: 'Cancer Type',
        options: PCAWG_SAMPLES,
        active: false
    }
};

type SampleDropdownProps = {
    selectedCohort: string | null;
};

const SampleDropdown = ({ selectedCohort }: SampleDropdownProps) => {
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown on outside click
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            const clickedOutside = !dropdownRef.current || !dropdownRef.current.contains(event.target as Node);
            if (clickedOutside) {
                setShowDropdown(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="dropdown-container" ref={dropdownRef}>
            <button
                className={`dropdown-button ${showDropdown ? 'toggle-open' : ''}`}
                onClick={e => setShowDropdown(!showDropdown)}
            >
                <span className="">{selectedCohort ?? 'PCAWG: Cancer Cohort'}</span>
                <svg className="icon" viewBox={ICONS.CHEVRON_UP.viewBox}>
                    <title>{showDropdown ? 'Chevron Up' : 'Chevron Down'}</title>
                    {ICONS.CHEVRON_UP.path.map(p => (
                        <path fill="currentColor" key={p} d={p} />
                    ))}
                </svg>
            </button>
            <ul className={`dropdown-items ${showDropdown ? 'd-flex' : 'd-none'}`}>
                <div className="sample-placeholder">
                    <div className="icon-container">
                        <svg className="icon" viewBox={ICONS.USERS.viewBox}>
                            <title>Users</title>
                            {ICONS.USERS.path.map(p => (
                                <path fill="currentColor" key={p} d={p} />
                            ))}
                        </svg>
                    </div>
                    <div className="text">
                        <h4>Cohorts Coming Soon</h4>
                        <span>Create a New Cohort to browse cohorts on Chromoscope</span>
                    </div>
                </div>
            </ul>
        </div>
    );
};

type OverviewPanelProps = {
    smallOverviewWrapper: React.ReactNode;
    demoIndex: React.MutableRefObject<number>;
    externalDemoUrl: React.MutableRefObject<string>;
    filteredSamples: Array<any>;
    setFilteredSamples: (samples: Array<any>) => void;
    setDemo: (demo: any) => void;
};

export const OverviewPanel = ({
    smallOverviewWrapper,
    demoIndex,
    externalDemoUrl,
    filteredSamples,
    setFilteredSamples,
    setDemo
}: OverviewPanelProps) => {
    const [selectedCohort, setSelectedCohort] = useState<string | null>(null);
    const [activeFilters, setActiveFilters] = useState<string[]>([]);

    // Scroll to top when new sample is selected
    useEffect(() => {
        // Scroll to top when new cohort is selected
        if (selectedCohort) {
            const container = document.querySelector('.overview-container');
            if (container) {
                container.scrollTo({ top: 0 });
            }
        }
    }, [selectedCohort]);

    const onChange = (url: string) => {
        fetch(url).then(response =>
            response.text().then(d => {
                let externalDemo = JSON.parse(d);
                if (Array.isArray(externalDemo) && externalDemo.length >= 0) {
                    setFilteredSamples(externalDemo);
                    externalDemo = externalDemo[demoIndex.current < externalDemo.length ? demoIndex.current : 0];
                }
                if (externalDemo) {
                    externalDemoUrl.current = url;
                    setDemo(externalDemo);
                }
            })
        );
    };

    useEffect(() => {
        // When no filters active, show default sample set
        if (activeFilters.length === 0) {
            setFilteredSamples(samples);
        }
    }, [activeFilters]);

    // When a new sample is added, add a class to the overview container
    useEffect(() => {
        const overviewContainer = document.querySelector('.overview-container');
        if (overviewContainer) {
            overviewContainer.classList.add('new-sample-added');
            setTimeout(() => {
                overviewContainer.classList.remove('new-sample-added');
            }, 3000);
        }
    }, [filteredSamples]);

    return (
        <div>
            <div className="overview-root">
                <div className="overview-header">
                    <SampleDropdown selectedCohort={selectedCohort} />
                    <button className="upload-file-button" data-bs-toggle="modal" data-bs-target="#upload-modal">
                        <svg className="button" viewBox={ICONS.UPLOAD_FILE.viewBox}>
                            <title>Upload File</title>
                            {ICONS.UPLOAD_FILE.path.map(p => (
                                <path fill="currentColor" key={p} d={p} />
                            ))}
                        </svg>
                        <span>Upload New Data</span>
                    </button>
                </div>
                <div className="overview-controls">
                    {Object.keys(defaultFilters).map((filter, index) => {
                        return (
                            <OverviewFilter
                                key={index}
                                identifier={filter}
                                title={defaultFilters[filter].title}
                                options={defaultFilters[filter].options}
                                active={activeFilters.includes(filter)}
                                onChange={onChange}
                                activeFilters={activeFilters}
                                nullValue={defaultFilters[filter].nullValue}
                                setActiveFilters={setActiveFilters}
                            />
                        );
                    })}
                </div>
                <div className="overview-status">{`Total of ${filteredSamples.length} samples loaded`}</div>
                <div className="overview-container">{smallOverviewWrapper}</div>
            </div>
        </div>
    );
};
