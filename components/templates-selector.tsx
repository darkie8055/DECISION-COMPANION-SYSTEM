'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TEMPLATES, TEMPLATE_CATEGORIES } from '@/lib/templates';
import type { Decision } from '@/lib/decision-engine';
import { ChevronRight, Briefcase, Zap, MapPin, TrendingUp } from 'lucide-react';

interface TemplatesSelectorProps {
  onSelectTemplate: (template: Decision) => void;
  onCreateCustom: () => void;
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  Career: <Briefcase className="w-5 h-5" />,
  Technology: <Zap className="w-5 h-5" />,
  Travel: <MapPin className="w-5 h-5" />,
  Business: <TrendingUp className="w-5 h-5" />,
};

export function TemplatesSelector({ onSelectTemplate, onCreateCustom }: TemplatesSelectorProps) {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold">Decision Companion</h1>
        <p className="text-lg text-muted-foreground">
          Make better decisions with weighted scoring and data-driven analysis
        </p>
      </div>

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
                    className="hover:shadow-lg transition-shadow cursor-pointer group"
                    onClick={() => onSelectTemplate(template)}
                  >
                    <CardHeader>
                      <CardTitle className="group-hover:text-primary transition-colors">
                        {template.name}
                      </CardTitle>
                      <CardDescription>{template.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="text-sm">
                          <p className="font-medium text-muted-foreground mb-2">Criteria:</p>
                          <ul className="text-xs space-y-1">
                            {template.criteria.slice(0, 3).map((criterion) => (
                              <li key={criterion.id} className="flex justify-between">
                                <span>{criterion.name}</span>
                                <span className="text-primary font-medium">{criterion.weight}%</span>
                              </li>
                            ))}
                            {template.criteria.length > 3 && (
                              <li className="text-muted-foreground">
                                +{template.criteria.length - 3} more
                              </li>
                            )}
                          </ul>
                        </div>
                        <Button
                          className="w-full mt-4 group/btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectTemplate(template);
                          }}
                        >
                          Use This Template
                          <ChevronRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-4">
        <Button
          variant="outline"
          className="flex-1 h-12"
          onClick={onCreateCustom}
        >
          Create Custom Decision
        </Button>
      </div>

      <div className="bg-secondary/50 p-6 rounded-lg text-center space-y-2">
        <h3 className="font-semibold">How it works</h3>
        <ol className="text-sm text-muted-foreground space-y-1">
          <li>1. Choose or create a decision framework</li>
          <li>2. Define criteria and their importance weights</li>
          <li>3. Score each option against the criteria</li>
          <li>4. Get data-driven recommendations</li>
          <li>5. Explore sensitivity analysis to validate your choice</li>
        </ol>
      </div>
    </div>
  );
}
