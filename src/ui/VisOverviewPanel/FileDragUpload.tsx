// FileDragUpload.tsx
import React, { useCallback, useState } from 'react';
import { ICONS } from '../../icon';
import { SampleConfig, ValidCohort } from '../SampleConfigForm';
import { Cohorts } from '../../App';
import { isValidUrl } from '../UploadModal';
import { cohortOkayToAdd } from '../UploadModal';

type FileDragUploadProps = {
    multiple?: boolean;
    error: { type?: string; message: JSX.Element } | null;
    uploadedFile: File | null;
    cohorts: Cohorts;
    setUploadedCohort?: React.Dispatch<React.SetStateAction<ValidCohort | null>>;
    onJsonParsed: (data: any | any[]) => void;
    setUploadedFile?: (file: File | null) => void;
    setSampleConfig: React.Dispatch<React.SetStateAction<SampleConfig>>;
    setError: React.Dispatch<React.SetStateAction<{ type?: string; message: JSX.Element } | null>>;
};

export const FileDragUpload = ({
    uploadedFile,
    onJsonParsed,
    setUploadedFile = null,
    setUploadedCohort = null,
    multiple = false, // In the future we may want to support multiple file uploads
    error,
    cohorts,
    setError
}: FileDragUploadProps) => {
    const [dragging, setDragging] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [inputUrl, setInputUrl] = useState<string>('');

    // Clear upload state
    const clearUpload = () => {
        setUploadedFile(null);
        setIsLoading(false);
        setError(null);
        setUploadedCohort(null);
    };

    const handleFiles = useCallback(
        (files: File[]) => {
            setIsLoading(true);

            const jsonFiles = multiple ? files : [files[0]];

            const readers = jsonFiles.map(file => {
                return new Promise<any>((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => {
                        try {
                            const parsed = JSON.parse(reader.result as string);
                            resolve(parsed);
                            setUploadedFile(file);
                            setTimeout(() => setIsLoading(false), 250); // Simulate loading for UX
                        } catch (err) {
                            const errorString = '' + err;
                            let errorObj = null;

                            // Check for syntax error in message
                            const syntaxErrorMessageIndex = errorString.indexOf('SyntaxError');
                            if (syntaxErrorMessageIndex !== -1) {
                                errorObj = {
                                    type: 'syntax',
                                    message: errorString.substring(syntaxErrorMessageIndex)
                                };
                            } else {
                                errorObj = {
                                    type: 'generic',
                                    message: `Failed to parse ${file.name}: ${errorString}`
                                };
                            }
                            setError(errorObj);
                            reject(new Error(`Failed to parse ${file.name}`));
                        }
                    };
                    reader.onerror = () => reject(new Error(`Error reading ${file.name}`));
                    reader.readAsText(file);
                });
            });

            Promise.all(readers)
                .then(parsedData => {
                    const data = parsedData[0] as ValidCohort;

                    let formattedDataName = data?.name || uploadedFile?.name || 'Untitled Cohort';

                    // If cohort name already exists, append _1
                    let i = 1;
                    while (cohorts[formattedDataName]) {
                        // Prevent infinite loop
                        if (i > 99) {
                            return;
                        }
                        if (cohorts[formattedDataName]) {
                            formattedDataName += `_${1}`;
                            i++;
                        }
                    }
                    const formattedDataSamples = Array.isArray(data) ? data : data.samples;

                    const formattedData: ValidCohort = {
                        name: formattedDataName,
                        samples: formattedDataSamples
                    };

                    const { errors, samplesOkay } = cohortOkayToAdd(formattedData);

                    // Set error if errors found
                    if (!samplesOkay) {
                        let errorMsg = null;

                        // List all sample errors
                        if (errors.size > 0) {
                            errorMsg = (
                                <ul className="error-list">
                                    {Array.from(errors.entries()).map(([index, err]) => {
                                        if (err.length > 0) {
                                            const errorFields = err.join(', ');
                                            return (
                                                <li key={index}>
                                                    Sample {index + 1} has error in the following fields:{' '}
                                                    <b>{errorFields}</b>
                                                </li>
                                            );
                                        }
                                    })}
                                </ul>
                            );
                        } else {
                            errorMsg = 'Parsed file did not pass validation.';
                        }
                        setError({
                            type: 'generic',
                            message: errorMsg
                        });
                    } else {
                        onJsonParsed(formattedData);
                        setError(null);
                    }
                })
                .catch(err => {
                    console.error(err);
                });
        },
        [multiple, onJsonParsed]
    );

    const handleDrop = useCallback(
        (e: React.DragEvent<HTMLDivElement>) => {
            e.preventDefault();
            setDragging(false);

            const files = Array.from(e.dataTransfer.files).filter(file => file.type === 'application/json');
            if (!files.length) {
                setError({ type: 'generic', message: <>Please upload a valid JSON file.</> });
                return;
            }
            handleFiles(files);
        },
        [handleFiles]
    );

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragging(false);
    };

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files ? Array.from(e.target.files) : [];
        const jsonFiles = files.filter(file => file.type === 'application/json');
        if (!jsonFiles.length) {
            setError({ type: 'generic', message: <>Please upload a valid JSON file.</> });
            return;
        }
        handleFiles(jsonFiles);
    };

    const handleUrlInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const url = e.target.value;
        setInputUrl(url);
    };

    return (
        <div className="file-drag-upload-container">
            {!error ? (
                uploadedFile ? (
                    <button
                        className="btn btn-link"
                        onClick={() => {
                            clearUpload();
                        }}
                    >
                        Try a different file
                    </button>
                ) : (
                    <div
                        className={`file-upload-dropzone ${dragging ? 'dragging' : ''}`}
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onClick={e => {
                            const target = e.target as HTMLElement;
                            if (target.className !== 'input-group') {
                                document.getElementById('hidden-file-input')?.click();
                            }
                        }}
                    >
                        <input
                            id="hidden-file-input"
                            type="file"
                            style={{ display: 'none' }}
                            onChange={handleFileInputChange}
                            accept=".json"
                            multiple={multiple}
                        />
                        <div className="file-upload-prompt">
                            {isLoading ? (
                                <div className="spinner-border" role="status"></div>
                            ) : (
                                <div className="upload-prompt">
                                    <svg className="" viewBox={ICONS.UPLOAD_FILE.viewBox}>
                                        {ICONS.UPLOAD_FILE.path.map(p => (
                                            <path fill="currentColor" key={p} d={p} />
                                        ))}
                                    </svg>
                                    <span>
                                        Drag a configuration file here <br /> or upload a file
                                    </span>
                                </div>
                            )}
                            <div className="url-upload">
                                <div className="divider">
                                    <span>OR</span>
                                </div>
                                <div className="input-group">
                                    <input
                                        onClick={e => e.stopPropagation()}
                                        onChange={handleUrlInputChange}
                                        id="url-input"
                                        type="text"
                                        placeholder="Paste URL to the configuration file"
                                    ></input>
                                    <a
                                        target="_blank"
                                        href={isValidUrl(inputUrl) ? `/?external=${inputUrl}` : ''}
                                        className={`btn ${isValidUrl(inputUrl) ? '' : ' disabled'}`}
                                        onClick={e => e.stopPropagation()}
                                        rel="noreferrer"
                                    >
                                        Upload
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            ) : (
                <div className="reupload-prompt">
                    <span>Upload Failed...</span>
                    <button
                        className="btn btn-link"
                        onClick={() => {
                            clearUpload();
                        }}
                    >
                        Try a different file
                    </button>
                </div>
            )}
        </div>
    );
};
