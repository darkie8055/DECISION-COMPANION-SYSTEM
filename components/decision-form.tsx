'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { Decision, Criterion, Option } from '@/lib/decision-engine';
import { Trash2, Plus } from 'lucide-react';

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || criteria.some((c) => !c.name.trim()) || options.some((o) => !o.name.trim())) {
      alert('Please fill in all fields');
      return;
    }

    const totalWeight = criteria.reduce((sum, c) => sum + c.weight, 0);
    if (totalWeight !== 100) {
      alert(`Criterion weights must sum to 100% (currently ${totalWeight}%)`);
      return;
    }

    const decision: Decision = {
      id: initialDecision?.id || Date.now().toString(),
      name,
      description,
      criteria,
      options,
      scores: initialDecision?.scores || [],
      createdAt: initialDecision?.createdAt || new Date(),
    };

    onDecisionCreate(decision);
  };

  const totalWeight = criteria.reduce((sum, c) => sum + c.weight, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Decision Setup</CardTitle>
        <CardDescription>Define your decision, criteria, and options</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Decision Name</label>
              <Input
                placeholder="e.g., Choose a new laptop"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <Textarea
                placeholder="Describe what you're deciding on..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>

          {/* Criteria */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium">
                Evaluation Criteria (Weight: {totalWeight}%)
              </label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddCriterion}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add
              </Button>
            </div>
            <div className="space-y-3">
              {criteria.map((criterion) => (
                <div key={criterion.id} className="flex gap-2">
                  <Input
                    placeholder="Criterion name"
                    value={criterion.name}
                    onChange={(e) => handleCriterionChange(criterion.id, 'name', e.target.value)}
                    className="flex-1"
                  />
                  <Input
                    type="number"
                    placeholder="Weight %"
                    min="0"
                    max="100"
                    value={criterion.weight}
                    onChange={(e) => handleCriterionChange(criterion.id, 'weight', e.target.value)}
                    className="w-24"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveCriterion(criterion.id)}
                    disabled={criteria.length === 1}
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
              <label className="block text-sm font-medium">Options to Compare</label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddOption}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add
              </Button>
            </div>
            <div className="space-y-3">
              {options.map((option) => (
                <div key={option.id} className="flex gap-2">
                  <Input
                    placeholder="Option name"
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
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <Button type="submit" className="w-full">
            Continue to Scoring
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
