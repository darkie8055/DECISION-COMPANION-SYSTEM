'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChevronDown, X, HelpCircle, Lightbulb, MoreVertical } from 'lucide-react';

interface HelpSidebarProps {
  step: 'templates' | 'customize' | 'setup' | 'scoring' | 'results' | 'sensitivity' | 'risk' | 'history';
  onOpen?: () => void;
}

const HELP_CONTENT = {
  templates: {
    title: '🚀 Getting Started',
    tips: [
      {
        emoji: '📋',
        title: 'Use a Template',
        description: 'Templates come with pre-built criteria to save you time'
      },
      {
        emoji: '✏️',
        title: 'Create Custom',
        description: 'Define your own decision, criteria, and options from scratch'
      },
      {
        emoji: '🔄',
        title: 'Load Recent',
        description: 'Continue working on decisions you\'ve saved before'
      }
    ],
    videoTip: 'Tip: Watch the "Getting Started" video for a quick overview!'
  },
  customize: {
    title: '⚙️ Customizing Template',
    tips: [
      {
        emoji: '📝',
        title: 'Edit Criteria',
        description: 'Change the criteria to match your specific decision'
      },
      {
        emoji: '➕',
        title: 'Add/Remove Options',
        description: 'Include all the options you want to compare'
      },
      {
        emoji: '💾',
        title: 'Set Weights',
        description: 'Assign importance percentages later in the process'
      }
    ],
    videoTip: 'Want to see an example? Check the tutorial videos!'
  },
  setup: {
    title: '📋 Setting Up Decision',
    tips: [
      {
        emoji: '🎯',
        title: 'Decision Name',
        description: 'Give your decision a clear, descriptive name'
      },
      {
        emoji: '📍',
        title: 'Add Criteria',
        description: 'List all factors that matter for this decision'
      },
      {
        emoji: '💡',
        title: 'Pro Tip',
        description: '3-7 criteria works best. Too many can be overwhelming'
      }
    ],
    videoTip: 'Example: For choosing a job, criteria might be: salary, culture, growth, location'
  },
  scoring: {
    title: '⚖️ Scoring Your Options',
    tips: [
      {
        emoji: '0️⃣',
        title: 'Score 0-3',
        description: 'Option doesn\'t meet this criterion'
      },
      {
        emoji: '5️⃣',
        title: 'Score 4-6',
        description: 'Option partially meets this criterion'
      },
      {
        emoji: '1️⃣',
        title: 'Score 7-10',
        description: 'Option excellently meets this criterion'
      },
      {
        emoji: '🎯',
        title: 'Stay Objective',
        description: 'Score based on facts, not feelings'
      }
    ],
    videoTip: 'Watch "How to Score Options" for detailed examples'
  },
  results: {
    title: '📊 Understanding Results',
    tips: [
      {
        emoji: '📈',
        title: 'Analysis Tab',
        description: 'Shows weighted scores based on your priorities'
      },
      {
        emoji: '⚠️',
        title: 'Risk Tab',
        description: 'Identifies potential problems with each option'
      },
      {
        emoji: '🔄',
        title: 'Sensitivity Tab',
        description: 'Shows how changes in weights affect the outcome'
      },
      {
        emoji: '🎯',
        title: 'Comparison Tab',
        description: 'Side-by-side comparison of all options'
      }
    ],
    videoTip: 'Check "Understanding Results" video for detailed explanations'
  },
  sensitivity: {
    title: '🔄 Sensitivity Analysis',
    tips: [
      {
        emoji: '⚙️',
        title: 'What It Shows',
        description: 'How changes in weight percentages affect your best choice'
      },
      {
        emoji: '🧪',
        title: 'Experiment',
        description: 'Adjust weights to see which criteria matter most'
      },
      {
        emoji: '📊',
        title: 'Understand Trade-offs',
        description: 'See what you gain and lose with different priorities'
      }
    ],
    videoTip: 'This helps you understand if your decision is robust'
  },
  risk: {
    title: '⚠️ Risk Assessment',
    tips: [
      {
        emoji: '🎯',
        title: 'What It Shows',
        description: 'Potential problems with each option'
      },
      {
        emoji: '📉',
        title: 'Weak Points',
        description: 'Criteria where an option scores poorly'
      },
      {
        emoji: '💭',
        title: 'Consider Carefully',
        description: 'Use this to identify hidden risks before deciding'
      }
    ],
    videoTip: 'Risk assessment helps you make more informed decisions'
  },
  history: {
    title: '⏱️ Decision History',
    tips: [
      {
        emoji: '💾',
        title: 'Save Decisions',
        description: 'Keep track of your decision-making process'
      },
      {
        emoji: '🔄',
        title: 'Revisit & Refine',
        description: 'Come back and adjust scores or weights anytime'
      },
      {
        emoji: '📈',
        title: 'Track Progress',
        description: 'Learn from past decisions and improve your process'
      }
    ],
    videoTip: 'Building a decision history helps you improve over time'
  }
};

export function HelpSidebar({ step, onOpen }: HelpSidebarProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [expandedTip, setExpandedTip] = useState<number | null>(null);

  const helpContent = HELP_CONTENT[step];

  if (!isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className="fixed bottom-4 left-4 z-30 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 shadow-lg transition-all hover:shadow-xl animate-fade-in"
        title="Click for help"
      >
        <HelpCircle className="w-5 h-5" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 z-30 w-80 max-h-96 animate-slide-in-up">
      <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30 border-blue-200 dark:border-blue-800 shadow-2xl overflow-hidden flex flex-col max-h-full">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5" />
            <h3 className="font-bold">{helpContent.title}</h3>
          </div>
          <button
            onClick={() => setIsExpanded(false)}
            className="hover:bg-white/20 p-1 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1 p-3 space-y-2">
          {helpContent.tips.map((tip, i) => (
            <div key={i} className="bg-white/70 dark:bg-gray-800/50 rounded-lg overflow-hidden">
              <button
                onClick={() => setExpandedTip(expandedTip === i ? null : i)}
                className="w-full p-3 flex items-start gap-2 hover:bg-white/80 dark:hover:bg-gray-800/80 transition-colors text-left"
              >
                <span className="text-xl flex-shrink-0">{tip.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-foreground text-sm">{tip.title}</div>
                  {expandedTip === i && (
                    <div className="text-xs text-foreground/70 mt-1">{tip.description}</div>
                  )}
                </div>
                <ChevronDown 
                  className={`w-4 h-4 text-foreground/50 flex-shrink-0 transition-transform ${
                    expandedTip === i ? 'rotate-180' : ''
                  }`}
                />
              </button>
            </div>
          ))}

          {/* Video tip */}
          <div className="bg-yellow-100/50 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-700 rounded-lg p-3 mt-2">
            <div className="text-xs font-semibold text-yellow-800 dark:text-yellow-200 flex items-start gap-2">
              <span>🎥</span>
              <span>{helpContent.videoTip}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-white/50 dark:bg-gray-800/50 border-t border-blue-200 dark:border-blue-800 p-3 flex-shrink-0">
          <Button
            variant="outline"
            size="sm"
            className="w-full gap-2"
            onClick={onOpen}
          >
            Watch Videos
          </Button>
        </div>
      </Card>
    </div>
  );
}

// Floating help button for specific sections
interface FloatingHelpProps {
  title: string;
  tips: string[];
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

export function FloatingHelp({ title, tips, position = 'top-right' }: FloatingHelpProps) {
  const [isOpen, setIsOpen] = useState(false);

  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4'
  };

  return (
    <div className={`fixed ${positionClasses[position]} z-20`}>
      {isOpen ? (
        <Card className="bg-white dark:bg-gray-900 border-blue-300 dark:border-blue-700 shadow-lg w-80 animate-slide-in-up">
          <div className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-foreground flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-yellow-500" />
                {title}
              </h4>
              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-gray-100 dark:hover:bg-gray-800 p-1 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <ul className="space-y-2">
              {tips.map((tip, i) => (
                <li key={i} className="text-sm text-foreground/70 flex gap-2">
                  <span className="text-blue-500 font-bold">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </Card>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2 shadow-lg transition-all hover:shadow-xl"
        >
          <MoreVertical className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
