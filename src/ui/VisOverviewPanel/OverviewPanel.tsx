import React, { useState, useRef, useEffect } from 'react';

import { CancerSelector } from '../cancer-selector';
import SampleConfigForm from '../sample-config-form';
import { ICONS } from '../../icon';

// Store example samples
export const PCAWG_SAMPLES = [
    {
        cancer: '[Liver-HCC] Liver Hepatocellular Carcinoma',
        url: 'https://chromoscope.bio/app/?showSamples=true&external=https://somatic-browser-test.s3.amazonaws.com/PCAWG/Liver-HCC/configs/Liver-HCC.all.config.json',
        count: 327
    },
    {
        cancer: '[Prost-AdenoCA] Prostate Adenocarcinoma',
        url: 'https://chromoscope.bio/app/?showSamples=true&external=https://somatic-browser-test.s3.amazonaws.com/PCAWG/Prost-AdenoCA/configs/Prost-AdenoCA.all.config.json',
        count: 286
    },
    {
        cancer: '[Panc-AdenoCA] Pancreas Adenocarcinoma',
        url: 'https://chromoscope.bio/app/?showSamples=true&external=https://somatic-browser-test.s3.amazonaws.com/PCAWG/Panc-AdenoCA/configs/Panc-AdenoCA.all.config.json',
        count: 241
    },
    {
        cancer: '[Breast-AdenoCA] Breast Adenocarcinoma',
        url: 'https://chromoscope.bio/app/?showSamples=true&external=https://somatic-browser-test.s3.amazonaws.com/PCAWG/Breast-AdenoCA/configs/Breast-AdenoCA.all.config.json',
        count: 198
    },
    {
        cancer: '[CNS-Medullo] CNS Medulloblastoma',
        url: 'https://chromoscope.bio/app/?showSamples=true&external=https://somatic-browser-test.s3.amazonaws.com/PCAWG/CNS-Medullo/configs/CNS-Medullo.all.config.json',
        count: 146
    },
    {
        cancer: '[Kidney-RCC] Kidney Renal Cell Carcinoma (Proximal Tubules)',
        url: 'https://chromoscope.bio/app/?showSamples=true&external=https://somatic-browser-test.s3.amazonaws.com/PCAWG/Kidney-RCC/configs/Kidney-RCC.all.config.json',
        count: 144
    },
    {
        cancer: '[Ovary-AdenoCA] Ovary Adenocarcinoma',
        url: 'https://chromoscope.bio/app/?showSamples=true&external=https://somatic-browser-test.s3.amazonaws.com/PCAWG/Ovary-AdenoCA/configs/Ovary-AdenoCA.all.config.json',
        count: 113
    },
    {
        cancer: '[Skin-Melanoma] Skin Melanoma',
        url: 'https://chromoscope.bio/app/?showSamples=true&external=https://somatic-browser-test.s3.amazonaws.com/PCAWG/Skin-Melanoma/configs/Skin-Melanoma.all.config.json',
        count: 107
    },
    {
        cancer: '[Lymph-BNHL] Lymphoid Mature B-Cell Lymphoma',
        url: 'https://chromoscope.bio/app/?showSamples=true&external=https://somatic-browser-test.s3.amazonaws.com/PCAWG/Lymph-BNHL/configs/Lymph-BNHL.all.config.json',
        count: 105
    },
    {
        cancer: '[Eso-AdenoCA] Esophagus Adenocarcinoma',
        url: 'https://chromoscope.bio/app/?showSamples=true&external=https://somatic-browser-test.s3.amazonaws.com/PCAWG/Eso-AdenoCA/configs/Eso-AdenoCA.all.config.json',
        count: 98
    },
    {
        cancer: '[Lymph-CLL] Lymphoid Chronic Lymphocytic Leukemia',
        url: 'https://chromoscope.bio/app/?showSamples=true&external=https://somatic-browser-test.s3.amazonaws.com/PCAWG/Lymph-CLL/configs/Lymph-CLL.all.config.json',
        count: 95
    },
    {
        cancer: '[CNS-PiloAstro] CNS Non-Diffuse Glioma',
        url: 'https://chromoscope.bio/app/?showSamples=true&external=https://somatic-browser-test.s3.amazonaws.com/PCAWG/CNS-PiloAstro/configs/CNS-PiloAstro.all.config.json',
        count: 89
    },
    {
        cancer: '[Panc-Endocrine] Pancreas Neuroendocrine Tumor',
        url: 'https://chromoscope.bio/app/?showSamples=true&external=https://somatic-browser-test.s3.amazonaws.com/PCAWG/Panc-Endocrine/configs/Panc-Endocrine.all.config.json',
        count: 85
    },
    {
        cancer: '[Stomach-AdenoCA] Stomach Adenocarcinoma',
        url: 'https://chromoscope.bio/app/?showSamples=true&external=https://somatic-browser-test.s3.amazonaws.com/PCAWG/Stomach-AdenoCA/configs/Stomach-AdenoCA.all.config.json',
        count: 75
    },
    {
        cancer: '[ColoRect-AdenoCA] Colon/Rectum Adenocarcinoma',
        url: 'https://chromoscope.bio/app/?showSamples=true&external=https://somatic-browser-test.s3.amazonaws.com/PCAWG/ColoRect-AdenoCA/configs/ColoRect-AdenoCA.all.config.json',
        count: 60
    },
    {
        cancer: '[Head-SCC] Head/Neck Squamous Cell Carcinoma',
        url: 'https://chromoscope.bio/app/?showSamples=true&external=https://somatic-browser-test.s3.amazonaws.com/PCAWG/Head-SCC/configs/Head-SCC.all.config.json',
        count: 57
    },
    {
        cancer: '[Myeloid-MPN] Myeloid Myeloproliferative Neoplasm',
        url: 'https://chromoscope.bio/app/?showSamples=true&external=https://somatic-browser-test.s3.amazonaws.com/PCAWG/Myeloid-MPN/configs/Myeloid-MPN.all.config.json',
        count: 51
    },
    {
        cancer: '[Uterus-AdenoCA] Uterus Adenocarcinoma',
        url: 'https://chromoscope.bio/app/?showSamples=true&external=https://somatic-browser-test.s3.amazonaws.com/PCAWG/Uterus-AdenoCA/configs/Uterus-AdenoCA.all.config.json',
        count: 51
    },
    {
        cancer: '[Lung-SCC] Lung Squamous Cell Carcinoma',
        url: 'https://chromoscope.bio/app/?showSamples=true&external=https://somatic-browser-test.s3.amazonaws.com/PCAWG/Lung-SCC/configs/Lung-SCC.all.config.json',
        count: 48
    },
    {
        cancer: '[Thy-AdenoCA] Thyroid Adenocarcinoma',
        url: 'https://chromoscope.bio/app/?showSamples=true&external=https://somatic-browser-test.s3.amazonaws.com/PCAWG/Thy-AdenoCA/configs/Thy-AdenoCA.all.config.json',
        count: 48
    },
    {
        cancer: '[Kidney-ChRCC] Kidney Renal Cell Carcinoma (Distal Tubules)',
        url: 'https://chromoscope.bio/app/?showSamples=true&external=https://somatic-browser-test.s3.amazonaws.com/PCAWG/Kidney-ChRCC/configs/Kidney-ChRCC.all.config.json',
        count: 45
    },
    {
        cancer: '[CNS-GBM] CNS Glioblastoma',
        url: 'https://chromoscope.bio/app/?showSamples=true&external=https://somatic-browser-test.s3.amazonaws.com/PCAWG/CNS-GBM/configs/CNS-GBM.all.config.json',
        count: 41
    },
    {
        cancer: '[Bone-Osteosarc] Bone/Softtissue Osteosarcoma',
        url: 'https://chromoscope.bio/app/?showSamples=true&external=https://somatic-browser-test.s3.amazonaws.com/PCAWG/Bone-Osteosarc/configs/Bone-Osteosarc.all.config.json',
        count: 39
    },
    {
        cancer: '[Lung-AdenoCA] Lung Adenocarcinoma',
        url: 'https://chromoscope.bio/app/?showSamples=true&external=https://somatic-browser-test.s3.amazonaws.com/PCAWG/Lung-AdenoCA/configs/Lung-AdenoCA.all.config.json',
        count: 38
    },
    {
        cancer: '[Biliary-AdenoCA] Biliary Adenocarcinoma',
        url: 'https://chromoscope.bio/app/?showSamples=true&external=https://somatic-browser-test.s3.amazonaws.com/PCAWG/Biliary-AdenoCA/configs/Biliary-AdenoCA.all.config.json',
        count: 34
    },
    {
        cancer: '[Bone-Leiomyo] Bone/Softtissue Leiomyosarcoma',
        url: 'https://chromoscope.bio/app/?showSamples=true&external=https://somatic-browser-test.s3.amazonaws.com/PCAWG/Bone-Leiomyo/configs/Bone-Leiomyo.all.config.json',
        count: 34
    },
    {
        cancer: '[Bladder-TCC] Bladder Transitional Cell Carcinoma',
        url: 'https://chromoscope.bio/app/?showSamples=true&external=https://somatic-browser-test.s3.amazonaws.com/PCAWG/Bladder-TCC/configs/Bladder-TCC.all.config.json',
        count: 23
    },
    {
        cancer: '[Cervix-SCC] Cervix Squamous Cell Carcinoma',
        url: 'https://chromoscope.bio/app/?showSamples=true&external=https://somatic-browser-test.s3.amazonaws.com/PCAWG/Cervix-SCC/configs/Cervix-SCC.all.config.json',
        count: 18
    },
    {
        cancer: '[CNS-Oligo] CNS Oligodendroglioma',
        url: 'https://chromoscope.bio/app/?showSamples=true&external=https://somatic-browser-test.s3.amazonaws.com/PCAWG/CNS-Oligo/configs/CNS-Oligo.all.config.json',
        count: 18
    },
    {
        cancer: '[Myeloid-AML] Myeloid Acute Myeloid Leukemia',
        url: 'https://chromoscope.bio/app/?showSamples=true&external=https://somatic-browser-test.s3.amazonaws.com/PCAWG/Myeloid-AML/configs/Myeloid-AML.all.config.json',
        count: 16
    },
    {
        cancer: '[Breast-LobularCA] Breast Lobular Carcinoma',
        url: 'https://chromoscope.bio/app/?showSamples=true&external=https://somatic-browser-test.s3.amazonaws.com/PCAWG/Breast-LobularCA/configs/Breast-LobularCA.all.config.json',
        count: 13
    },
    {
        cancer: '[Bone-Epith] Bone Neoplasm Epithelioid',
        url: 'https://chromoscope.bio/app/?showSamples=true&external=https://somatic-browser-test.s3.amazonaws.com/PCAWG/Bone-Epith/configs/Bone-Epith.all.config.json',
        count: 10
    },
    {
        cancer: '[Bone-Cart] Bone/Softtissue Chondroblastoma',
        url: 'https://chromoscope.bio/app/?showSamples=true&external=https://somatic-browser-test.s3.amazonaws.com/PCAWG/Bone-Cart/configs/Bone-Cart.all.config.json',
        count: 9
    },
    {
        cancer: '[Bone-Osteoblast] Bone/Softtissue Osteoblastoma',
        url: 'https://chromoscope.bio/app/?showSamples=true&external=https://somatic-browser-test.s3.amazonaws.com/PCAWG/Bone-Osteoblast/configs/Bone-Osteoblast.all.config.json',
        count: 5
    },
    {
        cancer: '[Breast-DCIS] Breast In Situ Adenocarcinoma',
        url: 'https://chromoscope.bio/app/?showSamples=true&external=https://somatic-browser-test.s3.amazonaws.com/PCAWG/Breast-DCIS/configs/Breast-DCIS.all.config.json',
        count: 3
    },
    {
        cancer: '[Myeloid-MDS] Myeloid Myelodysplastic Syndrome',
        url: 'https://chromoscope.bio/app/?showSamples=true&external=https://somatic-browser-test.s3.amazonaws.com/PCAWG/Myeloid-MDS/configs/Myeloid-MDS.all.config.json',
        count: 3
    },
    {
        cancer: '[Cervix-AdenoCA] Cervix Adenocarcinoma',
        url: 'https://chromoscope.bio/app/?showSamples=true&external=https://somatic-browser-test.s3.amazonaws.com/PCAWG/Cervix-AdenoCA/configs/Cervix-AdenoCA.all.config.json',
        count: 2
    },
    {
        cancer: '[Lymph-NOS] Lymphoid Lymphoma NOS',
        url: 'https://chromoscope.bio/app/?showSamples=true&external=https://somatic-browser-test.s3.amazonaws.com/PCAWG/Lymph-NOS/configs/Lymph-NOS.all.config.json',
        count: 2
    },
    {
        cancer: '[Bone-Benign] Bone/Softtissue Osteofibrous Dysplasia',
        url: 'https://chromoscope.bio/app/?showSamples=true&external=https://somatic-browser-test.s3.amazonaws.com/PCAWG/Bone-Benign/configs/Bone-Benign.all.config.json',
        count: 1
    }
];

type OverviewFilterProps = {
    options?: Array<any>;
    onChange?: (value: string) => void;
};

const OverviewFilter = ({ options = [], onChange = null }: OverviewFilterProps) => {
    return (
        <div className="filter">
            <select
                className="dropdown"
                onChange={e => {
                    const selectedValue = e.currentTarget.value;
                    if (selectedValue) {
                        onChange(e.currentTarget.value);
                    }
                }}
            >
                <option key={'Curated Sample Sets'} value={null}>
                    Cancer Type
                </option>
                {PCAWG_SAMPLES.sort((a, b) => (a.cancer > b.cancer ? 1 : -1)).map(sample => {
                    const str = `${sample.cancer.split('] ')[1]} (${sample.count} samples)`;
                    const configUrl = sample.url.replace('https://chromoscope.bio/app/?showSamples=true&external=', '');
                    return (
                        <option key={str} value={configUrl}>
                            <span>{str}</span>
                        </option>
                    );
                })}
            </select>
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
    const [selectedSample, setSelectedSample] = useState<string | null>(null);
    const [showDropdown, setShowDropdown] = useState(false);

    const dropdownRef = useRef<HTMLDivElement>(null);

    // Scroll to top when new sample is selected
    useEffect(() => {
        if (selectedSample) {
            const container = document.querySelector('.overview-container');
            if (container) {
                container.scrollTo({ top: 0 });
            }
        }
    }, [selectedSample]);

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

    return (
        <div>
            <div className="overview-root">
                <div className="overview-header">
                    <div className="dropdown-container" ref={dropdownRef}>
                        <button
                            className={`dropdown-button ${showDropdown ? 'toggle-open' : ''}`}
                            onClick={e => setShowDropdown(!showDropdown)}
                        >
                            <span className="">{selectedSample ?? 'PCAWG: Cancer Cohort'}</span>
                            <svg className="icon" viewBox={ICONS.CHEVRON_UP.viewBox}>
                                <title>Export Image</title>
                                {ICONS.CHEVRON_UP.path.map(p => (
                                    <path fill="currentColor" key={p} d={p} />
                                ))}
                            </svg>
                        </button>
                        <ul className={`dropdown-items ${showDropdown ? 'd-flex' : 'd-none'}`}>
                            <li>Coming soon!</li>
                        </ul>
                    </div>
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
                </div>
                <div className="overview-controls">
                    <OverviewFilter options={[]} />
                    <CancerSelector
                        selectedSample={selectedSample}
                        setSelectedSample={setSelectedSample}
                        onChange={onChange}
                    />
                </div>
                <div className="overview-status">{`Total of ${filteredSamples.length} samples loaded`}</div>
                <div className="overview-container">{smallOverviewWrapper}</div>
            </div>
        </div>
    );
};
