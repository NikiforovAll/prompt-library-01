# Quickstart Guide: AI Prompt Management Library MVP

**Date**: 2025-10-13
**Feature**: Search and Copy Prompts POC

## Overview

This guide provides step-by-step instructions for implementing the prompt search and copy functionality MVP. Follow these steps in order for fastest implementation.

## Prerequisites

✅ **Already Installed:**
- Node.js (18+)
- Next.js 15.5.3
- React 19
- TypeScript 5
- Tailwind CSS 4
- shadcn/ui (base components)
- Playwright (for future testing)

## Implementation Steps

### Step 1: Install Missing shadcn Components (2 min)

Install toast component for copy confirmation feedback:

```bash
npx shadcn@latest add toast
```

This adds:
- `src/components/ui/toast.tsx`
- `src/components/ui/toaster.tsx`
- `src/components/ui/use-toast.ts`

### Step 2: Create Type Definitions (3 min)

Create `src/types/prompt.ts`:

```typescript
/**
 * Represents a prompt template in the library
 */
export interface Prompt {
  /** Unique identifier for the prompt */
  id: string;

  /** Short descriptive title (displayed in search results) */
  title: string;

  /** Full prompt text content (copied to clipboard) */
  content: string;
}
```

### Step 3: Create Stub Data (5 min)

Create `src/data/prompts.ts`:

```typescript
import { Prompt } from '@/types/prompt';

export const STUB_PROMPTS: Prompt[] = [
  {
    id: '1',
    title: 'Meeting Summary',
    content: 'Please summarize the key points, decisions, and action items from this meeting. Include attendees, main topics discussed, and any follow-up tasks with assigned owners.'
  },
  {
    id: '2',
    title: 'Code Review Checklist',
    content: 'Review this code for: (1) correctness and logic errors, (2) code style and conventions, (3) performance considerations, (4) security vulnerabilities, (5) test coverage, and (6) documentation clarity.'
  },
  {
    id: '3',
    title: 'Blog Post Outline',
    content: 'Create an outline for a blog post on [TOPIC]. Include: engaging title, introduction hook, 3-5 main sections with key points, conclusion with call-to-action, and suggested meta description for SEO.'
  },
  {
    id: '4',
    title: 'Data Analysis Report',
    content: 'Analyze this dataset and provide: (1) summary statistics, (2) key trends and patterns, (3) outliers or anomalies, (4) correlations between variables, (5) visualizations recommendations, and (6) actionable insights.'
  },
  {
    id: '5',
    title: 'Email Response Template',
    content: 'Draft a professional email response addressing [TOPIC]. Tone: [friendly/formal/neutral]. Include: acknowledgment of their request, clear answer or next steps, timeline if applicable, and professional closing.'
  },
  {
    id: '6',
    title: 'Brainstorming Session',
    content: 'Generate 10 creative ideas for [TOPIC/PROBLEM]. For each idea: brief description, potential benefits, implementation difficulty (low/medium/high), and any risks or considerations.'
  },
  {
    id: '7',
    title: 'User Story Creation',
    content: 'Create a user story for [FEATURE]. Format: "As a [user type], I want to [action] so that [benefit]." Include: acceptance criteria (3-5 points), edge cases to consider, and testing notes.'
  }
];
```

### Step 4: Create Search Hook (10 min)

Create `src/hooks/usePromptSearch.ts`:

```typescript
import { useMemo, useState } from 'react';
import { Prompt } from '@/types/prompt';

function filterPrompts(prompts: Prompt[], query: string): Prompt[] {
  const trimmedQuery = query.trim();

  if (!trimmedQuery) {
    return prompts;
  }

  const lowerQuery = trimmedQuery.toLowerCase();

  return prompts.filter(prompt => {
    const titleMatch = prompt.title.toLowerCase().includes(lowerQuery);
    const contentMatch = prompt.content.toLowerCase().includes(lowerQuery);
    return titleMatch || contentMatch;
  });
}

export function usePromptSearch(prompts: Prompt[]) {
  const [query, setQuery] = useState('');

  const results = useMemo(
    () => filterPrompts(prompts, query),
    [prompts, query]
  );

  return {
    query,
    setQuery,
    results,
    isSearching: query.trim().length > 0
  };
}
```

### Step 5: Create Prompt Card Component (15 min)

Create `src/components/PromptCard.tsx`:

```typescript
'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Prompt } from '@/types/prompt';

interface PromptCardProps {
  prompt: Prompt;
}

export function PromptCard({ prompt }: PromptCardProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prompt.content);
      setCopied(true);
      toast({
        title: 'Copied!',
        description: `"${prompt.title}" copied to clipboard.`,
      });

      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
      toast({
        title: 'Copy failed',
        description: 'Unable to copy to clipboard. Please check browser permissions.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="border rounded-lg p-4 hover:border-primary transition-colors">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h3 className="font-semibold text-lg mb-2">{prompt.title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-3">
            {prompt.content}
          </p>
        </div>
        <Button
          onClick={handleCopy}
          variant="outline"
          size="icon"
          className="shrink-0"
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-600" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
}
```

### Step 6: Update Main Page (15 min)

Update `src/app/page.tsx`:

```typescript
'use client';

import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { PromptCard } from '@/components/PromptCard';
import { usePromptSearch } from '@/hooks/usePromptSearch';
import { STUB_PROMPTS } from '@/data/prompts';

export default function HomePage() {
  const { query, setQuery, results, isSearching } = usePromptSearch(STUB_PROMPTS);

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Prompt Library</h1>
        <p className="text-muted-foreground">
          Search and copy prompt templates for your AI workflows
        </p>
      </header>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search prompts..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="space-y-4">
        {results.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            {isSearching ? (
              <p>No prompts found matching &quot;{query}&quot;</p>
            ) : (
              <p>No prompts available</p>
            )}
          </div>
        ) : (
          results.map((prompt) => (
            <PromptCard key={prompt.id} prompt={prompt} />
          ))
        )}
      </div>
    </div>
  );
}
```

### Step 7: Add Toaster to Root Layout (5 min)

Update `src/app/layout.tsx` to include the Toaster:

```typescript
import { Toaster } from '@/components/ui/toaster';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
```

### Step 8: Run and Test (5 min)

```bash
# Start development server
npm run dev

# Open browser to http://localhost:3000
# Test:
# 1. Type "meeting" in search box → should see Meeting Summary
# 2. Click copy button → should see success toast
# 3. Paste in text editor → should see prompt content
# 4. Search "xyz" → should see "No prompts found"
```

## File Structure Created

```
src/
├── app/
│   ├── layout.tsx        # MODIFIED: Added Toaster
│   └── page.tsx          # MODIFIED: Search UI
├── components/
│   ├── ui/               # shadcn components (toast added)
│   └── PromptCard.tsx    # NEW
├── data/
│   └── prompts.ts        # NEW
├── hooks/
│   └── usePromptSearch.ts # NEW
└── types/
    └── prompt.ts         # NEW
```

## Testing Checklist

Manual testing steps:

- [ ] Search with empty query shows all prompts
- [ ] Search with "meeting" shows Meeting Summary
- [ ] Search with "code" shows Code Review Checklist
- [ ] Search with "xyz" shows "No prompts found"
- [ ] Copy button shows checkmark for 2 seconds
- [ ] Toast notification appears on successful copy
- [ ] Pasting in text editor shows full prompt content
- [ ] Multiple rapid copies work correctly

## Troubleshooting

### Toast not showing
- Check `<Toaster />` is in layout.tsx
- Verify shadcn toast was installed correctly
- Check browser console for errors

### Copy not working
- Ensure running on localhost or HTTPS
- Check browser console for clipboard permission errors
- Try in different browser

### Search not filtering
- Check query state is updating (add console.log)
- Verify filterPrompts function logic
- Ensure useMemo dependencies are correct

## Performance Notes

Expected performance with 7 prompts:
- Initial render: ~50ms
- Search filtering: <1ms per keystroke
- Copy operation: <50ms
- Toast display: <100ms

## Next Steps

After MVP is working:

1. Run `/speckit.tasks` to generate implementation task breakdown
2. Add Playwright tests for search and copy flows
3. Consider v2.0 features (see v_next.md):
   - localStorage persistence
   - Edit prompts
   - Add new prompts
   - Categories/folders

## Development Tips

**Hot Reload**: Next.js Turbopack provides instant updates. No need to manually refresh.

**Debugging**: Use React DevTools to inspect component state and props.

**Styling**: Modify Tailwind classes in components for custom styling. shadcn uses CSS variables for theming.

**Adding More Prompts**: Just add objects to STUB_PROMPTS array in `data/prompts.ts`.

## Estimated Time

Total implementation time: **~60 minutes**

- Setup (Steps 1-3): 10 min
- Core logic (Step 4): 10 min
- UI components (Steps 5-6): 30 min
- Integration (Steps 7-8): 10 min

## Support

If you encounter issues:
1. Check browser console for errors
2. Verify all files are created in correct locations
3. Ensure shadcn toast component installed successfully
4. Confirm Next.js dev server is running without errors
