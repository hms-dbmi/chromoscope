// FileDragUpload.tsx
import React, { useCallback, useState } from 'react';
import { ICONS } from '../../icon';
import { SampleConfig, ValidCohort } from '../SampleConfigForm';
import { isValidUrl } from '../UploadModal';

type FileDragUploadProps = {
    multiple?: boolean;
    error: string | null;
    onJsonParsed: (data: any | any[]) => void;
    setUploadedFile?: (file: File | null) => void;
    setSampleConfig: React.Dispatch<React.SetStateAction<SampleConfig>>;
    setError: React.Dispatch<React.SetStateAction<string | null>>;
};

export const FileDragUpload = ({
    onJsonParsed,
    setUploadedFile = null,
    multiple = false,
    error,
    setError
}: FileDragUploadProps) => {
    const [dragging, setDragging] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [inputUrl, setInputUrl] = useState<string>('');

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
                            setError(`Failed to parse ${file.name}: ${err}`);
                            reject(new Error(`Failed to parse ${file.name}`));
                        }
                    };
                    reader.onerror = () => reject(new Error(`Error reading ${file.name}`));
                    reader.readAsText(file);
                });
            });

            Promise.all(readers)
                .then(parsedData => {
                    onJsonParsed(multiple ? parsedData : parsedData[0]);
                    setError(null);
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
                setError('Please upload valid JSON file(s).');
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
            setError('Please upload valid JSON file(s).');
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
                <div
                    className={`file-upload-dropzone ${dragging ? 'dragging' : ''}`}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onClick={() => document.getElementById('hidden-file-input')?.click()}
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
                                    href={isValidUrl(inputUrl) ? `/?external=${inputUrl}` : ''}
                                    className={`btn ${isValidUrl(inputUrl) ? '' : ' disabled'}`}
                                    onClick={e => e.stopPropagation()}
                                >
                                    Upload
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="reupload-prompt">
                    <span>Upload Failed...</span>
                    <button
                        className="btn btn-link"
                        onClick={() => {
                            setUploadedFile(null);
                            setError(null);
                            setIsLoading(false);
                        }}
                    >
                        Try a different file
                    </button>
                </div>
            )}
        </div>
    );
};
