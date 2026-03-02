'use client';

import { useState } from 'react';
import { HelpCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ContextHelpProps {
  title: string;
  content: string;
  example?: string;
  tips?: string[];
  position?: 'top' | 'bottom' | 'left' | 'right';
  trigger?: 'hover' | 'click' | 'always';
  children?: React.ReactNode;
}

export function ContextHelp({
  title,
  content,
  example,
  tips,
  position = 'top',
  trigger = 'hover',
  children
}: ContextHelpProps) {
  const [isVisible, setIsVisible] = useState(trigger === 'always');
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return children;

  const positionClasses = {
    top: 'bottom-full mb-2',
    bottom: 'top-full mt-2',
    left: 'right-full mr-2',
    right: 'left-full ml-2'
  };

  const arrowClasses = {
    top: 'top-full left-1/2 -translate-x-1/2 border-t-gray-900 dark:border-t-gray-950 border-x-transparent border-b-transparent',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-gray-900 dark:border-b-gray-950 border-x-transparent border-t-transparent',
    left: 'left-full top-1/2 -translate-y-1/2 border-l-gray-900 dark:border-l-gray-950 border-y-transparent border-r-transparent',
    right: 'right-full top-1/2 -translate-y-1/2 border-r-gray-900 dark:border-r-gray-950 border-y-transparent border-l-transparent'
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => trigger === 'hover' && setIsVisible(true)}
      onMouseLeave={() => trigger === 'hover' && setIsVisible(false)}
      onClick={() => trigger === 'click' && setIsVisible(!isVisible)}
    >
      {children || (
        <Button variant="ghost" size="sm" className="gap-1">
          <HelpCircle className="w-4 h-4" />
          Help
        </Button>
      )}

      {isVisible && trigger !== 'always' && (
        <div className={`absolute ${positionClasses[position]} bg-gray-900 dark:bg-gray-950 text-white rounded-lg shadow-xl z-50 max-w-sm w-max animate-fade-in`}>
          {/* Arrow */}
          <div className={`absolute border-4 ${arrowClasses[position]} w-0 h-0`} />

          {/* Content */}
          <div className="p-4 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <h4 className="font-semibold text-white">{title}</h4>
              {trigger !== 'always' && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsDismissed(true);
                  }}
                  className="text-gray-400 hover:text-white transition-colors flex-shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <p className="text-sm text-gray-200">{content}</p>

            {example && (
              <div className="bg-gray-800/50 rounded p-2">
                <div className="text-xs font-semibold text-gray-300 mb-1">Example:</div>
                <div className="text-xs text-gray-300 font-mono">{example}</div>
              </div>
            )}

            {tips && tips.length > 0 && (
              <div>
                <div className="text-xs font-semibold text-gray-300 mb-2">Tips:</div>
                <ul className="space-y-1">
                  {tips.map((tip, i) => (
                    <li key={i} className="text-xs text-gray-300 flex gap-2">
                      <span className="text-blue-400">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {isVisible && trigger === 'always' && (
        <div className="mt-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-semibold text-foreground flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-blue-500" />
              {title}
            </h4>
            <button
              onClick={() => setIsDismissed(true)}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-sm text-foreground/70">{content}</p>

          {example && (
            <div className="bg-blue-100 dark:bg-blue-900/40 rounded p-3">
              <div className="text-xs font-semibold text-blue-900 dark:text-blue-200 mb-1">Example:</div>
              <div className="text-xs text-blue-900 dark:text-blue-200 font-mono">{example}</div>
            </div>
          )}

          {tips && tips.length > 0 && (
            <div>
              <div className="text-xs font-semibold text-foreground mb-2">Key Points:</div>
              <ul className="space-y-1.5">
                {tips.map((tip, i) => (
                  <li key={i} className="text-xs text-foreground/70 flex gap-2">
                    <span className="text-green-600 dark:text-green-400 font-bold">✓</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Quick help badge for inline information
interface HelpBadgeProps {
  text: string;
  shortLabel?: string;
}

export function HelpBadge({ text, shortLabel }: HelpBadgeProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-flex items-center">
      <button
        className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-blue-500 hover:bg-blue-600 rounded-full transition-colors cursor-help"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        onClick={() => setIsOpen(!isOpen)}
      >
        ?
      </button>

      {isOpen && (
        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-900 dark:bg-gray-950 text-white text-xs rounded-lg px-3 py-2 max-w-xs whitespace-normal shadow-lg z-50 animate-fade-in">
          {text}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-gray-900 dark:border-gray-950 border-b-transparent border-l-transparent border-r-transparent" />
        </div>
      )}
    </div>
  );
}

// Tutorial spotlight - highlights important elements
interface SpotlightProps {
  isActive: boolean;
  title: string;
  description: string;
  targetElement?: HTMLElement;
  onDismiss: () => void;
}

export function Spotlight({
  isActive,
  title,
  description,
  targetElement,
  onDismiss
}: SpotlightProps) {
  if (!isActive) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={onDismiss} />

      {/* Spotlight highlight and tooltip */}
      {targetElement && (
        <>
          {/* Highlight circle around target */}
          <div className="fixed z-40 pointer-events-none animate-pulse">
            <div className="absolute inset-0 bg-blue-500/20 rounded-2xl border-2 border-blue-500 shadow-lg shadow-blue-500/50" />
          </div>

          {/* Tooltip */}
          <div className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-900 rounded-lg shadow-2xl p-6 max-w-sm animate-slide-in-up">
            <div className="space-y-3">
              <h3 className="font-bold text-lg text-foreground">{title}</h3>
              <p className="text-sm text-foreground/70">{description}</p>
              <button
                onClick={onDismiss}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-colors"
              >
                Got it!
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
