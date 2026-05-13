import { useState, useCallback } from 'react';
import { pdfToBase64 } from '../utils/pdfToBase64';
import { buildMessages, SYSTEM_PROMPT } from '../utils/promptBuilder';

const API_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

// const GEMINI_API_KEY = 'AIzaSyDLELucaVhsh8rG2cZmPoekwEq1HPHDLFw';
/**
 * Custom hook that encapsulates the full resume-analysis workflow.
 *
 * Returns:
 *  { analyse, result, loading, error, reset }
 */
export function useResumeAnalyser() {
  const [result, setResult]   = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const analyse = useCallback(async (file) => {
    if (!file) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const base64 = await pdfToBase64(file);
      const messages = buildMessages(base64);

      const response = await fetch('/.netlify/functions/analyse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: SYSTEM_PROMPT },
                ...messages,
              ],
            },
          ],
        }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err?.error?.message || `API error ${response.status}`);
      }

      const data = await response.json();
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
      const clean = rawText.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(clean);
      setResult(parsed);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
    setLoading(false);
  }, []);

  return { analyse, result, loading, error, reset };
}