# Implementation Tasks: AI Prompt Management Library MVP

**Feature**: Search and Copy Prompts POC
**Branch**: `002-ai-prompt-management`
**Created**: 2025-10-13

## Overview

This task list implements a minimal prompt search and copy interface with hardcoded stub data. Single user story (P1) delivering end-to-end search and clipboard functionality in ~60 minutes.

**MVP Scope**: User can search prompts by keyword and copy them to clipboard with visual confirmation.

## Implementation Strategy

**Approach**: Linear implementation from data layer → logic layer → UI layer
**MVP-First**: Single user story P1 delivers complete working application
**Estimated Time**: 60 minutes total
**Testing**: Manual testing via browser (Playwright deferred to post-MVP)

---

## Phase 1: Setup & Dependencies (10 minutes)

### T001 [P] Install shadcn toast component
**User Story**: Setup (prerequisite for US1)
**File**: N/A (CLI command)
**Description**: Install shadcn/ui toast component for copy confirmation feedback
**Command**: `npx shadcn@latest add toast`
**Acceptance**: Toast component files created in `src/components/ui/` (toast.tsx, toaster.tsx, use-toast.ts)

### T002 [P] Verify existing shadcn components
**User Story**: Setup (prerequisite for US1)
**Files**: `src/components/ui/input.tsx`, `src/components/ui/button.tsx`
**Description**: Confirm Input and Button components are already installed
**Acceptance**: Both files exist and export functional components

---

## Phase 2: Data Layer (10 minutes)

### T003 Create TypeScript interface for Prompt
**User Story**: US1 - Search and Copy Prompts
**File**: `src/types/prompt.ts`
**Description**: Define Prompt interface with id, title, content fields

**Implementation**:
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

**Acceptance**:
- Interface exported from file
- TypeScript compilation succeeds
- All three fields properly typed

### T004 Create stub prompt data
**User Story**: US1 - Search and Copy Prompts
**File**: `src/data/prompts.ts`
**Description**: Create hardcoded array of 7 sample prompts covering diverse categories
**Dependencies**: T003 (needs Prompt interface)

**Implementation**:
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

**Acceptance**:
- Array contains exactly 7 prompts
- All prompts have unique IDs
- Content covers diverse use cases (meetings, code, writing, data, email, brainstorming, user stories)
- TypeScript compilation succeeds

---

## Phase 3: Business Logic (10 minutes)

### T005 Create search filtering hook
**User Story**: US1 - Search and Copy Prompts
**File**: `src/hooks/usePromptSearch.ts`
**Description**: Implement custom React hook for search state management and filtering logic
**Dependencies**: T003 (needs Prompt interface)

**Implementation**:
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

**Acceptance**:
- Hook returns query, setQuery, results, isSearching
- Empty query returns all prompts
- Case-insensitive substring search works
- Searches both title and content fields
- useMemo optimizes re-renders

---

## Phase 4: UI Components (30 minutes)

### T006 Create PromptCard component with copy functionality
**User Story**: US1 - Search and Copy Prompts
**File**: `src/components/PromptCard.tsx`
**Description**: Build card component displaying prompt info with copy button and clipboard integration
**Dependencies**: T001 (needs toast), T003 (needs Prompt interface)

**Implementation**:
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

**Acceptance**:
- Card displays prompt title and content preview (line-clamp-3)
- Copy button shows Copy icon by default
- Clicking copy button:
  - Copies prompt.content to clipboard
  - Shows checkmark for 2 seconds
  - Displays success toast
- Clipboard errors show error toast
- Hover effect on card border

### T007 Update main page with search UI
**User Story**: US1 - Search and Copy Prompts
**File**: `src/app/page.tsx`
**Description**: Replace existing page content with search interface and prompt list
**Dependencies**: T004 (needs stub data), T005 (needs search hook), T006 (needs PromptCard)

**Implementation**:
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

**Acceptance**:
- Page displays "Prompt Library" header with description
- Search input with magnifying glass icon
- All 7 prompts displayed on initial load
- Typing in search filters results in real-time
- Empty results show appropriate message
- No TypeScript errors
- Page is client component ('use client' directive)

### T008 Add Toaster to root layout
**User Story**: US1 - Search and Copy Prompts
**File**: `src/app/layout.tsx`
**Description**: Add Toaster component to root layout for toast notifications
**Dependencies**: T001 (needs toast component)

**Implementation**:
Add to existing layout.tsx:
```typescript
import { Toaster } from '@/components/ui/toaster';

// In the return statement, add before closing </body>:
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

**Acceptance**:
- Toaster component imported and rendered
- Toast notifications appear on screen
- Layout maintains existing structure
- No TypeScript errors

---

## Phase 5: Manual Testing (10 minutes)

### T009 Manual testing of search functionality
**User Story**: US1 - Search and Copy Prompts
**Type**: Manual Testing
**Description**: Verify search filtering works correctly across different queries
**Dependencies**: T007 (needs working UI)

**Test Cases**:
1. **Empty search**: All 7 prompts displayed
2. **Keyword "meeting"**: Shows "Meeting Summary" prompt
3. **Keyword "code"**: Shows "Code Review Checklist" prompt
4. **Keyword "xyz"**: Shows "No prompts found" message
5. **Case insensitivity**: "MEETING" matches "Meeting Summary"
6. **Content search**: Keyword in content (not title) still matches

**Acceptance**: All 6 test cases pass

### T010 Manual testing of copy functionality
**User Story**: US1 - Search and Copy Prompts
**Type**: Manual Testing
**Description**: Verify clipboard copy works and provides user feedback
**Dependencies**: T006 (needs PromptCard with copy)

**Test Cases**:
1. **Copy button click**: Icon changes to checkmark
2. **Toast notification**: Success toast appears with prompt title
3. **Clipboard content**: Paste in text editor shows full prompt content
4. **Checkmark timeout**: Icon reverts to Copy after 2 seconds
5. **Multiple copies**: Can copy different prompts sequentially
6. **Rapid clicks**: Multiple rapid clicks handled gracefully

**Acceptance**: All 6 test cases pass

---

## Checkpoint: MVP Complete ✅

**User Story P1 Complete**: All acceptance scenarios pass
- ✅ Search by keyword filters results
- ✅ Copy button copies to clipboard with confirmation
- ✅ Empty search results handled gracefully

**Ready for**: Demo, user feedback, or v2.0 planning

---

## Dependencies & Execution Order

### Critical Path (Must Complete in Order)
```
T001, T002 → T003 → T004
                 ↓
                T005
                 ↓
         T001 + T003 → T006
                       ↓
    T004 + T005 + T006 → T007
                         ↓
            T001 → T008
                   ↓
              T007 → T009, T010
```

### Parallel Opportunities

**Phase 1 (Setup):**
- T001 [P] T002 (independent setup tasks)

**Phase 2 (Data Layer):**
- After T003 completes:
  - T004 (stub data)
  - T005 (search hook)
  Can run in parallel - different files

**Phase 4 (UI):**
- After T004, T005, T006 complete:
  - T007 (page)
  - T008 (layout)
  Can run in parallel - different files

**Phase 5 (Testing):**
- After T007 completes:
  - T009 [P] T010
  Can run in parallel - independent tests

---

## Task Summary

**Total Tasks**: 10
- Setup: 2 tasks (T001-T002)
- Implementation: 6 tasks (T003-T008)
- Testing: 2 tasks (T009-T010)

**Parallelizable**: 4 tasks marked [P]
- Phase 1: T001, T002
- Phase 2: T004, T005 (after T003)
- Phase 4: T007, T008 (after T004-T006)
- Phase 5: T009, T010 (after T007)

**Estimated Time**: 60 minutes
- Setup: 10 min
- Data Layer: 10 min
- Business Logic: 10 min
- UI Components: 30 min
- Testing: 10 min (manual)

---

## Independent Testing Criteria

**User Story P1 - Search and Copy Prompts**:
1. Load application in browser → See 7 prompts displayed
2. Type "meeting" in search → See 1 matching prompt
3. Click copy button → See checkmark and toast notification
4. Paste in text editor → Verify full prompt content copied
5. Search "xyz" → See "No prompts found" message

**Complete**: All 5 steps pass = User Story P1 fully functional

---

## Implementation Notes

**Technology Stack**:
- TypeScript 5, React 19, Next.js 15.5.3
- shadcn/ui (Input, Button, Toast)
- Tailwind CSS for styling
- lucide-react for icons

**Code Quality**:
- TypeScript strict mode enabled
- Client components marked with 'use client'
- Proper error handling for clipboard API
- Accessible UI with semantic HTML

**Performance**:
- Search filtering: < 5ms (7 prompts)
- Copy operation: < 50ms
- Toast display: < 100ms
- Total interaction: < 200ms

---

## Next Steps After MVP

1. **User Feedback**: Demo to stakeholders, gather usage insights
2. **Playwright Tests**: Add automated E2E tests (deferred from MVP)
3. **v2.0 Planning**: See `v_next.md` for roadmap:
   - localStorage persistence
   - Edit/add prompts
   - Categories/folders
   - Advanced search

---

## Quick Reference

**Key Files Created**:
```
src/
├── types/prompt.ts           # T003: TypeScript interface
├── data/prompts.ts           # T004: Stub data (7 prompts)
├── hooks/usePromptSearch.ts  # T005: Search logic
├── components/
│   └── PromptCard.tsx        # T006: Card with copy button
└── app/
    ├── page.tsx              # T007: Main search UI
    └── layout.tsx            # T008: Toaster integration
```

**Commands**:
```bash
# Setup
npx shadcn@latest add toast

# Development
npm run dev

# Access
http://localhost:3000
```

**Verification**:
- Search "meeting" → 1 result
- Copy button → Checkmark + Toast
- Paste → Full prompt text
