'use client';

import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { PromptCard } from '@/components/PromptCard';
import { usePromptSearch } from '@/hooks/usePromptSearch';
import { STUB_PROMPTS } from '@/data/prompts';
import { ThemeToggle } from '@/components/theme-toggle';

export default function HomePage() {
  const { query, setQuery, results, isSearching } = usePromptSearch(STUB_PROMPTS);

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <header className="mb-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Prompt Library</h1>
            <p className="text-muted-foreground">
              Search and copy prompt templates for your AI workflows
            </p>
          </div>
          <ThemeToggle />
        </div>
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
