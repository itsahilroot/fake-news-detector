export interface FactCheckResult {
  claim: string;
  claimant?: string;
  rating?: string;
  source: string;
  url: string;
}

export interface DetectedIssue {
  type: string; // e.g., "bias", "logical_fallacy", "emotional_manipulation"
  description: string;
  severity: "low" | "medium" | "high";
  examples: string[];
}

export interface AnalysisResult {
  tone: "neutral" | "biased" | "sensational" | "objective" | "misleading";
  credibilityScore: number; // 0-100
  analysisSummary: string;
  detectedIssues: DetectedIssue[];
  factChecks?: FactCheckResult[];
}