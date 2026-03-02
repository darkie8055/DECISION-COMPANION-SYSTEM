# 👨‍💻 Tutorial System - Developer Guide

## 🎯 For Developers: Quick Start

This guide explains how the tutorial system works technically and how to maintain/extend it.

---

## 📁 File Structure

```
Decision Companion/
├── components/
│   ├── interactive-tutorial.tsx       (414 lines)
│   ├── video-tutorial.tsx             (302 lines)
│   ├── guided-walkthrough.tsx         (211 lines)
│   ├── context-help.tsx               (229 lines)
│   ├── help-sidebar.tsx               (333 lines)
│   └── onboarding-checklist.tsx       (280 lines)
│
├── app/
│   ├── page.tsx                       (modified)
│   └── globals.css                    (modified)
│
└── Documentation/
    ├── TUTORIAL_GUIDE.md              (User guide)
    ├── TUTORIAL_FEATURES.md           (Technical specs)
    ├── QUICK_REFERENCE.md             (Reference card)
    ├── TUTORIAL_VISUAL_GUIDE.md       (Visual overview)
    ├── TUTORIAL_IMPLEMENTATION.md     (Implementation summary)
    └── TUTORIAL_DEVELOPER_GUIDE.md    (This file)
```

---

## 🔧 Component Architecture

### 1. **Interactive Tutorial**
```tsx
// Usage in app/page.tsx
<InteractiveTutorial
  onComplete={handleCompleteOnboarding}
  onSkip={handleSkipOnboarding}
/>

// Props
interface InteractiveTutorialProps {
  onComplete: () => void;
  onSkip: () => void;
}

// State
const [currentStep, setCurrentStep] = useState(0);
const [autoAdvance, setAutoAdvance] = useState(false);
```

**Key Features:**
- 6 tutorial steps (TUTORIAL_STEPS array)
- 4 demo components (Criteria, Weights, Scoring, Results)
- Progress tracking with step indicators
- Auto-advance after 4 seconds (optional)

**Customization:**
Edit `TUTORIAL_STEPS` array to add/modify steps:
```tsx
const TUTORIAL_STEPS = [
  {
    id: 'step-id',
    title: "Step Title",
    description: "Step description",
    icon: <SomeIcon />,
    fullDescription: "Full explanation",
    example: "Example text",
    animation: 'fade-in' | 'slide-in-left' | 'slide-in-right',
    visual: 'demo-component-name', // optional
    tips: ['tip1', 'tip2'] // optional
  }
];
```

---

### 2. **Video Tutorial**
```tsx
// Usage in app/page.tsx
<VideoTutorial onClose={() => setShowVideoTutorial(false)} />

// Props
interface VideoTutorialProps {
  onClose: () => void;
}
```

**Key Features:**
- 4 video tutorials (TUTORIAL_VIDEOS array)
- Professional player with controls
- Fullscreen support
- Timeline navigation
- Playlist management

**To Add a New Video:**
```tsx
const TUTORIAL_VIDEOS = [
  {
    id: 'video-id',
    title: 'Video Title',
    duration: 60, // in seconds
    description: 'Video description',
    frames: [
      { time: 0, label: 'Frame Label', action: 'What happens' },
      // ... more frames
    ]
  }
];
```

---

### 3. **Guided Walkthrough**
```tsx
// Usage in your component
<GuidedWalkthrough
  step="scoring"
  onDismiss={() => setShowWalkthrough(false)}
/>

// Props
interface GuidedWalkthroughProps {
  step: 'templates' | 'customize' | 'setup' | 'scoring' | 'results';
  onDismiss: () => void;
}
```

**Configuration:**
Edit `WALKTHROUGHS` object to customize content for each step:
```tsx
const WALKTHROUGHS = {
  'step-name': {
    title: "Title",
    tips: [
      { emoji: '🎯', title: 'Tip Title', description: 'Description' }
    ],
    videoTip: "Suggestion to watch a video"
  }
};
```

---

### 4. **Context Help**
```tsx
// Usage in form fields or sections
<ContextHelp
  title="Field Name"
  content="Explanation of what this field does"
  example="Example input or value"
  tips={["tip1", "tip2"]}
  position="top"
  trigger="hover"
>
  <input type="text" placeholder="Your input" />
</ContextHelp>

// Props
interface ContextHelpProps {
  title: string;
  content: string;
  example?: string;
  tips?: string[];
  position?: 'top' | 'bottom' | 'left' | 'right';
  trigger?: 'hover' | 'click' | 'always';
  children?: React.ReactNode;
}
```

**Usage Examples:**
```tsx
// Hover trigger
<ContextHelp title="Price" content="What you'll pay" trigger="hover" />

// Click trigger with example
<ContextHelp
  title="Weight"
  content="Importance percentage"
  example="40% for important, 10% for less important"
  trigger="click"
/>

// Always visible (teaching mode)
<ContextHelp
  title="Scoring"
  content="Rate 0-10"
  tips={["0-3: Poor", "4-6: Okay", "7-10: Excellent"]}
  trigger="always"
/>
```

---

### 5. **Help Sidebar**
```tsx
// Usage in app/page.tsx
<HelpSidebar 
  step={step}
  onOpen={() => setShowVideoTutorial(true)}
/>

// Props
interface HelpSidebarProps {
  step: 'templates' | 'customize' | 'setup' | 'scoring' | 'results' | ...;
  onOpen?: () => void;
}
```

**Customization:**
Edit `HELP_CONTENT` object:
```tsx
const HELP_CONTENT = {
  'stage-name': {
    title: "Stage Title",
    tips: [
      { emoji: '🎯', title: 'Tip 1', description: 'Description' }
    ],
    videoTip: "Video recommendation"
  }
};
```

---

### 6. **Onboarding Checklist**
```tsx
// Usage in app/page.tsx
<OnboardingChecklist
  currentStep={step}
  completedSteps={completedSteps}
  onDismiss={() => {}}
/>

// Props
interface OnboardingChecklistProps {
  currentStep: string;
  completedSteps: string[];
  onDismiss?: () => void;
}
```

**Add/Modify Checklist Items:**
```tsx
const CHECKLIST_ITEMS: ChecklistItem[] = [
  {
    id: 'item-id',
    title: 'Item Title',
    description: 'What the user needs to do',
    icon: '📌',
    completed: false,
    step: 'templates' // when this step is active
  }
];
```

---

## 🎨 Animations & Styling

### CSS Animations (in `app/globals.css`)

```css
/* Fade In */
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}
.animate-fade-in {
  animation: fade-in 0.6s ease-out forwards;
}

/* Slide In From Left */
@keyframes slide-in-left {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
.animate-slide-in-left {
  animation: slide-in-left 0.6s ease-out forwards;
}

/* Slide In From Right */
@keyframes slide-in-right {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
.animate-slide-in-right {
  animation: slide-in-right 0.6s ease-out forwards;
}

/* Slide In From Bottom */
@keyframes slide-in-up {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-slide-in-up {
  animation: slide-in-up 0.6s ease-out forwards;
}
```

### Tailwind Classes Used

```tsx
// Layout
flex, grid, flex-col, flex-row, gap-*, p-*, m-*

// Colors
bg-blue-*, text-blue-*, border-blue-*
bg-gradient-to-*, from-*, to-*

// Effects
rounded-lg, shadow-lg, backdrop-blur-sm
hover:shadow-xl, transition-all, duration-300

// Responsive
md:, lg:, flex-shrink-0, max-h-*, overflow-y-auto

// Dark Mode
dark:bg-*, dark:text-*, dark:border-*
```

---

## 🔄 State Management

### Main App State (in `app/page.tsx`)

```tsx
// Tutorial visibility
const [showOnboarding, setShowOnboarding] = useState(true);
const [showVideoTutorial, setShowVideoTutorial] = useState(false);

// Handlers
const handleCompleteOnboarding = () => {
  setShowOnboarding(false);
};

const handleSkipOnboarding = () => {
  setShowOnboarding(false);
};
```

### Component Internal State

Each tutorial component manages its own state:
- Current step/frame
- Play/pause state (video player)
- Expanded/minimized state (help panels)
- Dismissed state (help prompts)

---

## 🚀 Integration Examples

### Example 1: Add Help to a Form Field
```tsx
import { ContextHelp } from '@/components/context-help';

<ContextHelp
  title="Decision Name"
  content="Give your decision a clear, meaningful name"
  example="'Choosing between job offers' or 'Which laptop to buy?'"
  trigger="hover"
  position="top"
>
  <input
    type="text"
    placeholder="Enter decision name"
  />
</ContextHelp>
```

### Example 2: Show Tutorial at Specific Step
```tsx
import { InteractiveTutorial } from '@/components/interactive-tutorial';

if (isFirstTime && step === 'templates') {
  <InteractiveTutorial
    onComplete={() => setIsFirstTime(false)}
    onSkip={() => setIsFirstTime(false)}
  />
}
```

### Example 3: Add Video Recommendation
```tsx
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';

<Button
  onClick={() => setShowVideoTutorial(true)}
  variant="outline"
  className="gap-2"
>
  <Play className="w-4 h-4" />
  Watch How-To Video
</Button>
```

### Example 4: Track Progress with Checklist
```tsx
import { OnboardingChecklist } from '@/components/onboarding-checklist';

const completedSteps = [];
if (decision) completedSteps.push('add-options');
if (scores.length > 0) completedSteps.push('score-options');

<OnboardingChecklist
  currentStep={step}
  completedSteps={completedSteps}
/>
```

---

## 🧪 Testing

### Unit Test Example
```tsx
import { render, screen } from '@testing-library/react';
import { InteractiveTutorial } from '@/components/interactive-tutorial';

describe('InteractiveTutorial', () => {
  it('renders all 6 steps', () => {
    const { container } = render(
      <InteractiveTutorial
        onComplete={() => {}}
        onSkip={() => {}}
      />
    );
    
    expect(screen.getByText(/Welcome/)).toBeInTheDocument();
  });

  it('calls onComplete when finished', () => {
    const onComplete = jest.fn();
    // ... test logic
  });
});
```

### Integration Test
```tsx
// Test full flow from tutorial to decision
describe('Tutorial System Integration', () => {
  it('completes full user journey', () => {
    // 1. Tutorial appears
    // 2. User clicks through steps
    // 3. Tutorial closes
    // 4. Help sidebar is available
    // 5. User makes a decision
  });
});
```

---

## 🔍 Debugging

### Enable Console Logging
```tsx
// In any tutorial component
useEffect(() => {
  console.log('[Tutorial] Current step:', currentStep);
  console.log('[Tutorial] Progress:', `${currentStep + 1}/${totalSteps}`);
}, [currentStep]);
```

### Check Component Props
```tsx
// Log props when component mounts
useEffect(() => {
  console.log('[Help Sidebar] Props:', { step, onOpen });
}, [step, onOpen]);
```

### Verify Animations
```tsx
// Check animation timing
const startTime = performance.now();
// ... animation code ...
const endTime = performance.now();
console.log(`[Animation] Duration: ${endTime - startTime}ms`);
```

---

## 📊 Performance Tips

### 1. Memoize Expensive Components
```tsx
export const InteractiveTutorial = React.memo(({ onComplete, onSkip }) => {
  // Component code
});
```

### 2. Lazy Load Tutorial Components
```tsx
const InteractiveTutorial = dynamic(
  () => import('@/components/interactive-tutorial'),
  { loading: () => <div>Loading...</div> }
);
```

### 3. Optimize Animation Timing
```tsx
// Use lower durations for mobile
const animationDuration = isMobile ? '0.3s' : '0.6s';
```

---

## 🎯 Customization Checklist

- [ ] Update TUTORIAL_STEPS with your content
- [ ] Modify TUTORIAL_VIDEOS with your videos
- [ ] Customize WALKTHROUGHS for each step
- [ ] Update HELP_CONTENT with your help text
- [ ] Modify CHECKLIST_ITEMS for your flow
- [ ] Adjust animation timing in globals.css
- [ ] Update color scheme if needed
- [ ] Test on mobile devices
- [ ] Verify dark mode colors
- [ ] Check accessibility (alt text, labels)

---

## 🚀 Deployment Checklist

- [ ] All components render without errors
- [ ] Animations play smoothly
- [ ] Mobile layout looks good
- [ ] Dark mode works correctly
- [ ] Links don't have broken references
- [ ] No console errors
- [ ] Video player works on all browsers
- [ ] Help content is complete and accurate
- [ ] No placeholder text remains
- [ ] Documentation is up-to-date

---

## 📚 Related Files

| File | Purpose |
|------|---------|
| `TUTORIAL_GUIDE.md` | User-facing guide |
| `TUTORIAL_FEATURES.md` | Feature specifications |
| `TUTORIAL_VISUAL_GUIDE.md` | Visual diagrams |
| `QUICK_REFERENCE.md` | Quick reference card |
| `TUTORIAL_IMPLEMENTATION.md` | Implementation summary |

---

## 🔗 External Resources

- **React Docs:** https://react.dev
- **Next.js Docs:** https://nextjs.org
- **Tailwind CSS:** https://tailwindcss.com
- **Lucide Icons:** https://lucide.dev
- **shadcn/ui:** https://ui.shadcn.com

---

## 💡 Tips for Maintainers

1. **Keep documentation updated** - Any code changes should update docs
2. **Test on multiple devices** - Mobile, tablet, and desktop
3. **Monitor performance** - Animation shouldn't impact page speed
4. **Gather user feedback** - Iterate based on user behavior
5. **Update tutorial content regularly** - Keep it relevant
6. **Version control** - Use meaningful commit messages
7. **Code review** - Have others review changes
8. **Test accessibility** - Screen readers, keyboard navigation

---

## 🎓 Learning Resources

For new developers on the project:

1. Start with `TUTORIAL_VISUAL_GUIDE.md`
2. Read `TUTORIAL_FEATURES.md`
3. Review component files (start with `interactive-tutorial.tsx`)
4. Look at integration in `app/page.tsx`
5. Test components locally
6. Reference `TUTORIAL_GUIDE.md` for user-facing content

---

## 📞 Support & Questions

**For issues:**
1. Check existing documentation
2. Review component comments
3. Check related components
4. Refer to examples in this guide

**For enhancements:**
1. Discuss with team
2. Update documentation first
3. Implement changes
4. Test thoroughly
5. Update all related docs

---

## ✅ Maintenance Schedule

- **Weekly:** Check for bug reports
- **Monthly:** Review user feedback
- **Quarterly:** Update tutorial content
- **Annually:** Major feature reviews

---

## 🎉 You're Ready!

With this guide, you can:
- ✅ Understand the component architecture
- ✅ Customize tutorial content
- ✅ Add new features
- ✅ Debug issues
- ✅ Deploy with confidence

Happy coding! 🚀

---

_Last Updated: March 2, 2026_
_For: Developers maintaining the Decision Companion_
