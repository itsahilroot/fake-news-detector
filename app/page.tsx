'use client';

import { useState } from 'react';
import ArticleInput from '@/components/ArticleInput';
import ResultsDisplay from '@/components/ResultsDisplay';
import { AnalysisResult } from '@/types/analysis';

export default function Home() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<AnalysisResult | null>(null);

  const analyzeArticle = async (articleText: string) => {
    setIsAnalyzing(true);
    setError(null);
    setResults(null);
    
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ articleText }),
      });

      if (!response.ok) {
        throw new Error(`Analysis failed: ${response.statusText}`);
      }

      const data = await response.json();
      setResults(data);
    } catch (err) {
      console.error('Error analyzing article:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <>
      <ArticleInput onAnalyze={analyzeArticle} isAnalyzing={isAnalyzing} />
      {results && <ResultsDisplay results={results} />}
      {error && (
        <div className="w-full max-w-4xl mx-auto mt-6 p-4 bg-destructive/10 text-destructive rounded-lg">
          <p className="font-medium">Error: {error}</p>
        </div>
      )}
    </>
  );
}
