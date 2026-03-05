import React, { useState, useRef, useEffect, useMemo } from 'react';

import { ICONS } from '../../icon';
import { OverviewFilter } from './OverviewFilter';
import { samples, SampleType } from '../../data/samples';
import { SmallOverviewWrapper } from '../SmallOverviewWrapper';
import { CohortSelector } from './CohortSelector';
import { Cohort, Cohorts } from '../../App';
import { accessNestedField } from '../../utils';
import { isFilterOption } from './OverviewFilter';

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

/**
 * OptionValue and FilterOption are used to define options for filter dropdowns,
 * OptionValue is the new configuration format
 */
export type FilterOption = {
    name: string;
    url?: string;
    count?: number;
    samples?: SampleType[]; // Optionally pass samples directly
};

export type OptionValue = {
    value: string | number | boolean;
    count?: number;
};

export type Filter = {
    nullValue?: string;
    title: string;
    options: Array<FilterOption>;
    active: boolean;
};

export type NewFilter = {
    type: string;
    values: OptionValue[];
};

export type Option = {
    type: string;
    values: OptionValue[];
};

type FiltersMap = {
    [key: string]: Option;
};

type NewFilterGroup = {
    [key: string]: NewFilter;
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

type OverviewPanelProps = {
    demo: SampleType;
    demoIndex: React.MutableRefObject<number>;
    externalDemoUrl: React.MutableRefObject<string>;
    filteredSamples: Array<any>;
    selectedCohort: string;
    cohorts: Cohorts;
    externalError: string;
    setCohorts: (cohorts: Cohorts) => void;
    setShowSamples: (showSamples: boolean) => void;
    setSelectedCohort: (cohort: string) => void;
    setFilteredSamples: (samples: Array<any>) => void;
    handleDemoChange: (demo: SampleType) => void;
};

export const OverviewPanel = ({
    demo,
    demoIndex,
    externalDemoUrl,
    filteredSamples,
    selectedCohort,
    cohorts,
    externalError,
    setCohorts,
    setShowSamples,
    setSelectedCohort,
    setFilteredSamples,
    handleDemoChange
}: OverviewPanelProps) => {
    const [activeFilters, setActiveFilters] = useState<string[]>([]);
    console.log('activeFilters:', activeFilters);
    const [showExternalDemoAlert, setShowExternalDemoAlert] = useState<boolean>(true);

    // Get filters for the selected cohort
    const filterIdentifiers = Object.keys(cohorts?.[selectedCohort]?.filters || {});
    const cohortFilters = cohorts[selectedCohort]?.filters;

    // Compute filter options based on cohort filters
    // Update when: cohorts or selectedCohort changes
    const filterValuesMap = useMemo(() => {
        // Return if no filters are defined
        if (filterIdentifiers.length === 0) {
            return;
        }

        const filtersMap: FiltersMap = {};

        // Extract the options from the filters property of the configuration
        filterIdentifiers.map((filterIdentifier: string, i: number) => {
            // console.log('filterIdentifier', filterIdentifier);
            const { field, title, type } = cohortFilters?.[filterIdentifier];

            /**
             * Note: it is a bit inefficient to do this. In order to find the
             * item in the clinicalInfo.summary array with the label "Response"
             * it needs to:
             * - For each sample (1..s):
             *  - For each item in clinicalInfo (1..n)
             *      - Check if there is a value with Response
             *
             * We can avoid this if we use objects to determine the clinicalInfo:
             *
             * "filter": {
             *      "field": "clinicalInfo.summary.response"
             * },
             * "samples": [
             *      {
             *          "clinicalInfo": {
             *              "summary": {
             *                  "response": {
             *                      "label": "Response",
             *                      "value": "0"
             *                  }
             *              }
             *          }
             *      }
             * ]
             *
             */

            const valuesMap = new Map<string | number | boolean, number>();

            // Check each sample for all possible entries
            cohorts[selectedCohort]?.samples.forEach((sample: any) => {
                //  Get nested field value
                const nestedFieldValue = accessNestedField(sample, field);

                if (nestedFieldValue !== null && nestedFieldValue !== undefined) {
                    // add value to the map with count
                    if (valuesMap.has(nestedFieldValue)) {
                        valuesMap.set(nestedFieldValue, valuesMap.get(nestedFieldValue) + 1);
                    } else {
                        valuesMap.set(nestedFieldValue, 1);
                    }
                }
            });

            filtersMap[filterIdentifier] = {
                type,
                values: [...valuesMap].map(([value, count]) => ({ value, count }))
            };
        });

        // console.log("filtersMap", filtersMap)

        return filtersMap;
    }, [cohorts, selectedCohort]);

    // // Update samples when filters applied
    // useEffect(() => {
    //     // When no filters active, show default sample set
    //     if (activeFilters.length === 0) {
    //         setFilteredSamples(cohorts[selectedCohort]?.samples || []);
    //     } else {
    //         // Apply filters sequentially
    //         const filtered = activeFilters.reduce((accSamples, filterKey) => {
    //             console.log('activeFilters:', activeFilters);
    //             console.log('Applying filter:', accSamples, filterKey);

    //             return accSamples.filter((sample: any) => sample?.[filterKey])

    //             // return filteredSamples.filter((sample: any) => {

    //             // })
    //         }, cohorts[selectedCohort]?.samples || []);

    //         console.log("Filtered samples after applying active filters:", filtered);

    //         // setFilteredSamples(filtered);
    //     }
    // }, [activeFilters]);

    const onFilterSelection = (filterKey: string, option: OptionValue) => {
        console.log('Filters selected:', activeFilters, filterKey, option);

        const allSamples = cohorts[selectedCohort]?.samples || [];

        // Remove filter if option is null
        if (option === null && activeFilters.includes(filterKey)) {
            setActiveFilters(activeFilters.filter(f => f !== filterKey));
            return;
        }
        if (isFilterOption(option)) {
            setFilteredSamples(allSamples.filter((sample: any) => sample?.[filterKey] === option.name));
        } else {
            console.log(
                'Filtering samples with key/value:',
                filterKey,
                allSamples.map((sample: any) => accessNestedField(sample, filterKey)),
                option
            );
            setActiveFilters([filterKey]);
            setFilteredSamples(
                allSamples.filter((sample: any) => accessNestedField(sample, filterKey) === option.value)
            );
        }
    };

    // Update filtered samples when cohort changes
    useEffect(() => {
        setFilteredSamples(cohorts[selectedCohort]?.samples || []);
    }, [cohorts, selectedCohort]);

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

    // useEffect(() => {
    //     // When no filters active, show default sample set
    //     if (activeFilters.length === 0) {
    //         setFilteredSamples(samples);
    //     }
    // }, [activeFilters]);

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

    // Handle filter changes and update external demo URL
    const onChange = (url: string) => {
        /**
         * When a new filter is selected, the filter option's URL is passed to
         * this function.
         */
        fetch(url).then(response =>
            response.text().then(d => {
                let externalDemo = JSON.parse(d);
                if (Array.isArray(externalDemo) && externalDemo.length >= 0) {
                    setFilteredSamples(externalDemo);
                    externalDemo = externalDemo[demoIndex.current < externalDemo.length ? demoIndex.current : 0];
                }
                if (externalDemo) {
                    externalDemoUrl.current = url;
                    handleDemoChange(externalDemo);
                }
            })
        );
    };

    // // Helper function for retrieving options from configuration
    // const getOptionsFromConfig = () => {

    // }

    return (
        <div>
            <div className="overview-root">
                {showExternalDemoAlert && externalError && (
                    <div className="alert alert-warning external-demo" role="alert">
                        <strong>Error loading external URL:</strong> The provided link could not be loaded. Please check
                        the URL and try again.
                        <button
                            type="button"
                            className="close"
                            aria-label="Close"
                            onClick={() => setShowExternalDemoAlert(false)}
                        >
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                )}
                <div className="overview-header">
                    <CohortSelector
                        cohorts={cohorts}
                        setCohorts={setCohorts}
                        setFilteredSamples={setFilteredSamples}
                        selectedCohort={selectedCohort}
                        setSelectedCohort={setSelectedCohort}
                    />
                    {/* Button below triggers UploadModal */}
                    <button className="upload-file-button" data-bs-toggle="modal" data-bs-target="#upload-modal">
                        <svg className="button" viewBox={ICONS.UPLOAD_FILE.viewBox}>
                            <title>Upload File</title>
                            {ICONS.UPLOAD_FILE.path.map(p => (
                                <path fill="currentColor" key={p} d={p} />
                            ))}
                        </svg>
                        <span>Visualize Your Data</span>
                    </button>
                </div>
                {selectedCohort === 'PCAWG: Cancer Cohort' && (
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
                )}
                {filterIdentifiers.length > 0 && (
                    <div className="overview-controls">
                        {filterIdentifiers.map((filterIdentifier, i) => {
                            const { field, title, type } = cohortFilters?.[filterIdentifier];

                            return (
                                <OverviewFilter
                                    key={i}
                                    type={type}
                                    identifier={field || 'Filter 1'}
                                    title={title}
                                    options={filterValuesMap?.[filterIdentifier]?.values}
                                    active={activeFilters.includes(field || '')}
                                    onChange={onFilterSelection}
                                    activeFilters={activeFilters}
                                    nullValue={type === 'binary' ? undefined : null}
                                    setActiveFilters={setActiveFilters}
                                />
                            );
                        })}
                    </div>
                )}
                <div className="overview-status">{`Total of ${filteredSamples.length} samples loaded`}</div>
                <div
                    className={`overview-container ${selectedCohort === 'PCAWG: Cancer Cohort' ? 'with-filters' : ''}`}
                >
                    <SmallOverviewWrapper
                        demo={demo}
                        handleDemoChange={handleDemoChange}
                        demoIndex={demoIndex}
                        filteredSamples={filteredSamples}
                        setShowSamples={setShowSamples}
                    />
                </div>
            </div>
        </div>
    );
};
