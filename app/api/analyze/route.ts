export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { AnalysisResult, DetectedIssue } from '@/types/analysis';

// In a real implementation, we would use the Google Vertex AI API client
// and authenticate using the Google Auth Library
export async function POST(request: Request) {
  try {
    const { articleText } = await request.json();

    if (!articleText || articleText.trim().length < 10) {
      return NextResponse.json(
        { error: 'Please provide a valid article text with at least 10 characters.' },
        { status: 400 }
      );
    }

    // Simulate API processing time
    await new Promise(resolve => setTimeout(resolve, 1500));

    // This is a mock response - in a real implementation, this would come from Vertex AI
    // based on the prompt engineering done with Claude
    const mockResult: AnalysisResult = generateMockAnalysisResult(articleText);

    // If we had fact check API integrated, we would call it here and add results to the response
    mockResult.factChecks = generateMockFactChecks(articleText);

    return NextResponse.json(mockResult);
  } catch (error) {
    console.error('Error in analyze API:', error);
    return NextResponse.json(
      { error: 'Failed to analyze the article' },
      { status: 500 }
    );
  }
}

// This function simulates what Vertex AI would return
// In a real implementation, this would be replaced with actual API calls
function generateMockAnalysisResult(text: string): AnalysisResult {
  // Determine mock credibility based on text length and characteristics
  const wordCount = text.split(/\s+/).length;
  const hasExclamationMarks = (text.match(/!/g) || []).length > wordCount * 0.05;
  const hasAllCaps = (text.match(/\b[A-Z]{2,}\b/g) || []).length > wordCount * 0.02;
  const hasSensationalWords = /shocking|unbelievable|incredible|jaw-dropping|mind-blowing/i.test(text);

  let credibilityScore = 75; // Start with a default score
  let tone = "neutral" as const;
  let detectedIssues: Array<DetectedIssue> = [];

  // Adjust score based on text characteristics
  if (hasExclamationMarks) {
    credibilityScore -= 15;
    detectedIssues.push({
      type: "emotional_manipulation",
      description: "Excessive use of exclamation marks to evoke emotional responses",
      severity: "medium",
      examples: text.match(/[^.!?]*![^.!?]*!/g) || [],
    });
    tone = "sensational";
  }

  if (hasAllCaps) {
    credibilityScore -= 10;
    detectedIssues.push({
      type: "sensationalism",
      description: "Use of all-caps words for emphasis, common in sensationalist writing",
      severity: "medium",
      examples: (text.match(/\b[A-Z]{2,}\b/g) || []).slice(0, 3),
    });
    tone = tone === "neutral" ? "biased" : "sensational";
  }

  if (hasSensationalWords) {
    credibilityScore -= 20;
    detectedIssues.push({
      type: "sensational_language",
      description: "Use of hyperbolic or sensational language that may exaggerate facts",
      severity: "high",
      examples: (text.match(/\b(shocking|unbelievable|incredible|jaw-dropping|mind-blowing)\b/gi) || []).slice(0, 3),
    });
    tone = "sensational";
  }

  // Add some random issues if text is long enough and score is below threshold
  if (wordCount > 100 && credibilityScore < 80) {
    const possibleIssues = [
      {
        type: "logical_fallacy",
        description: "Appeal to fear without substantial evidence",
        severity: "high" as const,
        examples: ["This paragraph contains threatening language without providing evidence."],
      },
      {
        type: "bias",
        description: "Article presents only one side of the issue",
        severity: "medium" as const,
        examples: ["The article doesn't mention alternative viewpoints or counter-arguments."],
      },
      {
        type: "missing_context",
        description: "Critical context or background information is omitted",
        severity: "low" as const,
        examples: ["Important historical context is missing from this explanation."],
      },
    ];

    // Add 1-2 random issues
    const randomIssuesCount = Math.floor(Math.random() * 2) + 1;
    for (let i = 0; i < randomIssuesCount; i++) {
      const randomIndex = Math.floor(Math.random() * possibleIssues.length);
      detectedIssues.push(possibleIssues[randomIndex]);
      credibilityScore -= 5; // Further reduce score
    }
  }

  // Generate analysis summary
  let analysisSummary = "The article appears to be ";
  if (credibilityScore >= 80) {
    analysisSummary += "generally credible with a neutral tone and well-presented information.";
  } else if (credibilityScore >= 60) {
    analysisSummary += "somewhat credible but contains potentially misleading elements or bias.";
  } else if (credibilityScore >= 40) {
    analysisSummary += "potentially misleading with significant issues in presentation and factual accuracy.";
  } else {
    analysisSummary += "highly questionable with multiple red flags indicating potential fake news.";
  }

  // Ensure score is within 0-100 range
  credibilityScore = Math.max(0, Math.min(100, credibilityScore));

  return {
    tone,
    credibilityScore,
    analysisSummary,
    detectedIssues,
  };
}

function generateMockFactChecks(text: string): FactCheckResult[] {
  // In a real implementation, this would call the Google Fact Check Tools API
  
  // For demo purposes, generate some mock fact checks if the text is long enough
  if (text.length < 100) return [];

  // Extract a few "claims" from the text for fact checking
  // This is a naive implementation - in reality we would use AI to identify claims
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
  const potentialClaims = sentences.filter(s => s.length > 30 && s.length < 150);
  
  if (potentialClaims.length === 0) return [];
  
  // Take 1-3 random sentences as "claims"
  const claimCount = Math.min(Math.floor(Math.random() * 3) + 1, potentialClaims.length);
  const selectedClaims: FactCheckResult[] = [];
  
  for (let i = 0; i < claimCount; i++) {
    const randomIndex = Math.floor(Math.random() * potentialClaims.length);
    const claim = potentialClaims[randomIndex].trim();
    potentialClaims.splice(randomIndex, 1); // Remove to avoid duplicates
    
    // Generate a fake fact check result
    const ratingOptions = ["True", "Partly True", "Misleading", "False", "Unverified"];
    const randomRating = ratingOptions[Math.floor(Math.random() * ratingOptions.length)];
    
    const sourceOptions = [
      { name: "FactCheck.org", url: "https://www.factcheck.org" },
      { name: "PolitiFact", url: "https://www.politifact.com" },
      { name: "Snopes", url: "https://www.snopes.com" },
      { name: "Reuters Fact Check", url: "https://www.reuters.com/fact-check" },
      { name: "AP Fact Check", url: "https://apnews.com/hub/ap-fact-check" }
    ];
    
    const randomSource = sourceOptions[Math.floor(Math.random() * sourceOptions.length)];
    
    selectedClaims.push({
      claim,
      claimant: "Article Author",
      rating: randomRating,
      source: randomSource.name,
      url: randomSource.url
    });
  }
  
  return selectedClaims;
}