'use client';

import { useState } from 'react';
import { TemplatesSelector } from '@/components/templates-selector';
import { DecisionForm } from '@/components/decision-form';
import { ScoringMatrix } from '@/components/scoring-matrix';
import { AnalysisResults } from '@/components/analysis-results';
import { SensitivityAnalysis } from '@/components/sensitivity-analysis';
import { DecisionHistory } from '@/components/decision-history';
import { RiskAssessment } from '@/components/risk-assessment';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { Decision, Score, AnalysisResult } from '@/lib/decision-engine';
import { ChevronLeft, Home as HomeIcon, History, Activity, Share2, BarChart3, AlertTriangle } from 'lucide-react';
import { generateDetailedReport, downloadFile } from '@/lib/export-utils';

type Step = 'templates' | 'setup' | 'scoring' | 'results' | 'sensitivity' | 'risk' | 'history';

export default function Home() {
  const [step, setStep] = useState<Step>('templates');
  const [decision, setDecision] = useState<Decision | null>(null);
  const [decisionHistory, setDecisionHistory] = useState<Decision[]>([]);
  const [activeTab, setActiveTab] = useState<'analysis' | 'risk' | 'history'>('analysis');

  const handleSelectTemplate = (template: Decision) => {
    const newDecision = { ...template, id: Date.now().toString() };
    setDecision(newDecision);
    setStep('scoring');
  };

  const handleCreateCustom = () => {
    setDecision(null);
    setStep('setup');
  };

  const handleDecisionCreate = (newDecision: Decision) => {
    const enhancedDecision = {
      ...newDecision,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setDecision(enhancedDecision);
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
    const reportContent = generateDetailedReport(decision, results);
    const filename = `decision-report-${decision.name.toLowerCase().replace(/\s+/g, '-')}-${new Date().getTime()}.txt`;
    downloadFile(reportContent, filename, 'text/plain');
  };

  const handleSaveDecision = () => {
    if (decision && !decisionHistory.some(d => d.id === decision.id)) {
      setDecisionHistory([...decisionHistory, decision]);
    }
  };

  const handleLoadDecision = (savedDecision: Decision) => {
    setDecision(savedDecision);
    setStep('scoring');
  };

  const handleCompareDecisions = () => {
    if (decisionHistory.length > 0) {
      setStep('history');
    }
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
        setActiveTab('analysis');
        setStep('scoring');
        break;
      case 'sensitivity':
      case 'risk':
        setActiveTab('analysis');
        setStep('results');
        break;
      case 'history':
        setStep('templates');
        setDecision(null);
        break;
      default:
        break;
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-secondary/5 to-background">
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-10">
        {/* Header Navigation */}
        {step !== 'templates' && step !== 'history' && (
          <div className="flex items-center justify-between mb-8 pb-6 border-b">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleGoBack}
                className="gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </Button>
              <div className="h-6 w-px bg-border" />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setStep('templates');
                  setDecision(null);
                }}
                className="gap-2"
              >
                <HomeIcon className="w-4 h-4" />
                Home
              </Button>
            </div>
            <div className="flex items-center gap-2">
              {decision && step === 'results' && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSaveDecision}
                    className="gap-2"
                  >
                    <History className="w-4 h-4" />
                    Save
                  </Button>
                  {decisionHistory.length > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCompareDecisions}
                      className="gap-2"
                    >
                      <BarChart3 className="w-4 h-4" />
                      Compare
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                  >
                    <Share2 className="w-4 h-4" />
                    Share
                  </Button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Home Header */}
        {step === 'templates' && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-2">
                  Decision Companion
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl">
                  Make smarter decisions with weighted scoring, visual analysis, and AI-powered insights. Compare options objectively and explore trade-offs.
                </p>
              </div>
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
              <div className="bg-gradient-to-br from-primary/5 to-primary/2 p-6 rounded-lg border border-primary/10">
                <h2 className="text-2xl font-bold mb-2">{decision.name}</h2>
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
              <div className="bg-gradient-to-br from-primary/5 to-primary/2 p-6 rounded-lg border border-primary/10">
                <h2 className="text-2xl font-bold mb-2">{decision.name}</h2>
                {decision.description && (
                  <p className="text-muted-foreground">{decision.description}</p>
                )}
              </div>
              
              <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="analysis" className="gap-2">
                    <BarChart3 className="w-4 h-4" />
                    Analysis
                  </TabsTrigger>
                  <TabsTrigger value="risk" className="gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    Risk Assessment
                  </TabsTrigger>
                  <TabsTrigger value="history" className="gap-2">
                    <History className="w-4 h-4" />
                    Sensitivity
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="analysis" className="space-y-4">
                  <AnalysisResults
                    decision={decision}
                    onExport={handleExport}
                    onSensitivityAnalysis={() => {
                      setActiveTab('history');
                    }}
                  />
                </TabsContent>

                <TabsContent value="risk" className="space-y-4">
                  <RiskAssessment decision={decision} />
                </TabsContent>

                <TabsContent value="history" className="space-y-4">
                  <SensitivityAnalysis decision={decision} />
                </TabsContent>
              </Tabs>
            </div>
          )}

          {step === 'history' && decisionHistory.length > 0 && (
            <div className="space-y-6">
              <DecisionHistory
                decisions={decisionHistory}
                onSelectDecision={handleLoadDecision}
              />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

// Export is now handled by handleExport which uses the utility functions
