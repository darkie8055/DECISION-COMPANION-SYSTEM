'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { Decision, Criterion, Option } from '@/lib/decision-engine';
import { Trash2, Plus, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface DecisionFormProps {
  onDecisionCreate: (decision: Decision) => void;
  initialDecision?: Decision;
}

export function DecisionForm({ onDecisionCreate, initialDecision }: DecisionFormProps) {
  const [name, setName] = useState(initialDecision?.name || '');
  const [description, setDescription] = useState(initialDecision?.description || '');
  const [criteria, setCriteria] = useState<Criterion[]>(
    initialDecision?.criteria || [{ id: '1', name: '', weight: 0 }]
  );
  const [options, setOptions] = useState<Option[]>(
    initialDecision?.options || [{ id: '1', name: '' }]
  );

  const handleAddCriterion = () => {
    setCriteria([
      ...criteria,
      { id: Date.now().toString(), name: '', weight: 0 },
    ]);
  };

  const handleAddOption = () => {
    setOptions([...options, { id: Date.now().toString(), name: '' }]);
  };

  const handleCriterionChange = (id: string, field: string, value: string | number) => {
    setCriteria(
      criteria.map((c) =>
        c.id === id ? { ...c, [field]: field === 'weight' ? Number(value) : value } : c
      )
    );
  };

  const handleOptionChange = (id: string, value: string) => {
    setOptions(options.map((o) => (o.id === id ? { ...o, name: value } : o)));
  };

  const handleRemoveCriterion = (id: string) => {
    if (criteria.length > 1) {
      setCriteria(criteria.filter((c) => c.id !== id));
    }
  };

  const handleRemoveOption = (id: string) => {
    if (options.length > 1) {
      setOptions(options.filter((o) => o.id !== id));
    }
  };

  const totalWeight = criteria.reduce((sum, c) => sum + c.weight, 0);
  const validCriteria = criteria.filter((c) => c.name.trim());
  const validOptions = options.filter((o) => o.name.trim());
  const isFormValid = name.trim() && validCriteria.length >= 2 && validOptions.length >= 2 && totalWeight === 100;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      alert('Please enter a decision name');
      return;
    }

    if (validCriteria.length < 2) {
      alert('Please enter at least 2 criteria');
      return;
    }

    if (validOptions.length < 2) {
      alert('Please enter at least 2 options');
      return;
    }

    if (totalWeight !== 100) {
      alert(`Criterion weights must sum to 100% (currently ${totalWeight}%)`);
      return;
    }

    const decision: Decision = {
      id: initialDecision?.id || Date.now().toString(),
      name,
      description,
      criteria: validCriteria,
      options: validOptions,
      scores: initialDecision?.scores || [],
      createdAt: initialDecision?.createdAt || new Date(),
    };

    onDecisionCreate(decision);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Your Decision Framework</CardTitle>
        <CardDescription>Define what you're deciding and set up your evaluation criteria</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Decision Name *</label>
              <Input
                placeholder="e.g., Choose a new laptop, Evaluate job offers"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="text-base"
                required
              />
              <p className="text-xs text-muted-foreground mt-1">What are you deciding?</p>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Description</label>
              <Textarea
                placeholder="Add any context or notes about this decision..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>
          </div>

          {/* Criteria */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-sm font-semibold mb-1">
                  Evaluation Criteria * (Min: 2)
                </label>
                <p className="text-xs text-muted-foreground">
                  {validCriteria.length} criteria · Total weight: {totalWeight}%
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddCriterion}
                className="gap-1"
              >
                <Plus className="w-4 h-4" />
                Add Criterion
              </Button>
            </div>
            
            {totalWeight !== 100 && totalWeight > 0 && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Weights must sum to 100% (currently {totalWeight}%). Adjust values to continue.
                </AlertDescription>
              </Alert>
            )}

            <Progress value={Math.min(totalWeight, 100)} className="h-2" />

            <div className="space-y-2">
              {criteria.map((criterion) => (
                <div key={criterion.id} className="flex gap-2 items-end">
                  <Input
                    placeholder="e.g., Price, Performance, Battery Life"
                    value={criterion.name}
                    onChange={(e) => handleCriterionChange(criterion.id, 'name', e.target.value)}
                    className="flex-1"
                  />
                  <div className="flex gap-1 items-center">
                    <Input
                      type="number"
                      placeholder="Weight"
                      min="0"
                      max="100"
                      value={criterion.weight || ''}
                      onChange={(e) => handleCriterionChange(criterion.id, 'weight', e.target.value)}
                      className="w-20 text-center"
                    />
                    <span className="text-sm text-muted-foreground">%</span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveCriterion(criterion.id)}
                    disabled={criteria.length === 1}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Options */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-sm font-semibold mb-1">
                  Options to Compare * (Min: 2)
                </label>
                <p className="text-xs text-muted-foreground">
                  {validOptions.length} option{validOptions.length !== 1 ? 's' : ''}
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddOption}
                className="gap-1"
              >
                <Plus className="w-4 h-4" />
                Add Option
              </Button>
            </div>
            <div className="space-y-2">
              {options.map((option) => (
                <div key={option.id} className="flex gap-2">
                  <Input
                    placeholder="e.g., Laptop Model A, Job Offer from Company X"
                    value={option.name}
                    onChange={(e) => handleOptionChange(option.id, e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveOption(option.id)}
                    disabled={options.length === 1}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Validation Summary */}
          {isFormValid && (
            <Alert className="bg-green-50 border-green-200 dark:bg-green-950/30 dark:border-green-800">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-900 dark:text-green-100">
                Your decision framework is complete! Ready to proceed to scoring.
              </AlertDescription>
            </Alert>
          )}

          <Button 
            type="submit" 
            className="w-full" 
            disabled={!isFormValid}
            size="lg"
          >
            Continue to Scoring
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
