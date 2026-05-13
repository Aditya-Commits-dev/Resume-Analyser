/**
 * Reads a File object and returns its Base64-encoded content (data stripped).
 * @param {File} file
 * @returns {Promise<string>} raw base64 string (no data-URI prefix)
 */
export function pdfToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      // result looks like "data:application/pdf;base64,JVBERi..."
      const base64 = reader.result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

/**
 * Format bytes to human-readable string.
 * @param {number} bytes
 */
export function formatBytes(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}
