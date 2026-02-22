'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, ComposedChart } from 'recharts';
import type { Decision } from '@/lib/decision-engine';
import { analyzeDecision } from '@/lib/decision-engine';
import { Clock, TrendingUp, Zap, ArrowRight } from 'lucide-react';

interface DecisionHistoryProps {
  decisions: Decision[];
  onSelectDecision: (decision: Decision) => void;
}

export function DecisionHistory({ decisions, onSelectDecision }: DecisionHistoryProps) {
  if (decisions.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">No saved decisions yet.</p>
        </CardContent>
      </Card>
    );
  }

  const analysisData = decisions.map((decision) => {
    const results = analyzeDecision(decision);
    const displayName = (decision as any).displayName || decision.name;
    return {
      name: displayName.length > 20 ? displayName.substring(0, 18) + '...' : displayName,
      decision,
      results,
      topScore: results[0]?.totalScore || 0,
      optionCount: decision.options.length,
      criteriaCount: decision.criteria.length,
    };
  });

  // Chart data for comparison
  const comparisonData = decisions.map((decision) => {
    const results = analyzeDecision(decision);
    const displayName = (decision as any).displayName || decision.name;
    return {
      name: displayName.length > 15 ? displayName.substring(0, 13) + '...' : displayName,
      topScore: results[0]?.totalScore || 0,
      avgScore: results.reduce((sum, r) => sum + r.totalScore, 0) / results.length,
      options: decision.options.length,
    };
  });

  // Best choices across decisions
  const bestChoices = analysisData.map((data) => ({
    decision: (data.decision as any).displayName || data.decision.name,
    choice: data.results[0]?.optionName,
    score: data.results[0]?.totalScore,
    confidence: (data.results[0]?.totalScore || 0) / 10 * 100,
  }));

  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="comparison">Comparison</TabsTrigger>
          <TabsTrigger value="history">Timeline</TabsTrigger>
        </TabsList>

        {/* Overview */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Total Decisions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{decisions.length}</div>
                <p className="text-xs text-muted-foreground mt-1">Saved analyses</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Avg Top Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {(analysisData.reduce((sum, d) => sum + d.topScore, 0) / analysisData.length).toFixed(1)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Out of 10</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Avg Options</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {(analysisData.reduce((sum, d) => sum + d.optionCount, 0) / analysisData.length).toFixed(1)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Per decision</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Your Best Choices
              </CardTitle>
              <CardDescription>Recommended options from each decision</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {bestChoices.map((item, index) => (
                  <div key={index} className="space-y-2 pb-4 border-b last:border-b-0 last:pb-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium">{item.decision}</p>
                        <p className="text-sm text-muted-foreground">→ {item.choice}</p>
                      </div>
                      <Badge variant="secondary">{item.score?.toFixed(1)}/10</Badge>
                    </div>
                    <Progress value={item.confidence} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                All Saved Decisions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {decisions.map((decision, index) => {
                const displayName = (decision as any).displayName || decision.name;
                const savedAt = (decision as any).savedAt;
                const savedAtText = savedAt ? 
                  (savedAt instanceof Date ? savedAt : new Date(savedAt)).toLocaleDateString() : null;
                
                return (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary/70 transition-colors">
                    <div>
                      <p className="font-medium">{displayName}</p>
                      <p className="text-xs text-muted-foreground">
                        {decision.options.length} options • {decision.criteria.length} criteria
                        {savedAtText && ` • Saved ${savedAtText}`}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onSelectDecision(decision)}
                      className="gap-2"
                    >
                      <ArrowRight className="w-4 h-4" />
                      View
                    </Button>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Comparison Chart */}
        <TabsContent value="comparison" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Score Comparison</CardTitle>
              <CardDescription>How your top choices compare across decisions</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <ComposedChart data={comparisonData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="topScore" fill="var(--color-chart-1)" name="Top Score" />
                  <Line type="monotone" dataKey="avgScore" stroke="var(--color-chart-2)" name="Avg Score" />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Decision Complexity</CardTitle>
              <CardDescription>Options vs Criteria for each decision</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analysisData.map(d => ({
                  name: d.decision.name.substring(0, 15),
                  options: d.optionCount,
                  criteria: d.criteriaCount,
                }))}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="options" fill="var(--color-chart-3)" name="Options" />
                  <Bar dataKey="criteria" fill="var(--color-chart-4)" name="Criteria" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Timeline */}
        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Decision Timeline
              </CardTitle>
              <CardDescription>Your decision-making journey</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analysisData.map((data, index) => {
                  const topResult = data.results[0];
                  return (
                    <div
                      key={index}
                      className="relative pl-6 pb-6 last:pb-0"
                    >
                      <div className="absolute left-0 top-2 w-3 h-3 rounded-full bg-primary" />
                      {index < analysisData.length - 1 && (
                        <div className="absolute left-1.5 top-5 bottom-0 w-0.5 bg-border" />
                      )}
                      <div className="space-y-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-semibold">{data.decision.name}</p>
                            <p className="text-sm text-muted-foreground">
                              Chose: <span className="font-medium text-foreground">{topResult?.optionName}</span>
                            </p>
                          </div>
                          <Badge variant="outline">
                            {topResult?.totalScore.toFixed(1)}/10
                          </Badge>
                        </div>
                        <Progress value={(topResult?.totalScore || 0) / 10 * 100} className="h-2" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
