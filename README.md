# AI Prompt Management Library

A modern, lightweight web application for managing and organizing AI prompt templates. Search, copy, and reuse your favorite prompts instantly.

## Overview

This project provides a minimal, user-friendly interface for storing and accessing AI prompt templates. Built with Next.js and TypeScript, it focuses on speed and simplicity - search your prompts by keyword and copy them to your clipboard with a single click.

### Key Features

- **⚡ Instant Search**: Real-time filtering of prompts by title or content
- **📋 One-Click Copy**: Copy any prompt to clipboard with visual feedback
- **🎨 Modern UI**: Clean interface built with shadcn/ui components
- **🚀 Fast Performance**: Client-side filtering with sub-millisecond response times
- **📱 Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

- **Framework**: [Next.js 15.5.3](https://nextjs.org/) with App Router and Turbopack
- **Language**: [TypeScript 5](https://www.typescriptlang.org/)
- **UI Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Components**: [shadcn/ui](https://ui.shadcn.com/) with Radix UI primitives
- **Icons**: [lucide-react](https://lucide.dev/)
- **Testing**: [Playwright](https://playwright.dev/)

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm, pnpm, or yarn package manager

### Installation

1. Clone the repository:

```bash
git clone https://github.com/NikiforovAll/prompt-library.git
cd prompt-library
```

2. Install dependencies:

```bash
npm install
# or
pnpm install
# or
yarn install
```

3. Run the development server:

```bash
npm run dev
# or
pnpm dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Quick Start

Once the application is running:

1. **Search**: Type keywords in the search box (e.g., "meeting", "code review")
2. **Browse**: View matching prompts with titles and preview text
3. **Copy**: Click the copy button next to any prompt
4. **Paste**: Use your copied prompt in any AI chat interface

## Project Structure

```
prompt-library/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout with Toaster
│   │   ├── page.tsx            # Main search and display page
│   │   └── globals.css         # Global styles
│   ├── components/
│   │   ├── ui/                 # shadcn/ui base components
│   │   └── PromptCard.tsx      # Prompt display component
│   ├── data/
│   │   └── prompts.ts          # Prompt data (stub/demo)
│   ├── hooks/
│   │   └── usePromptSearch.ts  # Search logic hook
│   ├── lib/
│   │   └── utils.ts            # Utility functions
│   └── types/
│       └── prompt.ts           # TypeScript type definitions
├── tests/
│   └── prompt-library.spec.ts  # Playwright tests
├── specs/
│   └── 002-ai-prompt-management/ # Feature specifications
├── .claude/                     # Claude Code configuration
│   ├── agents/                  # Specialized AI agents
│   └── commands/                # Custom slash commands
└── .specify/                    # Spec Kit templates and scripts
```

## Development

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build production bundle
- `npm run start` - Start production server
- `npm run lint` - Run ESLint for code quality
- `npm test` - Run Playwright tests

### Adding New Prompts

Edit `src/data/prompts.ts` to add your own prompts:

```typescript
{
  id: 'unique-id',
  title: 'Your Prompt Title',
  content: 'The full prompt text that will be copied...'
}
```

### Customizing UI

The project uses shadcn/ui components which are customizable via:
- **Tailwind classes**: Modify component styling directly
- **CSS variables**: Edit theme colors in `src/app/globals.css`
- **Component variants**: Extend shadcn components using class-variance-authority

## Development Workflow

This project integrates [Spec Kit](https://github.com/github/spec-kit) for structured feature development:

### Planning Features

```bash
# Create a new feature specification
/speckit.specify

# Analyze requirements
/speckit.analyze

# Generate implementation checklist
/speckit.checklist

# Break down into tasks
/speckit.tasks
```

### AI-Assisted Development

Configured for [Claude Code](https://claude.ai/code) with specialized agents:

- **shadcn components**: Requirements analysis, component research, and implementation
- **Playwright testing**: Test planning, generation, and healing
- **Spec Kit integration**: Feature specifications and task management

See `.claude/agents/` for agent configurations.

## Testing

### Manual Testing

1. Search with various keywords
2. Verify copy functionality
3. Check toast notifications
4. Test edge cases (empty search, no results)

### Automated Testing

```bash
# Run all tests
npm test

# Run in UI mode
npx playwright test --ui

# Run specific test
npx playwright test prompt-library
```

Tests cover:
- Search functionality
- Copy to clipboard operations
- Empty state handling
- Toast notifications

## Architecture Decisions

### Why Client-Side Only?

The MVP prioritizes simplicity and speed:
- No server-side processing needed for search
- Instant filtering without API calls
- Easy deployment as static site
- Future: Can add persistence layer when needed

### Why Stub Data?

Current implementation uses hardcoded prompts to:
- Validate core functionality first
- Avoid premature database integration
- Enable rapid iteration and testing
- Simplify initial deployment

Future versions will support:
- Local storage persistence
- Import/export functionality
- Database integration (optional)

## Roadmap

### Current (MVP - v0.1.0)
- ✅ Search and filter prompts
- ✅ Copy to clipboard
- ✅ Toast notifications
- ✅ Responsive UI

### Planned (v0.2.0)
- 📝 Edit existing prompts
- ➕ Add new prompts
- 💾 LocalStorage persistence
- 🗂️ Categories and folders
- 🔍 Advanced search (tags, metadata)

### Future Considerations
- User authentication
- Cloud sync
- Sharing prompts
- Prompt versioning
- Analytics and usage tracking

See `specs/002-ai-prompt-management/v_next.md` for detailed future plans.

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Follow the Spec Kit workflow for feature planning
4. Make your changes with tests
5. Run linting and tests: `npm run lint && npm test`
6. Commit with descriptive messages
7. Push and create a pull request

### Code Style

- TypeScript strict mode enabled
- Follow Next.js and React conventions
- Use shadcn/ui components when possible
- Write tests for new features
- Document complex logic

## Troubleshooting

### Copy Button Not Working

**Issue**: Copy button doesn't copy text

**Solutions**:
- Ensure running on localhost or HTTPS (clipboard API requirement)
- Check browser console for permission errors
- Try in a different browser
- Verify clipboard API support: `navigator.clipboard` exists

### Toast Notifications Not Showing

**Issue**: No confirmation after copying

**Solutions**:
- Verify `<Toaster />` in `src/app/layout.tsx`
- Check that shadcn toast components are installed
- Inspect browser console for errors
- Clear browser cache and reload

### Search Not Filtering

**Issue**: Search box doesn't filter results

**Solutions**:
- Check browser console for JavaScript errors
- Verify `usePromptSearch` hook is properly imported
- Ensure state updates are working (add console.log)
- Clear browser cache

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with [Next.js](https://nextjs.org/) by Vercel
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons by [Lucide](https://lucide.dev/)
- Feature planning powered by [Spec Kit](https://github.com/github/spec-kit)
- Development assisted by [Claude Code](https://claude.ai/code)

## Contact & Support

- **Issues**: [GitHub Issues](https://github.com/NikiforovAll/prompt-library/issues)
- **Discussions**: [GitHub Discussions](https://github.com/NikiforovAll/prompt-library/discussions)
- **Author**: [Oleksii Nikiforov](https://github.com/NikiforovAll)

---

**Status**: MVP Complete ✅ | **Version**: 0.1.0 | **Last Updated**: 2025-10-14
