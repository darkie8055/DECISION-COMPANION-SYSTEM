'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import type { Decision, Criterion, Option } from '@/lib/decision-engine';
import { 
  Plus, 
  Trash2, 
  Settings, 
  Weight, 
  Target, 
  ChevronRight,
  ArrowLeft,
  Edit2,
  Percent
} from 'lucide-react';

interface TemplateCustomizerProps {
  template: Decision;
  onConfirm: (customizedTemplate: Decision) => void;
  onBack: () => void;
}

export function TemplateCustomizer({ template, onConfirm, onBack }: TemplateCustomizerProps) {
  const [customizedTemplate, setCustomizedTemplate] = useState<Decision>({
    ...template,
    criteria: template.criteria.map(c => ({ ...c })),
    options: template.options.map(o => ({ ...o })),
  });

  const [editingCriterion, setEditingCriterion] = useState<string | null>(null);
  const [editingOption, setEditingOption] = useState<string | null>(null);

  // Criteria Management
  const addCriterion = () => {
    const newId = Math.max(...customizedTemplate.criteria.map(c => parseInt(c.id) || 0), 0) + 1;
    const newCriterion: Criterion = {
      id: newId.toString(),
      name: 'New Criterion',
      weight: 10,
    };
    
    // Distribute weights evenly
    const totalCriteria = customizedTemplate.criteria.length + 1;
    const evenWeight = Math.floor(100 / totalCriteria);
    const remainder = 100 - (evenWeight * totalCriteria);
    
    const updatedCriteria = customizedTemplate.criteria.map((c, index) => ({
      ...c,
      weight: evenWeight + (index < remainder ? 1 : 0),
    }));
    
    updatedCriteria.push({ ...newCriterion, weight: evenWeight });
    
    setCustomizedTemplate({
      ...customizedTemplate,
      criteria: updatedCriteria,
    });
    setEditingCriterion(newId.toString());
  };

  const removeCriterion = (criterionId: string) => {
    const updatedCriteria = customizedTemplate.criteria.filter(c => c.id !== criterionId);
    
    // Redistribute weights evenly
    if (updatedCriteria.length > 0) {
      const evenWeight = Math.floor(100 / updatedCriteria.length);
      const remainder = 100 - (evenWeight * updatedCriteria.length);
      
      updatedCriteria.forEach((c, index) => {
        c.weight = evenWeight + (index < remainder ? 1 : 0);
      });
    }
    
    setCustomizedTemplate({
      ...customizedTemplate,
      criteria: updatedCriteria,
    });
  };

  const updateCriterion = (criterionId: string, updates: Partial<Criterion>) => {
    setCustomizedTemplate({
      ...customizedTemplate,
      criteria: customizedTemplate.criteria.map(c =>
        c.id === criterionId ? { ...c, ...updates } : c
      ),
    });
  };

  const updateCriterionWeight = (criterionId: string, newWeight: number) => {
    const criterion = customizedTemplate.criteria.find(c => c.id === criterionId);
    if (!criterion) return;

    const otherCriteria = customizedTemplate.criteria.filter(c => c.id !== criterionId);
    const totalOtherWeight = 100 - newWeight;
    
    // Proportionally adjust other weights
    const currentOtherTotal = otherCriteria.reduce((sum, c) => sum + c.weight, 0);
    
    if (currentOtherTotal > 0 && otherCriteria.length > 0) {
      otherCriteria.forEach(c => {
        c.weight = Math.round((c.weight / currentOtherTotal) * totalOtherWeight);
      });
    }
    
    setCustomizedTemplate({
      ...customizedTemplate,
      criteria: customizedTemplate.criteria.map(c =>
        c.id === criterionId ? { ...c, weight: newWeight } : c
      ),
    });
  };

  // Options Management
  const addOption = () => {
    // Find the next available letter ID
    const existingIds = new Set(customizedTemplate.options.map(o => o.id));
    let newId = '';
    let displayName = '';
    
    // Start from 'a' and find the first unused letter
    for (let i = 0; i < 26; i++) {
      const candidateId = String.fromCharCode(97 + i); // 'a', 'b', 'c', ...
      if (!existingIds.has(candidateId)) {
        newId = candidateId;
        displayName = `Option ${String.fromCharCode(65 + i)}`; // A, B, C, etc.
        break;
      }
    }
    
    // Fallback: if all single letters are used, use alphanumeric
    if (!newId) {
      const timestamp = Date.now().toString(36).slice(-3);
      newId = `opt_${timestamp}`;
      displayName = `Option ${customizedTemplate.options.length + 1}`;
    }
    
    const newOption: Option = {
      id: newId,
      name: displayName,
    };
    
    setCustomizedTemplate({
      ...customizedTemplate,
      options: [...customizedTemplate.options, newOption],
    });
    setEditingOption(newOption.id);
  };

  const removeOption = (optionId: string) => {
    setCustomizedTemplate({
      ...customizedTemplate,
      options: customizedTemplate.options.filter(o => o.id !== optionId),
    });
  };

  const updateOption = (optionId: string, updates: Partial<Option>) => {
    setCustomizedTemplate({
      ...customizedTemplate,
      options: customizedTemplate.options.map(o =>
        o.id === optionId ? { ...o, ...updates } : o
      ),
    });
  };

  const updateTemplateInfo = (updates: Partial<Decision>) => {
    setCustomizedTemplate({
      ...customizedTemplate,
      ...updates,
    });
  };

  const totalWeight = customizedTemplate.criteria.reduce((sum, c) => sum + c.weight, 0);
  const isWeightValid = Math.abs(totalWeight - 100) < 1;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onBack} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <div>
          <h2 className="text-2xl font-bold">Customize Template</h2>
          <p className="text-muted-foreground">Modify criteria, weights, and options to fit your needs</p>
        </div>
      </div>

      {/* Template Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Edit2 className="w-5 h-5" />
            Template Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="template-name">Decision Name</Label>
              <Input
                id="template-name"
                value={customizedTemplate.name}
                onChange={(e) => updateTemplateInfo({ name: e.target.value })}
                placeholder="Enter decision name"
              />
            </div>
            <div className="space-y-2">
              <Label>Summary</Label>
              <div className="flex gap-2">
                <Badge variant="outline">{customizedTemplate.criteria.length} criteria</Badge>
                <Badge variant="outline">{customizedTemplate.options.length} options</Badge>
                <Badge variant={isWeightValid ? "default" : "destructive"}>
                  {totalWeight}% total weight
                </Badge>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="template-description">Description</Label>
            <Textarea
              id="template-description"
              value={customizedTemplate.description}
              onChange={(e) => updateTemplateInfo({ description: e.target.value })}
              placeholder="Describe this decision scenario"
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      {/* Criteria Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Weight className="w-5 h-5" />
              <CardTitle>Decision Criteria</CardTitle>
            </div>
            <Button size="sm" onClick={addCriterion} className="gap-1">
              <Plus className="w-4 h-4" />
              Add
            </Button>
          </div>
          <CardDescription>
            Define what factors matter in your decision and their relative importance
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isWeightValid && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                ⚠️ Weight total is {totalWeight}%. Adjust weights to sum to 100%.
              </p>
            </div>
          )}
          
          {customizedTemplate.criteria.map((criterion, index) => (
            <div key={criterion.id} className="border rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 space-y-2">
                  {editingCriterion === criterion.id ? (
                    <Input
                      value={criterion.name}
                      onChange={(e) => updateCriterion(criterion.id, { name: e.target.value })}
                      onBlur={() => setEditingCriterion(null)}
                      onKeyDown={(e) => e.key === 'Enter' && setEditingCriterion(null)}
                      autoFocus
                    />
                  ) : (
                    <div
                      className="font-medium cursor-pointer hover:text-primary"
                      onClick={() => setEditingCriterion(criterion.id)}
                    >
                      {criterion.name}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="min-w-[60px] justify-center">
                    {criterion.weight}%
                  </Badge>
                  {customizedTemplate.criteria.length > 1 && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeCriterion(criterion.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Percent className="w-4 h-4 text-muted-foreground" />
                  <Label className="text-sm">Importance Weight: {criterion.weight}%</Label>
                </div>
                <Slider
                  value={[criterion.weight]}
                  onValueChange={([value]) => updateCriterionWeight(criterion.id, value)}
                  max={100}
                  min={5}
                  step={5}
                  className="flex-1"
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Options Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              <CardTitle>Decision Options</CardTitle>
            </div>
            <Button size="sm" onClick={addOption} className="gap-1">
              <Plus className="w-4 h-4" />
              Add
            </Button>
          </div>
          <CardDescription>
            List the alternatives you're considering
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {customizedTemplate.options.map((option, index) => (
            <div key={option.id} className="flex items-center gap-3 p-3 border rounded-lg">
              <div className="flex-1">
                {editingOption === option.id ? (
                  <Input
                    value={option.name}
                    onChange={(e) => updateOption(option.id, { name: e.target.value })}
                    onBlur={() => setEditingOption(null)}
                    onKeyDown={(e) => e.key === 'Enter' && setEditingOption(null)}
                    autoFocus
                  />
                ) : (
                  <div
                    className="font-medium cursor-pointer hover:text-primary"
                    onClick={() => setEditingOption(option.id)}
                  >
                    {option.name}
                  </div>
                )}
              </div>
              <Badge variant="secondary">{option.id}</Badge>
              {customizedTemplate.options.length > 2 && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => removeOption(option.id)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Cancel
        </Button>
        <Button
          onClick={() => onConfirm(customizedTemplate)}
          disabled={!isWeightValid || customizedTemplate.criteria.length === 0 || customizedTemplate.options.length < 2}
          className="gap-2"
        >
          Continue to Scoring
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}