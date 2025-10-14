# Research: AI Prompt Management Library MVP

**Date**: 2025-10-13
**Feature**: Search and Copy Prompts POC

## Overview

This document captures technical research and decisions for implementing the minimal MVP: prompt search with clipboard copy functionality using the existing Next.js + shadcn/ui stack.

## 1. shadcn/ui Component Requirements

### Decision: Use Existing Components + Add Toast

**Components Needed:**
- ✅ **Input**: Already available in shadcn/ui for search box
- ✅ **Button**: Already available for copy action
- ⚠️ **Toast/Sonner**: Need to add for copy confirmation feedback
- ✅ **Card**: Already available for prompt display (optional, can use simple div)

**Rationale:**
- Leverage existing shadcn components to minimize setup
- Toast provides non-intrusive user feedback for copy action
- shadcn recommends Sonner for toast notifications (modern, accessible)

**Installation Required:**
```bash
npx shadcn@latest add toast
```

**Alternative Considered:**
- Button state change (checkmark icon) - rejected because less discoverable and requires timer logic
- Alert component - rejected because too prominent and blocks UI

### 2. Clipboard API Implementation

**Decision**: Use Modern Clipboard API with Error Handling

**Implementation:**
```typescript
async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Clipboard API failed:', error);
    return false;
  }
}
```

**Requirements:**
- HTTPS required (localhost works for development)
- User gesture required (button click satisfies this)
- Async operation - use try/catch for error handling

**Fallback Strategy:**
- If copy fails, show error toast: "Clipboard access denied"
- No fallback to `document.execCommand('copy')` - deprecated and unreliable
- For MVP, graceful degradation is acceptable

**Browser Support:**
- Chrome 66+ ✅
- Firefox 63+ ✅
- Safari 13.1+ ✅
- Edge 79+ ✅

**Rationale**: All modern browsers support Clipboard API. No polyfill needed for MVP targeting latest browsers.

## 3. Search Implementation Strategy

**Decision**: Client-Side Real-Time Filtering with Case-Insensitive Match

**Algorithm:**
```typescript
function filterPrompts(prompts: Prompt[], query: string): Prompt[] {
  if (!query.trim()) return prompts; // Show all if empty

  const lowerQuery = query.toLowerCase();
  return prompts.filter(prompt =>
    prompt.title.toLowerCase().includes(lowerQuery) ||
    prompt.content.toLowerCase().includes(lowerQuery)
  );
}
```

**Performance Considerations:**
- 5-10 prompts: Instant filtering (< 1ms)
- No debouncing needed for MVP
- Future (100+ prompts): Consider debouncing after 150-300ms

**Search Features:**
- ✅ Case-insensitive
- ✅ Partial match (substring)
- ✅ Search in title AND content
- ❌ Regex support (out of scope)
- ❌ Fuzzy matching (out of scope)
- ❌ Highlighting matches (deferred to v2.0)

**Alternatives Considered:**
- Full-text search library (Fuse.js, lunr.js) - overkill for 10 prompts
- Server-side search - violates constitution (client-side only)
- IndexedDB with full-text index - deferred to v2.0 with persistence

## 4. State Management Approach

**Decision**: React useState + Derived State (No External Library)

**Architecture:**
```typescript
// In component or custom hook
const [searchQuery, setSearchQuery] = useState('');
const filteredPrompts = useMemo(
  () => filterPrompts(PROMPTS, searchQuery),
  [searchQuery]
);
```

**State Structure:**
- `searchQuery: string` - User input from search box
- `filteredPrompts: Prompt[]` - Derived via useMemo (recalculates on query change)

**Why No External State Management:**
- Only 1 piece of state (search query)
- No global state needed (single page)
- No state persistence required (resets on refresh)
- React hooks sufficient for MVP

**Custom Hook Pattern (Optional):**
```typescript
function usePromptSearch(prompts: Prompt[]) {
  const [query, setQuery] = useState('');
  const results = useMemo(
    () => filterPrompts(prompts, query),
    [prompts, query]
  );
  return { query, setQuery, results };
}
```

**Rationale**: Encapsulates search logic for reusability and testability. Recommended for cleaner component code.

## 5. Stub Data Structure

**Decision**: Hardcoded Array of Prompt Objects

**Data File Location:** `src/data/prompts.ts`

**Sample Structure:**
```typescript
export const STUB_PROMPTS: Prompt[] = [
  {
    id: '1',
    title: 'Meeting Summary',
    content: 'Summarize the key points from this meeting...'
  },
  {
    id: '2',
    title: 'Code Review',
    content: 'Review this code for best practices...'
  },
  // ... 5-10 total prompts
];
```

**Prompt Categories for Stub Data:**
1. Meeting/Communication (2 prompts)
2. Writing/Content (2 prompts)
3. Code/Development (2 prompts)
4. Data Analysis (1-2 prompts)
5. Creative/Brainstorming (1-2 prompts)

**Rationale**: Diverse categories demonstrate search functionality across different use cases. Real-world representation for POC demo.

## 6. Component Architecture

**Decision**: Composition with Presentational Components

**Component Breakdown:**
```
page.tsx (Smart Component)
├── Uses usePromptSearch hook
├── Manages search state
└── Renders:
    ├── PromptSearch (input + search logic)
    └── PromptList (results display)
        └── PromptCard × N (individual prompts)
            └── CopyButton (clipboard action)
```

**Responsibilities:**
- `page.tsx`: State management, data orchestration
- `PromptSearch`: Search input UI, onChange handler
- `PromptCard`: Display prompt info, handle copy action
- `usePromptSearch`: Search logic, filtering algorithm

**Rationale**: Separation of concerns, testable components, reusable pieces for future features.

## 7. Styling Strategy

**Decision**: Tailwind CSS with shadcn/ui Design Tokens

**Approach:**
- Use shadcn/ui components for consistency
- Tailwind utility classes for layout
- CSS variables for theme colors (already configured)
- Responsive layout deferred (desktop-first for MVP)

**Layout:**
- Max-width container (prose or custom)
- Search bar at top (sticky optional)
- Grid/Flex layout for prompt cards
- Simple spacing (gap utilities)

## 8. Error Handling

**Scenarios & Solutions:**

1. **Clipboard API Unavailable**
   - Show error toast: "Unable to copy. Please check browser permissions."
   - Log error to console for debugging

2. **Empty Search Results**
   - Display: "No prompts found matching '[query]'"
   - Option to clear search

3. **Invalid Data**
   - TypeScript interfaces prevent invalid prompt structure
   - Runtime validation not needed (hardcoded data)

## 9. Accessibility Considerations

**MVP Requirements:**
- ✅ Search input has label (visible or aria-label)
- ✅ Copy button has clear text or aria-label
- ✅ Toast announcements for screen readers (Sonner handles this)
- ✅ Keyboard navigation works (native HTML elements)
- ⚠️ Focus management (defer to post-MVP)

## 10. Performance Benchmarks

**Expected Performance:**
- Initial render: < 100ms
- Search filtering: < 5ms (10 prompts)
- Copy operation: < 50ms
- Toast display: < 100ms

**Monitoring:** Browser DevTools Performance tab (manual testing for MVP).

## Summary of Key Decisions

| Decision Point | Choice | Rationale |
|---------------|--------|-----------|
| UI Framework | shadcn/ui + Tailwind | Already installed, consistent design |
| Toast Library | Sonner | Recommended by shadcn, accessible |
| Clipboard API | Modern navigator.clipboard | Best practice, no polyfill needed |
| Search Algorithm | Case-insensitive substring | Simple, fast for small dataset |
| State Management | React hooks only | Sufficient for single-state use case |
| Data Storage | Hardcoded array | MVP requirement, no persistence |
| Component Pattern | Composition | Testable, maintainable, reusable |
| Error Handling | Toast notifications | Non-intrusive, user-friendly |

## References

- [shadcn/ui Toast Documentation](https://ui.shadcn.com/docs/components/toast)
- [MDN Clipboard API](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API)
- [React useMemo Hook](https://react.dev/reference/react/useMemo)
- [Next.js App Router](https://nextjs.org/docs/app)

## Next Steps

Proceed to Phase 1: Generate data-model.md and quickstart.md based on these research findings.
