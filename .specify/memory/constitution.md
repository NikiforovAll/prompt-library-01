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

### II. Component-Based Architecture with shadcn/ui
The application MUST utilize a component-based architecture leveraging shadcn/ui components and patterns. Components MUST be composable, reusable, and follow React best practices including proper prop typing with TypeScript. Each component MUST maintain a single responsibility and be independently testable. Custom components MUST follow shadcn/ui's composition patterns and styling approach using Tailwind CSS and CSS variables for theming. This ensures consistency, maintainability, and accelerates development through proven UI patterns.

When creating new components, developers MUST:
- Follow shadcn/ui design patterns and conventions.
- Use Tailwind CSS for styling, adhering to the existing design system.
- Use @shadcn-component-researcher for researching component details, examples, and installation commands. Also, to analyze requirements use @shadcn-requirements-analyzer.

## Development Standards

### Code Quality and TypeScript
All code MUST be written in TypeScript with strict mode enabled. Type safety is mandatory - no `any` types without explicit justification. Components MUST have properly typed props and return types. API responses and data structures MUST be fully typed.


## Quality Assurance

## Governance

This constitution supersedes all other development practices for this project. Amendments require:
1. Documented rationale for the change
2. Impact assessment on existing code
3. Migration plan if breaking changes are introduced
4. Team consensus or project owner approval

All pull requests MUST verify compliance with these principles. Violations MUST be addressed before merge. Exceptions require explicit justification and compensating controls.

Runtime development guidance is maintained in project documentation and CLAUDE.md files for AI-assisted development.

**Version**: 1.0.0 | **Ratified**: 2025-09-22 | **Last Amended**: 2025-09-22