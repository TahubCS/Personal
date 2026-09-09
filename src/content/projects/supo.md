---
project: supo
title: Supo — AI support with a human handoff
description: An embeddable support widget, retrieved knowledge, and conversation continuity across AI and human support.
---

## The problem

A support conversation should not lose its context when an automated response is no longer useful. Supo combines an embedded customer widget with knowledge retrieval and an agent workspace, so a conversation can move from AI assistance to a person.

The integration surface matters as much as the chat window. A business needs to identify the customer, preserve the conversation, and embed the experience in its own application. Supo includes a browser widget package with React and headless entry points for that purpose.

## My contribution

My commits include stable customer identity in the widget SDK and changes to agent notification in the chat flow. The [identity change](https://github.com/TahubCS/Supo/commit/670430769edb079eb96dc15531257a7a2caf13a6) supports an external customer identifier, normalizes identity inputs, and updates conversation-storage behavior. The [notification change](https://github.com/TahubCS/Supo/commit/d4b436d044cc2f9556649172d5c71200decdc25d) connects knowledge availability and response behavior with escalation state.

The package `@supoapp/widget` was verified on npm at version `0.1.0-alpha.4`. Its repository mapping points to the widget workspace in this project. Publication is evidence of a distributed integration surface, not evidence of customer adoption.

## From message to handoff

The widget sends a customer message to the application. The chat route uses product-scoped knowledge retrieval and constructs context for a streamed model response. Messages and conversation state are persisted in PostgreSQL through Drizzle.

Ably carries conversation and inbox updates. The widget can fall back to polling when realtime delivery is unavailable. When escalation is pending or active, the chat path can bypass AI generation and preserve the human-support flow.

The [chat route](https://github.com/TahubCS/Supo/blob/18328e1b2ab5ed90960909c64df20c48beab003f/src/app/api/chat/route.ts) and [headless widget](https://github.com/TahubCS/Supo/blob/18328e1b2ab5ed90960909c64df20c48beab003f/packages/widget/src/headless.ts) show these responsibilities on either side of the boundary.

## A decision worth inspecting

Customer identity should survive beyond one page visit. Supporting a stable external identifier lets the host application provide continuity without relying exclusively on an email address. That decision affects validation, stored conversation references, and the public SDK contract together.

The SDK exposes browser, React, and headless entry points. This allows a host application to choose a ready-made interface or keep control over its own presentation while using the conversation runtime.

## Boundaries and limitations

Supo is an alpha project. The public landing page contains marketing figures and testimonials that are not used as portfolio evidence. This case study makes no claim about resolution rates, latency, uptime, paying customers, or deployment scale.

The static diagram is an architectural explanation, not a captured production conversation. Model responses and escalation decisions should be evaluated in their intended business context before making reliability claims.
