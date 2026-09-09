export const projects = [
  {
    slug: 'context-compiler',
    number: '01',
    name: 'Context Compiler',
    category: 'Developer tools / Retrieval',
    summary: 'The right repository context, in the hands of your AI agent.',
    url: 'https://context-compiler-xv35.vercel.app/',
    repo: 'https://github.com/TahubCS/Context-Compiler',
    stack: ['TypeScript', 'Python', 'MCP', 'pgvector'],
    contribution:
      'I contributed hybrid code retrieval, the Python search endpoint, and MCP tracing and result-selection behavior.',
    evidence:
      'https://github.com/TahubCS/Context-Compiler/commit/b1ff688e057faa22df530b877dfa88847c25e6b1',
    limitation:
      'Search reflects indexed content. Feature-flow suggestions are a reading aid, not proof of runtime execution.',
    flow: [
      'GitHub repository',
      'Scan & embed',
      'Hybrid retrieval',
      'Agent context',
    ],
  },
  {
    slug: 'supo',
    number: '02',
    name: 'Supo',
    category: 'Support systems / SDK',
    summary:
      'AI support that knows when to bring a person into the conversation.',
    url: 'https://supo-mu.vercel.app/',
    repo: 'https://github.com/TahubCS/Supo',
    stack: ['TypeScript', 'AI SDK', 'PostgreSQL', 'Ably'],
    contribution:
      'I contributed stable customer identity in the published widget SDK and agent-notification behavior in the chat flow.',
    evidence:
      'https://github.com/TahubCS/Supo/commit/670430769edb079eb96dc15531257a7a2caf13a6',
    limitation:
      'An alpha project. No resolution-rate, uptime, or customer-adoption claims are made.',
    flow: [
      'Customer message',
      'Knowledge retrieval',
      'AI response',
      'Human handoff',
    ],
  },
  {
    slug: 'crowsnest',
    number: '03',
    name: 'CrowsNest',
    category: 'Collaborative learning / AI',
    summary:
      'Shared course materials become a starting point for better study.',
    url: 'https://thecrowsnest.vercel.app/',
    repo: 'https://github.com/TahubCS/TheCrowsNest',
    stack: ['Next.js', 'FastAPI', 'Supabase', 'Gemini'],
    contribution:
      'On this team project, I contributed database and study-plan functionality, shared study resources, and streaming AI tutor behavior.',
    evidence:
      'https://github.com/TahubCS/TheCrowsNest/commit/5500d953b9cb71c63178422cd9c34ab08c1f6f86',
    limitation:
      'Generated learning materials need review. Built collaboratively; the interface and animation work also includes contributions from JacobGittHub.',
    flow: [
      'Course materials',
      'Extract & review',
      'Class retrieval',
      'Study resources',
    ],
  },
] as const;

export type Project = (typeof projects)[number];
