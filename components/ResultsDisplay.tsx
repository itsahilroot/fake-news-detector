'use client';

import { useState } from 'react';
import { AnalysisResult, DetectedIssue, FactCheckResult } from '@/types/analysis';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, Info, XCircle } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { cn } from '@/lib/utils';

interface ResultsDisplayProps {
  results: AnalysisResult;
}

export default function ResultsDisplay({ results }: ResultsDisplayProps) {
  const [activeTab, setActiveTab] = useState('summary');

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    if (score >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getToneIcon = (tone: string) => {
    switch (tone) {
      case 'neutral':
      case 'objective':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'biased':
        return <Info className="h-5 w-5 text-yellow-500" />;
      case 'sensational':
      case 'misleading':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default:
        return <Info className="h-5 w-5" />;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-8 animate-in fade-in-50 duration-500">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            Analysis Results
            <Badge variant={results.credibilityScore >= 70 ? 'default' : 'destructive'} className="ml-2">
              {results.credibilityScore >= 70 ? 'Likely Credible' : 'Potentially Misleading'}
            </Badge>
          </CardTitle>
          <CardDescription>
            Our AI has analyzed the article and generated the following assessment.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-medium">Credibility Score</h3>
              <span className="font-bold text-xl">{results.credibilityScore}/100</span>
            </div>
            <Progress 
              value={results.credibilityScore} 
              className={`h-3 ${getScoreColor(results.credibilityScore)}`}
            />
          </div>

          <div className="mb-6 p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-medium">Tone Analysis</h3>
              {getToneIcon(results.tone)}
              <Badge variant="outline" className="capitalize">{results.tone}</Badge>
            </div>
            <p className="text-muted-foreground">{results.analysisSummary}</p>
          </div>

          <Tabs defaultValue="summary" value={activeTab} onValueChange={setActiveTab} className="mt-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="summary">Issues ({results.detectedIssues.length})</TabsTrigger>
              <TabsTrigger value="factChecks">Fact Checks ({results.factChecks?.length || 0})</TabsTrigger>
            </TabsList>
            
            <TabsContent value="summary" className="mt-4">
              <IssuesList issues={results.detectedIssues} />
            </TabsContent>
            
            <TabsContent value="factChecks" className="mt-4">
              {results.factChecks && results.factChecks.length > 0 ? (
                <FactChecksList factChecks={results.factChecks} />
              ) : (
                <div className="p-4 border rounded-lg bg-muted/20 text-center">
                  <p className="text-muted-foreground">No fact checks available for this article.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

function IssuesList({ issues }: { issues: DetectedIssue[] }) {
  if (issues.length === 0) {
    return (
      <div className="p-4 border rounded-lg bg-muted/20 text-center">
        <p className="text-muted-foreground">No issues detected in this article.</p>
      </div>
    );
  }

  return (
    <Accordion type="single" collapsible className="w-full">
      {issues.map((issue, index) => (
        <AccordionItem key={index} value={`item-${index}`}>
          <AccordionTrigger>
            <div className="flex items-center gap-2 text-left">
              <Badge variant="outline" className={cn("capitalize", 
                issue.severity === "high" ? "bg-red-100 text-red-800 border-red-300" :
                issue.severity === "medium" ? "bg-orange-100 text-orange-800 border-orange-300" :
                "bg-yellow-100 text-yellow-800 border-yellow-300"
              )}>
                {issue.severity}
              </Badge>
              <span className="capitalize">{issue.type.replace('_', ' ')}</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="pl-2 border-l-2 border-muted mt-2">
              <p className="mb-2">{issue.description}</p>
              {issue.examples.length > 0 && (
                <div className="mt-2">
                  <h4 className="text-sm font-medium mb-1">Examples:</h4>
                  <ul className="space-y-1">
                    {issue.examples.map((example, i) => (
                      <li key={i} className="text-sm text-muted-foreground pl-2 border-l border-muted">
                        "{example}"
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

function FactChecksList({ factChecks }: { factChecks: FactCheckResult[] }) {
  return (
    <div className="space-y-4">
      {factChecks.map((check, index) => (
        <Card key={index} className="overflow-hidden">
          <CardContent className="p-4">
            <div className="flex flex-col gap-2">
              <p className="font-medium">"{check.claim}"</p>
              {check.claimant && <p className="text-sm text-muted-foreground">Claimed by: {check.claimant}</p>}
              {check.rating && <Badge variant="outline">{check.rating}</Badge>}
              <div className="text-sm mt-2">
                <span className="text-muted-foreground">Source: </span>
                <a href={check.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  {check.source}
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}