'use client';

import { useState, useEffect } from 'react';
import { TemplatesSelector } from '@/components/templates-selector';
import { TemplateCustomizer } from '@/components/template-customizer';
import { DecisionForm } from '@/components/decision-form';
import { ScoringMatrix } from '@/components/scoring-matrix-improved';
import { AnalysisResults } from '@/components/analysis-results';
import { SensitivityAnalysis } from '@/components/sensitivity-analysis';
import { DecisionHistory } from '@/components/decision-history';
import { RiskAssessment } from '@/components/risk-assessment';
import { InteractiveTutorial } from '@/components/interactive-tutorial';
import { VideoTutorial } from '@/components/video-tutorial';
import { DecisionComparison } from '@/components/decision-comparison';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ThemeToggle } from '@/components/theme-toggle';
import { storageManager } from '@/lib/storage';
import type { Decision, Score, AnalysisResult } from '@/lib/decision-engine';
import { ChevronLeft, Home as HomeIcon, History, Activity, Share2, BarChart3, AlertTriangle, Check, Loader2, Layers, Trash2, PlayCircle } from 'lucide-react';

type Step = 'templates' | 'customize' | 'setup' | 'scoring' | 'results' | 'sensitivity' | 'risk' | 'history';

export default function Home() {
  const [step, setStep] = useState<Step>('templates');
  const [decision, setDecision] = useState<Decision | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<Decision | null>(null);
  const [decisionHistory, setDecisionHistory] = useState<Decision[]>([]);
  const [activeTab, setActiveTab] = useState<'analysis' | 'risk' | 'history' | 'comparison'>('analysis');
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [showVideoTutorial, setShowVideoTutorial] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [shareStatus, setShareStatus] = useState<'idle' | 'sharing' | 'shared'>('idle');
  const [previousStep, setPreviousStep] = useState<Step | null>(null);

  // Load decision history from storage manager on mount
  useEffect(() => {
    try {
      // Try to load from new storage manager first
      let decisions = storageManager.loadDecisions();
      
      // If no decisions found, try to migrate from old localStorage format
      if (decisions.length === 0) {
        const oldDecisions = localStorage.getItem('decisionHistory');
        if (oldDecisions) {
          try {
            const parsed = JSON.parse(oldDecisions);
            const migrated = parsed.map((d: any) => ({
              ...d,
              createdAt: new Date(d.createdAt),
              updatedAt: d.updatedAt ? new Date(d.updatedAt) : new Date(d.createdAt),
              savedAt: d.savedAt ? new Date(d.savedAt) : undefined,
            }));
            
            // Save migrated decisions to new storage
            migrated.forEach((decision: Decision) => {
              storageManager.saveDecision(decision);
            });
            
            // Remove old storage after successful migration
            localStorage.removeItem('decisionHistory');
            decisions = migrated;
            console.log(`Migrated ${migrated.length} decisions from old storage format`);
          } catch (migrationError) {
            console.warn('Failed to migrate old decisions:', migrationError);
          }
        }
      }
      
      setDecisionHistory(decisions);
    } catch (error) {
      console.error('Failed to load decision history:', error);
    }
  }, []);

  // Note: Decisions are now saved individually through storage manager
  // No need for bulk sync as each decision is saved when created/updated

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
      const updatedDecision = { ...decision, scores, updatedAt: new Date() };
      setDecision(updatedDecision);
      
      // If this is a saved decision, update it in storage and state
      const savedDecisionIndex = decisionHistory.findIndex(d => d.id === decision.id);
      if (savedDecisionIndex !== -1) {
        // Update in storage
        storageManager.saveDecision(updatedDecision);
        
        // Update in local state
        const updatedHistory = [...decisionHistory];
        updatedHistory[savedDecisionIndex] = updatedDecision;
        setDecisionHistory(updatedHistory);
      }
    }
  };

  const handleAnalyze = () => {
    setStep('results');
  };

  const handleSaveDecision = async () => {
    if (decision) {
      // Check if current decision (by original ID) is already saved
      const isAlreadySaved = decisionHistory.some(d => d.id.startsWith(decision.id.split('-saved-')[0]));
      
      if (!isAlreadySaved) {
        setSaveStatus('saving');
        
        // Simulate save operation
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Create a unique saved version with timestamp
        const now = new Date();
        const savedDecision = {
          ...decision,
          id: `${decision.id}-saved-${Date.now()}`, // Unique ID for saved version
          createdAt: now,
          updatedAt: now,
          savedAt: now,
          displayName: `${decision.name} (${now.toLocaleDateString()} ${now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})})`,
        };
        
        // Save to storage manager
        const success = storageManager.saveDecision(savedDecision);
        if (success) {
          // Update local state
          const updatedHistory = [...decisionHistory, savedDecision];
          setDecisionHistory(updatedHistory);
          setSaveStatus('saved');
        } else {
          setSaveStatus('idle');
          console.error('Failed to save decision');
          return;
        }
        
        // Reset status after 2 seconds
        setTimeout(() => setSaveStatus('idle'), 2000);
      }
    }
  };

  const handleShareDecision = async () => {
    if (!decision) return;
    
    setShareStatus('sharing');
    
    try {
      const shareData = {
        title: `Decision Analysis: ${decision.name}`,
        text: `Check out my decision analysis for "${decision.name}"`,
        url: window.location.href,
      };

      if (navigator.share && navigator.canShare?.(shareData)) {
        await navigator.share(shareData);
      } else {
        // Fallback to clipboard
        const shareText = `Decision Analysis: ${decision.name}\n\n${decision.description || 'No description'}\n\nCriteria: ${decision.criteria.map(c => `${c.name} (${c.weight}%)`).join(', ')}\n\nOptions: ${decision.options.map(o => o.name).join(', ')}\n\nShared from Decision Companion`;
        await navigator.clipboard.writeText(shareText);
      }
      
      setShareStatus('shared');
    } catch (error) {
      console.error('Error sharing:', error);
      setShareStatus('idle');
    }
    
    // Reset status after 2 seconds
    setTimeout(() => setShareStatus('idle'), 2000);
  };

  const getSaveButtonContent = () => {
    switch (saveStatus) {
      case 'saving':
        return (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Saving...
          </>
        );
      case 'saved':
        return (
          <>
            <Check className="w-4 h-4" />
            Saved!
          </>
        );
      default:
        return 'Save Decision';
    }
  };

  const getShareButtonContent = () => {
    switch (shareStatus) {
      case 'sharing':
        return (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Sharing...
          </>
        );
      case 'shared':
        return (
          <>
            <Check className="w-4 h-4" />
            Shared!
          </>
        );
      default:
        return (
          <>
            <Share2 className="w-4 h-4" />
            Share
          </>
        );
    }
  };

  const handleLoadDecision = (savedDecision: Decision) => {
    setDecision(savedDecision);
    setStep('scoring');
  };

  const handleDeleteDecision = (decisionId: string) => {
    try {
      storageManager.deleteDecision(decisionId);
      const updatedDecisions = decisionHistory.filter(d => d.id !== decisionId);
      setDecisionHistory(updatedDecisions);
      
      // If the deleted decision is the current one, clear it
      if (decision?.id === decisionId) {
        setDecision(null);
        setStep('templates');
      }
    } catch (error) {
      console.error('Failed to delete decision:', error);
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
        // Go back to the previous step before coming to history
        if (previousStep && decision) {
          setStep(previousStep);
          setPreviousStep(null);
          // If coming back from history to results, make sure we're on analysis tab
          if (previousStep === 'results') {
            setActiveTab('analysis');
          }
        } else {
          // Fallback to templates if no previous step or decision
          setStep('templates');
          setDecision(null);
        }
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
        {/* Interactive Tutorial */}
        {showOnboarding && (
          <InteractiveTutorial
            onComplete={handleCompleteOnboarding}
            onSkip={handleSkipOnboarding}
          />
        )}

        {/* Video Tutorial */}
        {showVideoTutorial && (
          <VideoTutorial onClose={() => setShowVideoTutorial(false)} />
        )}

        {/* Global Header Navigation */}
        {step !== 'templates' && step !== 'customize' && (
          <div className="mb-8">
            <div className="glass-card p-4 rounded-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button
                    onClick={handleGoBack}
                    variant="outline"
                    size="sm"
                    className="gap-2"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Back
                  </Button>
                  <Button
                    onClick={() => setStep('templates')}
                    variant="outline"
                    size="sm"
                    className="gap-2"
                  >
                    <HomeIcon className="w-4 h-4" />
                    Home
                  </Button>
                  <ThemeToggle />
                </div>
                
                {decision && step === 'results' && (
                  <div className="flex items-center gap-3">
                    <Button
                      onClick={handleSaveDecision}
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      disabled={
                        saveStatus !== 'idle' || 
                        !decision ||
                        decisionHistory.some(d => d.id.startsWith(decision.id.split('-saved-')[0]))
                      }
                    >
                      {getSaveButtonContent()}
                    </Button>
                    <Button
                      onClick={handleShareDecision}
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      disabled={shareStatus !== 'idle'}
                    >
                      {getShareButtonContent()}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Templates Header */}
        {step === 'templates' && (
          <div className="mb-8">
            <div className="flex items-center gap-4">
              
            </div>
          </div>
        )}

        {/* Home Header */}
        {step === 'templates' && (
          <div className="mb-12 text-center">
            <div className="absolute top-8 right-8 flex gap-2">
              <Button
                onClick={() => setShowVideoTutorial(true)}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <PlayCircle className="w-4 h-4" />
                Watch Tutorial
              </Button>
              <ThemeToggle />
            </div>
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
              decisionHistory={decisionHistory}
              onLoadDecision={handleLoadDecision}
              onDeleteDecision={handleDeleteDecision}
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
                  <TabsList className="grid w-full grid-cols-4 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
                    <TabsTrigger value="analysis" className="gap-2 data-[state=active]:bg-white/80 dark:data-[state=active]:bg-gray-800/80">
                      <BarChart3 className="w-4 h-4" />
                      Analysis
                    </TabsTrigger>
                    <TabsTrigger value="risk" className="gap-2 data-[state=active]:bg-white/80 dark:data-[state=active]:bg-gray-800/80">
                      <AlertTriangle className="w-4 h-4" />
                      Risk
                    </TabsTrigger>
                    <TabsTrigger value="history" className="gap-2 data-[state=active]:bg-white/80 dark:data-[state=active]:bg-gray-800/80">
                      <History className="w-4 h-4" />
                      Sensitivity
                    </TabsTrigger>
                    <TabsTrigger value="comparison" className="gap-2 data-[state=active]:bg-white/80 dark:data-[state=active]:bg-gray-800/80">
                      <Layers className="w-4 h-4" />
                      Compare
                    </TabsTrigger>
                  </TabsList>

                  <div className="p-6">
                    <TabsContent value="analysis" className="space-y-4">
                      <AnalysisResults
                        decision={decision}
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

                    <TabsContent value="comparison" className="space-y-4">
                      <DecisionComparison 
                        decisions={decisionHistory}
                        selectedDecisions={[decision.id]}
                      />
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
                onDeleteDecision={handleDeleteDecision}
              />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
