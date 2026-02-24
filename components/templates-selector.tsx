'use client';

import { useState } from 'react';
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
  Clock,
  Grid3x3,
  PlusCircle,
  Sparkles,
  Trash2
} from 'lucide-react';

interface TemplatesSelectorProps {
  onSelectTemplate: (template: Decision) => void;
  onCustomizeTemplate?: (template: Decision) => void;
  onCreateCustom: () => void;
  decisionHistory?: Decision[];
  onLoadDecision?: (decision: Decision) => void;
  onDeleteDecision?: (decisionId: string) => void;
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  All: <Grid3x3 className="w-5 h-5" />,
  Career: <Briefcase className="w-5 h-5" />,
  Technology: <Zap className="w-5 h-5" />,
  Travel: <MapPin className="w-5 h-5" />,
  Business: <TrendingUp className="w-5 h-5" />,
  Education: <GraduationCap className="w-5 h-5" />,
  Other: <PlusCircle className="w-5 h-5" />,
};

export function TemplatesSelector({ onSelectTemplate, onCustomizeTemplate, onCreateCustom, decisionHistory = [], onLoadDecision, onDeleteDecision }: TemplatesSelectorProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Get filtered templates based on selected category
  const getFilteredTemplates = () => {
    if (selectedCategory === 'All') {
      return TEMPLATE_CATEGORIES.flatMap(category => 
        category.templates.map(templateId => ({
          templateId,
          category: category.name
        }))
      );
    }
    
    if (selectedCategory === 'Other') {
      // Other category shows custom decisions from history
      return [];
    }
    
    const category = TEMPLATE_CATEGORIES.find(cat => cat.name === selectedCategory);
    return category ? category.templates.map(templateId => ({
      templateId,
      category: category.name
    })) : [];
  };

  // Get custom decisions (those not from templates)
  const getCustomDecisions = () => {
    if (selectedCategory !== 'Other' && selectedCategory !== 'All') return [];
    
    const allTemplateIds = Object.keys(TEMPLATES);
    return decisionHistory.filter(decision => {
      // Check if this decision's name matches any template
      const isTemplate = allTemplateIds.some(templateId => {
        const template = TEMPLATES[templateId];
        return template.name === decision.name;
      });
      return !isTemplate;
    });
  };

  const customDecisions = getCustomDecisions();

  const filteredTemplates = getFilteredTemplates();

  return (
    <div className="space-y-8">
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

      {/* My Recent Decisions Section */}
      {decisionHistory && decisionHistory.length > 0 && (
        <Card className="glass-card border-green-200/30 dark:border-green-800/30 hover-lift">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 gradient-text">
              <Clock className="w-5 h-5 text-green-600 dark:text-green-400" />
              My Recent Decisions
            </CardTitle>
            <CardDescription>
              Continue working on your saved decisions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {decisionHistory.slice(0, 6).map((decision) => (
                <Card 
                  key={decision.id} 
                  className="group relative hover:shadow-lg transition-all duration-200 border-2 hover:border-green-400 dark:hover:border-green-600"
                >
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <h3 
                          className="font-semibold text-base line-clamp-1 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors cursor-pointer flex-1"
                          onClick={() => onLoadDecision?.(decision)}
                        >
                          {decision.name}
                        </h3>
                        {onDeleteDecision && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (confirm(`Delete "${decision.name}"?`)) {
                                onDeleteDecision(decision.id);
                              }
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                      <p 
                        className="text-sm text-muted-foreground line-clamp-2 cursor-pointer"
                        onClick={() => onLoadDecision?.(decision)}
                      >
                        {decision.description}
                      </p>
                      <div 
                        className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t cursor-pointer"
                        onClick={() => onLoadDecision?.(decision)}
                      >
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(decision.createdAt).toLocaleDateString()}
                        </span>
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-8">
        {/* Category Filter Buttons */}
        <div className="flex flex-wrap gap-3 justify-center">
          {/* All category button */}
          <Button
            variant={selectedCategory === 'All' ? 'default' : 'outline'}
            onClick={() => setSelectedCategory('All')}
            size="lg"
            className={`group relative overflow-hidden rounded-full px-6 py-6 font-bold transition-all duration-300 ${
              selectedCategory === 'All' 
                ? 'bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 text-white shadow-xl shadow-blue-500/50 scale-110 hover:shadow-2xl hover:shadow-blue-500/60' 
                : 'border-2 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30 hover:scale-105 hover:shadow-lg'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div className={`p-2 rounded-lg transition-all ${
                selectedCategory === 'All'
                  ? 'bg-white/25 backdrop-blur-sm shadow-inner'
                  : 'bg-blue-100 dark:bg-blue-900/50 group-hover:bg-blue-200 dark:group-hover:bg-blue-800/50'
              }`}>
                {CATEGORY_ICONS['All']}
              </div>
              <span className="text-base">All</span>
            </div>
            {selectedCategory === 'All' && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
            )}
          </Button>

          {/* Category filter buttons */}
          {TEMPLATE_CATEGORIES.map((category) => {
            const gradients = {
              Career: 'from-purple-600 via-purple-500 to-pink-500',
              Technology: 'from-yellow-600 via-orange-500 to-red-500',
              Travel: 'from-green-600 via-teal-500 to-cyan-500',
              Business: 'from-indigo-600 via-blue-500 to-cyan-500',
              Education: 'from-rose-600 via-pink-500 to-fuchsia-500',
            } as const;

            const hoverColors = {
              Career: 'hover:border-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/30',
              Technology: 'hover:border-orange-400 hover:bg-orange-50 dark:hover:bg-orange-950/30',
              Travel: 'hover:border-green-400 hover:bg-green-50 dark:hover:bg-green-950/30',
              Business: 'hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30',
              Education: 'hover:border-pink-400 hover:bg-pink-50 dark:hover:bg-pink-950/30',
            } as const;

            const shadowColors = {
              Career: 'shadow-purple-500/50 hover:shadow-purple-500/60',
              Technology: 'shadow-orange-500/50 hover:shadow-orange-500/60',
              Travel: 'shadow-green-500/50 hover:shadow-green-500/60',
              Business: 'shadow-blue-500/50 hover:shadow-blue-500/60',
              Education: 'shadow-pink-500/50 hover:shadow-pink-500/60',
            } as const;

            return (
              <Button
                key={category.name}
                variant={selectedCategory === category.name ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(category.name)}
                size="lg"
                className={`group relative overflow-hidden rounded-full px-6 py-6 font-bold transition-all duration-300 ${
                  selectedCategory === category.name 
                    ? `bg-gradient-to-r ${gradients[category.name as keyof typeof gradients]} text-white shadow-xl ${shadowColors[category.name as keyof typeof shadowColors]} scale-110 hover:shadow-2xl` 
                    : `border-2 ${hoverColors[category.name as keyof typeof hoverColors]} hover:scale-105 hover:shadow-lg`
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className={`p-2 rounded-lg transition-all ${
                    selectedCategory === category.name
                      ? 'bg-white/25 backdrop-blur-sm shadow-inner'
                      : 'bg-gradient-to-br from-primary/10 to-accent/10 group-hover:from-primary/20 group-hover:to-accent/20'
                  }`}>
                    {CATEGORY_ICONS[category.name]}
                  </div>
                  <span className="text-base">{category.name}</span>
                </div>
                {selectedCategory === category.name && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                )}
              </Button>
            );
          })}

          {/* Other category button */}
          <Button
            variant={selectedCategory === 'Other' ? 'default' : 'outline'}
            onClick={() => setSelectedCategory('Other')}
            size="lg"
            className={`group relative overflow-hidden rounded-full px-6 py-6 font-bold transition-all duration-300 ${
              selectedCategory === 'Other' 
                ? 'bg-gradient-to-r from-slate-700 via-gray-600 to-zinc-600 text-white shadow-xl shadow-slate-500/50 scale-110 hover:shadow-2xl hover:shadow-slate-500/60' 
                : 'border-2 border-dashed hover:border-slate-400 hover:bg-slate-50 dark:hover:bg-slate-950/30 hover:scale-105 hover:shadow-lg'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div className={`p-2 rounded-lg transition-all ${
                selectedCategory === 'Other'
                  ? 'bg-white/25 backdrop-blur-sm shadow-inner'
                  : 'bg-slate-100 dark:bg-slate-900/50 group-hover:bg-slate-200 dark:group-hover:bg-slate-800/50'
              }`}>
                {CATEGORY_ICONS['Other']}
              </div>
              <span className="text-base">Other</span>
            </div>
            {selectedCategory === 'Other' && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
            )}
          </Button>
        </div>

        {/* Show custom decision prompt and saved custom decisions for "Other" category */}
        {selectedCategory === 'Other' && (
          <div className="space-y-6">
            {/* Create new custom decision card */}
            <Card className="glass-card border-2 border-dashed border-primary/30 hover-lift">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PlusCircle className="w-6 h-6 text-primary" />
                  Create Custom Decision
                </CardTitle>
                <CardDescription>
                  Build your own decision framework from scratch with custom criteria and options
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={onCreateCustom}
                  className="w-full bg-gradient-to-r from-primary to-primary/80 hover:shadow-lg transition-all"
                  size="lg"
                >
                  <PlusCircle className="w-5 h-5 mr-2" />
                  Start Custom Decision
                </Button>
              </CardContent>
            </Card>

            {/* Saved custom decisions */}
            {customDecisions.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold gradient-text">Your Custom Decisions</h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {customDecisions.map((decision) => (
                    <Card 
                      key={decision.id} 
                      className="group cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-primary dark:hover:border-primary flex flex-col"
                      onClick={() => onLoadDecision?.(decision)}
                    >
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg line-clamp-1 group-hover:text-primary transition-colors">
                          {decision.name}
                        </CardTitle>
                        <CardDescription className="line-clamp-2">
                          {decision.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="flex-grow flex flex-col">
                        <div className="space-y-4 flex-grow">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm text-muted-foreground">
                              <span className="font-medium">Criteria:</span>
                              <Badge variant="secondary">{decision.criteria.length}</Badge>
                            </div>
                            <div className="flex items-center justify-between text-sm text-muted-foreground">
                              <span className="font-medium">Options:</span>
                              <Badge variant="secondary">{decision.options.length}</Badge>
                            </div>
                          </div>
                          <div className="pt-2 border-t">
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {new Date(decision.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                        <Button 
                          variant="outline" 
                          className="w-full mt-4 group-hover:bg-primary group-hover:text-primary-foreground transition-all"
                        >
                          Continue Working
                          <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Templates grid */}
        {(filteredTemplates.length > 0 || (selectedCategory === 'All' && customDecisions.length > 0)) && (
          <div className="space-y-6">
            {filteredTemplates.length > 0 && (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredTemplates.map(({ templateId, category }) => {
                  const template = TEMPLATES[templateId];
                  return (
                    <Card
                      key={templateId}
                      className="glass-card hover-lift group border border-white/20 dark:border-gray-700/20 transition-all duration-300 hover:scale-[1.02] flex flex-col h-full"
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
                      <CardContent className="flex-grow flex flex-col">
                        <div className="space-y-4 flex-grow">
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
                        </div>
                        
                        {/* Buttons fixed at bottom */}
                        <div className="grid grid-cols-2 gap-2 mt-4">
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
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}

            {/* Show custom decisions in "All" category */}
            {selectedCategory === 'All' && customDecisions.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold gradient-text">Your Custom Decisions</h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {customDecisions.map((decision) => (
                    <Card 
                      key={decision.id} 
                      className="group cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-primary dark:hover:border-primary flex flex-col"
                      onClick={() => onLoadDecision?.(decision)}
                    >
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg line-clamp-1 group-hover:text-primary transition-colors">
                          {decision.name}
                        </CardTitle>
                        <CardDescription className="line-clamp-2">
                          {decision.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="flex-grow flex flex-col">
                        <div className="space-y-4 flex-grow">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm text-muted-foreground">
                              <span className="font-medium">Criteria:</span>
                              <Badge variant="secondary">{decision.criteria.length}</Badge>
                            </div>
                            <div className="flex items-center justify-between text-sm text-muted-foreground">
                              <span className="font-medium">Options:</span>
                              <Badge variant="secondary">{decision.options.length}</Badge>
                            </div>
                          </div>
                          <div className="pt-2 border-t">
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {new Date(decision.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                        <Button 
                          variant="outline" 
                          className="w-full mt-4 group-hover:bg-primary group-hover:text-primary-foreground transition-all"
                        >
                          Continue Working
                          <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className={`grid gap-4 mt-12 ${selectedCategory === 'Other' ? 'grid-cols-1' : 'md:grid-cols-2'}`}>
        {selectedCategory !== 'Other' && (
          <Button
            variant="outline"
            className="h-14 glass border-primary/30 hover:bg-gradient-to-r hover:from-primary/10 hover:to-accent/10 transition-all duration-300 text-lg font-semibold"
            onClick={onCreateCustom}
          >
            <Lightbulb className="w-5 h-5 mr-3" />
            Create Custom Decision
          </Button>
        )}
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
              { num: 1, text: 'Select a pre-built template or create a custom framework', gradient: 'from-blue-500 to-cyan-500' },
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
