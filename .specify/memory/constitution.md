<!--
Sync Impact Report
==================
Version change: [TEMPLATE] → 1.0.0
Modified principles: NEW - 3 principles established
Added sections: Core Principles, Development Standards, Quality Assurance, Governance
Removed sections: N/A (initial constitution)
Templates requiring updates:
- .specify/templates/plan-template.md: ⚠ pending
- .specify/templates/spec-template.md: ⚠ pending
- .specify/templates/tasks-template.md: ⚠ pending
- .specify/templates/commands/*.md: ⚠ pending
Follow-up TODOs: None
-->

# Prompt Library Constitution

## Core Principles

### I. Accessibility-First Development
Every feature MUST be accessible to users with disabilities, following WCAG 2.1 Level AA guidelines. This includes proper semantic HTML, keyboard navigation support, screen reader compatibility, and sufficient color contrast ratios (4.5:1 for normal text, 3:1 for large text). All interactive elements MUST be keyboard accessible with visible focus indicators. ARIA attributes MUST be used correctly when semantic HTML alone is insufficient. This principle is non-negotiable as it ensures equal access for all users and compliance with legal requirements.

### II. Component-Based Architecture with shadcn/ui
The application MUST utilize a component-based architecture leveraging shadcn/ui components and patterns. Components MUST be composable, reusable, and follow React best practices including proper prop typing with TypeScript. Each component MUST maintain a single responsibility and be independently testable. Custom components MUST follow shadcn/ui's composition patterns and styling approach using Tailwind CSS and CSS variables for theming. This ensures consistency, maintainability, and accelerates development through proven UI patterns.

### III. Performance and User Experience Excellence
The application MUST deliver optimal performance with Core Web Vitals targets: LCP < 2.5s, FID < 100ms, CLS < 0.1. Next.js features like server components, image optimization, font optimization, and code splitting MUST be utilized appropriately. Navigation MUST be intuitive with clear visual hierarchy, responsive design for all screen sizes, and smooth transitions. Loading states and error boundaries MUST provide meaningful feedback. This ensures users have a fast, smooth, and delightful experience across all devices.

## Development Standards

### Code Quality and TypeScript
All code MUST be written in TypeScript with strict mode enabled. Type safety is mandatory - no `any` types without explicit justification. Components MUST have properly typed props and return types. API responses and data structures MUST be fully typed. ESLint and Prettier configurations MUST be followed for consistent code formatting.


## Quality Assurance

### Review Process
All code changes MUST pass automated checks: linting, type checking, tests, and build verification. Accessibility audit MUST be run for UI changes. Performance budget MUST be validated for production builds. Manual testing MUST verify keyboard navigation and screen reader functionality for new features.

### Documentation
Components MUST have JSDoc comments describing purpose and usage. README MUST be updated for new features or setup changes. Accessibility considerations MUST be documented for custom interactive components.

## Governance

This constitution supersedes all other development practices for this project. Amendments require:
1. Documented rationale for the change
2. Impact assessment on existing code
3. Migration plan if breaking changes are introduced
4. Team consensus or project owner approval

All pull requests MUST verify compliance with these principles. Violations MUST be addressed before merge. Exceptions require explicit justification and compensating controls.

Runtime development guidance is maintained in project documentation and CLAUDE.md files for AI-assisted development.

**Version**: 1.0.0 | **Ratified**: 2025-09-22 | **Last Amended**: 2025-09-22