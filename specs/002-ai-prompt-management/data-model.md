# Data Model: AI Prompt Management Library MVP

**Date**: 2025-10-13
**Feature**: Search and Copy Prompts POC

## Overview

This document defines the data structures and TypeScript interfaces for the MVP. Since this is a POC with hardcoded data, the model is intentionally minimal.

## Core Entities

### 1. Prompt

**Purpose**: Represents a single prompt template that users can search and copy.

**Interface:**
```typescript
interface Prompt {
  id: string;           // Unique identifier (e.g., '1', '2', '3')
  title: string;        // Display name/summary of the prompt
  content: string;      // The actual prompt text to be copied
}
```

**Field Specifications:**

| Field | Type | Required | Constraints | Description |
|-------|------|----------|-------------|-------------|
| `id` | string | ✅ Yes | Unique, non-empty | Unique identifier for React keys |
| `title` | string | ✅ Yes | Non-empty, max 100 chars | Short descriptive name |
| `content` | string | ✅ Yes | Non-empty, max 5000 chars | Prompt template text |

**Validation Rules:**
- All fields are required (no optional fields in MVP)
- `id` must be unique within the prompts array
- `title` should be concise for display in search results
- `content` contains the full prompt text

**Example Instance:**
```typescript
const examplePrompt: Prompt = {
  id: '1',
  title: 'Meeting Summary',
  content: 'Please summarize the key points, decisions, and action items from this meeting. Include attendees, main topics discussed, and any follow-up tasks with assigned owners.'
};
```

### 2. SearchState (Derived State)

**Purpose**: Represents the current search state in the UI.

**Structure:**
```typescript
interface SearchState {
  query: string;              // Current search input value
  results: Prompt[];          // Filtered prompts matching query
  isSearching: boolean;       // True if query is non-empty
}
```

**Note**: This is derived state, not persisted. Computed on-the-fly from prompts array and query string.

## Data Relationships

```
STUB_PROMPTS (Array)
  ├── Prompt 1
  ├── Prompt 2
  ├── ...
  └── Prompt N

User Input (query) ──filter──> SearchState (results)
```

**Relationship Rules:**
- One-to-many: One search query can match zero to many prompts
- No hierarchical relationships (no folders/categories in MVP)
- No user-prompt relationships (no ownership/authorship tracking)

## Data Storage

### Location
```typescript
// src/data/prompts.ts
export const STUB_PROMPTS: Prompt[] = [/* hardcoded data */];
```

### Characteristics
- **Immutable**: Array is read-only at runtime
- **In-memory**: No persistence across page refreshes
- **Static**: Defined at build time, not user-modifiable
- **Small dataset**: 5-10 prompts for MVP

### Future Evolution (v2.0+)
- Move to localStorage/IndexedDB
- Add metadata fields (tags, category, createdAt, etc.)
- Support user-created prompts
- Implement CRUD operations

## Data Flow

```
[User Types in Search Box]
         ↓
   Update query state
         ↓
   Filter STUB_PROMPTS
         ↓
  Display filtered results
         ↓
  [User Clicks Copy Button]
         ↓
   navigator.clipboard.writeText(prompt.content)
         ↓
    Show success toast
```

**Key Operations:**

1. **Read**: Load STUB_PROMPTS on page mount
2. **Filter**: Apply search query to prompts array
3. **Copy**: Extract `content` field for clipboard

No Create, Update, or Delete operations in MVP.

## Stub Data Specification

### Quantity
- Minimum: 5 prompts
- Maximum: 10 prompts
- Recommended: 7-8 prompts for variety

### Content Guidelines
- **Titles**: 3-8 words, action-oriented
- **Content**: 50-300 words, realistic prompt templates
- **Diversity**: Cover multiple use cases (meetings, code, writing, analysis)

### Sample Dataset

```typescript
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

## TypeScript Type Definitions

**File:** `src/types/prompt.ts`

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

/**
 * Type guard to check if an object is a valid Prompt
 * (Not needed for MVP but useful for future data loading)
 */
export function isPrompt(obj: unknown): obj is Prompt {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    'title' in obj &&
    'content' in obj &&
    typeof (obj as Prompt).id === 'string' &&
    typeof (obj as Prompt).title === 'string' &&
    typeof (obj as Prompt).content === 'string'
  );
}
```

## Search Algorithm Specification

**Function Signature:**
```typescript
function filterPrompts(prompts: Prompt[], query: string): Prompt[]
```

**Algorithm:**
```typescript
export function filterPrompts(prompts: Prompt[], query: string): Prompt[] {
  const trimmedQuery = query.trim();

  // Empty query returns all prompts
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
```

**Complexity:**
- Time: O(n × m) where n = number of prompts, m = average prompt length
- Space: O(k) where k = number of matching prompts
- Performance: < 5ms for 10 prompts, < 1ms for typical queries

**Search Behavior:**
- Case-insensitive matching
- Substring search (partial matches)
- OR logic (matches title OR content)
- No ranking/scoring (preserves original order)

## Validation & Error Handling

### Runtime Validation

**Not Needed for MVP** because:
- Data is hardcoded and typed at compile time
- TypeScript enforces interface at build time
- No user input creates new prompts

### Future Considerations (v2.0+)

When adding user-created prompts:
```typescript
function validatePrompt(prompt: unknown): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!isPrompt(prompt)) {
    errors.push('Invalid prompt structure');
    return { valid: false, errors };
  }

  if (!prompt.id) errors.push('ID is required');
  if (!prompt.title || prompt.title.length > 100) {
    errors.push('Title must be 1-100 characters');
  }
  if (!prompt.content || prompt.content.length > 5000) {
    errors.push('Content must be 1-5000 characters');
  }

  return { valid: errors.length === 0, errors };
}
```

## Summary

**Data Model Characteristics:**
- ✅ Minimal: Only essential fields for MVP
- ✅ Type-safe: Full TypeScript interfaces
- ✅ Immutable: Read-only hardcoded data
- ✅ Searchable: Title and content fields indexed
- ✅ Extensible: Easy to add fields in future versions

**Next Steps:**
- Implement TypeScript interfaces in `src/types/prompt.ts`
- Create stub data file in `src/data/prompts.ts`
- Build search filtering logic in `src/hooks/useSearch.ts`
