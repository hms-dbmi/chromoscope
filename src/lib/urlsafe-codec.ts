import pako from 'pako';
import base64Js from 'base64-js';

/**
 * UrlsafeCodec provides static methods to encode and decode samples
 * to and from a URL-safe base64 encoded string. It uses JSON for serialization,
 * pako for compression, and base64-js for handling base64 encoding.
 */
class UrlsafeCodec {
     /**
     * Encodes a sample object into a URL-safe base64 string.
     * 
     * The method serializes the sample to a JSON string, compresses it using pako,
     * converts the compressed data to a base64 string, and then modifies the base64 string
     * to make it URL-safe by replacing '+' with '.', '/' with '_', and '=' with '-'.
     *
     * @param {Object} sample - The sample object to encode.
     * @returns {string} A URL-safe base64 encoded string representing the sample.
     */
     static encode(sample) {
        try {
            const string = JSON.stringify(sample);
            const encoder = new TextEncoder();
            const stringAsUint8Array = encoder.encode(string);
            const compressedUint8Array = pako.deflate(stringAsUint8Array);
            const base64Bytes = base64Js.fromByteArray(compressedUint8Array);
            const base64Blob = base64Bytes.toString();
            const base64UrlsafeBlob = base64Blob.replace(/\+/g, '.').replace(/\//g, '_').replace(/=/g, '-');
            return base64UrlsafeBlob;
        } catch (error) {
            console.error('Error encoding sample:', error);
            // Handle the error or rethrow, depending on your needs
            throw error;
        }
    }

    /**
     * Decodes a URL-safe base64 string back into a sample object.
     * 
     * The method reverses the URL-safe transformation by replacing '.', '_', and '-'
     * with '+', '/', and '=' respectively. It then converts the base64 string back to bytes.
     * By default, the header check is turned off. If headerCheck is set to true, the method
     * will perform zlib/gzip header and checksum verification during decompression using pako.
     * Finally, it parses the JSON string to reconstruct the original sample object.
     *
     * @param {string} encodedString - The URL-safe base64 encoded string to decode.
     * @param {boolean} headerCheck - Optional parameter to enable header and checksum verification.
     * @returns {Object} The original sample object.
     */
    static decode(encodedString, headerCheck = false) {
        try {
            const base64Blob = encodedString.replace(/\./g, '+').replace(/_/g, '/').replace(/-/g, '=');
            const compressedUint8Array = base64Js.toByteArray(base64Blob);
            // Set 'raw' to true if headerCheck is false
            const bytes = pako.inflate(compressedUint8Array, {raw: !headerCheck });            
            const decoder = new TextDecoder();
            const string = decoder.decode(bytes);
            const sample = JSON.parse(string);
            return sample;
        } catch (error) {
            console.error('Error decoding string:', error);
            // Handle the error or rethrow, depending on your needs
            throw error;
        }
    }
}

export default UrlsafeCodec;
