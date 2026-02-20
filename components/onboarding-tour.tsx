'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  PlayCircle, 
  Target, 
  Weight, 
  BarChart3, 
  CheckCircle, 
  ArrowRight,
  X,
  Lightbulb
} from 'lucide-react';

interface OnboardingTourProps {
  onComplete: () => void;
  onSkip: () => void;
}

const TOUR_STEPS = [
  {
    title: "Welcome to Decision Companion!",
    description: "Make better decisions with simple scoring. Let's show you how it works.",
    icon: <PlayCircle className="w-8 h-8 text-blue-500" />,
    example: "Like choosing between job offers, laptops, or vacation spots"
  },
  {
    title: "Step 1: Pick What Matters",
    description: "Decide what factors are important for your choice.",
    icon: <Target className="w-8 h-8 text-green-500" />,
    example: "For laptops: Price, Performance, Battery Life, etc."
  },
  {
    title: "Step 2: Set Importance",
    description: "Tell us how much each factor matters (as percentages).",
    icon: <Weight className="w-8 h-8 text-orange-500" />,
    example: "Price: 40%, Performance: 30%, Battery: 20%, Others: 10%"
  },
  {
    title: "Step 3: Rate Your Options", 
    description: "Score each choice from 0-10 on every factor.",
    icon: <BarChart3 className="w-8 h-8 text-purple-500" />,
    example: "MacBook gets 8/10 for performance, 3/10 for price"
  },
  {
    title: "Step 4: Get Your Answer",
    description: "We calculate the best choice based on your priorities!",
    icon: <CheckCircle className="w-8 h-8 text-green-600" />,
    example: "Winner: Budget laptop (scored 8.2/10 for your needs)"
  }
];

export function OnboardingTour({ onComplete, onSkip }: OnboardingTourProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const currentTutorial = TOUR_STEPS[currentStep];

  const handleNext = () => {
    if (currentStep < TOUR_STEPS.length - 1) {
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

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {currentTutorial.icon}
              <div>
                <CardTitle className="text-lg">{currentTutorial.title}</CardTitle>
                <Badge variant="outline" className="mt-1">
                  Step {currentStep + 1} of {TOUR_STEPS.length}
                </Badge>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onSkip}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <CardDescription className="text-base">
            {currentTutorial.description}
          </CardDescription>
          
          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
            <div className="flex items-start gap-2">
              <Lightbulb className="w-4 h-4 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800 dark:text-blue-200">
                <strong>Example:</strong> {currentTutorial.example}
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Progress</span>
              <span>{Math.round(((currentStep + 1) / TOUR_STEPS.length) * 100)}%</span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${((currentStep + 1) / TOUR_STEPS.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between pt-2">
            <Button 
              variant="outline" 
              onClick={handlePrevious}
              disabled={currentStep === 0}
            >
              Previous
            </Button>
            
            <div className="flex gap-2">
              {currentStep === TOUR_STEPS.length - 1 ? (
                <Button onClick={onComplete} className="gap-2">
                  Start Making Decisions!
                  <CheckCircle className="w-4 h-4" />
                </Button>
              ) : (
                <Button onClick={handleNext} className="gap-2">
                  Next
                  <ArrowRight className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>

          <div className="text-center">
            <Button variant="ghost" size="sm" onClick={onSkip}>
              Skip tutorial
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}