# Decision Companion: Intelligent Decision-Making Platform

> **Personal Note:** This project was built with assistance from AI tools (ChatGPT, GitHub Copilot). I used them to help write code, organize documentation, debug issues, and explain complex concepts. However, all architectural decisions, feature choices, and trade-offs were made by me. The [RESEARCH_LOG.md](./RESEARCH_LOG.md) documents exactly when and how AI was used throughout development—every AI-generated suggestion was reviewed, tested, and validated before implementation.

## 🚀 Quick Start

```bash
# Install and run
pnpm install && pnpm dev
# Visit http://localhost:3000
```

**Requirements:** Node.js 18+, Modern browser (Chrome/Firefox/Safari/Edge)

---

---

## 📖 What Is This?

A web application that helps you make complex decisions using structured weighted scoring. Perfect for career choices, major purchases, vendor selection, and any decision with multiple competing factors.

**The Problem:** People make suboptimal decisions when overwhelmed by multiple options and criteria. Traditional pros/cons lists fail for complex scenarios.

**The Solution:** Break down decisions systematically:
- Define what matters (criteria)
- Weight importance (must sum to 100%)
- Score each option (0-10 scale)
- Get transparent mathematical rankings
- Analyze risks and sensitivities

## ✨ Key Features

- **4 Pre-built Templates**: Job offers, laptop purchases, vacation planning, general purchases
- **Interactive Scoring**: Real-time visual feedback with color-coded sliders
- **Risk Assessment**: Identifies decision uncertainty, low diversity, and unclear outcomes
- **Sensitivity Analysis**: Test "what-if" scenarios by adjusting weights
- **Decision Comparison**: Side-by-side analysis of multiple saved decisions
- **Multi-Format Export**: PDF (printable), PowerPoint (presentations), Excel, JSON
- **Dark Mode**: Full dark theme support
- **Privacy First**: All data stays in your browser (no server required)

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

```bash
# Install dependencies
pnpm install

# Development server
pnpm dev             # http://localhost:3000

# Production build
pnpm build
pnpm start

# Type checking
npx tsc --noEmit
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
PDF, PowerPoint, Excel/CSV, JSON - all mobile-optimized.

**Is my data private?**  
Yes! Everything runs in your browser. No server involved.

**Can I customize templates?**  
Yes! Choose "Custom Decision" and define your own criteria.

**How was AI used in development?**  
Fully documented in [RESEARCH_LOG.md](./RESEARCH_LOG.md) - all AI suggestions were human-reviewed.

## 📈 Future Enhancement Opportunities

### Immediate Priorities
- **Auto-save to localStorage**: Prevent data loss on browser refresh
- **Enhanced Export Formats**: PowerPoint presentation slides, Excel workbooks
- **Decision Templates Library**: Expand to 10+ industry-specific templates
- **Mobile-Optimized UI**: Responsive improvements for smartphone usage

### User Experience Enhancements
- **Guided Decision Wizard**: Step-by-step onboarding for new users
- **AI-Powered Criteria Suggestions**: Smart recommendations based on decision type
- **Template Customization**: Save and share custom templates
- **Keyboard Shortcuts**: Power-user features for faster navigation
- **Undo/Redo Functionality**: Non-destructive editing workflow

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
