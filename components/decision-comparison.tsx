'use client';

import { useState, useEffect } from 'react';
import { storageManager } from '@/lib/storage';
import { analyzeDecision } from '@/lib/decision-engine';
import type { Decision, AnalysisResult } from '@/lib/decision-engine';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis 
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Trophy,
  Target,
  ArrowRight,
  Eye,
  Share
} from 'lucide-react';

interface ComparisonProps {
  decisions?: Decision[]; // Pass decisions directly instead of loading from storage
  selectedDecisions?: string[]; // Decision IDs to compare
  onClose?: () => void;
}

interface ComparisonMetric {
  label: string;
  key: string;
  format: (value: number) => string;
  higher_is_better: boolean;
}

const COMPARISON_METRICS: ComparisonMetric[] = [
  { label: 'Top Score', key: 'topScore', format: (v) => v.toFixed(1), higher_is_better: true },
  { label: 'Score Range', key: 'scoreRange', format: (v) => v.toFixed(1), higher_is_better: false },
  { label: 'Clear Winner', key: 'clearWinner', format: (v) => v > 0.8 ? 'Yes' : 'No', higher_is_better: true },
  { label: 'Criteria Count', key: 'criteriaCount', format: (v) => v.toString(), higher_is_better: false },
  { label: 'Options Count', key: 'optionsCount', format: (v) => v.toString(), higher_is_better: false }
];

export function DecisionComparison({ decisions: propDecisions, selectedDecisions = [], onClose }: ComparisonProps) {
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [analysisResults, setAnalysisResults] = useState<Record<string, AnalysisResult[]>>({});
  const [activeTab, setActiveTab] = useState<'overview' | 'detailed' | 'charts'>('overview');
  const [initialized, setInitialized] = useState(false);

  // Load all decisions once - use prop if provided, otherwise load from storage
  useEffect(() => {
    const allDecisions = propDecisions || storageManager.loadDecisions();
    setDecisions(allDecisions);
  }, [propDecisions]);

  // Initialize selected decisions once when component mounts or when selectedDecisions prop changes
  useEffect(() => {
    if (!initialized && decisions.length > 0) {
      if (selectedDecisions.length > 0) {
        setSelectedIds(selectedDecisions);
      } else {
        // Auto-select most recent decisions for comparison
        const sorted = decisions.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setSelectedIds(sorted.slice(0, 3).map(d => d.id));
      }
      setInitialized(true);
    }
  }, [initialized, decisions, selectedDecisions]);

  useEffect(() => {
    const results: Record<string, AnalysisResult[]> = {};
    selectedIds.forEach(id => {
      const decision = decisions.find(d => d.id === id);
      if (decision && decision.scores.length > 0) {
        results[id] = analyzeDecision(decision);
      }
    });
    setAnalysisResults(results);
  }, [selectedIds, decisions]);

  const selectedDecisionObjs = decisions.filter(d => selectedIds.includes(d.id));

  const toggleDecisionSelection = (id: string) => {
    setSelectedIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(decisionId => decisionId !== id);
      } else if (prev.length < 5) {
        return [...prev, id];
      } else {
        return prev; // Max 5 decisions for comparison
      }
    });
  };

  const getComparisonMetrics = (decision: Decision, results: AnalysisResult[]) => {
    const scores = results.map(r => r.totalScore);
    return {
      topScore: Math.max(...scores),
      scoreRange: Math.max(...scores) - Math.min(...scores),
      clearWinner: (Math.max(...scores) - Math.min(...scores)) / Math.max(...scores),
      criteriaCount: decision.criteria.length,
      optionsCount: decision.options.length
    };
  };

  const getDecisionTrend = (metrics: ReturnType<typeof getComparisonMetrics>) => {
    if (metrics.clearWinner > 0.3) return 'up';
    if (metrics.scoreRange < 1.0) return 'down';
    return 'stable';
  };

  const prepareChartData = () => {
    if (selectedDecisionObjs.length === 0) return [];
    
    const chartData: any[] = [];
    
    selectedDecisionObjs.forEach(decision => {
      const results = analysisResults[decision.id] || [];
      results.forEach((result, optionIndex) => {
        const dataPoint: any = {
          decisionName: decision.name.slice(0, 20) + '...',
          optionName: result.optionName,
          totalScore: result.totalScore,
          percentage: result.percentage,
          rank: result.rank,
          decisionId: decision.id
        };
        
        // Add criterion-specific scores for radar chart
        result.scores.forEach(score => {
          dataPoint[score.criterionName] = score.score;
        });
        
        chartData.push(dataPoint);
      });
    });
    
    return chartData;
  };

  const getRadarData = () => {
    if (selectedDecisionObjs.length === 0) return [];
    
    // Get all unique criteria across decisions
    const allCriteria = new Set<string>();
    selectedDecisionObjs.forEach(decision => {
      decision.criteria.forEach(c => allCriteria.add(c.name));
    });
    
    const radarData: any[] = [];
    
    Array.from(allCriteria).forEach(criterionName => {
      const dataPoint: any = { criterion: criterionName };
      
      selectedDecisionObjs.forEach(decision => {
        const results = analysisResults[decision.id] || [];
        const topResult = results[0]; // Winner for this decision
        const criterionScore = topResult?.scores.find(s => s.criterionName === criterionName);
        dataPoint[decision.name.slice(0, 15)] = criterionScore?.score || 0;
      });
      
      radarData.push(dataPoint);
    });
    
    return radarData;
  };

  if (decisions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Decision Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            No decisions found. Create some decisions first to use the comparison feature.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Decision Comparison Matrix
            </CardTitle>
            {onClose && (
              <Button variant="outline" size="sm" onClick={onClose}>
                Close
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <h3 className="text-sm font-medium mb-2">Select Decisions to Compare (Max 5):</h3>
            <div className="flex flex-wrap gap-2">
              {decisions.map(decision => (
                <Button
                  key={decision.id}
                  variant={selectedIds.includes(decision.id) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleDecisionSelection(decision.id)}
                  disabled={!selectedIds.includes(decision.id) && selectedIds.length >= 5}
                >
                  {decision.name}
                  {selectedIds.includes(decision.id) && (
                    <Badge variant="secondary" className="ml-2 h-4 w-4 rounded-full p-0 text-xs">
                      {selectedIds.indexOf(decision.id) + 1}
                    </Badge>
                  )}
                </Button>
              ))}
            </div>
          </div>

          {selectedDecisionObjs.length > 0 && (
            <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)}>
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="detailed">Detailed</TabsTrigger>
                <TabsTrigger value="charts">Charts</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {selectedDecisionObjs.map(decision => {
                    const results = analysisResults[decision.id] || [];
                    const metrics = getComparisonMetrics(decision, results);
                    const trend = getDecisionTrend(metrics);
                    const winner = results[0];

                    return (
                      <Card key={decision.id} className="relative">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg flex items-start gap-2">
                            <div>
                              {decision.name}
                              {results.length > 0 && (
                                <div className="flex items-center gap-1 mt-1">
                                  {trend === 'up' ? (
                                    <TrendingUp className="h-4 w-4 text-green-600" />
                                  ) : trend === 'down' ? (
                                    <TrendingDown className="h-4 w-4 text-red-600" />
                                  ) : (
                                    <Minus className="h-4 w-4 text-yellow-600" />
                                  )}
                                  <span className="text-sm text-muted-foreground">
                                    {trend === 'up' ? 'Clear Choice' : 
                                     trend === 'down' ? 'Close Decision' : 'Mixed Results'}
                                  </span>
                                </div>
                              )}
                            </div>
                          </CardTitle>
                          {winner && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Trophy className="h-4 w-4 text-yellow-500" />
                              <span className="font-medium">{winner.optionName}</span>
                              <Badge variant="secondary">{winner.percentage.toFixed(0)}%</Badge>
                            </div>
                          )}
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {COMPARISON_METRICS.slice(0, 3).map(metric => {
                            const value = metrics[metric.key as keyof typeof metrics];
                            const formattedValue = metric.format(value as number);
                            
                            return (
                              <div key={metric.key} className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">{metric.label}:</span>
                                <span className="font-medium">{formattedValue}</span>
                              </div>
                            );
                          })}
                          
                          <div className="pt-2">
                            <div className="flex justify-between items-center text-xs text-muted-foreground mb-1">
                              <span>Decision Clarity</span>
                              <span>{(metrics.clearWinner * 100).toFixed(0)}%</span>
                            </div>
                            <Progress value={metrics.clearWinner * 100} className="h-2" />
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </TabsContent>

              <TabsContent value="detailed" className="space-y-4">
                <div className="grid gap-4">
                  {selectedDecisionObjs.map(decision => {
                    const results = analysisResults[decision.id] || [];
                    
                    return (
                      <Card key={decision.id}>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Eye className="h-5 w-5" />
                            {decision.name}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground">
                            {decision.description}
                          </p>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {results.map((result, index) => (
                              <div 
                                key={result.optionId}
                                className={`flex items-center justify-between p-3 rounded-lg border ${
                                  index === 0 ? 'border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20' : ''
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  {index === 0 && <Trophy className="h-4 w-4 text-yellow-500" />}
                                  <div>
                                    <div className="font-medium">{result.optionName}</div>
                                    <div className="text-sm text-muted-foreground">
                                      Rank #{result.rank}
                                    </div>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="font-bold text-lg">
                                    {result.totalScore.toFixed(1)}
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    {result.percentage.toFixed(0)}%
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </TabsContent>

              <TabsContent value="charts" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Score Comparison</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={prepareChartData()}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="optionName" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="totalScore" fill="#8884d8" name="Total Score" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Criteria Comparison (Top Choices)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart data={getRadarData()}>
                          <PolarGrid />
                          <PolarAngleAxis dataKey="criterion" />
                          <PolarRadiusAxis angle={90} domain={[0, 10]} />
                          {selectedDecisionObjs.map((decision, index) => (
                            <Radar
                              key={decision.id}
                              name={decision.name.slice(0, 15)}
                              dataKey={decision.name.slice(0, 15)}
                              stroke={['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1'][index]}
                              fill={['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1'][index]}
                              fillOpacity={0.3}
                            />
                          ))}
                          <Tooltip />
                          <Legend />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  );
}