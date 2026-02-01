# Angular Agent Skills

A curated collection of Angular [Agent Skills](https://agentskills.io/home).


## Installation

```bash
npx skills add angular-sanctuary/angular-agent-skills --skill='angular-material'
```

or to install all of them globally:

```bash
npx skills add angular-sanctuary/angular-agent-skills --skill='angular-material' -g
```

Learn more about the CLI usage at [skills](https://github.com/vercel-labs/skills).

## Available Skills

Angular Material
```bash
npx skills list angular-sanctuary/angular-agent-skills --skill='angular-material'
```

Angular Fire
```bash
npx skills list angular-sanctuary/angular-agent-skills --skill='angular-fire'
```

## Skills

This collection is aim to be a one-stop collection of you are mainly working on Angular. It includes skills from different sources with different scopes.

### Skills Generated from Official Documentation

Generated from official documentation and fine-tuned by Gerome Grignon.

| Skill | Description | Source |
|-------|-------------|--------|
| [angularMaterial](skills/angularMaterial) | Angular Material - UI component library for Angular | [angular/components](https://github.com/angular/components) |
| [angularFire](skills/angularFire) | Angular wrapper for Firebase with dependency injection, RxJS observables, and Zone.js integration | [angular/angularfire](https://github.com/angular/angularfire) |


## FAQ

### Skills vs llms.txt vs AGENTS.md

To me, the value of skills lies in being **shareable** and **on-demand**.

Being shareable makes prompts easier to manage and reuse across projects. Being on-demand means skills can be pulled in as needed, scaling far beyond what any agent's context window could fit at once.

You might hear people say "AGENTS.md outperforms skills". I think that's true — AGENTS.md loads everything upfront, so agents always respect it, whereas skills can have false negatives where agents don't pull them in when you'd expect. That said, I see this more as a gap in tooling and integration that will improve over time. Skills are really just a standardized format for agents to consume—plain markdown files at the end of the day. Think of them as a knowledge base for agents. If you want certain skills to always apply, you can reference them directly in your AGENTS.md.

## Generate Your Own Skills

Fork this project to create your own customized skill collection.

1. Fork or clone this repository
2. Install dependencies: `pnpm install`
3. Update `meta.ts` with your own projects and skill sources
4. Run `pnpm start cleanup` to remove existing submodules and skills
5. Run `pnpm start init` to clone the submodules
6. Run `pnpm start sync` to sync vendored skills
7. Ask your agent to `Generate skills for \<project\>` (recommended one at a time to manage token usage)

See [AGENTS.md](AGENTS.md) for detailed generation guidelines.

## License

Skills and the scripts in this repository are [MIT](LICENSE.md) licensed.

Vendored skills from external repositories retain their original licenses - see each skill directory for details.
