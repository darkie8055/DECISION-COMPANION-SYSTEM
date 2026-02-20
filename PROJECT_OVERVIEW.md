# Decision Companion - Advanced Decision Making Application

## 🎯 Project Overview

Decision Companion is a sophisticated web application designed to help users make informed, data-driven decisions through weighted scoring methodology, comprehensive analysis, and interactive visualizations.

## ✨ Key Features

### 1. **Core Decision Analysis**
- Weighted scoring system with customizable criteria weights
- Real-time calculation and ranking of options
- Support for unlimited criteria and options
- Automatic normalization and validation of weights

### 2. **Decision Templates**
Pre-built templates for common decisions:
- **Career**: Job Offer Evaluation
- **Technology**: Laptop Purchase Decision
- **Travel**: Vacation Destination Selection
- **Business**: Investment Opportunities, Real Estate, Vendor Selection
- **Education**: College/University Selection

### 3. **Advanced Risk Assessment**
- Variance analysis for decision clarity
- Option diversity evaluation
- Weight certainty assessment
- Confidence scoring and risk profiling
- High-variance criteria identification
- Actionable mitigation recommendations

### 4. **Visual Analytics**
- **Ranking Display**: Progress bars showing option scores
- **Comparison Charts**: Bar charts for overall score comparison
- **Detailed Breakdown Table**: Criterion-by-criterion scoring matrix
- **Color-coded Scoring**: Visual feedback for score quality
- **Progress Tracking**: Completion percentage during input

### 5. **Sensitivity Analysis**
- Interactive weight adjustment with sliders
- Real-time ranking updates
- Impact visualization showing how weight changes affect results
- "What-if" scenario exploration
- Dynamic line charts showing score trajectories

### 6. **Decision History & Comparison**
- Save and revisit past decisions
- Compare multiple decision analyses
- Timeline view of decision-making journey
- Historical trend analysis
- Aggregate insights across decisions

### 7. **Export & Reporting**
- Detailed text reports with formatted output
- JSON export for data portability
- CSV export for spreadsheet analysis
- Professional formatting with visual separators
- Comprehensive breakdown of all analysis

### 8. **Smart Input Forms**
- Real-time validation with visual feedback
- Weight tracking with progress bars
- Minimum requirement enforcement (2+ criteria, 2+ options)
- Contextual help and placeholders
- Clear error states and success indicators

## 🏗️ Architecture

### Frontend Stack
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **UI Components**: shadcn/ui
- **Charts**: Recharts
- **Styling**: Tailwind CSS v4
- **State Management**: React Hooks

### Core Modules

#### `lib/decision-engine.ts`
- Weighted score calculation algorithm
- Decision analysis and ranking logic
- Sensitivity analysis computation
- Interface definitions for Decision, Criterion, Option, Score, AnalysisResult

#### `lib/templates.ts`
- Pre-configured decision templates
- Category organization system
- Template initialization data

#### `lib/export-utils.ts`
- Detailed report generation
- JSON export formatting
- CSV export with proper escaping
- File download utility

### Components

#### Main Components
- **`page.tsx`**: Main app orchestrator with state management
- **`templates-selector.tsx`**: Template discovery and selection interface
- **`decision-form.tsx`**: Custom decision framework creation with validation

#### Analysis Components
- **`scoring-matrix.tsx`**: Interactive scoring grid with sliders
- **`analysis-results.tsx`**: Results display with rankings and charts
- **`sensitivity-analysis.tsx`**: Weight adjustment and impact visualization
- **`risk-assessment.tsx`**: Risk profiling and recommendations
- **`decision-history.tsx`**: Historical analysis and comparison

## 🎨 Design System

### Color Palette
- **Primary**: #2563eb (Blue) - Primary actions and highlights
- **Accent**: #06b6d4 (Cyan) - Secondary highlights
- **Success**: #10b981 (Green) - Positive indicators
- **Warning**: #f59e0b (Amber) - Warnings
- **Purple**: #8b5cf6 - Tertiary accent

### Typography
- **Headers**: System font for semantic headings
- **Body**: System font for readability
- **Monospace**: System monospace for data

### Key Design Principles
- Clean, professional interface
- Data-driven visual hierarchy
- Responsive mobile-first design
- Accessible color contrasts
- Progressive disclosure of complexity

## 🚀 User Journey

1. **Home**: Browse templates or create custom decision
2. **Setup**: Define decision name, criteria with weights, and options
3. **Scoring**: Rate each option (0-10) on every criterion
4. **Analysis**: View rankings, charts, and detailed breakdowns
5. **Risk Assessment**: Understand potential issues and trade-offs
6. **Sensitivity**: Explore how weight changes affect outcomes
7. **Export**: Download analysis results for future reference

## 💡 Advanced Features

### Real-time Validation
- Instant feedback on criteria weights
- Option and criterion minimum requirements
- Form completion status tracking

### Smart Recommendations
- Risk-aware decision guidance
- Variance-based priority suggestions
- Confidence scoring for recommendations

### Data Persistence (Session)
- Session-only storage (browser memory)
- Decision history within session
- Easy comparison of saved decisions

## 📊 Analysis Methodology

### Weighted Scoring Formula
For each option:
```
Total Score = Σ(criterion_score × criterion_weight) / 100
```

### Risk Metrics
- **Standard Deviation**: Measures consistency across criteria
- **Concentration Risk**: Evaluates option diversity
- **Confidence Score**: Based on top option's performance

## 🎯 Use Cases

Perfect for:
- Career decisions (job offers, promotions)
- Technology purchases (laptops, phones, software)
- Educational choices (university, courses)
- Real estate decisions (property purchases)
- Business investments and vendor selection
- Travel destination planning
- Any decision with multiple options and criteria

## 🔄 Workflow Highlights

- **Fast Setup**: Templates get you started in seconds
- **Intuitive Scoring**: Slider-based interface for easy input
- **Instant Results**: Real-time calculation and visualization
- **Deep Analysis**: Risk assessment and sensitivity analysis included
- **Shareable Results**: Export for discussion or record-keeping

## 🛠️ Technical Highlights

- Type-safe throughout with TypeScript
- Modular component architecture
- Responsive design for all screen sizes
- Dark mode support
- Accessible UI with ARIA labels
- No backend required (session-based)

## 📈 Future Enhancement Opportunities

- Multi-user collaboration
- Cloud sync and persistence
- Advanced filtering and sorting
- AI-powered recommendations
- Confidence intervals and probability distributions
- Integration with decision research frameworks
- Mobile app version
- API for programmatic access

---

Built with ❤️ using Next.js, React, and modern web technologies.
