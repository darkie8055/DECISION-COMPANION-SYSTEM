'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  PlayCircle, 
  Target, 
  Weight, 
  BarChart3, 
  CheckCircle, 
  ArrowRight,
  X,
  Lightbulb,
  Zap,
  Eye,
  ChevronDown,
  Layers
} from 'lucide-react';

interface InteractiveTutorialProps {
  onComplete: () => void;
  onSkip: () => void;
}

const TUTORIAL_STEPS = [
  {
    id: 'welcome',
    title: "🎯 Welcome to Decision Companion!",
    description: "Make better decisions with weighted scoring and visual analysis.",
    icon: <PlayCircle className="w-8 h-8 text-blue-500" />,
    fullDescription: "This tool helps you make complex choices by scoring options against criteria that matter to you. Whether it's choosing a job, buying a laptop, or planning your next move, we've got you covered.",
    example: "Choose between: Job offers, Laptops, Vacation destinations",
    animation: 'fade-in'
  },
  {
    id: 'criteria',
    title: "🎯 Step 1: Define Criteria",
    description: "Choose what factors matter for your decision.",
    icon: <Target className="w-8 h-8 text-green-500" />,
    fullDescription: "These are the factors you care about. For a job decision, criteria might be salary, work culture, growth opportunities, and location. For a laptop, it could be price, performance, battery life, and warranty.",
    example: "Job Decision → Criteria: Salary, Culture, Growth, Location",
    animation: 'slide-in-left',
    visual: 'criteria-demo'
  },
  {
    id: 'weights',
    title: "⚖️ Step 2: Set Weights",
    description: "Assign importance percentages to each criterion.",
    icon: <Weight className="w-8 h-8 text-orange-500" />,
    fullDescription: "Weights tell us which factors are most important to you. If salary is crucial, give it a higher weight. Less important factors get lower weights. All weights must add up to 100%.",
    example: "Salary: 40% | Culture: 30% | Growth: 20% | Location: 10%",
    animation: 'slide-in-right',
    visual: 'weights-demo'
  },
  {
    id: 'scoring',
    title: "📊 Step 3: Score Options",
    description: "Rate each option from 0-10 on every criterion.",
    icon: <BarChart3 className="w-8 h-8 text-purple-500" />,
    fullDescription: "Score how well each option meets your criteria. 0 means it doesn't meet the criterion at all, 10 means it perfectly meets it. Be honest with your scores for the best results!",
    example: "Company A: Salary 9/10 | Culture 8/10 | Growth 7/10 | Location 6/10",
    animation: 'slide-in-left',
    visual: 'scoring-demo'
  },
  {
    id: 'analysis',
    title: "✨ Step 4: See Results",
    description: "Get instant analysis and comparisons.",
    icon: <BarChart3 className="w-8 h-8 text-cyan-500" />,
    fullDescription: "Our algorithm calculates weighted scores for each option. You'll see detailed analysis, risk assessments, sensitivity insights, and side-by-side comparisons to help you decide with confidence.",
    example: "See which option scores best based on YOUR priorities",
    animation: 'slide-in-right',
    visual: 'results-demo'
  },
  {
    id: 'pro-tips',
    title: "💡 Pro Tips for Better Decisions",
    description: "Make the most of the Decision Companion.",
    icon: <Lightbulb className="w-8 h-8 text-yellow-500" />,
    fullDescription: "A few key tips for getting the best results: Be objective with scoring, test different weights to see what matters most, review the sensitivity analysis to understand trade-offs, and save your decisions to compare over time.",
    example: "💭 Try different weights to explore trade-offs",
    animation: 'fade-in',
    tips: [
      "Be honest with your scoring",
      "Test different weight combinations",
      "Check the sensitivity analysis",
      "Save decisions for future reference"
    ]
  }
];

// Demo component for criteria selection
function CriteriaDemo() {
  return (
    <div className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 p-6 rounded-lg space-y-3 mt-4">
      <div className="text-sm font-semibold text-foreground mb-3">Example Criteria:</div>
      <div className="grid grid-cols-2 gap-2">
        {[
          { name: 'Salary', emoji: '💰' },
          { name: 'Culture', emoji: '🤝' },
          { name: 'Growth', emoji: '📈' },
          { name: 'Location', emoji: '📍' }
        ].map((criterion, i) => (
          <div 
            key={i}
            className="bg-white dark:bg-gray-800 p-3 rounded-lg border-2 border-green-300 dark:border-green-700 animate-fade-in"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <div className="text-2xl">{criterion.emoji}</div>
            <div className="text-sm font-medium text-foreground">{criterion.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Demo component for weight distribution
function WeightsDemo() {
  const weights = [
    { name: 'Salary', weight: 40, color: 'bg-blue-500', emoji: '💰' },
    { name: 'Culture', weight: 30, color: 'bg-green-500', emoji: '🤝' },
    { name: 'Growth', weight: 20, color: 'bg-orange-500', emoji: '📈' },
    { name: 'Location', weight: 10, color: 'bg-purple-500', emoji: '📍' }
  ];

  return (
    <div className="space-y-4 mt-4">
      <div className="text-sm font-semibold text-foreground">Weight Distribution (must = 100%):</div>
      {weights.map((item, i) => (
        <div key={i} className="animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <span className="text-xl">{item.emoji}</span>
              <span className="text-sm font-medium">{item.name}</span>
            </div>
            <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{item.weight}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
            <div 
              className={`${item.color} h-full transition-all duration-1000`}
              style={{ width: `${item.weight}%` }}
            />
          </div>
        </div>
      ))}
      <div className="pt-2 text-xs text-muted-foreground">Total: <span className="font-bold text-foreground">100%</span></div>
    </div>
  );
}

// Demo component for scoring matrix
function ScoringDemo() {
  const companies = ['Company A', 'Company B', 'Company C'];
  const criteria = ['Salary', 'Culture', 'Growth', 'Location'];
  const scores = [
    [9, 8, 7, 6],
    [7, 9, 8, 8],
    [6, 7, 9, 9]
  ];

  return (
    <div className="overflow-x-auto mt-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 min-w-max">
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className="text-left font-semibold text-foreground pb-3 pr-3 border-b border-gray-200 dark:border-gray-700">Option</th>
              {criteria.map((c, i) => (
                <th key={i} className="text-center font-semibold text-foreground pb-3 px-3 border-b border-gray-200 dark:border-gray-700 min-w-20">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {companies.map((company, i) => (
              <tr key={i} className="animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
                <td className="font-medium text-foreground pr-3 py-2 border-r border-gray-200 dark:border-gray-700">{company}</td>
                {scores[i].map((score, j) => (
                  <td key={j} className="text-center py-2 px-3">
                    <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold text-white ${
                      score >= 8 ? 'bg-green-500' : score >= 6 ? 'bg-yellow-500' : 'bg-orange-500'
                    }`}>
                      {score}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Demo component for results
function ResultsDemo() {
  const results = [
    { name: 'Company A', score: 8.2, emoji: '🏆' },
    { name: 'Company B', score: 7.9, emoji: '🥈' },
    { name: 'Company C', score: 7.6, emoji: '🥉' }
  ];

  return (
    <div className="space-y-3 mt-4">
      <div className="text-sm font-semibold text-foreground">Weighted Scores:</div>
      {results.map((item, i) => (
        <div 
          key={i}
          className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-4 rounded-lg animate-slide-in-up"
          style={{ animationDelay: `${i * 150}ms` }}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{item.emoji}</span>
              <span className="font-semibold text-foreground">{item.name}</span>
            </div>
            <span className="text-lg font-bold text-blue-600 dark:text-blue-400">{item.score}/10</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-full transition-all duration-1000"
              style={{ width: `${item.score * 10}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export function InteractiveTutorial({ onComplete, onSkip }: InteractiveTutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [autoAdvance, setAutoAdvance] = useState(false);

  const currentTutorial = TUTORIAL_STEPS[currentStep];
  const progress = ((currentStep + 1) / TUTORIAL_STEPS.length) * 100;

  useEffect(() => {
    if (autoAdvance && currentStep < TUTORIAL_STEPS.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStep(currentStep + 1);
        setAutoAdvance(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [autoAdvance, currentStep]);

  const handleNext = () => {
    if (currentStep < TUTORIAL_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const jumpToStep = (stepIndex: number) => {
    setCurrentStep(stepIndex);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-white to-blue-50 dark:from-gray-900 dark:to-gray-800 border-2 border-blue-200 dark:border-blue-800 shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur border-b border-blue-200 dark:border-blue-800 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3 flex-1">
              <div className="text-3xl">{currentTutorial.icon}</div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-foreground">{currentTutorial.title}</h2>
                <Badge variant="secondary" className="mt-2 text-xs">
                  Step {currentStep + 1} of {TUTORIAL_STEPS.length}
                </Badge>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onSkip} className="h-8 w-8">
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Progress bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>

        {/* Content */}
        <CardContent className="p-6 space-y-6">
          {/* Main description */}
          <div className="space-y-3 animate-fade-in">
            <p className="text-base font-medium text-foreground">
              {currentTutorial.fullDescription}
            </p>
            
            {/* Example box */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 rounded">
              <div className="flex items-start gap-2">
                <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-xs font-semibold text-blue-900 dark:text-blue-200 uppercase tracking-wide">Example</div>
                  <div className="text-sm text-blue-800 dark:text-blue-300 mt-1">
                    {currentTutorial.example}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Visual demonstrations */}
          {currentTutorial.visual === 'criteria-demo' && <CriteriaDemo />}
          {currentTutorial.visual === 'weights-demo' && <WeightsDemo />}
          {currentTutorial.visual === 'scoring-demo' && <ScoringDemo />}
          {currentTutorial.visual === 'results-demo' && <ResultsDemo />}

          {/* Pro tips */}
          {currentTutorial.tips && (
            <div className="space-y-3 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <div className="flex items-center gap-2 font-semibold text-foreground">
                <Zap className="w-5 h-5 text-yellow-600" />
                Quick Tips for Success
              </div>
              <ul className="space-y-2">
                {currentTutorial.tips.map((tip, i) => (
                  <li 
                    key={i}
                    className="text-sm text-foreground flex items-start gap-2 animate-fade-in"
                    style={{ animationDelay: `${i * 100}ms` }}
                  >
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Step indicator */}
          <div className="flex flex-wrap gap-2">
            {TUTORIAL_STEPS.map((step, i) => (
              <button
                key={i}
                onClick={() => jumpToStep(i)}
                className={`h-8 w-8 rounded-full font-bold text-xs transition-all duration-300 ${
                  i === currentStep
                    ? 'bg-blue-600 text-white shadow-lg scale-110'
                    : i < currentStep
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-foreground hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {i < currentStep ? '✓' : i + 1}
              </button>
            ))}
          </div>
        </CardContent>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur border-t border-blue-200 dark:border-blue-800 p-6 space-y-3">
          <div className="flex justify-between gap-3">
            <Button 
              variant="outline" 
              onClick={handlePrevious}
              disabled={currentStep === 0}
            >
              ← Previous
            </Button>
            
            <div className="flex gap-2">
              {currentStep === TUTORIAL_STEPS.length - 1 ? (
                <Button 
                  onClick={onComplete} 
                  className="gap-2 bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="w-4 h-4" />
                  Start Using Decision Companion!
                </Button>
              ) : (
                <Button 
                  onClick={handleNext} 
                  className="gap-2 bg-blue-600 hover:bg-blue-700"
                >
                  Next
                  <ArrowRight className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Button variant="ghost" size="sm" onClick={onSkip}>
              Skip tutorial
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
