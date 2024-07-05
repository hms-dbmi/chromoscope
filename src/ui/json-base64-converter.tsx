import React, { useState } from 'react';
import UrlsafeCodec from '../lib/urlsafe-codec';

const JsonBase64Converter = () => {
    const [jsonText, setJsonText] = useState('');
    const [base64Text, setBase64Text] = useState('');
    const [error, setError] = useState('');

    const handleEncode = () => {
        try {
            const jsonObject = JSON.parse(jsonText);
            const encoded = UrlsafeCodec.encode(jsonObject);
            setBase64Text(encoded);
            setError('');
        } catch (error) {
            setError('Error parsing JSON. Please enter valid JSON.');
        }
    };

    const handleDecode = () => {
        try {
            const decoded = UrlsafeCodec.decode(base64Text);
            const jsonString = JSON.stringify(decoded, null, 4);
            setJsonText(jsonString);
            setError('');
        } catch (error) {
            setError('Error decoding base64 string. Please enter a valid base64-encoded string.');
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'row' }}>
            <div style={{ flex: 1, marginRight: '8px', marginLeft: '8px' }}>
                <h2>JSON Text</h2>
                <textarea
                    value={jsonText}
                    onChange={e => setJsonText(e.target.value)}
                    placeholder="Enter JSON text"
                    rows={48}
                    style={{ width: '99%', fontSize: 'large' }}
                />
                <button onClick={handleEncode}>Encode</button>
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </div>
            <div style={{ flex: 1, marginRight: '8px', marginLeft: '8px' }}>
                <h2>Base64 Encoded Text</h2>
                <textarea
                    value={base64Text}
                    onChange={e => setBase64Text(e.target.value)}
                    placeholder="Base64 url safe encoded string"
                    rows={48}
                    style={{ width: '99%', fontSize: 'large' }}
                />
                <button onClick={handleDecode}>Decode</button>
            </div>
        </div>
    );
};

export default JsonBase64Converter;
