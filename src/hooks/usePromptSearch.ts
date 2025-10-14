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
