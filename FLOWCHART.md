# User Flow & Decision Process Flowcharts

## Main Application Flow

```
┌──────────────────────────────────────────────────────────────────────┐
│                    APPLICATION ENTRY POINT                          │
│                         (app/page.tsx)                              │
└──────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
                    ┌─────────────────────────┐
                    │   Initialize State      │
                    │ ├─ step = 'templates'   │
                    │ ├─ decision = null      │
                    │ ├─ history = []         │
                    │ └─ activeTab = 'analysis'
                    └─────────────────────────┘
                                  │
                                  ▼
                    ┌─────────────────────────┐
                    │   STEP: TEMPLATES       │
                    │   (TemplatesSelector)   │
                    └─────────────────────────┘
                                  │
                   ┌──────────────┴──────────────┐
                   │                             │
                   ▼                             ▼
         ┌─────────────────────┐    ┌──────────────────────┐
         │ SELECT TEMPLATE     │    │ CREATE CUSTOM        │
         │                     │    │                      │
         │ User clicks:        │    │ User clicks:         │
         │ • Job Offer        │    │ "Create Custom"      │
         │ • Laptop Purchase  │    │                      │
         │ • Vacation         │    │ → step = 'setup'     │
         │ • Investment       │    │                      │
         │ • Real Estate      │    └──────────────────────┘
         │ • College          │
         │ • Vendor           │
         │                    │
         │ → Decision loaded  │
         │ → step = 'scoring' │
         └─────────────────────┘
                   │
                   │
                   └─────────────────────────────┐
                                                 │
                    ┌────────────────────────────┘
                    │
                    ▼
    ┌──────────────────────────────────────┐
    │   STEP: SETUP                        │
    │   (DecisionForm - if custom)         │
    │                                      │
    │ User enters:                         │
    │ • Decision name *                    │
    │ • Description (optional)             │
    │ • Criteria (2+ required)             │
    │ • Criterion weights (sum to 100%)   │
    │ • Options to compare (2+ required)   │
    │                                      │
    │ Real-time validation:                │
    │ • Progress bar showing weight total  │
    │ • Alerts for invalid states          │
    │ • Disabled submit if invalid         │
    │                                      │
    │ When complete → User clicks submit   │
    │ → Decision created                   │
    │ → step = 'scoring'                   │
    └──────────────────────────────────────┘
                    │
                    ▼
    ┌──────────────────────────────────────┐
    │   STEP: SCORING                      │
    │   (ScoringMatrix)                    │
    │                                      │
    │ Display:                             │
    │ ├─ Decision summary card             │
    │ ├─ Scoring matrix table              │
    │ │  ├─ Rows: Options                 │
    │ │  ├─ Columns: Criteria + weights   │
    │ │  └─ Cells: Interactive sliders    │
    │ ├─ Color feedback (R/Y/G)            │
    │ ├─ Progress bar (% complete)        │
    │ ├─ Scoring guide                     │
    │ └─ "Analyze Results" button         │
    │                                      │
    │ User interaction:                    │
    │ • Adjusts sliders 0-10 for each cell│
    │ • Progress bar updates               │
    │ • Color changes based on score       │
    │ • Button enabled when all scored     │
    │                                      │
    │ When complete → User clicks Analyze  │
    │ → Analysis engine runs               │
    │ → step = 'results'                   │
    │ → activeTab = 'analysis'             │
    └──────────────────────────────────────┘
                    │
                    ▼
    ┌──────────────────────────────────────┐
    │   ANALYSIS ENGINE                    │
    │   (decision-engine.ts)               │
    │                                      │
    │ FOR each option:                     │
    │   FOR each criterion:                │
    │     weighted_score =                 │
    │       (weight × score) / 100         │
    │   total_score = SUM(weighted_scores) │
    │                                      │
    │ RANK options by total_score          │
    │                                      │
    │ CALCULATE confidence percentages     │
    │                                      │
    │ ASSESS risk metrics:                 │
    │   • Variance in scores               │
    │   • Clarity of winner                │
    │   • Diversity of options             │
    │                                      │
    │ OUTPUT: AnalysisResult[]             │
    └──────────────────────────────────────┘
                    │
                    ▼
    ┌──────────────────────────────────────┐
    │   STEP: RESULTS                      │
    │   (Tabbed Interface)                 │
    │                                      │
    │ ┌────────────────────────────────┐  │
    │ │ ANALYSIS TAB (default)         │  │
    │ │                                │  │
    │ │ Display:                       │  │
    │ │ • Summary cards                │  │
    │ │   - Top recommendation         │  │
    │ │   - Average score              │  │
    │ │   - Best/worst range           │  │
    │ │ • Rankings with progress bars  │  │
    │ │ • Detailed breakdown table     │  │
    │ │ • Bar & radar charts           │  │
    │ │ • Action buttons               │  │
    │ │   - Save Decision              │  │
    │ │   - Export Report              │  │
    │ │   - Test Sensitivity           │  │
    │ └────────────────────────────────┘  │
    │                                      │
    │ ┌────────────────────────────────┐  │
    │ │ RISK ASSESSMENT TAB            │  │
    │ │                                │  │
    │ │ Display:                       │  │
    │ │ • Risk level (RED/YELLOW/GREEN)│  │
    │ │ • Variance analysis            │  │
    │ │ • Decision clarity metrics     │  │
    │ │ • Option diversity check       │  │
    │ │ • Actionable recommendations   │  │
    │ │ • Risk timeline visualization  │  │
    │ └────────────────────────────────┘  │
    │                                      │
    │ ┌────────────────────────────────┐  │
    │ │ SENSITIVITY ANALYSIS TAB       │  │
    │ │                                │  │
    │ │ User can:                      │  │
    │ │ • Adjust criterion weights     │  │
    │ │ • See scores update in real-time
    │ │ • View impact on ranking       │  │
    │ │ • Answer "What if?" questions  │  │
    │ │                                │  │
    │ │ Display:                       │  │
    │ │ • Interactive weight sliders   │  │
    │ │ • Score trajectory lines       │  │
    │ │ • Critical factors highlighted │  │
    │ └────────────────────────────────┘  │
    └──────────────────────────────────────┘
                    │
        ┌───────────┼───────────┬──────────────┐
        │           │           │              │
        ▼           ▼           ▼              ▼
    ┌─────┐   ┌──────┐   ┌────────┐   ┌──────────┐
    │SAVE │   │EXPORT│   │COMPARE │   │BACK/HOME │
    └─────┘   └──────┘   └────────┘   └──────────┘
        │       │          │              │
        ▼       ▼          ▼              ▼
    [Save to    [Generate  [Load from   [Return to
    History     & Download History]     Previous]
    State]      Report]
        │       │          │              │
        │       │          ▼              │
        │       │    ┌──────────────┐    │
        │       │    │ HISTORY VIEW │    │
        │       │    │ (comparison) │    │
        │       │    └──────────────┘    │
        │       │          │              │
        │       │          └──────────────┘
        │       │
        └───────┴──────────────┐
                               │
                        ┌──────▼──────┐
                        │ NEW DECISION │
                        │ OR REFINEMENT │
                        │              │
                        │ User chooses:│
                        │ • Adjust     │
                        │   scores &   │
                        │   re-analyze │
                        │ • Start new  │
                        │   decision   │
                        │ • View       │
                        │   history    │
                        └──────────────┘
                               │
                    ┌──────────┴──────────┐
                    │                     │
                    ▼ (adjust)            ▼ (new)
                [Back to Scoring]   [Back to Templates]
```

---

## Decision Setup Flow (Custom Decision)

```
┌─────────────────────────────────────────────────┐
│  USER STARTS CUSTOM DECISION CREATION           │
│  (Clicked "Create Custom" from templates)       │
└─────────────────────────────────────────────────┘
                        │
                        ▼
        ┌───────────────────────────────┐
        │ DECISION FORM RENDERED        │
        │ (DecisionForm component)      │
        │                               │
        │ Initial state:                │
        │ • name = ""                   │
        │ • description = ""            │
        │ • criteria = [1 empty]        │
        │ • options = [1 empty]         │
        └───────────────────────────────┘
                        │
        ┌───────────────┴────────────────┐
        │                                │
        ▼                                ▼
    ┌────────────────┐    ┌──────────────────────┐
    │ ENTER DECISION │    │ ENTER CRITERIA       │
    │ NAME & DESCR.  │    │                      │
    │                │    │ User:                │
    │ Validation:    │    │ 1. Names criteria    │
    │ • Not empty    │    │ 2. Sets weight (%)   │
    │ • 1+ char      │    │ 3. Progress bar      │
    │                │    │    shows total       │
    │ Feedback:      │    │ 4. Add/remove rows   │
    │ • Red if error │    │ 5. Validation alert  │
    │ • Green if OK  │    │    if total ≠ 100%  │
    │                │    │                      │
    │                │    │ Minimum: 2 criteria  │
    │                │    │ Validation: Sum=100% │
    └────────────────┘    └──────────────────────┘
        │                           │
        │                           ▼
        │             ┌─────────────────────────┐
        │             │ Weight Validation Loop  │
        │             │                         │
        │             │ While Sum ≠ 100:        │
        │             │ • Alert shown           │
        │             │ • Weights highlighted   │
        │             │ • Progress bar red      │
        │             │ • Submit button disabled│
        │             │                         │
        │             │ User adjusts until:    │
        │             │ Sum = 100%              │
        │             │ ✓ Alert clears         │
        │             │ ✓ Submit enabled       │
        │             └─────────────────────────┘
        │                           │
        │                           ▼
        └──────────────┬────────────────────┐
                       │                    │
                       ▼                    ▼
        ┌────────────────────────┐    ┌──────────────────┐
        │ ENTER OPTIONS          │    │ FORM VALIDATION  │
        │                        │    │                  │
        │ User:                  │    │ Real-time Check: │
        │ 1. Names each option   │    │ ✓ name present   │
        │ 2. Can add/remove rows │    │ ✓ 2+ criteria    │
        │ 3. Minimum 2 options   │    │ ✓ weights=100%   │
        │ 4. Max limited by UX   │    │ ✓ 2+ options     │
        │                        │    │                  │
        │ Validation:            │    │ Submit Button:   │
        │ • Not empty            │    │ • Disabled if    │
        │ • Unique (optional)    │    │   any check fails│
        │ • 1+ char              │    │ • Enabled when   │
        │                        │    │   all pass       │
        │ Feedback:              │    │                  │
        │ • Green checkmark      │    │ Status Card:     │
        │   if valid             │    │ • Green if ready │
        │                        │    │ • Red if issues  │
        └────────────────────────┘    └──────────────────┘
                       │                    │
                       └────────┬───────────┘
                                │
                                ▼
                    ┌─────────────────────────┐
                    │ USER CLICKS SUBMIT      │
                    │                         │
                    │ Backend validation:     │
                    │ • All fields non-empty  │
                    │ • Weights sum to 100%   │
                    │ • 2+ criteria & options │
                    │                         │
                    │ If valid:               │
                    │ → Create Decision obj   │
                    │ → Set decision state    │
                    │ → step = 'scoring'      │
                    │ → Navigate to scoring   │
                    │                         │
                    │ If invalid:             │
                    │ → Show error alert      │
                    │ → Keep form open        │
                    │ → User corrects         │
                    └─────────────────────────┘
```

---

## Scoring & Analysis Flow

```
┌────────────────────────────────────────┐
│ SCORING PHASE BEGINS                   │
│ (ScoringMatrix component)              │
└────────────────────────────────────────┘
              │
              ▼
    ┌─────────────────────────┐
    │ RENDER SCORING MATRIX   │
    │                         │
    │ Table Structure:        │
    │ Row Headers:            │
    │ • Option 1              │
    │ • Option 2              │
    │ • Option 3              │
    │ • ...                   │
    │                         │
    │ Column Headers:         │
    │ • Criterion 1 (25%)     │
    │ • Criterion 2 (35%)     │
    │ • Criterion 3 (20%)     │
    │ • ...                   │
    │                         │
    │ Each cell:              │
    │ • Slider (0-10)         │
    │ • Numeric display       │
    │ • Color feedback        │
    └─────────────────────────┘
              │
              ▼
    ┌──────────────────────────────┐
    │ USER SCORES EACH CELL        │
    │                              │
    │ For each option × criterion: │
    │                              │
    │ 1. User drags slider         │
    │    OR clicks on position     │
    │    OR types number           │
    │                              │
    │ 2. Real-time feedback:       │
    │    • Slider moves            │
    │    • Number updates          │
    │    • Color changes:          │
    │      - 0-3: RED (poor)       │
    │      - 4-6: YELLOW (ok)      │
    │      - 7-10: GREEN (good)    │
    │                              │
    │ 3. Progress bar updates      │
    │    • Shows % complete        │
    │    • Counts filled cells     │
    │    • Updates badge           │
    │                              │
    │ 4. Score stored in state:    │
    │    decision.scores.push({    │
    │      optionId,               │
    │      criterionId,            │
    │      score                   │
    │    })                        │
    │                              │
    │ Repeats for all cells...     │
    └──────────────────────────────┘
              │
              ▼
    ┌──────────────────────────┐
    │ COMPLETION CHECK         │
    │                          │
    │ After each score entry:  │
    │ Check if all cells filled│
    │                          │
    │ Calculation:             │
    │ total_filled =           │
    │   COUNT(non-zero scores) │
    │ total_required =         │
    │   options.length ×       │
    │   criteria.length        │
    │ percent_complete =       │
    │   filled / required × 100│
    │                          │
    │ If complete:             │
    │ ✓ Progress = 100%        │
    │ ✓ Button enabled         │
    │ ✓ "Analyze Results"      │
    │   clickable              │
    │                          │
    │ If incomplete:           │
    │ ✗ Progress < 100%        │
    │ ✗ Button disabled        │
    │ ✗ Tooltip shows missing  │
    └──────────────────────────┘
              │
              ▼
    ┌──────────────────────────────┐
    │ USER CLICKS ANALYZE RESULTS  │
    │ (when 100% complete)         │
    │                              │
    │ Triggers:                    │
    │ 1. Call analyzeDecision()    │
    │ 2. Pass current decision obj │
    │ 3. Receive results array     │
    │ 4. Set analysis state        │
    │ 5. Set step = 'results'      │
    │ 6. Navigate to results page  │
    └──────────────────────────────┘
              │
              ▼
    ┌──────────────────────────────┐
    │ ANALYSIS ENGINE EXECUTES     │
    │ (decision-engine.ts)         │
    │                              │
    │ Algorithm:                   │
    │                              │
    │ FOR each option:             │
    │   total_score = 0            │
    │   FOR each criterion:        │
    │     find score for this      │
    │     option + criterion       │
    │     weight = criterion.weight│
    │     score_value = score      │
    │     contribution =           │
    │       weight × score / 100   │
    │     total_score +=           │
    │       contribution           │
    │   results[i].totalScore =    │
    │     total_score              │
    │                              │
    │ SORT results by totalScore   │
    │ ASSIGN rank (1, 2, 3...)     │
    │                              │
    │ CALCULATE percentages:       │
    │ sum_all_scores =             │
    │   SUM(totalScore for all)    │
    │ FOR each result:             │
    │   percentage =               │
    │     totalScore / sum ×       │
    │     100                      │
    │                              │
    │ CALCULATE risk metrics:      │
    │   variance = stddev(scores)  │
    │   clarity = gap between top2 │
    │   diversity = count options  │
    │                              │
    │ RETURN AnalysisResult[]      │
    └──────────────────────────────┘
              │
              ▼
    ┌────────────────────────────┐
    │ RESULTS PAGE RENDERED      │
    │ (Analysis tab active)      │
    │                            │
    │ Displays:                  │
    │                            │
    │ 1. SUMMARY CARDS           │
    │    ├─ Top Recommendation   │
    │    │  ├─ Winner name       │
    │    │  ├─ Score 8.5/10      │
    │    │  └─ Progress bar      │
    │    ├─ Average Score        │
    │    │  ├─ Mean score        │
    │    │  └─ Option count      │
    │    └─ Score Range          │
    │       ├─ Best score        │
    │       └─ Worst score       │
    │                            │
    │ 2. RANKINGS LIST           │
    │    ├─ #1 Option A: 8.5/10  │
    │    │   Progress bar (green)│
    │    ├─ #2 Option B: 7.8/10  │
    │    │   Progress bar        │
    │    └─ #3 Option C: 6.2/10  │
    │       Progress bar (orange)│
    │                            │
    │ 3. DETAILED BREAKDOWN      │
    │    ├─ Full scoring table   │
    │    ├─ All criteria columns │
    │    ├─ All option rows      │
    │    ├─ Individual scores    │
    │    └─ Total per option     │
    │                            │
    │ 4. VISUALIZATIONS          │
    │    ├─ Bar chart (scores)   │
    │    └─ Radar chart (profile)│
    │                            │
    │ 5. ACTION BUTTONS          │
    │    ├─ Save Decision        │
    │    ├─ Export Report        │
    │    └─ Test Sensitivity     │
    └────────────────────────────┘
```

---

## Post-Analysis User Paths

```
FROM RESULTS PAGE - FOUR MAIN PATHS

┌────────────────────┬─────────────────┬──────────────┬──────────────┐
│                    │                 │              │              │
▼                    ▼                 ▼              ▼              ▼

PATH 1:          PATH 2:           PATH 3:          PATH 4:
SAVE             EXPORT            SENSITIVITY      BACK/HOME
DECISION         REPORT            ANALYSIS

│                │                 │                │
│                │                 │                │
▼                ▼                 ▼                ▼

Add to       Generate          Switch to       Return to
history      & download        sensitivity     previous
array        report file       analysis tab    step


┌───────────────────────────────────────────────────────────────────┐
│ PATH 1: SAVE DECISION                                             │
├───────────────────────────────────────────────────────────────────┤
│                                                                   │
│ User clicks "Save Decision" button                                │
│         │                                                         │
│         ▼                                                         │
│ Check if decision already in history                             │
│         │                                                         │
│    ┌────┴────┐                                                    │
│    │          │                                                   │
│    ▼          ▼                                                   │
│ Exists    Not exists                                              │
│    │          │                                                   │
│    ▼          ▼                                                   │
│ Skip      Add to array                                            │
│  │       decisionHistory.push(decision)                           │
│  │            │                                                   │
│  │            ▼                                                   │
│  │       "Compare" button enabled                                 │
│  │            │                                                   │
│  └────┬───────┘                                                   │
│       │                                                           │
│       ▼                                                           │
│ Decision persists in history                                      │
│ (until page reload)                                               │
│                                                                   │
└───────────────────────────────────────────────────────────────────┘


┌───────────────────────────────────────────────────────────────────┐
│ PATH 2: EXPORT REPORT                                             │
├───────────────────────────────────────────────────────────────────┤
│                                                                   │
│ User clicks "Export Report" button                                │
│         │                                                         │
│         ▼                                                         │
│ Call generateDetailedReport(decision, results)                   │
│         │                                                         │
│         ▼                                                         │
│ Format decision data into readable text:                          │
│ ┌──────────────────────────────────────────┐                     │
│ │ DECISION ANALYSIS REPORT                 │                     │
│ │ Generated: Feb 20, 2026                  │                     │
│ │ Decision: Choose Laptop                  │                     │
│ │                                          │                     │
│ │ CRITERIA & WEIGHTS                       │                     │
│ │ • Price: 25%                             │                     │
│ │ • Performance: 35%                       │                     │
│ │ ...                                      │                     │
│ │                                          │                     │
│ │ SCORING MATRIX                           │                     │
│ │ Option  Price  Performance  ...  Total   │                     │
│ │ MacBook    6        9      ...   8.05   │                     │
│ │ ...                                      │                     │
│ │                                          │                     │
│ │ RANKINGS                                 │                     │
│ │ 1. MacBook: 8.05/10 (33.3%)              │                     │
│ │ ...                                      │                     │
│ │                                          │                     │
│ │ RECOMMENDATION                           │                     │
│ │ "MacBook Pro" is recommended...          │                     │
│ └──────────────────────────────────────────┘                     │
│         │                                                         │
│         ▼                                                         │
│ Call downloadFile(content, filename)                              │
│         │                                                         │
│         ▼                                                         │
│ Browser download triggered                                        │
│ File: decision-report-choose-laptop-[timestamp].txt              │
│         │                                                         │
│         ▼                                                         │
│ User receives file locally                                        │
│ Can open in text editor                                           │
│                                                                   │
└───────────────────────────────────────────────────────────────────┘


┌───────────────────────────────────────────────────────────────────┐
│ PATH 3: SENSITIVITY ANALYSIS                                      │
├───────────────────────────────────────────────────────────────────┤
│                                                                   │
│ User clicks "Test Sensitivity" button                             │
│         │                                                         │
│         ▼                                                         │
│ Switch activeTab = 'history'                                      │
│ (Sensitivity Analysis tab)                                        │
│         │                                                         │
│         ▼                                                         │
│ Sensitivity Analysis Component Rendered                           │
│ ┌────────────────────────────────────────┐                       │
│ │ For each criterion:                    │                       │
│ │ • Slider to adjust weight (0-100%)     │                       │
│ │ • Current weight display               │                       │
│ │ • Real-time score update               │                       │
│ │                                        │                       │
│ │ Results visualization:                 │                       │
│ │ • Line chart with trajectories         │                       │
│ │ • Option score lines as weights change │                       │
│ │ • Identify crossing points             │                       │
│ │                                        │                       │
│ │ Critical factors highlighted:          │                       │
│ │ • Which criteria swing rankings        │                       │
│ │ • Threshold values                     │                       │
│ │ • Decision stability assessment        │                       │
│ └────────────────────────────────────────┘                       │
│         │                                                         │
│         ▼                                                         │
│ User adjusts weights with sliders                                │
│         │                                                         │
│         ▼                                                         │
│ For each weight change:                                           │
│  1. Update local weight state                                    │
│  2. Recalculate all option scores                                │
│  3. Re-rank options                                              │
│  4. Update line chart                                            │
│  5. Show new ranking                                             │
│  6. Check if winner changed                                      │
│         │                                                         │
│         ▼                                                         │
│ User explores "what-if" scenarios:                               │
│ "What if marketing is 50% not 25%?"                              │
│ → Drag slider → See ranking change                               │
│ → Find breakeven points                                          │
│ → Gain confidence in decision                                    │
│                                                                   │
└───────────────────────────────────────────────────────────────────┘


┌───────────────────────────────────────────────────────────────────┐
│ PATH 4: BACK / HOME                                               │
├───────────────────────────────────────────────────────────────────┤
│                                                                   │
│ User clicks "Back" button                                         │
│         │                                                         │
│         ▼                                                         │
│ activeTab = 'analysis'                                            │
│ step = 'scoring'                                                  │
│         │                                                         │
│         ▼                                                         │
│ Return to scoring matrix                                          │
│ Can adjust scores and re-analyze                                 │
│         │                                                         │
│         ▼                                                         │
│ Click "Analyze Results" again                                     │
│ See updated analysis                                              │
│                                                                   │
│ OR                                                                │
│                                                                   │
│ User clicks "Home" button                                         │
│         │                                                         │
│         ▼                                                         │
│ Reset state:                                                      │
│ • decision = null                                                │
│ • step = 'templates'                                             │
│ • activeTab = 'analysis'                                         │
│         │                                                         │
│         ▼                                                         │
│ Return to template selection                                      │
│ Start a new decision                                             │
│                                                                   │
└───────────────────────────────────────────────────────────────────┘
```

---

## Decision History & Comparison Flow

```
┌──────────────────────────────────────────┐
│ USER HAS SAVED MULTIPLE DECISIONS        │
│ (decisionHistory contains 2+ items)      │
└──────────────────────────────────────────┘
          │
          ▼
┌──────────────────────────────────────────┐
│ "COMPARE" BUTTON ENABLED IN RESULTS      │
│                                          │
│ Only appears when:                       │
│ • User is in results view                │
│ • decisionHistory.length > 0             │
│ • Step = 'results'                       │
└──────────────────────────────────────────┘
          │
          ▼
┌──────────────────────────────────────────┐
│ USER CLICKS "COMPARE"                    │
│                                          │
│ Triggers:                                │
│ step = 'history'                         │
└──────────────────────────────────────────┘
          │
          ▼
┌──────────────────────────────────────────┐
│ DECISION HISTORY VIEW                    │
│ (DecisionHistory component)              │
│                                          │
│ Displays:                                │
│                                          │
│ For each saved decision:                 │
│ ┌────────────────────────────┐           │
│ │ Decision 1: Choose Laptop  │           │
│ │ • Decision made: Feb 20    │           │
│ │ • Winner: MacBook (8.5/10) │           │
│ │ • Risk Level: STABLE       │           │
│ │ • Load | Delete            │           │
│ ├────────────────────────────┤           │
│ │ Decision 2: Buy Laptop     │           │
│ │ • Decision made: Feb 18    │           │
│ │ • Winner: Dell XPS (7.8/10)│           │
│ │ • Risk Level: UNCERTAIN    │           │
│ │ • Load | Delete            │           │
│ └────────────────────────────┘           │
│                                          │
│ Comparison Summary:                      │
│ ┌────────────────────────────┐           │
│ │ Total Decisions: 2         │           │
│ │ Avg. Confidence: 31%       │           │
│ │ Trends:                    │           │
│ │ • 50% had stable decisions │           │
│ │ • Price was important in:  │           │
│ │   100% of decisions        │           │
│ │ • Most agreed on: MacBook  │           │
│ └────────────────────────────┘           │
└──────────────────────────────────────────┘
          │
          ▼
┌──────────────────────────────────────────┐
│ USER ACTIONS FROM HISTORY                │
│                                          │
│ Load Decision:                           │
│ • Click "Load" button                    │
│ • Decision becomes current               │
│ • step = 'scoring'                       │
│ • Can modify scores & re-analyze         │
│                                          │
│ Delete Decision:                         │
│ • Click "Delete" button                  │
│ • Remove from history array              │
│ • Refresh comparison view                │
│                                          │
│ Back to Results:                         │
│ • Click "Back" button                    │
│ • Return to current results              │
│ • step = 'results'                       │
└──────────────────────────────────────────┘
```

---

## Error Handling Flow

```
VALIDATION ERROR SCENARIOS

┌──────────────────────────────┐
│ FORM VALIDATION ERRORS       │
│ (DecisionForm)               │
└──────────────────────────────┘
              │
    ┌─────────┼─────────┬─────────┬──────────┐
    │         │         │         │          │
    ▼         ▼         ▼         ▼          ▼
Missing    Weights  Too Few   Too Few      Empty
Name       ≠ 100%   Criteria  Options      Criteria

│         │         │         │          │
└─────────┼─────────┼─────────┼──────────┘
          │
          ▼
    ┌────────────────┐
    │ Show alert to  │
    │ user explaining│
    │ what's wrong   │
    │ & how to fix   │
    └────────────────┘
          │
          ▼
    ┌────────────────┐
    │ Disable submit │
    │ button         │
    └────────────────┘
          │
          ▼
    ┌────────────────┐
    │ User corrects  │
    │ the issue      │
    └────────────────┘


┌──────────────────────────────┐
│ SCORING VALIDATION ERRORS    │
│ (ScoringMatrix)              │
└──────────────────────────────┘
              │
         ┌────┴────┐
         │          │
         ▼          ▼
    Empty       Invalid
    Scores      Range
    (< 0-10)
    │              │
    └──────┬───────┘
           │
           ▼
    ┌────────────────────────┐
    │ Real-time feedback:    │
    │ • Progress bar shows   │
    │   incomplete           │
    │ • Button disabled      │
    │ • Color coding shows   │
    │   unfilled cells       │
    │ • Tooltip on button:   │
    │   "Complete scoring    │
    │   to analyze"          │
    └────────────────────────┘
           │
           ▼
    ┌────────────────────────┐
    │ User fills all cells   │
    │ • Progress → 100%      │
    │ • Button enabled       │
    │ • Ready to analyze     │
    └────────────────────────┘


┌──────────────────────────────┐
│ RISK DETECTION (Post-Analysis)│
│ (RiskAssessment)             │
└──────────────────────────────┘
              │
    ┌─────────┼──────────┬──────────┐
    │         │          │          │
    ▼         ▼          ▼          ▼
   High   Decision   Low          
Variance  Clarity  Diversity
           Issue


│         │          │          │
└─────────┼──────────┼──────────┘
          │
          ▼
    ┌──────────────────────────┐
    │ Risk Assessment Tab      │
    │                          │
    │ Shows:                   │
    │ • Risk level badge       │
    │   (RED/YELLOW/GREEN)     │
    │ • Specific issues        │
    │ • Actionable guidance:   │
    │   - "Adjust weights"     │
    │   - "Add more options"   │
    │   - "Clarify scores"     │
    │                          │
    │ User can:                │
    │ • Go back to scoring     │
    │ • Use sensitivity to     │
    │   test adjustments       │
    │ • Gather more info       │
    └──────────────────────────┘
```

This comprehensive flowchart documentation provides complete visibility into all user flows, decision paths, validation logic, and error handling scenarios within the Decision Companion application.
