'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TEMPLATES, TEMPLATE_CATEGORIES } from '@/lib/templates';
import type { Decision } from '@/lib/decision-engine';
import { ChevronRight, Briefcase, Zap, MapPin, TrendingUp, Lightbulb, Home, GraduationCap } from 'lucide-react';

interface TemplatesSelectorProps {
  onSelectTemplate: (template: Decision) => void;
  onCreateCustom: () => void;
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  Career: <Briefcase className="w-5 h-5" />,
  Technology: <Zap className="w-5 h-5" />,
  Travel: <MapPin className="w-5 h-5" />,
  Business: <TrendingUp className="w-5 h-5" />,
  Education: <GraduationCap className="w-5 h-5" />,
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
                    className="hover:shadow-md hover:border-primary/30 transition-all cursor-pointer group border-2"
                    onClick={() => onSelectTemplate(template)}
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
                          <p className="font-semibold text-foreground mb-2 text-xs uppercase tracking-wide">Top Criteria:</p>
                          <ul className="text-xs space-y-1">
                            {template.criteria.slice(0, 3).map((criterion) => (
                              <li key={criterion.id} className="flex justify-between items-center">
                                <span className="text-muted-foreground">{criterion.name}</span>
                                <Badge variant="outline" className="text-xs font-bold">
                                  {criterion.weight}%
                                </Badge>
                              </li>
                            ))}
                            {template.criteria.length > 3 && (
                              <li className="text-muted-foreground text-xs pt-1">
                                + {template.criteria.length - 3} more criteria
                              </li>
                            )}
                          </ul>
                        </div>
                        <Button
                          className="w-full mt-2 group/btn"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectTemplate(template);
                          }}
                        >
                          Use Template
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
        >
          <Briefcase className="w-4 h-4 mr-2" />
          View Examples
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
