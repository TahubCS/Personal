import type { Outcome } from './trace-state';

interface Props {
  step: number;
  outcome: Outcome;
}

export default function RequestArtifact({ step, outcome }: Props) {
  const rejected = outcome === 'invalid-key' && step === 2;
  return (
    <div className="request-artifact" data-step={step} data-rejected={rejected}>
      <div className="artifact-ruler">
        <span>Request 001</span>
        <span>Illustrated transformation</span>
      </div>
      <div className="request-forms">
        <div
          className="request-form question-form"
          aria-hidden={step > 1}
          data-active={step <= 1}
        >
          <span className="eyebrow">
            {step === 0
              ? 'Question / natural language'
              : 'MCP / tool invocation'}
          </span>
          <div className="query-object">
            <span aria-hidden="true">↘</span>
            <strong>Where is access resolved?</strong>
          </div>
          <code className="tool-envelope">
            {step === 1
              ? 'search_codebase(query)'
              : 'Question → useful context'}
          </code>
        </div>
        <div
          className="request-form access-form"
          aria-hidden={step !== 2}
          data-active={step === 2}
        >
          <span className="eyebrow">Application boundary</span>
          <div className="access-gate">
            <span className="gate-key">Bearer key</span>
            <span className="gate-rule" aria-hidden="true"></span>
            <strong>
              {rejected ? 'Access stopped.' : 'Repository scope.'}
            </strong>
            <span>
              {rejected ? 'No index access' : 'Key resolved → bound repository'}
            </span>
          </div>
        </div>
        <div
          className="request-form vector-form"
          aria-hidden={step !== 3}
          data-active={step === 3}
        >
          <span className="eyebrow">Query → embedding</span>
          <div className="vector-bars" aria-hidden="true">
            {[30, 72, 44, 90, 58, 24, 82, 48, 66, 36, 94, 52].map(
              (height, i) => (
                <span key={i} style={{ height: `${height}%` }} />
              ),
            )}
          </div>
          <strong>A representation for retrieval.</strong>
          <span className="artifact-note">
            Illustrative vector · no measured values
          </span>
        </div>
        <div
          className="request-form files-form"
          aria-hidden={step !== 4}
          data-active={step === 4}
        >
          <span className="eyebrow">Repository index / selected fragments</span>
          <div className="retrieved-file">
            <code>src/mcp/server.ts</code>
            <span>Tool invocation → application</span>
          </div>
          <div className="retrieved-file">
            <code>src/app/api/mcp/search/route.ts</code>
            <span>Authentication → repository scope</span>
          </div>
          <div className="retrieved-file">
            <code>ai-backend/vector_store.py</code>
            <span>Semantic + lexical candidates</span>
          </div>
        </div>
        <div
          className="request-form pack-form"
          aria-hidden={step !== 5}
          data-active={step === 5}
        >
          <div className="context-pack">
            <span className="eyebrow">Context / assembled</span>
            <strong>
              {outcome === 'empty'
                ? 'No indexed matches.'
                : 'The useful pieces.'}
            </strong>
            <span>
              {outcome === 'empty'
                ? 'Inspect scan state · refine query'
                : 'Paths · excerpts · selection metadata'}
            </span>
            <div className="pack-seal">
              {outcome === 'empty'
                ? 'No invented answer'
                : 'Ready for the agent'}
            </div>
          </div>
        </div>
      </div>
      <div className="artifact-track" aria-hidden="true">
        <span style={{ transform: `translateX(${step * 100}%)` }} />
      </div>
    </div>
  );
}
