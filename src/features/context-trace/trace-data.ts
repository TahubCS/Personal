const sourceRoot =
  'https://github.com/TahubCS/Context-Compiler/blob/6b6a0f8d395d9cde51f9a7ff40daab24dfc4ca72/';

export const stages = [
  {
    title: 'Call the tool',
    label: 'MCP client',
    detail:
      'An AI client invokes search_codebase. The local stdio bridge forwards the query to the application over HTTPS.',
    file: 'src/mcp/server.ts',
    signal: 'search_codebase("authenticateMcpRequest")',
  },
  {
    title: 'Resolve access',
    label: 'Application API',
    detail:
      'The application resolves the bearer key and its bound repository. An invalid or revoked key stops the request here.',
    file: 'src/app/api/mcp/search/route.ts',
    signal: 'Repository-bound access',
  },
  {
    title: 'Embed the query',
    label: 'Python / Gemini',
    detail:
      'The FastAPI service embeds the question. This query vector searches an existing index; the repository is not cloned again for each request.',
    file: 'ai-backend/main.py',
    signal: 'Question → query vector',
  },
  {
    title: 'Retrieve context',
    label: 'PostgreSQL',
    detail:
      'Semantic and lexical candidates are combined and ranked. The application prepares a useful selection of implementation and declaration context.',
    file: 'ai-backend/vector_store.py',
    signal: 'Semantic + lexical candidates',
  },
  {
    title: 'Return the evidence',
    label: 'Agent context',
    detail:
      'The bridge returns structured context with paths and selection metadata. The examples here are curated explanations, not a live search response.',
    file: 'src/lib/repository-retrieval.ts',
    signal: 'Paths · excerpts · selection metadata',
  },
] as const;

export function sourceUrl(file: string): string {
  return sourceRoot + file;
}
