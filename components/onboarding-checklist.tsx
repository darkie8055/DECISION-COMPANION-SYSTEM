'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, Circle, ChevronRight, X, Lightbulb } from 'lucide-react';

interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  completed: boolean;
  step: 'templates' | 'customize' | 'setup' | 'scoring' | 'results';
}

interface OnboardingChecklistProps {
  currentStep: string;
  completedSteps: string[];
  onDismiss?: () => void;
}

const CHECKLIST_ITEMS: ChecklistItem[] = [
  {
    id: 'choose-template',
    title: 'Choose Your Starting Point',
    description: 'Select a template or create a custom decision',
    icon: '🚀',
    completed: false,
    step: 'templates'
  },
  {
    id: 'define-criteria',
    title: 'Define Your Criteria',
    description: 'List what factors matter for your decision (3-7 criteria)',
    icon: '📋',
    completed: false,
    step: 'setup'
  },
  {
    id: 'set-weights',
    title: 'Set Importance Weights',
    description: 'Assign percentages to show how much each criterion matters',
    icon: '⚖️',
    completed: false,
    step: 'setup'
  },
  {
    id: 'add-options',
    title: 'Add Your Options',
    description: 'List the choices you want to compare',
    icon: '📌',
    completed: false,
    step: 'scoring'
  },
  {
    id: 'score-options',
    title: 'Score Your Options',
    description: 'Rate each option on each criterion (0-10)',
    icon: '⭐',
    completed: false,
    step: 'scoring'
  },
  {
    id: 'analyze-results',
    title: 'Analyze Results',
    description: 'Review weighted scores and insights',
    icon: '📊',
    completed: false,
    step: 'results'
  },
  {
    id: 'review-risk',
    title: 'Review Risk Assessment',
    description: 'Check for potential problems with each option',
    icon: '⚠️',
    completed: false,
    step: 'results'
  },
  {
    id: 'save-decision',
    title: 'Save Your Decision',
    description: 'Keep it for future reference and updates',
    icon: '💾',
    completed: false,
    step: 'results'
  }
];

export function OnboardingChecklist({ currentStep, completedSteps, onDismiss }: OnboardingChecklistProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed || !isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className="fixed top-20 right-4 z-20 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 shadow-lg transition-all hover:shadow-xl animate-fade-in"
        title="Open checklist"
      >
        <Lightbulb className="w-5 h-5" />
      </button>
    );
  }

  // Update checklist items with actual completion status
  const items = CHECKLIST_ITEMS.map(item => ({
    ...item,
    completed: completedSteps.includes(item.id)
  }));

  const completedCount = items.filter(i => i.completed).length;
  const progress = (completedCount / items.length) * 100;
  const currentItemIndex = items.findIndex(i => i.step === currentStep);
  const currentItem = items[currentItemIndex];

  return (
    <div className="fixed top-20 right-4 z-20 w-96 max-h-96 animate-slide-in-right">
      <Card className="bg-gradient-to-br from-white to-blue-50 dark:from-gray-900 dark:to-gray-800 border-2 border-blue-200 dark:border-blue-800 shadow-2xl flex flex-col max-h-full overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-4 flex items-center justify-between flex-shrink-0">
          <div>
            <h3 className="font-bold flex items-center gap-2">
              <span>🎯</span>
              Your Decision Journey
            </h3>
            <div className="text-xs opacity-90 mt-1">{completedCount} of {items.length} steps completed</div>
          </div>
          <button
            onClick={() => {
              setIsDismissed(true);
              onDismiss?.();
            }}
            className="hover:bg-white/20 p-1 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Progress bar */}
        <div className="px-4 py-3 flex-shrink-0 bg-white/50 dark:bg-gray-800/50">
          <Progress value={progress} className="h-2" />
          <div className="text-xs text-muted-foreground mt-1 text-center">
            {Math.round(progress)}% Complete
          </div>
        </div>

        {/* Checklist items */}
        <div className="overflow-y-auto flex-1 px-3 py-2 space-y-2">
          {items.map((item, index) => {
            const isCurrent = index === currentItemIndex;
            const isUpcoming = index > currentItemIndex;

            return (
              <div
                key={item.id}
                className={`p-3 rounded-lg transition-all ${
                  item.completed
                    ? 'bg-green-50 dark:bg-green-900/20 border border-green-300 dark:border-green-700'
                    : isCurrent
                    ? 'bg-blue-100 dark:bg-blue-900/30 border-2 border-blue-500 shadow-md animate-pulse'
                    : isUpcoming
                    ? 'bg-gray-100 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700 opacity-60'
                    : 'bg-white/70 dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700'
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Checkbox */}
                  <div className="flex-shrink-0 mt-0.5">
                    {item.completed ? (
                      <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center text-white">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                    ) : isCurrent ? (
                      <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                        {index + 1}
                      </div>
                    ) : (
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                        isUpcoming 
                          ? 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                      }`}>
                        {index + 1}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{item.icon}</span>
                      <h4 className={`font-semibold text-sm ${
                        item.completed ? 'text-green-700 dark:text-green-300' : 'text-foreground'
                      }`}>
                        {item.title}
                      </h4>
                    </div>
                    <p className={`text-xs mt-1 ${
                      item.completed 
                        ? 'text-green-600 dark:text-green-400' 
                        : 'text-foreground/60'
                    }`}>
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Current step hint */}
        {currentItem && !currentItem.completed && (
          <div className="px-4 py-3 bg-blue-50 dark:bg-blue-900/20 border-t border-blue-200 dark:border-blue-800 flex-shrink-0">
            <div className="flex items-start gap-2">
              <ChevronRight className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-blue-700 dark:text-blue-300">
                <div className="font-semibold">You're here!</div>
                <div className="mt-1">{currentItem.description}</div>
              </div>
            </div>
          </div>
        )}

        {/* Completion celebration */}
        {completedCount === items.length && (
          <div className="px-4 py-3 bg-green-50 dark:bg-green-900/20 border-t border-green-200 dark:border-green-800 flex-shrink-0">
            <div className="text-center">
              <div className="text-2xl mb-1">🎉</div>
              <div className="font-bold text-green-700 dark:text-green-300">Amazing!</div>
              <div className="text-xs text-green-600 dark:text-green-400 mt-1">
                You've completed your first decision analysis!
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

// Simplified progress badge for header
interface ProgressBadgeProps {
  current: number;
  total: number;
  label?: string;
}

export function ProgressBadge({ current, total, label = 'Progress' }: ProgressBadgeProps) {
  const percentage = Math.round((current / total) * 100);

  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700 rounded-full">
      <div className="relative w-4 h-4">
        <svg className="absolute inset-0" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" className="stroke-current text-blue-300 dark:text-blue-700" strokeWidth="2" />
          <circle
            cx="12"
            cy="12"
            r="10"
            className="stroke-current text-blue-600 dark:text-blue-400 transition-all"
            strokeWidth="2"
            strokeDasharray={`${percentage * 0.628} 62.8`}
            strokeLinecap="round"
            style={{
              transform: 'rotate(-90deg)',
              transformOrigin: 'center'
            }}
          />
        </svg>
      </div>
      <span className="text-xs font-semibold text-blue-700 dark:text-blue-300">
        {percentage}%
      </span>
    </div>
  );
}
