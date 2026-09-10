import { useEffect, useReducer, useRef, useState } from 'react';
import { stages, sourceUrl } from './trace-data';
import { initialState, lastStep, traceReducer } from './trace-state';
import '../../styles/trace.css';
import RequestArtifact from './RequestArtifact';
import { useScrollTrace } from './use-scroll-trace';

export default function ContextTrace() {
  const [state, dispatch] = useReducer(traceReducer, initialState);
  const [ready, setReady] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  const scrollProgress = useScrollTrace(root, dispatch, reducedMotion);

  useEffect(() => {
    setReady(true);
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updatePreference = () => {
      setReducedMotion(preference.matches);
      if (preference.matches) dispatch({ type: 'pause' });
    };
    updatePreference();
    preference.addEventListener('change', updatePreference);
    const pauseWhenHidden = () => {
      if (document.hidden) dispatch({ type: 'pause' });
    };
    document.addEventListener('visibilitychange', pauseWhenHidden);
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) dispatch({ type: 'pause' });
      },
      { threshold: 0 },
    );
    if (root.current) observer.observe(root.current);
    return () => {
      observer.disconnect();
      preference.removeEventListener('change', updatePreference);
      document.removeEventListener('visibilitychange', pauseWhenHidden);
    };
  }, []);

  useEffect(() => {
    if (state.status !== 'playing' || reducedMotion) return;
    const timer = window.setInterval(() => dispatch({ type: 'tick' }), 1800);
    return () => window.clearInterval(timer);
  }, [state.status, reducedMotion]);

  const stage = stages[state.step - 1];
  const rejected = state.outcome === 'invalid-key' && state.step === 2;
  const empty = state.outcome === 'empty' && state.step === 5;
  const title = rejected
    ? 'Request rejected.'
    : empty
      ? 'No indexed matches.'
      : (stage?.title ?? 'A question enters. Context comes back.');
  const detail = rejected
    ? 'The key could not be resolved. Processing stops before the embedding service or repository index is accessed.'
    : empty
      ? 'The request completed, but the index returned no matches. There is no invented answer: inspect the scan state and refine the question.'
      : (stage?.detail ??
        'Follow one search through the actual application boundaries. Start the illustration, or select a stage to inspect it at your own pace.');

  function changeOutcome(value: string) {
    if (value === 'success' || value === 'invalid-key' || value === 'empty')
      dispatch({ type: 'outcome', outcome: value });
  }

  return (
    <div
      className="trace"
      ref={root}
      data-status={state.status}
      data-source={state.source}
      data-step={state.step}
    >
      <div className="trace-toolbar">
        <span className="eyebrow">Context Compiler / Request 001</span>
        <label>
          Scenario{' '}
          <select
            value={state.outcome}
            onChange={(event) => changeOutcome(event.target.value)}
            disabled={!ready}
          >
            <option value="success">Successful request</option>
            <option value="invalid-key">Invalid key</option>
            <option value="empty">No matches</option>
          </select>
        </label>
      </div>
      <div className="trace-composition">
        <ol className="trace-stages" aria-label="Request stages">
          {stages.map((item, index) => (
            <li key={item.label}>
              <button
                className={state.step === index + 1 ? 'stage active' : 'stage'}
                aria-current={state.step === index + 1 ? 'step' : undefined}
                disabled={!ready || index + 1 > lastStep(state.outcome)}
                onClick={() => dispatch({ type: 'select', step: index + 1 })}
              >
                <span className="stage-number">0{index + 1}</span>
                <span>{item.label}</span>
                <span className="stage-operation">{item.title}</span>
                <span className="stage-detail">{item.detail}</span>
              </button>
            </li>
          ))}
        </ol>
        <RequestArtifact step={state.step} outcome={state.outcome} />
      </div>
      <div className="index-note">
        <span className="eyebrow">Prepared separately</span>
        <span>GitHub → scan / chunk / embed → repository index</span>
      </div>
      <div className="trace-inspector">
        <div>
          <p className="eyebrow">
            {state.step === 0
              ? 'Ready to explore'
              : `Stage 0${state.step} / 05`}
          </p>
          <h3>{title}</h3>
          <p>{detail}</p>
        </div>
        <div className="trace-evidence">
          <span className="eyebrow">Implementation evidence</span>
          <code>{stage?.signal ?? 'authenticateMcpRequest'}</code>
          {stage ? (
            <a href={sourceUrl(stage.file)}>{`${stage.file} ↗`}</a>
          ) : (
            <span className="evidence-placeholder" aria-hidden="true" />
          )}
          <p>
            Illustrated flow. Curated examples.
            <br />
            No live requests or measured rankings.
          </p>
        </div>
      </div>
      <div className="trace-controls">
        <button
          className="button primary"
          disabled={!ready}
          onClick={() =>
            state.status === 'playing'
              ? dispatch({ type: 'pause' })
              : dispatch({ type: 'play', reducedMotion })
          }
        >
          {state.status === 'playing'
            ? 'Pause'
            : state.status === 'paused' && !reducedMotion
              ? 'Resume'
              : state.status === 'complete'
                ? 'Replay trace'
                : 'Trace a request'}
        </button>
        <button
          className="button"
          disabled={!ready || state.step === 0}
          onClick={() => dispatch({ type: 'select', step: state.step - 1 })}
        >
          Previous
        </button>
        <button
          className="button"
          disabled={!ready || state.step === lastStep(state.outcome)}
          onClick={() => dispatch({ type: 'select', step: state.step + 1 })}
        >
          Next
        </button>
        <button
          className="reset"
          disabled={!ready}
          onClick={() => dispatch({ type: 'restart' })}
        >
          Reset
        </button>
        <button
          className="button follow-scroll"
          disabled={!ready || reducedMotion || state.source === 'scroll'}
          onClick={() =>
            dispatch({
              type: 'follow-scroll',
              progress: scrollProgress.current,
            })
          }
        >
          Follow scroll
        </button>
        <span className="trace-status" role="status">
          {reducedMotion
            ? 'Manual stepping · reduced motion'
            : state.status === 'playing'
              ? 'Playing illustration'
              : state.status === 'complete'
                ? 'Illustration complete'
                : state.source === 'scroll'
                  ? 'Scroll to follow the request'
                  : 'Manual control · scroll paused'}
        </span>
      </div>
    </div>
  );
}
