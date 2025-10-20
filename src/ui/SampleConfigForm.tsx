import React, { useRef, useEffect, useMemo, useState } from 'react';
import { SampleType } from '../data/samples';
import { ICONS } from '../icon';

import { FileDragUpload } from './VisOverviewPanel/FileDragUpload';
import { Cohorts } from '../App';

export type SampleConfig = Partial<
    Omit<SampleType, 'group' | 'cnFields' | 'note' | 'drivers' | 'assembly' | 'thumbnail'>
> & {
    drivers?: string;
    assembly?: 'hg19' | 'hg38';
};

type ValidSampleConfig = Required<Pick<SampleConfig, 'id' | 'cancer' | 'sv' | 'cnv' | 'assembly'>> &
    Omit<SampleConfig, 'id' | 'cancer' | 'sv' | 'cnv' | 'assembly'>;

function isValidUrl(str: string) {
    let url;
    try {
        url = new URL(str);
    } catch (_) {
        return false;
    }
    return url.protocol === 'http:' || url.protocol === 'https:';
}

const testOkay = {
    id: (_: SampleConfig) => _.id,
    cancer: (_: SampleConfig) => _.cancer,
    sv: (_: SampleConfig) => isValidUrl(_.sv),
    // optional
    cnv: (_: SampleConfig) => !_.cnv || isValidUrl(_.cnv),
    drivers: (_: SampleConfig) => !_.drivers || isValidUrl(_.drivers),
    vcf: (_: SampleConfig) => !_.vcf || isValidUrl(_.vcf),
    vcfIndex: (_: SampleConfig) => !_.vcfIndex || isValidUrl(_.vcfIndex),
    vcf2: (_: SampleConfig) => !_.vcf2 || isValidUrl(_.vcf2),
    vcf2Index: (_: SampleConfig) => !_.vcf2Index || isValidUrl(_.vcf2Index),
    bam: (_: SampleConfig) => !_.bam || isValidUrl(_.bam),
    bai: (_: SampleConfig) => !_.bai || isValidUrl(_.bai)
};

const exampleConfigFields: SampleConfig = {
    id: '7a921087-8e62-4a93-a757-fd8cdbe1eb8f',
    cancer: 'Ovarian',
    assembly: 'hg19',
    sv: 'https://s3.amazonaws.com/gosling-lang.org/data/SV/7a921087-8e62-4a93-a757-fd8cdbe1eb8f.pcawg_consensus_1.6.161022.somatic.sv.bedpe',
    cnv: 'https://s3.amazonaws.com/gosling-lang.org/data/SV/7a921087-8e62-4a93-a757-fd8cdbe1eb8f.consensus.20170119.somatic.cna.annotated.txt'
};

type UploadModalFeedback = {
    uploadedFile: File | null;
    uploadedFileData: any;
};

const UploadModalFeedback = ({ uploadedFile, uploadedFileData }: UploadModalFeedback) => {
    const [showAllSamples, setShowAllSamples] = useState(false);

    return (
        <div className="upload-feedback">
            <div className="success-banner">
                <div className="header">
                    <svg className="" viewBox={ICONS.UPLOAD_FILE.viewBox}>
                        {ICONS.UPLOAD_FILE.path.map(p => (
                            <path fill="currentColor" key={p} d={p} />
                        ))}
                    </svg>
                    <span>Upload Successful: {uploadedFile?.name}</span>
                </div>
                <div className="body">
                    <div className="summary">
                        <span>{uploadedFileData?.samples ? uploadedFileData.samples.length : 0} samples found</span>
                    </div>
                    {showAllSamples && (
                        <ul>
                            {uploadedFileData?.samples.map((sample: any, key: number) => (
                                <li key={sample.id}>
                                    <span>{sample.id}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};

type UploadModalProps = {
    sampleConfig: SampleConfig;
    showNewSampleConfig: boolean;
    sampleOkayToAdd: boolean;
    cohorts: Cohorts;
    setCohorts: (cohorts: Cohorts) => void;
    onAdd: (config: ValidSampleConfig) => void;
    setSampleConfig: React.Dispatch<React.SetStateAction<SampleConfig>>;
    setShowNewSampleConfig: React.Dispatch<React.SetStateAction<boolean>>;
};

export const UploadModal = ({
    sampleConfig,
    showNewSampleConfig,
    sampleOkayToAdd,
    cohorts,
    setCohorts,
    onAdd,
    setSampleConfig,
    setShowNewSampleConfig
}: UploadModalProps) => {
    const [uploadType, setUploadType] = useState<'file' | 'form'>('file');
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [uploadedFileData, setUploadedFileData] = useState<any>(null);

    // Function to clear sample configuration
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
                                {uploadType === 'file' ? (
                                    <>
                                        <FileDragUpload
                                            onJsonParsed={sample => {
                                                setUploadedFileData(sample);
                                                setSampleConfig(sample);
                                            }}
                                            multiple={false}
                                            uploadedFile={uploadedFile}
                                            setUploadedFile={setUploadedFile}
                                            setSampleConfig={setSampleConfig}
                                        />
                                        {uploadedFile && uploadedFileData ? (
                                            <UploadModalFeedback
                                                uploadedFile={uploadedFile}
                                                uploadedFileData={uploadedFileData}
                                            />
                                        ) : null}
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
                                                        onChange={e =>
                                                            setSampleConfig({
                                                                ...sampleConfig,
                                                                assembly: e.currentTarget.value as 'hg19' | 'hg38'
                                                            })
                                                        }
                                                        value={sampleConfig.assembly ?? 'hg19'}
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
                                                            sampleConfig?.id === exampleConfigFields.id &&
                                                            sampleConfig?.cancer === exampleConfigFields.cancer &&
                                                            sampleConfig?.assembly === exampleConfigFields.assembly &&
                                                            sampleConfig?.sv === exampleConfigFields.sv &&
                                                            sampleConfig?.cnv === exampleConfigFields.cnv
                                                        ) {
                                                            clearSampleConfig();
                                                        } else {
                                                            setSampleConfig({
                                                                ...sampleConfig,
                                                                ...exampleConfigFields
                                                            });
                                                        }
                                                    }}
                                                >
                                                    {sampleConfig?.id === exampleConfigFields.id &&
                                                    sampleConfig?.cancer === exampleConfigFields.cancer &&
                                                    sampleConfig?.assembly === exampleConfigFields.assembly &&
                                                    sampleConfig?.sv === exampleConfigFields.sv &&
                                                    sampleConfig?.cnv === exampleConfigFields.cnv ? (
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
                                                    testOkay.id(sampleConfig) ? 'input' : 'input-invalid'
                                                }`}
                                            >
                                                <span className="menu-subtitle">
                                                    ID<sup>*</sup>
                                                </span>
                                                {/* <span className="menu-subtitle-right">Required</span> */}
                                                <input
                                                    id="sample-id-input"
                                                    type="text"
                                                    className="menu-text-input"
                                                    placeholder="My sample 1, etc"
                                                    required
                                                    onChange={e =>
                                                        setSampleConfig({ ...sampleConfig, id: e.currentTarget.value })
                                                    }
                                                    value={sampleConfig.id ?? ''}
                                                />
                                            </div>

                                            {/* Cancer  */}
                                            <div
                                                className={`input-container ${
                                                    testOkay.cancer(sampleConfig) ? 'input' : 'input-invalid'
                                                }`}
                                            >
                                                <div className="menu-subtitle">
                                                    Cancer<sup>*</sup>
                                                </div>
                                                {/* <span className="menu-subtitle-right">Required</span> */}
                                                <input
                                                    id="sample-cancer-input"
                                                    type="text"
                                                    className="menu-text-input"
                                                    placeholder="Gastric, Ovary, Prostate, etc"
                                                    required
                                                    onChange={e =>
                                                        setSampleConfig({
                                                            ...sampleConfig,
                                                            cancer: e.currentTarget.value
                                                        })
                                                    }
                                                    value={sampleConfig.cancer ?? ''}
                                                />
                                            </div>

                                            {/* SV */}
                                            <div
                                                className={`input-container ${
                                                    testOkay.sv(sampleConfig) ? 'input' : 'input-invalid'
                                                }`}
                                            >
                                                <div className="menu-subtitle">
                                                    SV<sup>*</sup> <small>(.bedpe)</small>
                                                </div>
                                                {/* <span className="menu-subtitle-right">Required</span> */}
                                                <input
                                                    id="sample-sv-input"
                                                    type="text"
                                                    className="menu-text-input"
                                                    placeholder="https://..."
                                                    required
                                                    onChange={e =>
                                                        setSampleConfig({ ...sampleConfig, sv: e.currentTarget.value })
                                                    }
                                                    value={sampleConfig.sv ?? ''}
                                                />
                                            </div>

                                            {/* CNV */}
                                            <div
                                                className={`input-container ${
                                                    testOkay.cnv(sampleConfig) ? 'input' : 'input-invalid'
                                                }`}
                                            >
                                                <div className="menu-subtitle">
                                                    CNV <small>(.txt)</small>
                                                </div>
                                                {/* <span className="menu-subtitle-right">Required</span> */}
                                                <input
                                                    id="sample-cnv-input"
                                                    type="text"
                                                    className="menu-text-input"
                                                    placeholder="https://..."
                                                    onChange={e =>
                                                        setSampleConfig({ ...sampleConfig, cnv: e.currentTarget.value })
                                                    }
                                                    value={sampleConfig.cnv ?? ''}
                                                />
                                            </div>

                                            {/* Drivers */}
                                            <div
                                                className={`input-container ${
                                                    testOkay.drivers(sampleConfig) ? 'input' : 'input-invalid'
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
                                                        setSampleConfig({
                                                            ...sampleConfig,
                                                            drivers: e.currentTarget.value
                                                        })
                                                    }
                                                    value={sampleConfig.drivers ?? ''}
                                                />
                                            </div>

                                            {/* Point Mutation */}
                                            <div
                                                className={`input-container ${
                                                    testOkay.vcf(sampleConfig) ? 'input' : 'input-invalid'
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
                                                        setSampleConfig({ ...sampleConfig, vcf: e.currentTarget.value })
                                                    }
                                                    value={sampleConfig.vcf ?? ''}
                                                />
                                            </div>

                                            {/* Point Mutation Index */}
                                            <div
                                                className={`input-container ${
                                                    testOkay.vcfIndex(sampleConfig) ? 'input' : 'input-invalid'
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
                                                        setSampleConfig({
                                                            ...sampleConfig,
                                                            vcfIndex: e.currentTarget.value
                                                        })
                                                    }
                                                    value={sampleConfig.vcfIndex ?? ''}
                                                />
                                            </div>

                                            {/* Indel */}
                                            <div
                                                className={`input-container ${
                                                    testOkay.vcf2(sampleConfig) ? 'input' : 'input-invalid'
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
                                                        setSampleConfig({
                                                            ...sampleConfig,
                                                            vcf2: e.currentTarget.value
                                                        })
                                                    }
                                                    value={sampleConfig.vcf2 ?? ''}
                                                />
                                            </div>

                                            {/* Indel Index */}
                                            <div
                                                className={`input-container ${
                                                    testOkay.vcf2Index(sampleConfig) ? 'input' : 'input-invalid'
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
                                                        setSampleConfig({
                                                            ...sampleConfig,
                                                            vcf2Index: e.currentTarget.value
                                                        })
                                                    }
                                                    value={sampleConfig.vcf2Index ?? ''}
                                                />
                                            </div>

                                            {/* Read Alignment */}
                                            <div
                                                className={`input-container ${
                                                    testOkay.bam(sampleConfig) ? 'input' : 'input-invalid'
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
                                                        setSampleConfig({ ...sampleConfig, bam: e.currentTarget.value })
                                                    }
                                                    value={sampleConfig.bam ?? ''}
                                                />
                                            </div>

                                            {/* Read Alignment Index */}
                                            <div
                                                className={`input-container ${
                                                    testOkay.bai(sampleConfig) ? 'input' : 'input-invalid'
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
                                                        setSampleConfig({ ...sampleConfig, bai: e.currentTarget.value })
                                                    }
                                                    value={sampleConfig.bai ?? ''}
                                                />
                                            </div>

                                            <div className="footnote">* Required Fields</div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button className="btn btn-outline-primary create-cohort" disabled>
                            <span>Create New Cohort</span>
                        </button>
                        <button
                            className="btn btn-primary add-to-cohort"
                            disabled={!sampleOkayToAdd}
                            data-bs-dismiss="modal"
                            aria-label="Submit"
                        >
                            <span
                                className={!sampleOkayToAdd && uploadedFileData === null ? 'disabled' : ''}
                                onClick={() => {
                                    clearSampleConfig();
                                    onAdd(sampleConfig as ValidSampleConfig);
                                }}
                            >
                                Add to Cohort
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

type SampleConfigFormProps = {
    cohorts: Cohorts;
    setCohorts: (cohorts: Cohorts) => void;
    onAdd: (config: ValidSampleConfig) => void;
};

export default function SampleConfigForm({ cohorts, setCohorts, onAdd }: SampleConfigFormProps) {
    const [sampleConfig, setSampleConfig] = useState<SampleConfig>({});
    const [showNewSampleConfig, setShowNewSampleConfig] = useState(false);
    const sampleOkayToAdd = useMemo(() => {
        let okay = true;
        Object.keys(testOkay).map(k => {
            okay = okay && testOkay[k](sampleConfig);
        });
        return okay;
    }, [sampleConfig]);

    return (
        <div className="upload-button-container">
            <UploadModal
                cohorts={cohorts}
                setCohorts={setCohorts}
                onAdd={onAdd}
                sampleConfig={sampleConfig}
                setSampleConfig={setSampleConfig}
                showNewSampleConfig={showNewSampleConfig}
                setShowNewSampleConfig={setShowNewSampleConfig}
                sampleOkayToAdd={sampleOkayToAdd}
            />
        </div>
    );
}
