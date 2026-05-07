import { MonoLabel } from '@/components/primitives/MonoLabel';

interface Metric {
  value: string;
  label: string;
  accent?: boolean;
}

interface MetricStripProps {
  metrics: Metric[];
}

export function MetricStrip({ metrics }: MetricStripProps) {
  return (
    <div className="metric-strip">
      {metrics.map((m, i) => (
        <div key={i} className="metric-strip-item">
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '28px',
              fontWeight: 700,
              lineHeight: 1,
              color: m.accent ? 'var(--brass)' : 'var(--ink)',
            }}
          >
            {m.value}
          </span>
          <MonoLabel>{m.label}</MonoLabel>
        </div>
      ))}
    </div>
  );
}
