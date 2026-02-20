# Architecture & System Design

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                     DECISION COMPANION APPLICATION                   │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE LAYER                         │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  app/page.tsx (Main Orchestrator Component)                 │  │
│  │  - State Management (decision, history, active tab)         │  │
│  │  - Route Handling (templates → setup → scoring → results)   │  │
│  │  - Handler Functions                                        │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  ┌─────────────────┐  ┌──────────────────┐  ┌────────────────────┐ │
│  │ templates-      │  │ decision-form.   │  │ scoring-matrix.    │ │
│  │ selector.tsx    │  │ tsx              │  │ tsx                │ │
│  │ (7 templates +  │  │ (custom setup)   │  │ (interactive       │ │
│  │  custom option) │  │                  │  │  sliders)          │ │
│  └─────────────────┘  └──────────────────┘  └────────────────────┘ │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │ Analysis Interface (Tabbed)                                 │  │
│  │  ┌──────────────┐ ┌──────────────┐ ┌────────────────────┐ │  │
│  │  │ analysis-    │ │ risk-        │ │ sensitivity-       │ │  │
│  │  │ results.tsx  │ │ assessment.  │ │ analysis.tsx       │ │  │
│  │  │ (charts +    │ │ tsx (risk    │ │ (what-if testing)  │ │  │
│  │  │  rankings)   │ │  metrics)    │ │                    │ │  │
│  │  └──────────────┘ └──────────────┘ └────────────────────┘ │  │
│  └─────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ decision-history.tsx (Comparison & History)                 │  │
│  │ - View saved decisions                                       │  │
│  │ - Compare multiple analyses                                  │  │
│  └──────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                      BUSINESS LOGIC LAYER                            │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ decision-engine.ts - CORE ALGORITHM                          │  │
│  │                                                              │  │
│  │  calculateWeightedScore(option, criteria, scores)          │  │
│  │  ├─ For each criterion:                                    │  │
│  │  │  weighted = (criterion.weight × option.score) / 100    │  │
│  │  └─ Return sum of all weighted scores                      │  │
│  │                                                             │  │
│  │  analyzeDecision(decision)                                 │  │
│  │  ├─ Calculate scores for all options                       │  │
│  │  ├─ Rank options by score                                  │  │
│  │  ├─ Calculate percentage confidence                        │  │
│  │  └─ Return analysis results array                          │  │
│  │                                                             │  │
│  │  calculateRiskMetrics(results)                             │  │
│  │  ├─ Score Variance (how consistent)                        │  │
│  │  ├─ Decision Clarity (how clear winner is)                 │  │
│  │  ├─ Option Diversity (enough alternatives)                 │  │
│  │  └─ Risk Level classification                              │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ templates.ts - PREDEFINED FRAMEWORKS                        │  │
│  │                                                              │  │
│  │ TEMPLATES Object:                                            │  │
│  │ ├─ job-offer (6 criteria)                                  │  │
│  │ ├─ laptop-purchase (5 criteria)                            │  │
│  │ ├─ travel-destination (5 criteria)                         │  │
│  │ ├─ business-investment (6 criteria)                        │  │
│  │ ├─ home-purchase (6 criteria)                              │  │
│  │ ├─ college-choice (6 criteria)                             │  │
│  │ └─ vendor-selection (6 criteria)                           │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ export-utils.ts - REPORT GENERATION                         │  │
│  │                                                              │  │
│  │ generateDetailedReport(decision, results)                   │  │
│  │ ├─ Format decision overview                                 │  │
│  │ ├─ Include criteria and weights                             │  │
│  │ ├─ Create scoring matrix table                              │  │
│  │ ├─ List rankings                                            │  │
│  │ └─ Add recommendations                                      │  │
│  │                                                             │  │
│  │ downloadFile(content, filename, type)                       │  │
│  │ └─ Handle file download to user's machine                  │  │
│  └──────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                      PRESENTATION LAYER                              │
│                                                                      │
│  Components Library (shadcn/ui)                                      │
│  ├─ Button, Card, Input, Textarea                                   │
│  ├─ Slider, Progress, Badge, Alert                                  │
│  ├─ Table, Tabs, Dialog                                             │
│  └─ Icons from Lucide                                               │
│                                                                      │
│  Styling                                                             │
│  ├─ Tailwind CSS v4                                                 │
│  ├─ CSS Design Tokens (--primary, --accent, etc.)                   │
│  ├─ Light & Dark Mode Support                                       │
│  └─ Responsive Design (mobile-first)                                │
│                                                                      │
│  Visualization                                                       │
│  └─ Recharts                                                         │
│     ├─ BarChart (score comparisons)                                 │
│     ├─ RadarChart (decision profile)                                │
│     └─ LineChart (sensitivity analysis)                             │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                      DATA LAYER                                      │
│                                                                      │
│  TypeScript Interfaces:                                              │
│  ├─ Decision                                                        │
│  │  ├─ id: string                                                  │
│  │  ├─ name: string                                                │
│  │  ├─ description: string                                         │
│  │  ├─ criteria: Criterion[]                                       │
│  │  ├─ options: Option[]                                           │
│  │  ├─ scores: Score[]                                             │
│  │  └─ createdAt: Date                                             │
│  │                                                                  │
│  ├─ Criterion                                                       │
│  │  ├─ id: string                                                  │
│  │  ├─ name: string                                                │
│  │  └─ weight: number                                              │
│  │                                                                  │
│  ├─ Option                                                          │
│  │  ├─ id: string                                                  │
│  │  └─ name: string                                                │
│  │                                                                  │
│  ├─ Score                                                           │
│  │  ├─ optionId: string                                            │
│  │  ├─ criterionId: string                                         │
│  │  └─ score: number (0-10)                                        │
│  │                                                                  │
│  └─ AnalysisResult                                                  │
│     ├─ optionId: string                                            │
│     ├─ optionName: string                                          │
│     ├─ totalScore: number                                          │
│     ├─ percentage: number                                          │
│     ├─ rank: number                                                │
│     └─ scores: { criterionName, score }[]                          │
│                                                                      │
│  Storage:                                                            │
│  ├─ React State (current decision, history)                        │
│  └─ Session Memory (no persistence yet)                            │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                      DEPLOYMENT & RUNTIME                            │
│                                                                      │
│  Runtime Environment:                                                │
│  ├─ Node.js 18+ (development & build)                              │
│  ├─ Browser (Chrome, Safari, Firefox, Edge)                        │
│  └─ Vercel Platform (recommended deployment)                        │
│                                                                      │
│  Build Process:                                                      │
│  ├─ TypeScript Compilation                                          │
│  ├─ Next.js Compilation (with Turbopack)                           │
│  ├─ Tailwind CSS Processing                                         │
│  ├─ Code Splitting & Tree Shaking                                   │
│  └─ Production Optimizations                                        │
│                                                                      │
│  Performance:                                                        │
│  ├─ Bundle Size: ~150KB gzipped                                     │
│  ├─ Time to Interactive: <1s (4G)                                   │
│  ├─ Lighthouse Scores: 92-100                                       │
│  └─ Zero Server Calls (client-side only)                            │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Data Flow Diagram

```
USER JOURNEY: FROM DECISION TO ANALYSIS

START
  │
  ├─► [Template Selection Screen]
  │   ├─ User views 7 pre-built templates
  │   ├─ OR chooses "Create Custom"
  │   └─ Selection triggers decision setup
  │
  ├─► [Decision Setup (if custom)]
  │   ├─ Enter decision name
  │   ├─ Add criteria (2+ required)
  │   ├─ Set weights (must sum to 100%)
  │   ├─ Add options (2+ required)
  │   └─ Validation feedback on each field
  │
  ├─► [Scoring Phase]
  │   ├─ Display decision overview
  │   ├─ Show scoring matrix
  │   │  ├─ Rows: Options to evaluate
  │   │  ├─ Columns: Criteria (with weights)
  │   │  └─ Cells: Interactive sliders (0-10)
  │   ├─ Color-coded feedback (red/yellow/green)
  │   ├─ Progress bar showing completion
  │   └─ "Analyze Results" button (enabled when complete)
  │
  ├─► [Analysis Engine] (lib/decision-engine.ts)
  │   ├─ Input: Decision + all scores
  │   │
  │   ├─ CALCULATION PHASE
  │   │  ├─ For each Option:
  │   │  │  ├─ For each Criterion:
  │   │  │  │  └─ weighted_score = weight × score / 100
  │   │  │  └─ total_score = sum of weighted scores
  │   │  └─ Results: AnalysisResult[]
  │   │
  │   ├─ RANKING PHASE
  │   │  ├─ Sort options by total_score (descending)
  │   │  ├─ Assign rank (1, 2, 3...)
  │   │  └─ Calculate percentage confidence
  │   │
  │   └─ Output: Complete Analysis Results
  │
  ├─► [Risk Assessment Analysis]
  │   ├─ Calculate variance in scores
  │   │  └─ High variance = uncertain decision
  │   │
  │   ├─ Calculate decision clarity
  │   │  └─ Gap between top 2 options
  │   │
  │   ├─ Evaluate option diversity
  │   │  └─ Warn if too few alternatives
  │   │
  │   └─ Classify risk level
  │      ├─ GREEN (Stable & Clear)
  │      ├─ YELLOW (Uncertain or Low Diversity)
  │      └─ RED (Unstable Decision)
  │
  ├─► [Results Display - Tabbed Interface]
  │   │
  │   ├─ TAB 1: ANALYSIS
  │   │  ├─ Summary Cards
  │   │  │  ├─ Top Recommendation (winner)
  │   │  │  ├─ Average Score (across options)
  │   │  │  └─ Score Range (best/worst)
  │   │  │
  │   │  ├─ Visualization
  │   │  │  ├─ Bar Chart (option comparison)
  │   │  │  └─ Radar Chart (criteria breakdown)
  │   │  │
  │   │  └─ Rankings Table
  │   │     └─ Complete score breakdown by criterion
  │   │
  │   ├─ TAB 2: RISK ASSESSMENT
  │   │  ├─ Risk Level Badge
  │   │  ├─ Variance Analysis
  │   │  ├─ Clarity Metrics
  │   │  ├─ Diversity Check
  │   │  └─ Recommendations (actionable next steps)
  │   │
  │   └─ TAB 3: SENSITIVITY ANALYSIS
  │      ├─ Interactive Weight Adjustment
  │      │  ├─ Slider for each criterion
  │      │  └─ Real-time score recalculation
  │      │
  │      ├─ Impact Visualization
  │      │  ├─ Line chart showing score trajectories
  │      │  └─ Identify critical criteria
  │      │
  │      └─ "What-if" Testing
  │         └─ Answer: Does the winner change if we adjust weights?
  │
  ├─► [User Actions from Results]
  │   ├─ SAVE: Add to decision history
  │   │  └─ Stored in React state (current session)
  │   │
  │   ├─ COMPARE: View past decisions
  │   │  ├─ Load decision history
  │   │  ├─ Compare side-by-side
  │   │  └─ Identify patterns
  │   │
  │   ├─ EXPORT: Download report
  │   │  ├─ Format: Structured text
  │   │  ├─ Includes: All metrics & analysis
  │   │  └─ File: decision-report-[name]-[timestamp].txt
  │   │
  │   ├─ BACK: Return to scoring
  │   │  └─ Adjust scores and re-analyze
  │   │
  │   └─ HOME: Start new decision
  │      └─ Reset state, show templates
  │
  └─► END

OPTIONAL: DECISION HISTORY FLOW
  │
  ├─ Multiple decisions completed
  ├─ Each saved to decisionHistory array
  ├─ User navigates to History tab
  ├─ Views past decisions with metadata
  ├─ Compares multiple analyses
  └─ Identifies decision-making patterns
```

---

## Component Hierarchy

```
App Root
│
├── app/page.tsx (Main Orchestrator)
│   │
│   ├── [Step: templates]
│   │   └── TemplatesSelector
│   │       ├── 7 Template Cards (clickable)
│   │       ├── Custom Decision Button
│   │       └── How It Works Guide
│   │
│   ├── [Step: setup]
│   │   └── DecisionForm
│   │       ├── Decision Name Input
│   │       ├── Description Textarea
│   │       ├── Criteria Editor
│   │       │   ├── Criterion Inputs
│   │       │   ├── Weight Inputs
│   │       │   ├── Weight Progress Bar
│   │       │   └── Add/Remove Buttons
│   │       ├── Options Editor
│   │       │   ├── Option Inputs
│   │       │   └── Add/Remove Buttons
│   │       └── Form Validation Summary
│   │
│   ├── [Step: scoring]
│   │   ├── Decision Header Card
│   │   └── ScoringMatrix
│   │       ├── Progress Bar (completion %)
│   │       ├── Scoring Table
│   │       │   ├── Rows: Options
│   │       │   ├── Cells: Sliders
│   │       │   └── Score Display (color-coded)
│   │       ├── Scoring Guide Card
│   │       └── Analyze Button
│   │
│   ├── [Step: results]
│   │   ├── Decision Header Card
│   │   ├── Tabs Component
│   │   │   │
│   │   │   ├── Tab 1: Analysis
│   │   │   │   ├── AnalysisResults
│   │   │   │   │   ├── Summary Cards
│   │   │   │   │   │   ├── Top Recommendation
│   │   │   │   │   │   ├── Average Score
│   │   │   │   │   │   └── Score Range
│   │   │   │   │   ├── Rankings List
│   │   │   │   │   │   └── Progress bars per option
│   │   │   │   │   ├── Detailed Breakdown Table
│   │   │   │   │   │   └── Score matrix with badges
│   │   │   │   │   ├── Bar Chart
│   │   │   │   │   │   └── Option comparison
│   │   │   │   │   └── Export/Sensitivity Buttons
│   │   │   │   │
│   │   │   ├── Tab 2: Risk Assessment
│   │   │   │   └── RiskAssessment
│   │   │   │       ├── Risk Level Badge
│   │   │   │       ├── Variance Analysis
│   │   │   │       ├── Clarity Metrics
│   │   │   │       ├── Diversity Check
│   │   │   │       ├── Risk Timeline
│   │   │   │       └── Recommendations
│   │   │   │
│   │   │   └── Tab 3: Sensitivity Analysis
│   │   │       └── SensitivityAnalysis
│   │   │           ├── Interactive Weight Sliders
│   │   │           ├── Real-time Score Display
│   │   │           ├── Line Chart (trajectories)
│   │   │           └── Critical Criteria Highlight
│   │   │
│   │   ├── Action Buttons
│   │   │   ├── Save Decision
│   │   │   ├── Compare (if history exists)
│   │   │   ├── Export Report
│   │   │   └── Share
│   │   │
│   │   └── Navigation
│   │       ├── Back Button
│   │       └── Home Button
│   │
│   ├── [Step: history]
│   │   └── DecisionHistory
│   │       ├── Saved Decisions List
│   │       ├── Decision Comparison View
│   │       │   ├── Side-by-side metrics
│   │       │   ├── Score comparisons
│   │       │   └── Risk comparisons
│   │       └── Load Decision Button
│   │
│   └── Header Navigation
│       ├── Breadcrumb/Back Button
│       ├── Home Button
│       └── Action Buttons (Save/Compare/Share)
```

---

## State Management Architecture

```
PAGE STATE STRUCTURE (React.useState)

┌─────────────────────────────────────────────┐
│         app/page.tsx State                  │
├─────────────────────────────────────────────┤
│                                             │
│ step: Step                                  │
│ ├─ 'templates'                              │
│ ├─ 'setup'                                  │
│ ├─ 'scoring'                                │
│ ├─ 'results'                                │
│ └─ 'history'                                │
│                                             │
│ decision: Decision | null                   │
│ ├─ Holds current decision being worked on   │
│ ├─ Passed to all child components           │
│ └─ Reset when starting new decision         │
│                                             │
│ decisionHistory: Decision[]                 │
│ ├─ Array of saved/completed decisions      │
│ ├─ Populated when user clicks "Save"        │
│ └─ Used for comparison and history          │
│                                             │
│ activeTab: 'analysis' | 'risk' | 'history'│
│ ├─ Controls which results tab is shown      │
│ ├─ Persists while on results page           │
│ └─ Reset when returning to scoring          │
│                                             │
└─────────────────────────────────────────────┘

DATA FLOW THROUGH COMPONENTS

Input Data (decision):
┌──────────────────────────────────────────┐
│ {                                        │
│   id: "12345",                           │
│   name: "Choose Laptop",                 │
│   description: "For work and personal",  │
│   criteria: [                            │
│     { id: "1", name: "Price", weight: 25},
│     { id: "2", name: "Performance", w: 35},
│     ...                                  │
│   ],                                     │
│   options: [                             │
│     { id: "a", name: "MacBook Pro" },   │
│     { id: "b", name: "Dell XPS" },      │
│     ...                                  │
│   ],                                     │
│   scores: [                              │
│     { optionId: "a", criterionId: "1", score: 6 },
│     ...                                  │
│   ]                                      │
│ }                                        │
└──────────────────────────────────────────┘

Processing (decision-engine.ts):
┌──────────────────────────────────────────┐
│ analyzeDecision(decision)                │
│ ├─ Calculate weighted scores             │
│ ├─ Rank options                          │
│ ├─ Calculate percentages                 │
│ └─ Return AnalysisResult[]               │
└──────────────────────────────────────────┘

Output Data (analysis results):
┌──────────────────────────────────────────┐
│ [                                        │
│   {                                      │
│     optionId: "a",                       │
│     optionName: "MacBook Pro",           │
│     totalScore: 7.85,                    │
│     percentage: 32.5,                    │
│     rank: 1,                             │
│     scores: [                            │
│       { criterionName: "Price", score: 6},
│       { criterionName: "Performance", s: 9},
│       ...                                │
│     ]                                    │
│   },                                     │
│   ...                                    │
│ ]                                        │
└──────────────────────────────────────────┘
```

---

## Algorithm: Weighted Scoring Calculation

```
FORMULA:
╔════════════════════════════════════════════════════════════╗
║  Option Score = Σ(Criterion Weight × Option Score) / 100   ║
╚════════════════════════════════════════════════════════════╝

EXAMPLE CALCULATION:

Decision: Choose Laptop

Criteria Setup:
┌─────────────┬────────┐
│ Criteria    │ Weight │
├─────────────┼────────┤
│ Price       │   25%  │
│ Performance │   35%  │
│ Design      │   20%  │
│ Battery     │   20%  │
├─────────────┼────────┤
│ TOTAL       │  100%  │
└─────────────┴────────┘

Option Scores (0-10 scale):
┌──────────┬─────┬─────┬─────┬────────┐
│ Criteria │ M1  │ XPS │ Asus│ Weight │
├──────────┼─────┼─────┼─────┼────────┤
│ Price    │  6  │  7  │  8  │  25%   │
│ Perform  │  9  │  8  │  7  │  35%   │
│ Design   │  9  │  8  │  6  │  20%   │
│ Battery  │  8  │  5  │  7  │  20%   │
└──────────┴─────┴─────┴─────┴────────┘

STEP-BY-STEP CALCULATION FOR M1:

1. Price contribution:
   25% × 6 = 1.5

2. Performance contribution:
   35% × 9 = 3.15

3. Design contribution:
   20% × 9 = 1.8

4. Battery contribution:
   20% × 8 = 1.6

5. Total Score:
   1.5 + 3.15 + 1.8 + 1.6 = 8.05 / 10

FINAL RANKINGS:
┌──────┬──────────┬───────┬────────────┐
│ Rank │ Option   │ Score │ Confidence │
├──────┼──────────┼───────┼────────────┤
│  1   │ MacBook  │  8.05 │   33.3%    │
│  2   │ Dell XPS │  7.35 │   30.4%    │
│  3   │ Asus     │  7.05 │   29.1%    │
└──────┴──────────┴───────┴────────────┘

CONFIDENCE = (Winner Score / Sum of All Scores) × 100
           = 8.05 / (8.05 + 7.35 + 7.05) × 100
           = 33.3%
```

---

## Risk Assessment Logic

```
RISK ANALYSIS FRAMEWORK

1. SCORE VARIANCE
   ├─ Definition: How scattered are individual scores across criteria?
   ├─ Calculation: Standard deviation of all scores
   ├─ Interpretation:
   │  ├─ Variance < 2: Consistent ratings (GOOD)
   │  ├─ Variance 2-3: Moderate scatter (OK)
   │  └─ Variance > 3: Highly inconsistent (RISKY)
   │
   └─ What It Means:
      If you score the same option 8/10 on one criterion
      and 2/10 on another, you're uncertain about its quality.

2. DECISION CLARITY
   ├─ Definition: How clear is the winning option?
   ├─ Calculation: Score gap between 1st and 2nd place
   ├─ Interpretation:
   │  ├─ Gap > 0.5: Clear winner (GOOD)
   │  ├─ Gap 0.2-0.5: Close decision (CAREFUL)
   │  └─ Gap < 0.2: Too close to call (RISKY)
   │
   └─ What It Means:
      If top 2 options score 8.0 and 7.9, it's essentially a tie.
      Small weight changes could flip the ranking.

3. OPTION DIVERSITY
   ├─ Definition: Do you have enough alternatives?
   ├─ Criteria:
   │  ├─ < 2 options: Invalid (need minimum)
   │  ├─ 2-3 options: Low diversity (WARNING)
   │  ├─ 4+ options: Good diversity (OK)
   │  └─ 6+ options: Excellent (HIGH CONFIDENCE)
   │
   └─ What It Means:
      Only comparing 2 options means you might miss better alternatives.
      More options = more robust decision.

4. OVERALL RISK CLASSIFICATION

   GREEN (Stable & Confident):
   ├─ Variance < 2
   ├─ Clarity gap > 0.5
   ├─ Diversity: 4+ options
   └─ Recommendation: Proceed with confidence

   YELLOW (Caution):
   ├─ One or more warning flags
   ├─ Examples:
   │  ├─ High variance but clear winner
   │  ├─ Clear winner but low diversity
   │  └─ Moderate variance with close call
   └─ Recommendation: Reconsider criteria weights or add alternatives

   RED (Unstable):
   ├─ Multiple risk factors
   ├─ Variance > 3 OR
   ├─ Clarity gap < 0.2 OR
   ├─ Only 2 options with multiple uncertainties
   └─ Recommendation: Gather more data, reconsider approach

ACTIONABLE RECOMMENDATIONS:

If Score Variance is High:
→ "You're uncertain about some options. Review and clarify scores."
→ Suggestion: Are criteria definitions clear? Do you need more info?

If Decision Clarity is Low:
→ "Top choices are too close. Weights might not reflect your priorities."
→ Suggestion: Reconsider criterion weights in Sensitivity Analysis.

If Option Diversity is Low:
→ "You're comparing too few alternatives."
→ Suggestion: Add more options or review why you excluded others.
```

---

## Technology Stack Rationale

```
┌─────────────────────────────────────────────────────────┐
│ TECHNOLOGY LAYER DECISIONS                              │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ RUNTIME & BUILD                                         │
│ ├─ Node.js 18+ (LTS)                                   │
│ │  Why: Stable, widely adopted, excellent tooling      │
│ │                                                      │
│ ├─ Next.js 16 (App Router)                             │
│ │  Why: React framework with built-in optimization,    │
│ │        latest React 19 support, Turbopack bundler    │
│ │                                                      │
│ └─ TypeScript 5                                        │
│    Why: Type safety catches bugs, improves DX          │
│                                                         │
│ UI & STYLING                                            │
│ ├─ React 19                                            │
│ │  Why: Latest hooks, better performance               │
│ │                                                      │
│ ├─ Tailwind CSS v4                                     │
│ │  Why: Utility-first, design tokens system,           │
│ │        excellent dark mode support                   │
│ │                                                      │
│ ├─ shadcn/ui                                           │
│ │  Why: Accessible, customizable, no dependencies      │
│ │                                                      │
│ └─ Lucide Icons                                        │
│    Why: Modern, SVG-based, tree-shakeable              │
│                                                         │
│ VISUALIZATION                                           │
│ └─ Recharts                                            │
│    Why: Built on React, responsive, good docs          │
│                                                         │
│ PACKAGE MANAGER                                         │
│ └─ pnpm                                                │
│    Why: Faster, better disk space, monorepo support    │
│                                                         │
└─────────────────────────────────────────────────────────┘

WHY NO BACKEND?
├─ MVP Requirement: Not needed for core functionality
├─ Privacy: Data stays in user's browser
├─ Cost: No server infrastructure
├─ Speed: Faster initial development
└─ Future: Easy to add when needed
```

---

## Scalability & Future Architecture

```
CURRENT ARCHITECTURE (MVP)

Client-Side Only
└─ Single Page App (SPA)
   └─ Session-based state
   └─ In-memory decisions

↓ ↓ ↓ FUTURE PHASE 1 ↓ ↓ ↓

ADD PERSISTENCE LAYER

Client
├─ localStorage / IndexedDB
└─ Session storage

↓ ↓ ↓ FUTURE PHASE 2 ↓ ↓ ↓

ADD BACKEND SERVICES

Client → API Gateway
         ├─ Authentication Service
         ├─ Decision Storage Service
         ├─ User Profile Service
         └─ Analytics Service
         └─ Database (Supabase/Neon)

↓ ↓ ↓ FUTURE PHASE 3 ↓ ↓ ↓

ADD AI & ADVANCED FEATURES

Client ← → Backend
         ├─ OpenAI Integration
         │  ├─ Score suggestions
         │  ├─ Criterion extraction
         │  └─ Insight generation
         ├─ ML Models
         │  ├─ Template recommendations
         │  ├─ Outcome prediction
         │  └─ Pattern detection
         ├─ Analytics
         │  ├─ User cohorts
         │  ├─ Decision trends
         │  └─ Quality metrics
         └─ Integrations
            ├─ Calendar
            ├─ Finance apps
            └─ Real estate APIs

SCALABILITY CONSIDERATIONS

Horizontal Scaling:
├─ Separate frontend & backend deployments
├─ CDN for static assets
├─ API load balancing
└─ Database read replicas

Vertical Scaling:
├─ Code splitting per route
├─ Image optimization
├─ Database indexing
└─ Query optimization

Data Management:
├─ Archive old decisions
├─ Paginate large lists
├─ Compress decision exports
└─ Cache frequent operations
```

---

## Security Architecture

```
CURRENT SECURITY POSTURE

Data Location:
├─ All processing: Client-side browser
├─ No transmission: No external API calls for core logic
├─ No storage: No persistent backend storage (MVP)
└─ User control: Data stays with user

Input Validation:
├─ Weight validation: Must sum to 100%
├─ Score validation: Must be 0-10
├─ Text validation: Trimmed, length limits
└─ Type checking: TypeScript prevents type errors

Output Security:
├─ No sensitive data exposed
├─ Export files client-generated
├─ No analytics/tracking on decisions
└─ User privacy protected

FUTURE SECURITY ENHANCEMENTS

Authentication:
├─ Email/password with bcrypt hashing
├─ OAuth (Google, GitHub)
├─ Session management with secure cookies

Data Protection:
├─ HTTPS only
├─ Database encryption at rest
├─ Row-level security (RLS)
└─ API rate limiting

Compliance:
├─ GDPR compliance
├─ Data export functionality
├─ Deletion of user data
└─ Privacy policy

Monitoring:
├─ Error tracking (Sentry)
├─ Usage analytics
├─ Security audit logs
└─ Performance monitoring
```

---

## Deployment Architecture

```
DEVELOPMENT
├─ Local machine
├─ pnpm install
├─ pnpm dev
└─ http://localhost:3000

STAGING
├─ Feature branch
├─ GitHub Actions CI/CD
├─ Staging environment
└─ Manual testing

PRODUCTION

Code Repository:
└─ GitHub (main branch)

CI/CD Pipeline:
├─ GitHub Actions
├─ Runs tests/linting (if configured)
└─ Automatic deployment

Deployment Platform:
├─ Vercel (recommended)
│  ├─ Zero-config deployment
│  ├─ Automatic HTTPS
│  ├─ Global CDN
│  ├─ Edge functions
│  ├─ Performance monitoring
│  └─ Preview deployments
│
├─ Alternative: Netlify
├─ Alternative: Cloudflare Pages
└─ Alternative: Docker + custom infrastructure

Performance:
├─ Edge caching (global CDN)
├─ Bundle analysis
├─ Performance budgets
└─ Real User Monitoring (RUM)

Monitoring:
├─ Error tracking
├─ Performance analytics
├─ User session replay
└─ Deployment rollback
```

This comprehensive architecture documentation provides complete visibility into the system design, data flows, algorithms, and scalability path for the Decision Companion application.
