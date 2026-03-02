'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, Lightbulb, HelpCircle, X } from 'lucide-react';

interface GuidedWalkthroughProps {
  step: 'templates' | 'setup' | 'scoring' | 'results';
  onDismiss: () => void;
}

const WALKTHROUGHS = {
  templates: {
    title: "🚀 Choose Your Starting Point",
    description: "Pick a template to get started quickly, or create a custom decision from scratch.",
    tips: [
      "Templates save you time by having pre-defined criteria",
      "Each template is customizable for your specific needs",
      "Or click 'Create Custom' to define everything yourself"
    ],
    highlight: "Try selecting a template to begin!"
  },
  setup: {
    title: "📋 Define Your Decision",
    description: "Create a custom decision by naming it and listing your criteria.",
    tips: [
      "Give your decision a clear, descriptive name",
      "Add criteria that matter for this decision",
      "You'll set their importance percentages next"
    ],
    highlight: "Fill in the form and continue to set weights"
  },
  scoring: {
    title: "⚖️ Score Your Options",
    description: "Rate each option against your criteria on a scale of 0-10.",
    tips: [
      "0-3: Doesn't meet the criterion well",
      "4-6: Partially meets the criterion",
      "7-10: Excellently meets the criterion",
      "Be objective and consistent in your scoring"
    ],
    highlight: "Once all scores are entered, click 'Analyze' to see results"
  },
  results: {
    title: "📊 Review Your Analysis",
    description: "See weighted scores, risk assessments, and sensitivity analysis.",
    tips: [
      "Analysis Tab: Shows overall weighted scores",
      "Risk Tab: Identifies potential problems with each option",
      "Sensitivity Tab: Shows how changes affect the outcome",
      "You can save this decision for future reference"
    ],
    highlight: "Try switching between tabs to explore different insights"
  }
};

export function GuidedWalkthrough({ step, onDismiss }: GuidedWalkthroughProps) {
  const [isMinimized, setIsMinimized] = useState(false);
  const walkthrough = WALKTHROUGHS[step];

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-40">
        <button
          onClick={() => setIsMinimized(false)}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 shadow-lg transition-all hover:shadow-xl animate-fade-in"
        >
          <HelpCircle className="w-5 h-5" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-40 max-w-sm animate-slide-in-up">
      <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-blue-200 dark:border-blue-800 shadow-xl">
        <div className="p-4 space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-bold text-foreground flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-yellow-500" />
                {walkthrough.title}
              </h3>
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => setIsMinimized(true)}
                className="p-1 hover:bg-white/50 dark:hover:bg-gray-700/50 rounded transition-colors"
              >
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </button>
              <button
                onClick={onDismiss}
                className="p-1 hover:bg-white/50 dark:hover:bg-gray-700/50 rounded transition-colors"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-foreground/80">
            {walkthrough.description}
          </p>

          {/* Tips */}
          <div className="bg-white/50 dark:bg-gray-800/50 rounded p-3 space-y-2">
            <div className="text-xs font-semibold text-foreground/70 uppercase">Tips</div>
            <ul className="space-y-1.5">
              {walkthrough.tips.map((tip, i) => (
                <li key={i} className="text-xs text-foreground/70 flex gap-2">
                  <span className="text-blue-500 font-bold">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Highlight */}
          <div className="bg-yellow-100/50 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-700 rounded p-2">
            <p className="text-xs font-semibold text-yellow-800 dark:text-yellow-200 flex items-start gap-2">
              <span>✨</span>
              <span>{walkthrough.highlight}</span>
            </p>
          </div>

          {/* Close button */}
          <button
            onClick={onDismiss}
            className="w-full text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors py-1"
          >
            Got it, thanks! →
          </button>
        </div>
      </Card>
    </div>
  );
}

// Floating tooltip for specific elements
interface TooltipGuideProps {
  title: string;
  description: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export function TooltipGuide({ title, description, position = 'top' }: TooltipGuideProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  const positionClasses = {
    top: 'bottom-full mb-2 left-1/2 -translate-x-1/2',
    bottom: 'top-full mt-2 left-1/2 -translate-x-1/2',
    left: 'right-full mr-2 top-1/2 -translate-y-1/2',
    right: 'left-full ml-2 top-1/2 -translate-y-1/2'
  };

  return (
    <div className={`absolute ${positionClasses[position]} bg-gray-900 dark:bg-gray-950 text-white rounded-lg p-2 text-xs max-w-xs z-50 shadow-lg animate-fade-in`}>
      <div className="font-semibold mb-1">{title}</div>
      <div className="text-gray-200">{description}</div>
      <button
        onClick={() => setIsVisible(false)}
        className="absolute top-1 right-1 text-gray-400 hover:text-white"
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  );
}

// Video-like demo component
interface AnimatedDemoProps {
  title: string;
  steps: string[];
  duration?: number;
}

export function AnimatedDemo({ title, steps, duration = 8000 }: AnimatedDemoProps) {
  const [currentStep, setCurrentStep] = useState(0);

  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg p-6 text-white">
      <h3 className="font-bold mb-4 flex items-center gap-2">
        <span className="animate-pulse">●</span>
        {title}
      </h3>
      <div className="bg-black/30 rounded p-4 min-h-32 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-2 animate-fade-in">{steps[currentStep]}</div>
          <div className="text-sm opacity-75">Step {currentStep + 1} of {steps.length}</div>
        </div>
      </div>
      <div className="mt-3 flex gap-1">
        {steps.map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all ${
              i <= currentStep ? 'bg-white' : 'bg-white/30'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
