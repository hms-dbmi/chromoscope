import React, { useEffect, useState } from 'react';
import { ValidCohort } from '../SampleConfigForm';
import { ICONS } from '../../icon';
import { Cohorts } from '../../App';

type UploadModalFeedbackProps = {
    uploadedFile: File | null;
    uploadedFileData: any;
    uploadedCohort: ValidCohort;
    cohorts: Cohorts;
    setUploadedCohort: React.Dispatch<React.SetStateAction<ValidCohort>>;
    error: { type?: string; message: JSX.Element } | null;
};

export const UploadModalFeedback = ({
    uploadedFile,
    uploadedFileData,
    uploadedCohort,
    cohorts,
    setUploadedCohort,
    error
}: UploadModalFeedbackProps) => {
    const [showAllSamples, setShowAllSamples] = useState(false);
    const [cohortName, setCohortName] = useState(uploadedCohort?.name || '');
    const [changingCohortName, setChangingCohortName] = useState(false);

    // Sync cohort name state with uploaded cohort
    useEffect(() => {
        setCohortName(uploadedCohort?.name);
    }, [uploadedCohort]);

    // Handle cohort name change
    const handleCohortNameChange = (newName: string) => {
        if (newName && newName.length > 0) {
            setUploadedCohort &&
                setUploadedCohort({
                    ...uploadedCohort,
                    name: newName
                });
            setChangingCohortName(false);
        }
    };

    if (error) {
        return (
            <div className="upload-feedback">
                <div className="feedback-banner error">
                    <div className="header">
                        <svg className="" viewBox={ICONS.WARNING_TRIANGLE.viewBox}>
                            {ICONS.WARNING_TRIANGLE.path.map(p => (
                                <path fill="currentColor" key={p} d={p} />
                            ))}
                        </svg>
                        <span>Upload Failed</span>
                    </div>
                    <div className="body">
                        {error?.type === 'syntax' && (
                            <>
                                <span>There was a syntax error in your JSON:</span>
                                <code>{error?.message}</code>
                            </>
                        )}
                        {error?.type === 'generic' && <span>{error?.message}</span>}
                    </div>
                </div>
            </div>
        );
    } else {
        return (
            <div className="upload-feedback">
                <div className="feedback-banner success">
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
                            <div className="name">
                                <b>Cohort Name:</b>
                                {changingCohortName ? (
                                    <div className="name-input">
                                        <input
                                            id="cohort-name-input"
                                            type="text"
                                            value={cohortName}
                                            onChange={e => setCohortName(e.target.value)}
                                            onKeyPress={e => {
                                                if (e.key === 'Enter') {
                                                    if (cohortName !== uploadedCohort?.name && !cohorts?.[cohortName]) {
                                                        handleCohortNameChange(cohortName);
                                                        setCohortName(cohortName);
                                                    }
                                                } else if (e.key === 'Esc') {
                                                    e.preventDefault();
                                                    setCohortName(uploadedCohort?.name);
                                                    setChangingCohortName(false);
                                                }
                                            }}
                                        />
                                        <div className="controls">
                                            <button
                                                className="cancel"
                                                onClick={() => {
                                                    setChangingCohortName(false);
                                                }}
                                            >
                                                <svg viewBox={ICONS.CLOSE.viewBox}>
                                                    {ICONS.CLOSE.path.map(p => (
                                                        <path fill="currentColor" key={p} d={p} />
                                                    ))}
                                                </svg>
                                            </button>
                                            <button
                                                className={`save ${
                                                    cohortName &&
                                                    cohortName !== uploadedCohort?.name &&
                                                    !cohorts?.[cohortName]
                                                        ? ''
                                                        : 'disabled'
                                                }`}
                                                type="submit"
                                                onClick={() => {
                                                    if (cohortName !== uploadedCohort?.name && !cohorts?.[cohortName]) {
                                                        handleCohortNameChange(cohortName);
                                                    }
                                                }}
                                            >
                                                Save
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="name-display">
                                        <span>{uploadedCohort?.name}</span>
                                        <div className="controls">
                                            <button
                                                className="edit"
                                                onClick={() => {
                                                    setCohortName(cohortName);
                                                    setChangingCohortName(true);
                                                }}
                                            >
                                                <svg className="" viewBox={ICONS.PENCIL.viewBox}>
                                                    {ICONS.PENCIL.path.map(p => (
                                                        <path fill="currentColor" key={p} d={p} />
                                                    ))}
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <ul>
                                <li>
                                    <span className="">
                                        <b>
                                            {uploadedFileData?.samples ? uploadedFileData.samples.length : 0} Samples
                                            Uploaded
                                        </b>{' '}
                                        -{' '}
                                        <button onClick={() => setShowAllSamples(!showAllSamples)}>
                                            <i>{showAllSamples ? 'Hide' : 'View All'}</i>
                                        </button>
                                        <br />
                                    </span>
                                </li>
                            </ul>
                        </div>
                        <div className="samples">
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
            </div>
        );
    }
};
