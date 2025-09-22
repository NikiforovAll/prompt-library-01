# Guide


This is guide described e2e demo for Claude Code usage for e2e POC development.


1. Initialize next.js project

```bash
npx create-next-app@latest
```

2. Initialize shadcn

```bash
pnpm dlx shadcn@latest mcp init --client claude
```

Add UI libraries to `components.json`. Use <https://registry.directory/>

3. Initialize Spec Kit

```bash
uvx --from git+https://github.com/github/spec-kit.git specify init --here --skip-tls --ai claude --script sh
```

4. Configure `shadcn` agents:

* [requirements-analyzer](./.claude/agents/shadcn/requirements-analyzer.md)
* [component-researcher](./.claude/agents/shadcn/component-researcher.md)
* [implementation-builder](./.claude/agents/shadcn/implementation-builder.md)

4. Run Claude Code

```bash
claude --dangerously-skip-permissions
```

5. Initialize project constitution


x. Use shadcn assistant