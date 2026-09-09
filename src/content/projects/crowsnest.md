---
project: crowsnest
title: CrowsNest — Shared materials, connected learning
description: A collaborative ECU study platform with class-specific retrieval, study resources, and a streaming tutor.
---

## The problem

Course material is more useful when students can connect it to the question they are trying to answer. CrowsNest brings shared course materials, study plans, generated resources, and tutor conversations into an ECU-focused application.

The project began around an ECU hackathon and continued beyond the initial event. It is a collaborative project. The public repository includes contributions from JacobGittHub as well as my account; the portfolio does not imply that I created every interface or animation.

## My contribution

This was a hackathon-winning team project. The specific award category and event details are not listed here until they can be attributed precisely.

My commits cover database and study-plan functionality, integration of shared study resources, and streaming AI tutor behavior. The [study-resource commit](https://github.com/TahubCS/TheCrowsNest/commit/353d0960f25c3c075966fd91b617685984df0e54) connects shared resource generation, material coverage, API responses, and study-plan updates. The [streaming-tutor commit](https://github.com/TahubCS/TheCrowsNest/commit/5500d953b9cb71c63178422cd9c34ab08c1f6f86) connects the Python stream, application route, and browser consumption of that stream.

Working across these boundaries is the main story: a backend feature is only useful when the interface can represent its progress and results clearly.

## The material-to-study pipeline

The core application uses Next.js and TypeScript, with PostgreSQL and Supabase Storage. A separate Python FastAPI service handles AI-related processing. The ingestion layer extracts document text and evaluates material before it proceeds through the system.

Processed content is embedded and stored for retrieval. The AI service can use class-specific or selected-material context to generate flashcards, practice questions, and study-plan content. A streaming tutor provides another way to work with class context.

The [ingestion implementation](https://github.com/TahubCS/TheCrowsNest/blob/81ebd11473449a4ae14f0f5546e366bee593fab3/ai-backend/core/ingest.py) and [AI service](https://github.com/TahubCS/TheCrowsNest/blob/81ebd11473449a4ae14f0f5546e366bee593fab3/ai-backend/core/ai.py) make those responsibilities inspectable.

## A decision worth inspecting

Shared resources should account for which materials have already contributed to them. Coverage tracking connects a material to a resource type, allowing the application to identify newly eligible material instead of treating every generation as unrelated work. The database and application changes need to agree on that meaning.

The streaming tutor also required changes on both sides of the API boundary. Producing chunks in Python is only one part of the feature; the application must forward them and the interface must consume them as they arrive.

## Boundaries and limitations

Generated educational material still needs review. Relevance thresholds are application rules, not measured accuracy. This case study does not claim student adoption, improved grades, or validated learning outcomes.

The public deployment exposes an authentication boundary. The portfolio therefore uses an original architecture illustration rather than inventing screenshots of a signed-in student workspace. Detailed hackathon award attribution will be added when the event and category can be identified accurately.
