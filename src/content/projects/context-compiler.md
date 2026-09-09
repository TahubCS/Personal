---
project: context-compiler
title: Context Compiler — Repository context for AI agents
description: Hybrid code retrieval, repository-bound MCP access, and the engineering behind a useful working context.
---

## The problem

An AI coding assistant can only reason about the code it can see. Manually choosing files is a fragile way to provide that context: it is easy to miss an entry point, include unrelated implementation details, or paste an outdated version. Context Compiler makes a repository searchable and exposes the indexed material through a web interface and a local MCP bridge.

The useful output is a working set of code with its source paths. The system is designed to help a person or agent decide what to read next, rather than suggest that retrieval alone establishes correctness.

## My contribution

My commits include the Python search endpoint and hybrid retrieval behavior, plus the MCP feature-flow endpoint and richer result-selection metadata. The [search implementation commit](https://github.com/TahubCS/Context-Compiler/commit/25b78b6d0ee876841e0c47a8ad4be6652382a1f6) spans the FastAPI endpoint and vector-store retrieval. The [MCP tracing commit](https://github.com/TahubCS/Context-Compiler/commit/b1ff688e057faa22df530b877dfa88847c25e6b1) connects the API route, retrieval orchestration, bridge, and setup interface.

These are specific contributions supported by repository history. They are not a claim of exclusive authorship over every part of the application.

## Two paths through the system

Index preparation and query handling are separate. The scanner clones source, selects and chunks files, creates embeddings, and writes indexed content to PostgreSQL with pgvector. Incremental scanning and GitHub synchronization help keep that index useful as the repository changes.

At query time, the MCP client invokes a local TypeScript stdio bridge. That bridge forwards an authenticated request to the Next.js application. A repository-bound key determines which repository is available. The Python service embeds the query and retrieves semantic and lexical candidates. The application then prepares selected results for the agent.

## A decision worth inspecting

Natural-language questions and exact symbol names behave differently. The retrieval implementation combines vector similarity with lexical signals rather than assuming one signal is sufficient for every query. It also provides file and declaration information to make the result easier to inspect. This is an implementation choice; no benchmark improvement is claimed here.

The [retrieval source](https://github.com/TahubCS/Context-Compiler/blob/6b6a0f8d395d9cde51f9a7ff40daab24dfc4ca72/ai-backend/vector_store.py) is the best place to examine that decision.

## Boundaries and limitations

The bridge is stdio-only and depends on a separately hosted application and AI service. Its five tools provide search, repository questions, file context, context packs, and feature-flow suggestions. It does not grant unrestricted live GitHub access.

Indexed content can lag the repository. A suggested feature flow is a retrieval-based reading order, not an observed runtime call graph. Generated answers and selected files still need verification. The portfolio's interactive trace is a deterministic illustration of this architecture, not a recording or live query.
