import { useState, useCallback } from 'react';
import { pdfToBase64 } from '../utils/pdfToBase64';
import { SYSTEM_PROMPT } from '../utils/promptBuilder';

/**
 * Custom hook that encapsulates the full resume-analysis workflow.
 *
 * Returns:
 *  { analyse, result, loading, error, reset }
 */
export function useResumeAnalyser() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const analyse = useCallback(async (file) => {
    if (!file) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Convert PDF to base64
      const base64 = await pdfToBase64(file);

      // Send request to Netlify Function
      const response = await fetch('/.netlify/functions/analyse', {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: SYSTEM_PROMPT,
                },

                {
                  inline_data: {
                    mime_type: 'application/pdf',
                    data: base64,
                  },
                },
              ],
            },
          ],
        }),
      });

      // Handle API errors
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));

        throw new Error(
          err?.error?.message || `API Error ${response.status}`
        );
      }

      // Parse response
      const data = await response.json();

      console.log('Gemini Response:', data);

      // Validate response
      if (!data.candidates) {
        throw new Error(
          data.error?.message || 'No response returned from Gemini'
        );
      }

      // Extract text safely
      const rawText =
        data.candidates?.[0]?.content?.parts
          ?.map((p) => p.text || '')
          .join('') || '';

      const clean = rawText
        .replace(/```json|```/g, '')
        .trim();

      console.log('Clean Response:', clean);

      if (!clean) {
        throw new Error('Empty response from AI');
      }

      // Parse JSON safely
      try {
        const parsed = JSON.parse(clean);
        setResult(parsed);
      } catch (jsonError) {
        console.error('Invalid JSON:', clean);

        throw new Error(
          'AI did not return valid JSON. Check console.'
        );
      }

    } catch (err) {
      console.error(err);

      setError(
        err.message || 'Something went wrong. Please try again.'
      );

    } finally {
      setLoading(false);
    }

  }, []);

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    analyse,
    result,
    loading,
    error,
    reset,
  };
}
