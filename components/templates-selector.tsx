'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TEMPLATES, TEMPLATE_CATEGORIES } from '@/lib/templates';
import type { Decision } from '@/lib/decision-engine';
import { 
  ChevronRight, 
  Briefcase, 
  Zap, 
  MapPin, 
  TrendingUp, 
  Lightbulb, 
  Home, 
  GraduationCap,
  Settings,
  HelpCircle,
  PlayCircle,
  Clock
} from 'lucide-react';

interface TemplatesSelectorProps {
  onSelectTemplate: (template: Decision) => void;
  onCustomizeTemplate?: (template: Decision) => void;
  onCreateCustom: () => void;
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  Career: <Briefcase className="w-5 h-5" />,
  Technology: <Zap className="w-5 h-5" />,
  Travel: <MapPin className="w-5 h-5" />,
  Business: <TrendingUp className="w-5 h-5" />,
  Education: <GraduationCap className="w-5 h-5" />,
};

export function TemplatesSelector({ onSelectTemplate, onCustomizeTemplate, onCreateCustom }: TemplatesSelectorProps) {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold">Decision Companion</h1>
        <p className="text-lg text-muted-foreground">
          Make better decisions with weighted scoring and data-driven analysis
        </p>
      </div>

      {/* Help Banner */}
      <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-blue-900 dark:text-blue-100">
            <HelpCircle className="w-5 h-5" />
            How This Works (Super Simple!)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">1</div>
              <span className="text-blue-800 dark:text-blue-200">Pick a template or create custom</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">2</div>
              <span className="text-blue-800 dark:text-blue-200">Rate what matters most</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">3</div>
              <span className="text-blue-800 dark:text-blue-200">Score your options 0-10</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">4</div>
              <span className="text-blue-800 dark:text-blue-200">Get your best choice!</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6">
        {TEMPLATE_CATEGORIES.map((category) => (
          <div key={category.name} className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              {CATEGORY_ICONS[category.name]}
              <h2 className="text-xl font-semibold">{category.name}</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {category.templates.map((templateId) => {
                const template = TEMPLATES[templateId];
                return (
                  <Card
                    key={templateId}
                    className="hover:shadow-md hover:border-primary/30 transition-all group border-2"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between mb-2">
                        <CardTitle className="group-hover:text-primary transition-colors text-lg">
                          {template.name}
                        </CardTitle>
                        <Badge variant="secondary" className="ml-auto">
                          {template.criteria.length} criteria
                        </Badge>
                      </div>
                      <CardDescription className="text-xs">{template.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="text-sm">
                          <p className="font-semibold text-foreground mb-2 text-xs uppercase tracking-wide flex items-center gap-1">
                            <PlayCircle className="w-3 h-3" />
                            What We'll Compare:
                          </p>
                          <ul className="text-xs space-y-1">
                            {template.criteria.slice(0, 3).map((criterion) => (
                              <li key={criterion.id} className="flex justify-between items-center">
                                <span className="text-muted-foreground">{criterion.name}</span>
                                <Badge variant="outline" className="text-xs font-bold">
                                  {criterion.weight}% important
                                </Badge>
                              </li>
                            ))}
                            {template.criteria.length > 3 && (
                              <li className="text-muted-foreground text-xs pt-1">
                                + {template.criteria.length - 3} more factors
                              </li>
                            )}
                          </ul>
                        </div>
                        
                        {/* Example use case */}
                        <div className="bg-secondary/30 p-2 rounded text-xs">
                          <div className="flex items-center gap-1 mb-1">
                            <Clock className="w-3 h-3 text-muted-foreground" />
                            <span className="font-medium text-muted-foreground">Takes ~5 minutes</span>
                          </div>
                          <span className="text-muted-foreground">
                            {template.name === 'Job Offer Evaluation' && 'Perfect for comparing multiple job offers'}
                            {template.name === 'Laptop Purchase Decision' && 'Great for finding the best laptop for your budget'}
                            {template.name === 'Vacation Destination' && 'Choose your next trip destination easily'}
                            {template.name === 'Business Investment' && 'Evaluate investment opportunities objectively'}
                            {template.name === 'Real Estate Purchase' && 'Compare houses or apartments systematically'}
                            {template.name === 'College/University Selection' && 'Pick the right school for your future'}
                            {template.name === 'Vendor/Supplier Selection' && 'Choose the best business partner'}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectTemplate(template);
                            }}
                            className="group/btn"
                          >
                            Use Now
                            <ChevronRight className="w-4 h-4 ml-1" />
                          </Button>
                          {onCustomizeTemplate && (
                            <Button
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                onCustomizeTemplate(template);
                              }}
                              className="group/btn gap-1"
                            >
                              <Settings className="w-4 h-4" />
                              Customize
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Button
          variant="outline"
          className="h-12"
          onClick={onCreateCustom}
        >
          <Lightbulb className="w-4 h-4 mr-2" />
          Create Custom Decision
        </Button>
        <Button
          variant="secondary"
          className="h-12"
          onClick={() => window.open('https://github.com/yourusername/decision-companion', '_blank')}
        >
          <HelpCircle className="w-4 h-4 mr-2" />
          Need Help? See Examples
        </Button>
      </div>

      <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Lightbulb className="w-5 h-5 text-primary" />
            How Decision Companion Works
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { num: 1, text: 'Choose a template or create a custom decision framework' },
              { num: 2, text: 'Define your criteria and assign importance weights' },
              { num: 3, text: 'Rate each option on a 0-10 scale for every criterion' },
              { num: 4, text: 'Get automatic weighted scoring and rankings' },
              { num: 5, text: 'Explore risk assessment and sensitivity analysis' },
              { num: 6, text: 'Export your analysis and compare past decisions' },
            ].map((item) => (
              <div key={item.num} className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                  {item.num}
                </div>
                <span className="text-sm">{item.text}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
