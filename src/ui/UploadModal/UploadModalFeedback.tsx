import React, { useState } from 'react';
import { ValidCohort } from '../SampleConfigForm';
import { ICONS } from '../../icon';

type UploadModalFeedbackProps = {
    uploadedFile: File | null;
    uploadedFileData: any;
    uploadedCohort: ValidCohort;
    setUploadedCohort: React.Dispatch<React.SetStateAction<ValidCohort>>;
    error: string | null;
    setError: React.Dispatch<React.SetStateAction<string | null>>;
};

export const UploadModalFeedback = ({
    uploadedFile,
    uploadedFileData,
    uploadedCohort,
    setUploadedCohort,
    error,
    setError
}: UploadModalFeedbackProps) => {
    const [showAllSamples, setShowAllSamples] = useState(false);
    const [cohortName, setCohortName] = useState(uploadedCohort?.name);
    const [changingCohortName, setChangingCohortName] = useState(false);

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
                        {/* <svg className="" viewBox={ICONS.ERROR.viewBox}>
                            {ICONS.ERROR.path.map(p => (
                                <path fill="currentColor" key={p} d={p} />
                            ))}
                        </svg> */}
                        <span>Upload Failed</span>
                    </div>
                    <div className="body">
                        <span>{error}</span>
                    </div>
                </div>
            </div>
        );
    }

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
                                        // placeholder={uploadedCohort?.name || uploadedFile?.name}
                                        value={cohortName || uploadedCohort?.name}
                                        onChange={e => setCohortName(e.target.value || uploadedCohort?.name)}
                                        onKeyPress={e => {
                                            if (e.key === 'Enter') {
                                                handleCohortNameChange(cohortName);
                                                setCohortName(cohortName);
                                            } else if (e.key === 'Esc') {
                                                e.preventDefault();
                                                setCohortName(uploadedCohort?.name);
                                                setChangingCohortName(false);
                                            }
                                        }}
                                    />
                                    <button
                                        className="cancel"
                                        onClick={() => {
                                            console.log('setting cohortName', cohortName, uploadedCohort?.name);
                                            setCohortName(uploadedCohort?.name);
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
                                        className="save"
                                        type="submit"
                                        onClick={() => {
                                            handleCohortNameChange(cohortName);
                                        }}
                                    >
                                        Save
                                    </button>
                                </div>
                            ) : (
                                <div className="name-display">
                                    <span>{uploadedCohort?.name || uploadedFile?.name}</span>
                                    <button
                                        className="edit"
                                        onClick={() => {
                                            setCohortName(cohortName);
                                            setChangingCohortName(true);
                                        }}
                                    >
                                        Edit
                                        {/* <svg viewBox={ICONS.PENCIL.viewBox}>
                                            {ICONS.PENCIL.path.map(p => (
                                                <path fill="currentColor" key={p} d={p} />
                                            ))}
                                        </svg> */}
                                    </button>
                                </div>
                            )}
                        </div>
                        <span className="">
                            <b>{uploadedFileData?.samples ? uploadedFileData.samples.length : 0} Samples Uploaded</b> -{' '}
                            <button onClick={() => setShowAllSamples(!showAllSamples)}>
                                <i>{showAllSamples ? 'Hide' : 'View All'}</i>
                            </button>
                            <br />
                        </span>
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
};
