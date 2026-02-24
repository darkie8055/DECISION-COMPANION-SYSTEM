/**
 * Enhanced storage manager for persistent decision data
 * Includes data migration, backup, and export/import functionality
 */

import type { Decision } from './decision-engine';

interface StorageMetadata {
  version: string;
  lastBackup?: Date;
  totalDecisions: number;
  storageUsed: number;
}

interface DecisionOutcome {
  decisionId: string;
  rating: 1 | 2 | 3 | 4 | 5; // How well did this decision work out?
  notes: string;
  followUpDate: Date;
  lessons?: string;
}

interface WeightTemplate {
  id: string;
  name: string;
  category: string;
  weights: Record<string, number>;
  description: string;
  usageCount: number;
  createdAt: Date;
}

interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  defaultTemplate?: string;
  autoSave: boolean;
  enableAnalytics: boolean;
  exportFormat: 'pdf' | 'excel' | 'json';
}

interface AnalyticsData {
  decisionCount: number;
  averageCompletionTime: number;
  mostUsedTemplates: Record<string, number>;
  criteriaPopularity: Record<string, number>;
  monthlyDecisionTrend: Record<string, number>;
}

class StorageManager {
  private static readonly STORAGE_VERSION = '2.0';
  private static readonly KEYS = {
    DECISIONS: 'decision_companion_decisions',
    OUTCOMES: 'decision_companion_outcomes', 
    WEIGHT_TEMPLATES: 'decision_companion_weight_templates',
    PREFERENCES: 'decision_companion_preferences',
    ANALYTICS: 'decision_companion_analytics',
    METADATA: 'decision_companion_metadata'
  } as const;

  // Decision Management
  saveDecision(decision: Decision): boolean {
    try {
      const decisions = this.loadDecisions();
      const existingIndex = decisions.findIndex(d => d.id === decision.id);
      
      if (existingIndex >= 0) {
        decisions[existingIndex] = { ...decision, updatedAt: new Date() };
      } else {
        decisions.push({ ...decision, createdAt: new Date() });
      }
      
      localStorage.setItem(StorageManager.KEYS.DECISIONS, JSON.stringify(decisions));
      this.updateMetadata();
      this.updateAnalytics(decision);
      return true;
    } catch (error) {
      console.error('Failed to save decision:', error);
      return false;
    }
  }

  loadDecisions(): Decision[] {
    try {
      const stored = localStorage.getItem(StorageManager.KEYS.DECISIONS);
      if (!stored) return [];
      
      const parsed = JSON.parse(stored);
      return parsed.map((d: any) => ({
        ...d,
        createdAt: new Date(d.createdAt),
        updatedAt: d.updatedAt ? new Date(d.updatedAt) : undefined
      }));
    } catch (error) {
      console.error('Failed to load decisions:', error);
      return [];
    }
  }

  deleteDecision(id: string): boolean {
    try {
      const decisions = this.loadDecisions();
      const filtered = decisions.filter(d => d.id !== id);
      localStorage.setItem(StorageManager.KEYS.DECISIONS, JSON.stringify(filtered));
      this.updateMetadata();
      return true;
    } catch (error) {
      console.error('Failed to delete decision:', error);
      return false;
    }
  }

  // Weight Templates
  saveWeightTemplate(template: Omit<WeightTemplate, 'id' | 'createdAt' | 'usageCount'>): string {
    const templates = this.loadWeightTemplates();
    const newTemplate: WeightTemplate = {
      id: Date.now().toString(),
      createdAt: new Date(),
      usageCount: 0,
      ...template
    };
    
    templates.push(newTemplate);
    localStorage.setItem(StorageManager.KEYS.WEIGHT_TEMPLATES, JSON.stringify(templates));
    return newTemplate.id;
  }

  loadWeightTemplates(): WeightTemplate[] {
    try {
      const stored = localStorage.getItem(StorageManager.KEYS.WEIGHT_TEMPLATES);
      if (!stored) return this.getDefaultWeightTemplates();
      
      const parsed = JSON.parse(stored);
      return parsed.map((t: any) => ({
        ...t,
        createdAt: new Date(t.createdAt)
      }));
    } catch (error) {
      console.error('Failed to load weight templates:', error);
      return this.getDefaultWeightTemplates();
    }
  }

  private getDefaultWeightTemplates(): WeightTemplate[] {
    return [
      {
        id: 'job-evaluation',
        name: 'Job Opportunity',
        category: 'career',
        weights: {
          'Salary & Benefits': 35,
          'Company Culture': 25,
          'Growth Opportunities': 25,
          'Work-Life Balance': 15
        },
        description: 'Balanced approach to job evaluation',
        usageCount: 0,
        createdAt: new Date()
      },
      {
        id: 'laptop-buying',
        name: 'Laptop Purchase',
        category: 'technology',
        weights: {
          'Performance': 35,
          'Price': 30,
          'Build Quality': 20,
          'Battery Life': 15
        },
        description: 'Practical laptop buying priorities',
        usageCount: 0,
        createdAt: new Date()
      },
      {
        id: 'travel-planning',
        name: 'Travel Destination',
        category: 'travel',
        weights: {
          'Cost': 30,
          'Attractions': 25,
          'Safety': 25,
          'Weather': 20
        },
        description: 'Comprehensive travel decision framework',
        usageCount: 0,
        createdAt: new Date()
      },
      {
        id: 'general-purchase',
        name: 'Purchase Decision',
        category: 'general',
        weights: {
          'Price & Value': 35,
          'Quality': 30,
          'Features': 20,
          'Brand Reputation': 15
        },
        description: 'Generic purchase evaluation template',
        usageCount: 0,
        createdAt: new Date()
      }
    ];
  }

  incrementTemplateUsage(templateId: string): void {
    const templates = this.loadWeightTemplates();
    const template = templates.find(t => t.id === templateId);
    if (template) {
      template.usageCount++;
      localStorage.setItem(StorageManager.KEYS.WEIGHT_TEMPLATES, JSON.stringify(templates));
    }
  }

  // Decision Outcomes
  saveDecisionOutcome(outcome: DecisionOutcome): boolean {
    try {
      const outcomes = this.loadDecisionOutcomes();
      const existingIndex = outcomes.findIndex(o => o.decisionId === outcome.decisionId);
      
      if (existingIndex >= 0) {
        outcomes[existingIndex] = outcome;
      } else {
        outcomes.push(outcome);
      }
      
      localStorage.setItem(StorageManager.KEYS.OUTCOMES, JSON.stringify(outcomes));
      return true;
    } catch (error) {
      console.error('Failed to save decision outcome:', error);
      return false;
    }
  }

  loadDecisionOutcomes(): DecisionOutcome[] {
    try {
      const stored = localStorage.getItem(StorageManager.KEYS.OUTCOMES);
      if (!stored) return [];
      
      const parsed = JSON.parse(stored);
      return parsed.map((o: any) => ({
        ...o,
        followUpDate: new Date(o.followUpDate)
      }));
    } catch (error) {
      console.error('Failed to load decision outcomes:', error);
      return [];
    }
  }

  // User Preferences
  savePreferences(preferences: UserPreferences): void {
    localStorage.setItem(StorageManager.KEYS.PREFERENCES, JSON.stringify(preferences));
  }

  loadPreferences(): UserPreferences {
    try {
      const stored = localStorage.getItem(StorageManager.KEYS.PREFERENCES);
      if (!stored) return this.getDefaultPreferences();
      
      return JSON.parse(stored);
    } catch (error) {
      console.error('Failed to load preferences:', error);
      return this.getDefaultPreferences();
    }
  }

  private getDefaultPreferences(): UserPreferences {
    return {
      theme: 'system',
      autoSave: true,
      enableAnalytics: true,
      exportFormat: 'pdf'
    };
  }

  // Analytics
  private updateAnalytics(decision: Decision): void {
    const analytics = this.loadAnalytics();
    analytics.decisionCount++;
    
    // Update template popularity
    if (decision.category) {
      analytics.mostUsedTemplates[decision.category] = 
        (analytics.mostUsedTemplates[decision.category] || 0) + 1;
    }
    
    // Update criteria popularity
    decision.criteria.forEach(criterion => {
      analytics.criteriaPopularity[criterion.name] = 
        (analytics.criteriaPopularity[criterion.name] || 0) + 1;
    });
    
    // Update monthly trend
    const monthKey = new Date().toISOString().slice(0, 7); // YYYY-MM
    analytics.monthlyDecisionTrend[monthKey] = 
      (analytics.monthlyDecisionTrend[monthKey] || 0) + 1;
    
    localStorage.setItem(StorageManager.KEYS.ANALYTICS, JSON.stringify(analytics));
  }

  loadAnalytics(): AnalyticsData {
    try {
      const stored = localStorage.getItem(StorageManager.KEYS.ANALYTICS);
      if (!stored) return this.getDefaultAnalytics();
      
      return JSON.parse(stored);
    } catch (error) {
      console.error('Failed to load analytics:', error);
      return this.getDefaultAnalytics();
    }
  }

  private getDefaultAnalytics(): AnalyticsData {
    return {
      decisionCount: 0,
      averageCompletionTime: 0,
      mostUsedTemplates: {},
      criteriaPopularity: {},
      monthlyDecisionTrend: {}
    };
  }

  // Backup & Export
  exportData(): string {
    const data = {
      version: StorageManager.STORAGE_VERSION,
      exportDate: new Date().toISOString(),
      decisions: this.loadDecisions(),
      outcomes: this.loadDecisionOutcomes(),
      templates: this.loadWeightTemplates(),
      preferences: this.loadPreferences(),
      analytics: this.loadAnalytics()
    };
    
    return JSON.stringify(data, null, 2);
  }

  importData(jsonData: string): { success: boolean; message: string } {
    try {
      const data = JSON.parse(jsonData);
      
      // Validate data structure
      if (!data.version || !data.decisions) {
        return { success: false, message: 'Invalid backup file format' };
      }
      
      // Backup current data
      this.createBackup();
      
      // Import data
      if (data.decisions) {
        localStorage.setItem(StorageManager.KEYS.DECISIONS, JSON.stringify(data.decisions));
      }
      if (data.outcomes) {
        localStorage.setItem(StorageManager.KEYS.OUTCOMES, JSON.stringify(data.outcomes));
      }
      if (data.templates) {
        localStorage.setItem(StorageManager.KEYS.WEIGHT_TEMPLATES, JSON.stringify(data.templates));
      }
      if (data.preferences) {
        localStorage.setItem(StorageManager.KEYS.PREFERENCES, JSON.stringify(data.preferences));
      }
      if (data.analytics) {
        localStorage.setItem(StorageManager.KEYS.ANALYTICS, JSON.stringify(data.analytics));
      }
      
      this.updateMetadata();
      
      return { success: true, message: 'Data imported successfully' };
    } catch (error) {
      return { success: false, message: `Import failed: ${error}` };
    }
  }

  private createBackup(): void {
    const timestamp = new Date().toISOString();
    const backupData = this.exportData();
    localStorage.setItem(`backup_${timestamp}`, backupData);
    
    // Keep only last 5 backups
    const backupKeys = Object.keys(localStorage)
      .filter(key => key.startsWith('backup_'))
      .sort()
      .reverse();
      
    backupKeys.slice(5).forEach(key => {
      localStorage.removeItem(key);
    });
  }

  // Storage Management
  private updateMetadata(): void {
    const metadata: StorageMetadata = {
      version: StorageManager.STORAGE_VERSION,
      lastBackup: new Date(),
      totalDecisions: this.loadDecisions().length,
      storageUsed: this.getStorageSize()
    };
    
    localStorage.setItem(StorageManager.KEYS.METADATA, JSON.stringify(metadata));
  }

  private getStorageSize(): number {
    let totalSize = 0;
    for (const key of Object.values(StorageManager.KEYS)) {
      const item = localStorage.getItem(key);
      if (item) {
        totalSize += item.length;
      }
    }
    return totalSize;
  }

  getStorageInfo(): StorageMetadata {
    try {
      const stored = localStorage.getItem(StorageManager.KEYS.METADATA);
      if (!stored) return {
        version: StorageManager.STORAGE_VERSION,
        totalDecisions: 0,
        storageUsed: 0
      };
      
      const parsed = JSON.parse(stored);
      return {
        ...parsed,
        lastBackup: parsed.lastBackup ? new Date(parsed.lastBackup) : undefined
      };
    } catch (error) {
      console.error('Failed to load storage metadata:', error);
      return {
        version: StorageManager.STORAGE_VERSION,
        totalDecisions: 0,
        storageUsed: 0
      };
    }
  }

  clearAllData(): boolean {
    try {
      Object.values(StorageManager.KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
      
      // Remove backup files too
      Object.keys(localStorage)
        .filter(key => key.startsWith('backup_'))
        .forEach(key => localStorage.removeItem(key));
        
      return true;
    } catch (error) {
      console.error('Failed to clear data:', error);
      return false;
    }
  }
}

// Export singleton instance
export const storageManager = new StorageManager();

// Export types for use in components
export type { 
  DecisionOutcome, 
  WeightTemplate, 
  UserPreferences, 
  AnalyticsData, 
  StorageMetadata 
};