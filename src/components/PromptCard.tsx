'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Prompt } from '@/types/prompt';

interface PromptCardProps {
  prompt: Prompt;
}

export function PromptCard({ prompt }: PromptCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prompt.content);
      setCopied(true);
      toast.success('Copied!', {
        description: `"${prompt.title}" copied to clipboard.`,
      });

      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
      toast.error('Copy failed', {
        description: 'Unable to copy to clipboard. Please check browser permissions.',
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
