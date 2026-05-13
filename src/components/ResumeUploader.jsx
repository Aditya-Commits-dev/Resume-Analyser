import { useState, useRef } from 'react';
import { formatBytes } from '../utils/pdfToBase64';

/**
 * ResumeUploader – drag-and-drop / click-to-browse PDF uploader.
 */
export default function ResumeUploader({ file, onFileChange, onAnalyse, loading, canAnalyse }) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef(null);

  function handleDrop(e) {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer.files?.[0];
    if (dropped && dropped.type === 'application/pdf') {
      onFileChange(dropped);
    }
  }

  function handleFileInput(e) {
    const picked = e.target.files?.[0];
    if (picked) onFileChange(picked);
  }

  return (
    <div className="card">
      <div className="card-title">📄 Upload Resume (PDF)</div>

      {!file ? (
        <div
          className={`drop-zone ${dragging ? 'dragging' : ''}`}
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
        >
          <div className="icon">📂</div>
          <h3>Drop your PDF here</h3>
          <p>or click to browse — PDF only, max 10 MB</p>
          <input
            ref={inputRef}
            type="file"
            accept="application/pdf"
            onChange={handleFileInput}
          />
        </div>
      ) : (
        <div className="file-preview">
          <span className="file-icon">📑</span>
          <div className="file-info">
            <div className="file-name">{file.name}</div>
            <div className="file-size">{formatBytes(file.size)}</div>
          </div>
          <button
            className="btn-remove"
            title="Remove file"
            onClick={() => onFileChange(null)}
          >
            ✕
          </button>
        </div>
      )}

      <button
        className="btn-analyse"
        onClick={onAnalyse}
        disabled={!canAnalyse || loading}
      >
        {loading ? (
          <>
            <span className="loader" />
            Analysing with Gemini AI…
          </>
        ) : (
          '✨ Analyse Resume'
        )}
      </button>
    </div>
  );
}
