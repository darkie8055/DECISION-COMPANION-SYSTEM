'use client';

import { useState } from 'react';
import { TemplatesSelector } from '@/components/templates-selector';
import { DecisionForm } from '@/components/decision-form';
import { ScoringMatrix } from '@/components/scoring-matrix';
import { AnalysisResults } from '@/components/analysis-results';
import { SensitivityAnalysis } from '@/components/sensitivity-analysis';
import { Button } from '@/components/ui/button';
import type { Decision, Score, AnalysisResult } from '@/lib/decision-engine';
import { ChevronLeft } from 'lucide-react';

type Step = 'templates' | 'setup' | 'scoring' | 'results' | 'sensitivity';

export default function Home() {
  const [step, setStep] = useState<Step>('templates');
  const [decision, setDecision] = useState<Decision | null>(null);

  const handleSelectTemplate = (template: Decision) => {
    setDecision(template);
    setStep('scoring');
  };

  const handleCreateCustom = () => {
    setDecision(null);
    setStep('setup');
  };

  const handleDecisionCreate = (newDecision: Decision) => {
    setDecision(newDecision);
    setStep('scoring');
  };

  const handleScoresChange = (scores: Score[]) => {
    if (decision) {
      setDecision({ ...decision, scores });
    }
  };

  const handleAnalyze = () => {
    setStep('results');
  };

  const handleExport = (decision: Decision, results: AnalysisResult[]) => {
    const reportContent = generateReport(decision, results);
    downloadReport(reportContent, decision.name);
  };

  const handleGoBack = () => {
    switch (step) {
      case 'setup':
        setStep('templates');
        setDecision(null);
        break;
      case 'scoring':
        setDecision(null);
        setStep('templates');
        break;
      case 'results':
        setStep('scoring');
        break;
      case 'sensitivity':
        setStep('results');
        break;
      default:
        break;
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        {/* Header with navigation */}
        {step !== 'templates' && (
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="outline"
              size="sm"
              onClick={handleGoBack}
              className="gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </Button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold">
                {step === 'setup' && 'Create Decision'}
                {step === 'scoring' && 'Score Options'}
                {step === 'results' && 'Analysis Results'}
                {step === 'sensitivity' && 'Sensitivity Analysis'}
              </h1>
            </div>
          </div>
        )}

        {/* Main content */}
        <div className="space-y-8">
          {step === 'templates' && (
            <TemplatesSelector
              onSelectTemplate={handleSelectTemplate}
              onCreateCustom={handleCreateCustom}
            />
          )}

          {step === 'setup' && (
            <DecisionForm onDecisionCreate={handleDecisionCreate} />
          )}

          {step === 'scoring' && decision && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-card p-6 rounded-lg border">
                <h2 className="text-xl font-semibold mb-2">{decision.name}</h2>
                {decision.description && (
                  <p className="text-muted-foreground">{decision.description}</p>
                )}
              </div>
              <ScoringMatrix
                decision={decision}
                onScoresChange={handleScoresChange}
                onAnalyze={handleAnalyze}
              />
            </div>
          )}

          {step === 'results' && decision && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-card p-6 rounded-lg border">
                <h2 className="text-xl font-semibold mb-2">{decision.name}</h2>
                {decision.description && (
                  <p className="text-muted-foreground">{decision.description}</p>
                )}
              </div>
              <AnalysisResults
                decision={decision}
                onExport={handleExport}
                onSensitivityAnalysis={() => setStep('sensitivity')}
              />
            </div>
          )}

          {step === 'sensitivity' && decision && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-card p-6 rounded-lg border">
                <h2 className="text-xl font-semibold mb-2">{decision.name}</h2>
                {decision.description && (
                  <p className="text-muted-foreground">{decision.description}</p>
                )}
              </div>
              <SensitivityAnalysis decision={decision} />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

function generateReport(decision: Decision, results: AnalysisResult[]): string {
  const timestamp = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  let report = `DECISION ANALYSIS REPORT
========================\n`;
  report += `Generated: ${timestamp}\n`;
  report += `Decision: ${decision.name}\n`;
  if (decision.description) {
    report += `Description: ${decision.description}\n`;
  }

  report += `\nCRITERIA & WEIGHTS\n`;
  report += `------------------\n`;
  decision.criteria.forEach((criterion) => {
    report += `• ${criterion.name}: ${criterion.weight}%\n`;
  });

  report += `\nOPTIONS EVALUATED\n`;
  report += `------------------\n`;
  decision.options.forEach((option) => {
    report += `• ${option.name}\n`;
  });

  report += `\nSCORING MATRIX\n`;
  report += `------------------\n`;
  report += `Option`;
  decision.criteria.forEach((c) => {
    report += `\t${c.name}`;
  });
  report += `\tTotal\n`;

  results.forEach((result) => {
    report += `${result.optionName}`;
    result.scores.forEach((score) => {
      report += `\t${score.score}`;
    });
    report += `\t${result.totalScore.toFixed(2)}\n`;
  });

  report += `\nRANKINGS\n`;
  report += `------------------\n`;
  results.forEach((result) => {
    report += `${result.rank}. ${result.optionName} - ${result.totalScore.toFixed(2)}/10 (${result.percentage.toFixed(1)}%)\n`;
  });

  report += `\nRECOMMENDATION\n`;
  report += `------------------\n`;
  report += `Based on the weighted scoring analysis, "${results[0].optionName}" is the recommended choice with a score of ${results[0].totalScore.toFixed(2)}/10.\n`;

  return report;
}

function downloadReport(content: string, decisionName: string) {
  const element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
  element.setAttribute('download', `decision-report-${decisionName.toLowerCase().replace(/\s+/g, '-')}.txt`);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}
