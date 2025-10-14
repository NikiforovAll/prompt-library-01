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
