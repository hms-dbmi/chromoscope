import React, { useState, useEffect, useMemo } from 'react';
import { ICONS } from '../../icon';
import { FileDragUpload } from '../VisOverviewPanel/FileDragUpload';
import { SampleConfig, ValidCohort } from '../SampleConfigForm';
import { Cohorts, Cohort } from '../../App';
import { ValidSampleConfig } from '../SampleConfigForm';
import { UploadModalFeedback } from './UploadModalFeedback';

const exampleConfigFields: SampleConfig = {
    id: '7a921087-8e62-4a93-a757-fd8cdbe1eb8f',
    cancer: 'Ovarian',
    assembly: 'hg19',
    sv: 'https://s3.amazonaws.com/gosling-lang.org/data/SV/7a921087-8e62-4a93-a757-fd8cdbe1eb8f.pcawg_consensus_1.6.161022.somatic.sv.bedpe',
    cnv: 'https://s3.amazonaws.com/gosling-lang.org/data/SV/7a921087-8e62-4a93-a757-fd8cdbe1eb8f.consensus.20170119.somatic.cna.annotated.txt'
};

/**
 * Checks if a string is a valid URL.
 * @param str String to test as URL
 * @returns `true` if the string is a valid URL, `false` otherwise.
 */
export function isValidUrl(str: string) {
    let url: string | URL;
    try {
        url = new URL(str);
    } catch (_) {
        return false;
    }
    return url.protocol === 'http:' || url.protocol === 'https:';
}

// Tests for checking if sample configuration fields are valid
export const testOkay = {
    id: (_: SampleConfig) => _?.id,
    cancer: (_: SampleConfig) => _?.cancer,
    sv: (_: SampleConfig) => isValidUrl(_?.sv),
    // optional
    cnv: (_: SampleConfig) => !_?.cnv || isValidUrl(_?.cnv),
    drivers: (_: SampleConfig) => !_?.drivers || isValidUrl(_?.drivers),
    vcf: (_: SampleConfig) => !_?.vcf || isValidUrl(_?.vcf),
    vcfIndex: (_: SampleConfig) => !_?.vcfIndex || isValidUrl(_?.vcfIndex),
    vcf2: (_: SampleConfig) => !_?.vcf2 || isValidUrl(_?.vcf2),
    vcf2Index: (_: SampleConfig) => !_?.vcf2Index || isValidUrl(_?.vcf2Index),
    bam: (_: SampleConfig) => !_?.bam || isValidUrl(_?.bam),
    bai: (_: SampleConfig) => !_?.bai || isValidUrl(_?.bai)
};

// Check if a list of samples are valid
export const samplesOkayToAdd = (
    samples: SampleConfig[] = []
): { samplesOkay: boolean; allSampleErrors: Map<number, string[]> } => {
    // Create an array to hold errors for each sample
    const allSampleErrors = new Map<number, string[]>();

    samples.forEach((sample, index) => {
        // Create object of sample errors associated with this sample
        const sampleErrors = [];

        let okay = true;

        // Test each field
        Object.keys(testOkay).map(field => {
            const isFieldOkay = testOkay[field](sample);

            // Add errors to sampleErrors object
            if (!isFieldOkay) {
                sampleErrors.push(field);
            }

            okay = okay && isFieldOkay;
        });

        // Add errors for this sample to allSampleErrors map
        if (sampleErrors.length > 0) {
            allSampleErrors.set(index, sampleErrors);
        }

        return okay;
    });

    const isOkay = samples?.length > 0 && allSampleErrors.size === 0;

    return {
        samplesOkay: isOkay,
        allSampleErrors
    };
};

// Check if a cohort is okay to add i.e. has valid `samples` property
export const cohortOkayToAdd = (cohort: Cohort) => {
    const { samplesOkay, allSampleErrors } = samplesOkayToAdd(cohort?.samples);

    // Check for a non-empty list of valid samples in the `samples` field
    return {
        errors: allSampleErrors,
        samplesOkay
    };
};

type UploadModalProps = {
    sampleConfig: SampleConfig;
    showNewSampleConfig: boolean;
    cohorts: Cohorts;
    uploadedCohort: ValidCohort;
    selectedCohort: string;
    demoIndex: React.MutableRefObject<number>;
    setDemo: (demo: SampleConfig) => void;
    setSelectedCohort: (cohort: string) => void;
    setUploadedCohort: React.Dispatch<React.SetStateAction<ValidCohort>>;
    setCohorts: (cohorts: Cohorts) => void;
    setSampleConfig: React.Dispatch<React.SetStateAction<SampleConfig>>;
    setShowNewSampleConfig: React.Dispatch<React.SetStateAction<boolean>>;
};

/**
 * Upload Modal Component
 * @param props UploadModalProps
 * @returns JSX.Element
 */
export const UploadModal = ({
    sampleConfig,
    showNewSampleConfig,
    uploadedCohort,
    setUploadedCohort,
    cohorts,
    selectedCohort,
    demoIndex,
    setDemo,
    setSelectedCohort,
    setCohorts,
    setSampleConfig,
    setShowNewSampleConfig
}: UploadModalProps) => {
    const [uploadType, setUploadType] = useState<'file' | 'form'>('file');
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [uploadedFileData, setUploadedFileData] = useState<any>(null);
    const [error, setError] = useState<{ type: string; message: JSX.Element } | null>(null);

    // Clear sample configuration
    const clearSampleConfig = () => {
        setSampleConfig({
            id: '',
            cancer: '',
            assembly: 'hg19',
            sv: '',
            cnv: '',
            drivers: '',
            vcf: '',
            vcfIndex: '',
            vcf2: '',
            vcf2Index: '',
            bam: '',
            bai: ''
        });
    };

    // Clear uploaded cohort
    // Note: assumes the uploaded cohort has one sample
    const clearUploadedCohort = () => {
        setUploadedFile(null);
        setUploadedFileData(null);
        setUploadedCohort({
            samples: [
                {
                    id: '',
                    cancer: '',
                    assembly: 'hg19',
                    sv: '',
                    cnv: '',
                    drivers: '',
                    vcf: '',
                    vcfIndex: '',
                    vcf2: '',
                    vcf2Index: '',
                    bam: '',
                    bai: ''
                }
            ]
        });
    };

    /**
     * Handle the parsed JSON data from the uploaded file.
     *   - Check the data structure with `ValidCohort`
     *   - Set the uploaded cohort state
     * @param data Parsed JSON data from uploaded file
     */
    const handleValidJsonParsed = (data: ValidCohort | SampleConfig[]) => {
        setError(null);
        setUploadedFileData(data);
        setUploadedCohort(data as Cohort);
    };

    // Function for adding samples to existing cohort
    const addSamplesToCohort = (
        cohortId: string,
        samples: ValidSampleConfig[],
        filters?: Array<{ field: string; title: string; type: string }>
    ) => {
        if (cohorts?.[cohortId]) {
            // Cohort exists, append samples
            const prevCohortConfig = cohorts?.[cohortId];
            setCohorts({
                ...cohorts,
                [cohortId]: {
                    ...prevCohortConfig,
                    // Add new samples to exisitng cohort samples
                    samples: [...samples, ...prevCohortConfig.samples],
                    // Merge filters and prioritize existing filters
                    filters: [...(filters ?? []), ...prevCohortConfig.filters]
                }
            });
            setUploadedCohort(null);
        }
    };

    /**
     * Create a new cohort with the given cohortId and samples. If there is a
     * naming cohort, appends '_1' to the cohortId.
     * @param cohortId {string}
     * @param samples {ValidSampleConfig[]}
     */
    const createNewCohortWithSamples = (
        cohortId: string,
        samples: ValidSampleConfig[],
        filters?: Array<{ field: string; title: string; type: string }>
    ) => {
        // Create new cohort ID if the given one already exists
        const newCohortId = !cohorts?.[cohortId] ? cohortId : cohortId + '_1';

        setCohorts({
            ...cohorts,
            [newCohortId]: {
                name: uploadedCohort?.name || newCohortId,
                samples: samples,
                filters: filters || []
            }
        });
        setSelectedCohort(newCohortId);
        setUploadedCohort(null);
        setUploadedFile(null);
        setUploadedFileData(null);
        clearSampleConfig();
        setDemo(samples[0]); // Set first sample as demo
        demoIndex.current = 0;
    };

    return (
        <div
            className="modal fade"
            id="upload-modal"
            tabIndex={0}
            aria-labelledby="Upload Data Modal"
            aria-hidden="true"
        >
            <div className="modal-dialog modal-xl">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title" id="exampleModalLabel">
                            <svg className="" viewBox={ICONS.UPLOAD_FILE.viewBox}>
                                {ICONS.UPLOAD_FILE.path.map(p => (
                                    <path fill="currentColor" key={p} d={p} />
                                ))}
                            </svg>
                            Upload New Data to Chromoscope
                        </h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <div className="upload-modal-content">
                            <div className="upload-modal-header">
                                <div className="upload-type-selector">
                                    <button
                                        className={'upload-type-button ' + (uploadType === 'file' ? 'active' : '')}
                                        onClick={() => setUploadType('file')}
                                    >
                                        <svg className="" viewBox={ICONS.UPLOAD_ARROW.viewBox}>
                                            {ICONS.UPLOAD_ARROW.path.map(p => (
                                                <path fill="currentColor" key={p} d={p} />
                                            ))}
                                        </svg>
                                        File Upload
                                    </button>
                                    <button
                                        className={'upload-type-button ' + (uploadType === 'form' ? 'active' : '')}
                                        onClick={() => setUploadType('form')}
                                    >
                                        <svg className="" viewBox={ICONS.PENCIL.viewBox}>
                                            {ICONS.PENCIL.path.map(p => (
                                                <path fill="currentColor" key={p} d={p} />
                                            ))}
                                        </svg>
                                        Manual Entry
                                    </button>
                                </div>
                            </div>
                            <div className="upload-modal-body">
                                {uploadType === 'file' ? (
                                    <>
                                        {error || (uploadedFile && uploadedFileData) ? (
                                            <>
                                                <UploadModalFeedback
                                                    cohorts={cohorts}
                                                    uploadedFile={uploadedFile}
                                                    uploadedFileData={uploadedFileData}
                                                    uploadedCohort={uploadedCohort}
                                                    setUploadedCohort={setUploadedCohort}
                                                    error={error}
                                                />
                                                <hr className="upload-divider" />
                                            </>
                                        ) : null}
                                        <FileDragUpload
                                            uploadedFile={uploadedFile}
                                            onJsonParsed={handleValidJsonParsed}
                                            multiple={false}
                                            cohorts={cohorts}
                                            setUploadedCohort={setUploadedCohort}
                                            setUploadedFile={setUploadedFile}
                                            setSampleConfig={setSampleConfig}
                                            error={error}
                                            setError={setError}
                                        />
                                    </>
                                ) : (
                                    <div
                                        className="sample-config-form"
                                        onClick={() => {
                                            showNewSampleConfig ? null : setShowNewSampleConfig(true);
                                        }}
                                    >
                                        <div className="form-header">
                                            <h2>Add a New Sample</h2>
                                            <a
                                                href="https://chromoscope.bio/loading-data/data-formats"
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                Documentation on Data Formats
                                            </a>
                                        </div>
                                        <div className="form-inputs-container">
                                            <div className="input-button-container">
                                                {/* Assembly */}
                                                <div className="input-container">
                                                    <div className="menu-subtitle">Assembly</div>
                                                    <select
                                                        id="sample-assembly-select"
                                                        className="menu-dropdown"
                                                        onChange={e => {
                                                            // const newSampleConfig : ValidSampleConfig = {
                                                            //     ...sampleConfig,
                                                            //     assembly: e.currentTarget.value as 'hg19' | 'hg38'
                                                            // };
                                                            setUploadedCohort({
                                                                name: '',
                                                                samples: [
                                                                    {
                                                                        ...uploadedCohort?.samples?.[0],
                                                                        assembly: e.currentTarget.value as
                                                                            | 'hg19'
                                                                            | 'hg38'
                                                                    }
                                                                ]
                                                            });
                                                        }}
                                                        value={uploadedCohort?.samples?.[0]?.assembly ?? 'hg19'}
                                                    >
                                                        <option key={'hg19'} value={'hg19'}>
                                                            hg19
                                                        </option>
                                                        <option key={'hg38'} value={'hg38'}>
                                                            hg38
                                                        </option>
                                                    </select>
                                                </div>

                                                {/* Fill in example datasets or clear form */}
                                                <button
                                                    className="example-dataset-button"
                                                    onClick={() => {
                                                        if (
                                                            uploadedCohort?.samples[0]?.id === exampleConfigFields.id &&
                                                            uploadedCohort?.samples[0]?.cancer ===
                                                                exampleConfigFields.cancer &&
                                                            uploadedCohort?.samples[0]?.assembly ===
                                                                exampleConfigFields.assembly &&
                                                            uploadedCohort?.samples[0]?.sv === exampleConfigFields.sv &&
                                                            uploadedCohort?.samples[0]?.cnv === exampleConfigFields.cnv
                                                        ) {
                                                            clearUploadedCohort();
                                                        } else {
                                                            setUploadedCohort({
                                                                name: 'Example Dataset',
                                                                samples: [
                                                                    {
                                                                        ...uploadedCohort?.samples?.[0],
                                                                        ...exampleConfigFields
                                                                    }
                                                                ]
                                                            });
                                                        }
                                                    }}
                                                >
                                                    {uploadedCohort?.samples[0]?.id === exampleConfigFields.id &&
                                                    uploadedCohort?.samples[0]?.cancer === exampleConfigFields.cancer &&
                                                    uploadedCohort?.samples[0]?.assembly ===
                                                        exampleConfigFields.assembly &&
                                                    uploadedCohort?.samples[0]?.sv === exampleConfigFields.sv &&
                                                    uploadedCohort?.samples[0]?.cnv === exampleConfigFields.cnv ? (
                                                        <>
                                                            <svg viewBox={ICONS.CLOSE.viewBox}>
                                                                {ICONS.CLOSE.path.map(d => (
                                                                    <path key={d} fill="currentColor" d={d} />
                                                                ))}
                                                            </svg>
                                                            Clear Example Dataset
                                                        </>
                                                    ) : (
                                                        <>
                                                            <svg viewBox={ICONS.PENCIL.viewBox}>
                                                                {ICONS.PENCIL.path.map(d => (
                                                                    <path key={d} fill="currentColor" d={d} />
                                                                ))}
                                                            </svg>
                                                            Fill in Example Dataset
                                                        </>
                                                    )}
                                                </button>
                                            </div>

                                            {/* ID */}
                                            <div
                                                className={`input-container ${
                                                    testOkay.id(uploadedCohort?.samples?.[0])
                                                        ? 'input'
                                                        : 'input-invalid'
                                                }`}
                                            >
                                                <span className="menu-subtitle">
                                                    ID<sup>*</sup>
                                                </span>
                                                <input
                                                    id="sample-id-input"
                                                    type="text"
                                                    className="menu-text-input"
                                                    placeholder="My sample 1, etc"
                                                    required
                                                    onChange={e =>
                                                        setUploadedCohort({
                                                            ...uploadedCohort,
                                                            samples: [
                                                                {
                                                                    ...uploadedCohort?.samples?.[0],
                                                                    id: e.currentTarget.value
                                                                }
                                                            ]
                                                        })
                                                    }
                                                    value={uploadedCohort?.samples?.[0]?.id ?? ''}
                                                />
                                            </div>

                                            {/* Cancer  */}
                                            <div
                                                className={`input-container ${
                                                    testOkay.cancer(uploadedCohort?.samples?.[0])
                                                        ? 'input'
                                                        : 'input-invalid'
                                                }`}
                                            >
                                                <div className="menu-subtitle">
                                                    Cancer<sup>*</sup>
                                                </div>
                                                <input
                                                    id="sample-cancer-input"
                                                    type="text"
                                                    className="menu-text-input"
                                                    placeholder="Gastric, Ovary, Prostate, etc"
                                                    required
                                                    onChange={e =>
                                                        setUploadedCohort({
                                                            name: '',
                                                            samples: [
                                                                {
                                                                    ...uploadedCohort?.samples?.[0],
                                                                    cancer: e.currentTarget.value
                                                                }
                                                            ]
                                                        })
                                                    }
                                                    value={uploadedCohort?.samples?.[0]?.cancer ?? ''}
                                                />
                                            </div>

                                            {/* SV */}
                                            <div
                                                className={`input-container ${
                                                    testOkay.sv(uploadedCohort?.samples?.[0])
                                                        ? 'input'
                                                        : 'input-invalid'
                                                }`}
                                            >
                                                <div className="menu-subtitle">
                                                    SV<sup>*</sup> <small>(.bedpe)</small>
                                                </div>
                                                <input
                                                    id="sample-sv-input"
                                                    type="text"
                                                    className="menu-text-input"
                                                    placeholder="https://..."
                                                    required
                                                    onChange={e =>
                                                        setUploadedCohort({
                                                            ...uploadedCohort,
                                                            samples: [
                                                                {
                                                                    ...uploadedCohort?.samples?.[0],
                                                                    sv: e.currentTarget.value
                                                                }
                                                            ]
                                                        })
                                                    }
                                                    value={uploadedCohort?.samples?.[0]?.sv ?? ''}
                                                />
                                            </div>

                                            {/* CNV */}
                                            <div
                                                className={`input-container ${
                                                    testOkay.cnv(uploadedCohort?.samples?.[0])
                                                        ? 'input'
                                                        : 'input-invalid'
                                                }`}
                                            >
                                                <div className="menu-subtitle">
                                                    CNV <small>(.txt)</small>
                                                </div>
                                                <input
                                                    id="sample-cnv-input"
                                                    type="text"
                                                    className="menu-text-input"
                                                    placeholder="https://..."
                                                    onChange={e =>
                                                        setUploadedCohort({
                                                            name: '',
                                                            samples: [
                                                                {
                                                                    ...uploadedCohort?.samples?.[0],
                                                                    cnv: e.currentTarget.value
                                                                }
                                                            ]
                                                        })
                                                    }
                                                    value={uploadedCohort?.samples?.[0]?.cnv ?? ''}
                                                />
                                            </div>

                                            {/* Drivers */}
                                            <div
                                                className={`input-container ${
                                                    testOkay.drivers(uploadedCohort?.samples?.[0])
                                                        ? 'input'
                                                        : 'input-invalid'
                                                }`}
                                            >
                                                <div className="menu-subtitle">
                                                    Drivers <small>(.txt)</small>
                                                </div>
                                                <input
                                                    id="sample-drivers-input"
                                                    type="text"
                                                    className="menu-text-input"
                                                    placeholder="https://..."
                                                    onChange={e =>
                                                        setUploadedCohort({
                                                            name: '',
                                                            samples: [
                                                                {
                                                                    ...uploadedCohort?.samples?.[0],
                                                                    drivers: e.currentTarget.value
                                                                }
                                                            ]
                                                        })
                                                    }
                                                    value={uploadedCohort?.samples?.[0]?.drivers ?? ''}
                                                />
                                            </div>

                                            {/* Point Mutation */}
                                            <div
                                                className={`input-container ${
                                                    testOkay.vcf(uploadedCohort?.samples?.[0])
                                                        ? 'input'
                                                        : 'input-invalid'
                                                }`}
                                            >
                                                <div className="menu-subtitle">
                                                    Point Mutation <small>(.vcf)</small>
                                                </div>
                                                <input
                                                    id="sample-vcf-input"
                                                    type="text"
                                                    className="menu-text-input"
                                                    placeholder="https://..."
                                                    onChange={e =>
                                                        setUploadedCohort({
                                                            name: '',
                                                            samples: [
                                                                {
                                                                    ...uploadedCohort?.samples?.[0],
                                                                    vcf: e.currentTarget.value
                                                                }
                                                            ]
                                                        })
                                                    }
                                                    value={uploadedCohort?.samples?.[0]?.vcf ?? ''}
                                                />
                                            </div>

                                            {/* Point Mutation Index */}
                                            <div
                                                className={`input-container ${
                                                    testOkay.vcfIndex(uploadedCohort?.samples?.[0])
                                                        ? 'input'
                                                        : 'input-invalid'
                                                }`}
                                            >
                                                <div className="menu-subtitle">
                                                    Point Mutation Index <small>(.tbi)</small>
                                                </div>
                                                <input
                                                    id="sample-vcf-index-input"
                                                    type="text"
                                                    className="menu-text-input"
                                                    placeholder="https://..."
                                                    onChange={e =>
                                                        setUploadedCohort({
                                                            name: '',
                                                            samples: [
                                                                {
                                                                    ...uploadedCohort?.samples?.[0],
                                                                    vcfIndex: e.currentTarget.value
                                                                }
                                                            ]
                                                        })
                                                    }
                                                    value={uploadedCohort?.samples?.[0]?.vcfIndex ?? ''}
                                                />
                                            </div>

                                            {/* Indel */}
                                            <div
                                                className={`input-container ${
                                                    testOkay.vcf2(uploadedCohort?.samples?.[0])
                                                        ? 'input'
                                                        : 'input-invalid'
                                                }`}
                                            >
                                                <div className="menu-subtitle">
                                                    Indel <small>(.vcf)</small>
                                                </div>
                                                <input
                                                    id="sample-vcf2-input"
                                                    type="text"
                                                    className="menu-text-input"
                                                    placeholder="https://..."
                                                    onChange={e =>
                                                        setUploadedCohort({
                                                            name: '',
                                                            samples: [
                                                                {
                                                                    ...uploadedCohort?.samples?.[0],
                                                                    vcf2: e.currentTarget.value
                                                                }
                                                            ]
                                                        })
                                                    }
                                                    value={uploadedCohort?.samples?.[0]?.vcf2 ?? ''}
                                                />
                                            </div>

                                            {/* Indel Index */}
                                            <div
                                                className={`input-container ${
                                                    testOkay.vcf2Index(uploadedCohort?.samples?.[0])
                                                        ? 'input'
                                                        : 'input-invalid'
                                                }`}
                                            >
                                                <div className="menu-subtitle">
                                                    Indel Index <small>(.tbi)</small>
                                                </div>
                                                <input
                                                    id="sample-vcf2-index-input"
                                                    type="text"
                                                    className="menu-text-input"
                                                    placeholder="https://..."
                                                    onChange={e =>
                                                        setUploadedCohort({
                                                            name: '',
                                                            samples: [
                                                                {
                                                                    ...uploadedCohort?.samples?.[0],
                                                                    vcf2Index: e.currentTarget.value
                                                                }
                                                            ]
                                                        })
                                                    }
                                                    value={uploadedCohort?.samples?.[0]?.vcf2Index ?? ''}
                                                />
                                            </div>

                                            {/* Read Alignment */}
                                            <div
                                                className={`input-container ${
                                                    testOkay.bam(uploadedCohort?.samples?.[0])
                                                        ? 'input'
                                                        : 'input-invalid'
                                                }`}
                                            >
                                                <div className="menu-subtitle">
                                                    Read Alignment <small>(.bam)</small>
                                                </div>
                                                <input
                                                    id="sample-bam-input"
                                                    type="text"
                                                    className="menu-text-input"
                                                    placeholder="https://..."
                                                    onChange={e =>
                                                        setUploadedCohort({
                                                            name: '',
                                                            samples: [
                                                                {
                                                                    ...uploadedCohort?.samples?.[0],
                                                                    bam: e.currentTarget.value
                                                                }
                                                            ]
                                                        })
                                                    }
                                                    value={uploadedCohort?.samples?.[0]?.bam ?? ''}
                                                />
                                            </div>

                                            {/* Read Alignment Index */}
                                            <div
                                                className={`input-container ${
                                                    testOkay.bai(uploadedCohort?.samples?.[0])
                                                        ? 'input'
                                                        : 'input-invalid'
                                                }`}
                                            >
                                                <div className="menu-subtitle">
                                                    Read Alignment Index <small>(.bai)</small>
                                                </div>
                                                <input
                                                    id="sample-bai-input"
                                                    type="text"
                                                    className="menu-text-input"
                                                    placeholder="https://..."
                                                    onChange={e =>
                                                        // setSampleConfig({ ...sampleConfig, bai: e.currentTarget.value })
                                                        setUploadedCohort({
                                                            name: '',
                                                            samples: [
                                                                {
                                                                    ...uploadedCohort?.samples?.[0],
                                                                    bai: e.currentTarget.value
                                                                }
                                                            ]
                                                        })
                                                    }
                                                    value={uploadedCohort?.samples?.[0]?.bai ?? ''}
                                                />
                                            </div>

                                            <div className="footnote">* Required Fields</div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    {/**
                     * Note: type validation occures on user input. If button
                     * is active, assumes valid input.
                     */}
                    <div className="modal-footer">
                        <button
                            className="btn btn-outline-primary add-to-cohort"
                            disabled={!cohortOkayToAdd(uploadedCohort).samplesOkay}
                            data-bs-dismiss="modal"
                            aria-label="Submit"
                            onClick={() => {
                                addSamplesToCohort(selectedCohort, uploadedCohort.samples, uploadedCohort?.filters);
                                clearSampleConfig();
                                setUploadedFile(null);
                            }}
                        >
                            <span className={!cohortOkayToAdd(uploadedCohort).samplesOkay ? 'disabled' : ''}>
                                Add Samples to {cohorts[selectedCohort]?.name ?? 'Current Cohort'}
                            </span>
                        </button>
                        {uploadType === 'file' && (
                            <button
                                className="btn btn-primary create-cohort"
                                disabled={!cohortOkayToAdd(uploadedCohort).samplesOkay}
                                data-bs-dismiss="modal"
                                aria-label="Submit"
                                onClick={() => {
                                    createNewCohortWithSamples(
                                        uploadedCohort.name,
                                        uploadedCohort.samples,
                                        uploadedCohort?.filters
                                    );
                                    clearSampleConfig();
                                    setUploadedFile(null);
                                }}
                            >
                                <span>Create New Cohort{uploadedCohort?.name ? ': ' + uploadedCohort.name : ''}</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
