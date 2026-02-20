'use client';

import { useState } from 'react';
import { TemplatesSelector } from '@/components/templates-selector';
import { TemplateCustomizer } from '@/components/template-customizer';
import { DecisionForm } from '@/components/decision-form';
import { ScoringMatrix } from '@/components/scoring-matrix-improved';
import { AnalysisResults } from '@/components/analysis-results';
import { SensitivityAnalysis } from '@/components/sensitivity-analysis';
import { DecisionHistory } from '@/components/decision-history';
import { RiskAssessment } from '@/components/risk-assessment';
import { OnboardingTour } from '@/components/onboarding-tour';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { Decision, Score, AnalysisResult } from '@/lib/decision-engine';
import { ChevronLeft, Home as HomeIcon, History, Activity, Share2, BarChart3, AlertTriangle } from 'lucide-react';
import { generateDetailedReport, downloadFile } from '@/lib/export-utils';

type Step = 'templates' | 'customize' | 'setup' | 'scoring' | 'results' | 'sensitivity' | 'risk' | 'history';

export default function Home() {
  const [step, setStep] = useState<Step>('templates');
  const [decision, setDecision] = useState<Decision | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<Decision | null>(null);
  const [decisionHistory, setDecisionHistory] = useState<Decision[]>([]);
  const [activeTab, setActiveTab] = useState<'analysis' | 'risk' | 'history'>('analysis');
  const [showOnboarding, setShowOnboarding] = useState(true);

  const handleSelectTemplate = (template: Decision) => {
    const newDecision = { ...template, id: Date.now().toString() };
    setDecision(newDecision);
    setStep('scoring');
  };

  const handleCustomizeTemplate = (template: Decision) => {
    setSelectedTemplate(template);
    setStep('customize');
  };

  const handleCreateCustom = () => {
    setDecision(null);
    setSelectedTemplate(null);
    setStep('setup');
  };

  const handleConfirmCustomization = (customizedTemplate: Decision) => {
    const newDecision = { ...customizedTemplate, id: Date.now().toString() };
    setDecision(newDecision);
    setSelectedTemplate(null);
    setStep('scoring');
  };

  const handleBackFromCustomize = () => {
    setSelectedTemplate(null);
    setStep('templates');
  };

  const handleCompleteOnboarding = () => {
    setShowOnboarding(false);
  };

  const handleSkipOnboarding = () => {
    setShowOnboarding(false);
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
      case 'customize':
        setStep('templates');
        setSelectedTemplate(null);
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
    <main className="min-h-screen relative overflow-hidden">
      {/* Floating background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-xl animate-float" />
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-cyan-400/20 to-blue-400/20 rounded-full blur-xl animate-float-delayed" />
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-gradient-to-br from-purple-400/15 to-pink-400/15 rounded-full blur-xl animate-float" />
        <div className="absolute bottom-40 right-10 w-28 h-28 bg-gradient-to-br from-green-400/20 to-blue-400/20 rounded-full blur-xl animate-float-delayed" />
        <div className="absolute top-1/3 left-1/2 w-20 h-20 bg-gradient-to-br from-yellow-400/15 to-orange-400/15 rounded-full blur-xl animate-gentle-pulse" />
        
        {/* Geometric patterns */}
        <div className="absolute top-0 left-0 w-full h-full backdrop-elements" />
        
        {/* Floating particles */}
        <div className="absolute top-1/4 right-1/3 w-2 h-2 bg-blue-400/40 rounded-full animate-gentle-pulse" />
        <div className="absolute top-3/4 left-1/5 w-1.5 h-1.5 bg-purple-400/40 rounded-full animate-gentle-pulse" style={{animationDelay: '1s'}} />
        <div className="absolute top-1/2 right-1/4 w-1 h-1 bg-cyan-400/40 rounded-full animate-gentle-pulse" style={{animationDelay: '2s'}} />
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-6 md:py-10">
        {/* Onboarding Tour */}
        {showOnboarding && (
          <OnboardingTour
            onComplete={handleCompleteOnboarding}
            onSkip={handleSkipOnboarding}
          />
        )}
        {/* Header Navigation */}
        {step !== 'templates' && step !== 'history' && (
          <div className="glass-card rounded-2xl p-6 mb-8 hover-lift">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleGoBack}
                  className="gap-2 hover:bg-white/20 dark:hover:bg-gray-800/20"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </Button>
                <div className="h-6 w-px bg-gradient-to-b from-transparent via-border to-transparent" />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setStep('templates');
                    setDecision(null);
                    setSelectedTemplate(null);
                  }}
                  className="gap-2 hover:bg-white/20 dark:hover:bg-gray-800/20"
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
                      className="gap-2 bg-white/10 dark:bg-gray-800/10 border-white/20 dark:border-gray-700/20 hover:bg-white/20 dark:hover:bg-gray-700/20"
                    >
                      <History className="w-4 h-4" />
                      Save
                    </Button>
                    {decisionHistory.length > 0 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCompareDecisions}
                        className="gap-2 bg-white/10 dark:bg-gray-800/10 border-white/20 dark:border-gray-700/20 hover:bg-white/20 dark:hover:bg-gray-700/20"
                      >
                        <BarChart3 className="w-4 h-4" />
                        Compare
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 bg-white/10 dark:bg-gray-800/10 border-white/20 dark:border-gray-700/20 hover:bg-white/20 dark:hover:bg-gray-700/20"
                    >
                      <Share2 className="w-4 h-4" />
                      Share
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Home Header */}
        {step === 'templates' && (
          <div className="mb-12 text-center">
            <div className="relative">
              {/* Background glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-cyan-600/20 blur-3xl rounded-full" />
              
              <div className="relative">
                <h1 className="text-6xl md:text-7xl font-bold mb-4">
                  <span className="gradient-text animate-gradient">
                    Decision Companion
                  </span>
                </h1>
                <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
                  Make smarter decisions with weighted scoring, visual analysis, and AI-powered insights. 
                  <span className="text-primary font-semibold">Compare options objectively</span> and explore trade-offs.
                </p>
                
                {/* Decorative elements */}
                <div className="flex justify-center mt-8 gap-4">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-gentle-pulse" />
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-gentle-pulse" style={{animationDelay: '0.5s'}} />
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-gentle-pulse" style={{animationDelay: '1s'}} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main content */}
        <div className="space-y-8">
          {step === 'templates' && (
            <TemplatesSelector
              onSelectTemplate={handleSelectTemplate}
              onCustomizeTemplate={handleCustomizeTemplate}
              onCreateCustom={handleCreateCustom}
            />
          )}

          {step === 'customize' && selectedTemplate && (
            <TemplateCustomizer
              template={selectedTemplate}
              onConfirm={handleConfirmCustomization}
              onBack={handleBackFromCustomize}
            />
          )}

          {step === 'setup' && (
            <DecisionForm onDecisionCreate={handleDecisionCreate} />
          )}

          {step === 'scoring' && decision && (
            <div className="space-y-6">
              <div className="glass-card p-8 rounded-2xl hover-lift">
                <div className="text-center md:text-left">
                  <h2 className="text-3xl font-bold mb-3 gradient-text">{decision.name}</h2>
                  {decision.description && (
                    <p className="text-muted-foreground text-lg leading-relaxed">{decision.description}</p>
                  )}
                </div>
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
              <div className="glass-card p-8 rounded-2xl hover-lift">
                <div className="text-center md:text-left">
                  <h2 className="text-3xl font-bold mb-3 gradient-text">{decision.name}</h2>
                  {decision.description && (
                    <p className="text-muted-foreground text-lg leading-relaxed">{decision.description}</p>
                  )}
                </div>
              </div>
              
              <div className="glass-card rounded-2xl overflow-hidden">
                <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
                  <TabsList className="grid w-full grid-cols-3 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
                    <TabsTrigger value="analysis" className="gap-2 data-[state=active]:bg-white/80 dark:data-[state=active]:bg-gray-800/80">
                      <BarChart3 className="w-4 h-4" />
                      Analysis
                    </TabsTrigger>
                    <TabsTrigger value="risk" className="gap-2 data-[state=active]:bg-white/80 dark:data-[state=active]:bg-gray-800/80">
                      <AlertTriangle className="w-4 h-4" />
                      Risk Assessment
                    </TabsTrigger>
                    <TabsTrigger value="history" className="gap-2 data-[state=active]:bg-white/80 dark:data-[state=active]:bg-gray-800/80">
                      <History className="w-4 h-4" />
                      Sensitivity
                    </TabsTrigger>
                  </TabsList>

                  <div className="p-6">
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
                  </div>
                </Tabs>
              </div>
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
