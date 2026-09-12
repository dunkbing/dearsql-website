---
layout: ../../layouts/DocsLayout.astro
title: "AI assistant"
description: "Pick a coding agent or an API key, and what the Assistant tab can do."
section: "AI assistant"
sectionOrder: 2
order: 1
---

DearSQL's sidebar has two tabs: **Databases** and **Assistant**. The Assistant tab is a chat panel that lives at the app level, so it stays put as you move between tables and editors.

<img src="/docs/assistant-panel.png" alt="The Assistant tab, with the agent picker at the top and the message box at the bottom" width="480" />

It can talk to two different kinds of backend:

- **A coding agent** — Claude Code, Gemini CLI, Codex, or any command that speaks the [Agent Client Protocol](https://agentclientprotocol.com). These are real agents: they stream their thinking, call tools, and ask permission before acting.
- **An API key** — Anthropic, OpenAI or Gemini, straight over HTTPS. No install, no agent process, but no tools either.

## Picking an agent

The dropdown at the top of the tab lists the built-in agents, plus **Custom agent** and **API key**. Your choice is remembered between launches.

| Agent | What DearSQL launches |
|---|---|
| Claude Code | `claude-agent-acp`, or `@agentclientprotocol/claude-agent-acp` via a package runner |
| Gemini CLI | `gemini --experimental-acp`, or `@google/gemini-cli` |
| Codex | `codex-acp`, or `@zed-industries/codex-acp` |
| Custom agent | Whatever command you type, as long as it speaks ACP over stdio |

DearSQL looks for an agent in this order:

1. A binary you downloaded through DearSQL (see below).
2. The agent's own binary on your `PATH`.
3. A package runner — `npx`, then `bunx`, `pnpm dlx`, `yarn dlx`, `uvx`.

If none of those work, the panel says so and offers to install the agent with whichever package manager you have (`npm`, `bun`, `pnpm` or `yarn`), showing the exact command it will run.

## Agents without Node

The three built-in agents are published as npm packages, so they need a JavaScript runtime. If you don't have one, the panel offers a list of **agents that run without Node** — Amp, Goose, Cursor and others from the official ACP registry that ship a prebuilt binary.

Downloading one fetches the archive for your platform, **verifies its SHA-256**, and unpacks it into `~/.dearsql/agents/`. Nothing is unpacked if the checksum doesn't match. Once installed, the agent appears in the dropdown like any other.

## Signing in

DearSQL doesn't handle agent credentials — each agent uses its own login. If an agent reports an authentication error, the panel shows a hint for that agent, for example running `claude /login` in a terminal, or setting `ANTHROPIC_API_KEY`.

For the **API key** backend, open the gear icon and paste an Anthropic, OpenAI or Gemini key. It's stored with your other DearSQL settings.

## Choosing a model

When an ACP agent publishes a model selector, DearSQL shows it beside the agent picker. Choose a model and DearSQL applies it to the current agent session. The available names and choices come from the agent itself, so different versions of Claude Code, Codex, Gemini, and custom agents can expose different options. If no second picker appears, that agent does not support model selection through ACP; use its own configuration instead.

## What you see during a turn

An agent reports more than plain text, and the panel renders each kind:

- **Assistant text**, with markdown — headings, lists, and code blocks with a Copy button.
- **Thinking**, collapsed behind a "Thinking..." toggle.
- **Tool calls**, as a row with a spinner that resolves to a tick or a cross. Click one to expand its output.
- **Plans**, as a checklist that updates as the agent works.
- **Permission prompts**, inline, with the agent's own options. Nothing happens until you choose.

The arrow button sends; while a turn is running it becomes a stop button that cancels it.

## Where the agent runs

Agents carry their own file and shell tools that don't go through DearSQL. To keep that contained, DearSQL runs the agent with its working directory set to `~/.dearsql/agent` — a scratch directory, not your home folder and not your current project. That also stops the agent picking up unrelated project config it happens to find.

## Notes

- Agents and API-key chat are supported on macOS, Linux and Windows.
- Starting an agent takes a few seconds. DearSQL launches it as soon as you open the Assistant tab, so it's usually ready by the time you've typed, and shows "Starting *agent*..." until it is.
- `/new` restarts the session; the transcript and pinned context are cleared with `/clear`.

## Earlier sessions

The clock button in the header lists your recent conversations with the selected backend; pick one to continue it, or right-click to delete it. `+` starts a new one. With an API key the transcript is stored by DearSQL. With a coding agent the agent keeps its own history, and DearSQL asks it to reload the session — agents that can't (or have since discarded it) start fresh and say so. Sessions older than 90 days are dropped.
