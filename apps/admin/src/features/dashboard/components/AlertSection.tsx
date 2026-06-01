import { AlertSeverity, type DashboardAlert } from '../types';
import { AlertTriangle, AlertCircle } from 'lucide-react';

interface AlertSectionProps {
  alerts: DashboardAlert[];
}

export const AlertSection = ({ alerts }: AlertSectionProps) => {
  if (!alerts || alerts.length === 0) return null;

  return (
    <section
      role="alert"
      aria-label="System Alerts"
      className="glass-card border border-amber-500/10 bg-amber-500/5 p-6 rounded-2xl"
    >
      <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2 mb-4">
        <AlertTriangle className="h-4 w-4" />
        <span>Needs Attention ({alerts.length})</span>
      </h3>
      <div className="space-y-3">
        {alerts.map((alert, idx) => {
          const isCritical = alert.severity === AlertSeverity.CRITICAL;
          return (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: Order doesn't matter for read-only keys
              key={idx}
              className={`flex gap-3 items-start p-3.5 rounded-xl border text-sm transition-all duration-200 ${
                isCritical
                  ? 'border-red-900/30 bg-red-950/20 text-red-200'
                  : 'border-amber-900/20 bg-amber-950/10 text-amber-200'
              }`}
            >
              {isCritical ? (
                <AlertCircle className="h-4 w-4 shrink-0 text-red-400 mt-0.5" />
              ) : (
                <AlertTriangle className="h-4 w-4 shrink-0 text-amber-400 mt-0.5" />
              )}
              <div className="flex-1 leading-relaxed">
                {alert.message}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
