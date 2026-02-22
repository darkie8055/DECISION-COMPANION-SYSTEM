'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
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
      <Card className="glass-card border-blue-200/30 dark:border-blue-800/30 hover-lift">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 gradient-text">
            <HelpCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            How This Works (Super Simple!)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white flex items-center justify-center text-xs font-bold shadow-lg">1</div>
              <span className="text-blue-800 dark:text-blue-200 font-medium">Pick a template or create custom</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white flex items-center justify-center text-xs font-bold shadow-lg">2</div>
              <span className="text-blue-800 dark:text-blue-200 font-medium">Rate what matters most</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-green-600 to-cyan-600 text-white flex items-center justify-center text-xs font-bold shadow-lg">3</div>
              <span className="text-blue-800 dark:text-blue-200 font-medium">Score your options 0-10</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-orange-600 to-pink-600 text-white flex items-center justify-center text-xs font-bold shadow-lg">4</div>
              <span className="text-blue-800 dark:text-blue-200 font-medium">Get your best choice!</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-8">
        <div className="flex flex-wrap gap-6 justify-center">
          {TEMPLATE_CATEGORIES.map((category) => (
            <div key={category.name} className="flex items-center gap-3 px-6 py-3 glass-card rounded-full hover-lift">
              <div className="p-2 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 backdrop-blur-sm border border-primary/20">
                {CATEGORY_ICONS[category.name]}
              </div>
              <h2 className="text-lg font-bold gradient-text">{category.name}</h2>
            </div>
          ))}
        </div>

        {/* All templates in one grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {TEMPLATE_CATEGORIES.flatMap(category => 
            category.templates.map((templateId) => {
              const template = TEMPLATES[templateId];
              return (
                <Card
                  key={templateId}
                  className="glass-card hover-lift group border border-white/20 dark:border-gray-700/20 transition-all duration-300 hover:scale-[1.02]"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between mb-2">
                      <CardTitle className="group-hover:text-primary transition-colors text-lg font-bold">
                        {template.name}
                      </CardTitle>
                      <Badge variant="secondary" className="ml-auto bg-gradient-to-r from-primary/10 to-accent/10 text-primary font-semibold border-primary/20">
                        {template.criteria.length} criteria
                      </Badge>
                    </div>
                    <CardDescription className="text-sm leading-relaxed">{template.description}</CardDescription>
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
            })
          )}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 mt-12">
        <Button
          variant="outline"
          className="h-14 glass border-primary/30 hover:bg-gradient-to-r hover:from-primary/10 hover:to-accent/10 transition-all duration-300 text-lg font-semibold"
          onClick={onCreateCustom}
        >
          <Lightbulb className="w-5 h-5 mr-3" />
          Create Custom Decision
        </Button>
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="secondary"
              className="h-14 glass border-secondary/30 hover:bg-gradient-to-r hover:from-secondary/10 hover:to-muted/10 transition-all duration-300 text-lg font-semibold"
            >
              <HelpCircle className="w-5 h-5 mr-3" />
              Need Help? View Guide
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>How to Use Decision Companion</DialogTitle>
              <DialogDescription>
                Quick examples to get you started
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Example: Laptop Purchase Decision</h3>
                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg text-sm">
                  <p><strong>Criteria & Weights:</strong></p>
                  <ul className="ml-4 space-y-1">
                    <li>• Price (40%) - Budget is important</li>
                    <li>• Performance (30%) - Need for work</li>
                    <li>• Battery Life (20%) - Travel frequently</li>
                    <li>• Portability (10%) - Nice to have</li>
                  </ul>
                  <p className="mt-3"><strong>Options:</strong></p>
                  <ul className="ml-4 space-y-1">
                    <li>• MacBook Air M3</li>
                    <li>• Dell XPS 13</li>
                    <li>• ThinkPad X1 Carbon</li>
                  </ul>
                  <p className="mt-3"><strong>Scoring:</strong> Rate each laptop 0-10 on each criterion, get recommendation!</p>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Tips for Good Decisions:</h3>
                <div className="grid gap-3 text-sm">
                  <div className="flex gap-2">
                    <span className="font-medium text-green-600">✓</span>
                    <span>Use specific criteria that matter to YOU</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="font-medium text-green-600">✓</span>
                    <span>Set weights based on your priorities (more important = higher %)</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="font-medium text-green-600">✓</span>
                    <span>Score honestly - compare each option to your ideal</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="font-medium text-green-600">✓</span>
                    <span>Use the sensitivity analysis to test "what if" scenarios</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Common Use Cases:</h3>
                <div className="grid gap-2 text-sm">
                  <div>• <strong>Career:</strong> Job offers, colleges, career paths</div>
                  <div>• <strong>Purchases:</strong> Cars, homes, gadgets, software</div>
                  <div>• <strong>Business:</strong> Vendors, investments, strategies</div>
                  <div>• <strong>Personal:</strong> Vacations, living locations, major choices</div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="glass-card border-primary/20 hover-lift mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl">
            <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20">
              <Lightbulb className="w-6 h-6 text-primary" />
            </div>
            <span className="gradient-text">How Decision Companion Works</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { num: 1, text: 'Choose a template or create a custom decision framework', gradient: 'from-blue-500 to-cyan-500' },
              { num: 2, text: 'Define your criteria and assign importance weights', gradient: 'from-purple-500 to-blue-500' },
              { num: 3, text: 'Rate each option on a 0-10 scale for every criterion', gradient: 'from-green-500 to-cyan-500' },
              { num: 4, text: 'Get automatic weighted scoring and rankings', gradient: 'from-orange-500 to-pink-500' },
              { num: 5, text: 'Explore risk assessment and sensitivity analysis', gradient: 'from-pink-500 to-purple-500' },
              { num: 6, text: 'Export your analysis and compare past decisions', gradient: 'from-indigo-500 to-blue-500' },
            ].map((item) => (
              <div key={item.num} className="flex gap-4 items-start group">
                <div className={`flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r ${item.gradient} text-white flex items-center justify-center text-sm font-bold shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  {item.num}
                </div>
                <span className="text-sm leading-relaxed group-hover:text-primary transition-colors duration-300">{item.text}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
