import { useState } from 'react';
// import ApiKeyInput    from './components/ApiKeyInput';
import ResumeUploader from './components/ResumeUploader';
import AnalysisResult from './components/AnalysisResult';
import { useResumeAnalyser } from './hooks/useResumeAnalyser';

export default function App() {
  // const [apiKey, setApiKey] = useState('');
  const [file, setFile]     = useState(null);

  const { analyse, result, loading, error, reset } = useResumeAnalyser();

  function handleAnalyse() {
    analyse(file);
  }

  function handleReset() {
    setFile(null);
    reset();
  }

  const canAnalyse = !!file

  return (
    <div className="app">
      {/* Header */}
      <div className="header">
        <h1>📄 Resume Analyser</h1>
        <p>Get instant, AI-powered feedback on your resume — scored and actionable</p>
      </div>

      {/* API Key */}
      {/* <ApiKeyInput apiKey={apiKey} onChange={setApiKey} /> */}

      {/* Uploader — hide while showing results */}
      {!result && (
        <ResumeUploader
          file={file}
          onFileChange={setFile}
          onAnalyse={handleAnalyse}
          loading={loading}
          canAnalyse={canAnalyse}
        />
      )}

      {/* Error */}
      {error && (
        <div className="error-box">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Results */}
      {result && (
        <AnalysisResult result={result} onReset={handleReset} />
      )}
    </div>
  );
}
