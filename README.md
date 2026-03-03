# Decision Companion: Intelligent Decision-Making Platform

> **Personal Note:** This project was built with assistance from AI tools (ChatGPT, GitHub Copilot). I used them to help write code, organize documentation, debug issues, and explain complex concepts. However, all architectural decisions, feature choices, and trade-offs were made by me. The [RESEARCH_LOG.md](./RESEARCH_LOG.md) documents exactly when and how AI was used throughout development—every AI-generated suggestion was reviewed, tested, and validated before implementation.

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18.x or higher ([Download here](https://nodejs.org/))
- **Package Manager:** pnpm (recommended), npm, or yarn
- **Modern Browser:** Chrome, Firefox, Safari, or Edge (latest version)

### Installation & Setup

**Step 1: Clone the Repository**
```bash
git clone https://github.com/darkie8055/DECISION-COMPANION-SYSTEM.git
cd DECISION-COMPANION-SYSTEM
```

**Step 2: Install Dependencies**
```bash
# Using pnpm (recommended)
pnpm install

# Or using npm
npm install

# Or using yarn
yarn install
```

**Step 3: Start Development Server**
```bash
# Using pnpm
pnpm dev

# Or using npm
npm run dev

# Or using yarn
yarn dev
```

**Step 4: Open in Browser**
```
Visit: http://localhost:3000
```

The application will automatically open in your default browser. If not, manually navigate to the URL above.

### Verify Installation

Once running, you should see:
- ✅ The Decision Companion homepage
- ✅ Four template options (Job Offer, Laptop Purchase, Vacation Planning, General)
- ✅ No console errors in browser developer tools

If you encounter any issues, see the **Troubleshooting** section in Development below.

---

---

## 📖 What Is This?

A web application that helps you make complex decisions using structured weighted scoring. Perfect for career choices, major purchases, vendor selection, and any decision with multiple competing factors.

**The Problem:** People make suboptimal decisions when overwhelmed by multiple options and criteria. Traditional pros/cons lists fail for complex scenarios.

**The Solution:** Break down decisions systematically using **transparent, explainable mathematics**—no AI black boxes, just clear weighted scoring:
- Define what matters (criteria)
- Weight importance (must sum to 100%)
- Score each option (0-10 scale)
- Get transparent mathematical rankings (Formula: Σ(weight × score) / 100)
- Analyze risks and sensitivities
- Every calculation is verifiable and explainable

**Why Transparent Algorithms?** Unlike AI-driven systems, you can see exactly how every recommendation is made. No hidden factors, no black-box magic—just math you can trust and verify.

## ✨ Key Features

- **4 Pre-built Templates**: Job offers, laptop purchases, vacation planning, general purchases
- **Custom Template Builder**: Create and save your own decision templates with custom criteria and weights
- **Interactive Scoring**: Real-time visual feedback with color-coded sliders
- **Risk Assessment**: Identifies decision uncertainty, low diversity, and unclear outcomes
- **Sensitivity Analysis**: Test "what-if" scenarios by adjusting weights
- **Decision Comparison**: Side-by-side analysis of multiple saved decisions
- **Multi-Format Export**: PDF (printable), PowerPoint (presentations), Excel, JSON
- **Dark Mode**: Full dark theme support with manual toggle
- **Privacy First**: All data stays in your browser (no server required)
- **100% Transparent**: Every calculation is explainable—no AI, no black boxes, just math

## 🏗️ Tech Stack

- **Framework:** Next.js 16 + React 19
- **Language:** TypeScript 5.x
- **Styling:** Tailwind CSS v4 + shadcn/ui
- **Charts:** Recharts
- **Architecture:** Client-side only (no backend)

## 📁 Project Structure

```
app/          # Pages and routing
components/   # UI components (8 main + 40 shadcn/ui)
lib/          # Core logic (decision-engine, templates, export, storage)
hooks/        # React hooks (mobile, toast)
```

## 📚 Documentation

**Quick Start:**
- [GETTING_STARTED.md](./GETTING_STARTED.md) - How to use the app

**Deep Dives:**
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Technical design & decisions
- [BUILD_PROCESS.md](./BUILD_PROCESS.md) - Development journey
- [FLOWCHART.md](./FLOWCHART.md) - User flows & processes
- [FEATURES.md](./FEATURES.md) - Complete feature list
- [ALGORITHMS_EXPLAINED.md](./ALGORITHMS_EXPLAINED.md) - Scoring methodology

**Navigation:**
- [DOCUMENTATION_INDEX.md](./DOCUMENTATION_INDEX.md) - Master guide

## 🔧 Development

### Available Scripts

**Development Mode** (with hot reload)
```bash
pnpm dev          # Starts dev server on http://localhost:3000
npm run dev       # Alternative with npm
yarn dev          # Alternative with yarn
```

**Production Build**
```bash
pnpm build        # Creates optimized production build
npm run build     # Alternative with npm
yarn build        # Alternative with yarn
```

**Start Production Server**
```bash
pnpm start        # Runs production build locally
npm run start     # Alternative with npm
yarn start        # Alternative with yarn
```

**Type Checking**
```bash
npx tsc --noEmit  # Check TypeScript types without compilation
```

**Linting** (if configured)
```bash
pnpm lint         # Run ESLint
npm run lint      # Alternative with npm
```

### Project Structure
```
app/          # Next.js app directory (pages & routing)
components/   # React components (8 main + 40 shadcn/ui)
lib/          # Core logic (decision-engine, templates, export, storage)
hooks/        # Custom React hooks (mobile, toast)
public/       # Static assets
styles/       # Global styles
```

### Environment Variables
No environment variables required - runs entirely client-side.

### Troubleshooting

**Port 3000 already in use?**
```bash
# Find and kill the process using port 3000
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:3000 | xargs kill -9

# Or use a different port
pnpm dev -- -p 3001
```

**Module not found errors?**
```bash
# Clear node_modules and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

**TypeScript errors?**
```bash
# Restart TypeScript server in VS Code
# Press: Ctrl+Shift+P (or Cmd+Shift+P on Mac)
# Type: "TypeScript: Restart TS Server"
```

## 🚢 Deployment

Deploy to Vercel (recommended):
```bash
npx vercel
```

Or Netlify:
```bash
netlify deploy --prod
```

## ❓ FAQ

**Can I save decisions?**  
Yes! Auto-saved to localStorage. Delete anytime via trash icon.

**What export formats?**  
PDF (printable), PowerPoint (presentations), Excel/CSV, JSON - all mobile-optimized and ready to use.

**Is my data private?**  
Yes! Everything runs in your browser. No server involved.

**Can I customize templates?**  
Yes! Choose "Custom Decision" to build from scratch, or start with any template and modify it. The custom template builder supports:
- Add/remove criteria
- Adjust weight distributions
- Rename options and criteria
- Full flexibility for any decision type

**How are calculations done?**  
Using simple, transparent mathematics: Total Score = Σ(Weight × Score) / 100. No AI, no machine learning, no hidden factors. Every result can be verified with a calculator. See [ALGORITHMS_EXPLAINED.md](./ALGORITHMS_EXPLAINED.md) for complete formulas.

**How was AI used in development?**  
Fully documented in [RESEARCH_LOG.md](./RESEARCH_LOG.md) - all AI suggestions were human-reviewed.

## 📈 Future Enhancement Opportunities

### User Experience Enhancements
- **Guided Decision Wizard**: Step-by-step onboarding for new users
- **AI-Powered Criteria Suggestions**: Smart recommendations based on decision type (optional feature)
- **Keyboard Shortcuts**: Power-user features for faster navigation
- **Undo/Redo Functionality**: Non-destructive editing workflow
- **Template Library Expansion**: 10+ industry-specific templates

### Collaboration & Sharing
- **Multi-User Collaboration**: Real-time co-editing of decisions
- **Decision Sharing Links**: Shareable URLs for team review
- **Commenting System**: Discuss options and criteria with stakeholders
- **Version History**: Track decision evolution over time
- **Team Workspaces**: Organizational decision repositories

### Advanced Analytics
- **Outcome Tracking**: Record actual results vs predicted outcomes
- **Pattern Recognition**: Learn from historical decisions
- **Confidence Intervals**: Statistical uncertainty in scores
- **Monte Carlo Simulation**: Probability distributions for uncertain weights
- **Decision Quality Metrics**: Measure effectiveness over time

### Enterprise Features
- **User Authentication**: Secure accounts with SSO (Google, Microsoft)
- **Cloud Synchronization**: Access decisions across devices
- **Audit Trails**: Compliance-friendly decision logging
- **API Access**: Programmatic decision creation and retrieval
- **Custom Branding**: White-label for organizational deployments
- **Role-Based Access**: Manager/contributor/viewer permissions

### Platform Expansion
- **Native Mobile Apps**: iOS and Android applications
- **Browser Extensions**: Quick decision capture in any tab
- **Slack/Teams Integration**: Decision-making within communication tools
- **Excel Add-In**: Import/export directly from spreadsheets

### Technical Improvements
- **Backend Infrastructure**: Supabase/Firebase for persistence
- **Performance Optimization**: Lazy loading, code splitting
- **Progressive Web App**: Offline functionality, install prompts
- **Internationalization**: Multi-language support (i18n)
- **Accessibility Audit**: WCAG 2.1 AAA compliance

See [BUILD_PROCESS.md](./BUILD_PROCESS.md#future-development-roadmap) for detailed roadmap and [ARCHITECTURE.md](./ARCHITECTURE.md#future-enhancements) for technical planning.

## 📄 License

MIT License - Free for personal and commercial use.

---

**Built with ❤️ using Next.js 16, React 19, and shadcn/ui**
