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
