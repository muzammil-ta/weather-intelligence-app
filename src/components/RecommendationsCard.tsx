import React from 'react';
import {
  Umbrella,
  Sun,
  Snowflake,
  Wind,
  CheckCircle2,
  AlertTriangle,
  Info,
  Activity,
  Flame,
  ShieldAlert,
} from 'lucide-react';
import { PlanningIntelligence, WeatherRecommendation } from '../types/weather';

interface RecommendationsCardProps {
  intelligence: PlanningIntelligence;
}

export const RecommendationsCard: React.FC<RecommendationsCardProps> = ({ intelligence }) => {
  const { recommendations, overallActivityScore, overallActivityLevel, summaryText, activityBreakdown } =
    intelligence;

  const getSeverityStyle = (severity: WeatherRecommendation['severity']) => {
    switch (severity) {
      case 'alert':
        return {
          bg: 'bg-rose-50 dark:bg-rose-950/30',
          border: 'border-rose-200 dark:border-rose-900/60',
          title: 'text-rose-900 dark:text-rose-200',
          text: 'text-rose-700 dark:text-rose-300',
          icon: <ShieldAlert className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />,
        };
      case 'warning':
        return {
          bg: 'bg-amber-50 dark:bg-amber-950/30',
          border: 'border-amber-200 dark:border-amber-900/60',
          title: 'text-amber-900 dark:text-amber-200',
          text: 'text-amber-700 dark:text-amber-300',
          icon: <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />,
        };
      case 'success':
        return {
          bg: 'bg-emerald-50 dark:bg-emerald-950/30',
          border: 'border-emerald-200 dark:border-emerald-900/60',
          title: 'text-emerald-900 dark:text-emerald-200',
          text: 'text-emerald-700 dark:text-emerald-300',
          icon: <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />,
        };
      case 'info':
      default:
        return {
          bg: 'bg-sky-50 dark:bg-sky-950/30',
          border: 'border-sky-200 dark:border-sky-900/60',
          title: 'text-sky-900 dark:text-sky-200',
          text: 'text-sky-700 dark:text-sky-300',
          icon: <Info className="w-5 h-5 text-sky-600 dark:text-sky-400 shrink-0" />,
        };
    }
  };

  const getRecommendationIcon = (type: WeatherRecommendation['type']) => {
    switch (type) {
      case 'umbrella':
        return <Umbrella className="w-4 h-4 text-sky-500 shrink-0" />;
      case 'heat':
        return <Flame className="w-4 h-4 text-amber-500 shrink-0" />;
      case 'cold':
        return <Snowflake className="w-4 h-4 text-cyan-400 shrink-0" />;
      case 'wind':
        return <Wind className="w-4 h-4 text-teal-500 shrink-0" />;
      default:
        return <Sun className="w-4 h-4 text-amber-400 shrink-0" />;
    }
  };

  const getLevelBadge = (level: string) => {
    switch (level) {
      case 'excellent':
        return 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800';
      case 'good':
        return 'text-sky-700 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/50 border-sky-200 dark:border-sky-800';
      case 'fair':
        return 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-800';
      case 'poor':
      default:
        return 'text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-800';
    }
  };

  return (
    <div id="planning-intel" className="space-y-6">
      {/* 1. Rule-Based Atmospheric Advisories */}
      <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-8 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-5 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-sky-500" />
              <span>Planning Recommendations & Rule Advisories</span>
            </h2>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Evaluated using Open-Meteo real-time rain probability, thermal index, and wind drag.
            </p>
          </div>
        </div>

        {/* Advisory List */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendations.map((rec) => {
            const style = getSeverityStyle(rec.severity);
            return (
              <div
                key={rec.id}
                className={`p-4 rounded-lg border ${style.bg} ${style.border} transition-all`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">{style.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        {getRecommendationIcon(rec.type)}
                        {rec.type} check
                      </span>
                    </div>
                    <h3 className={`mt-1 text-sm font-bold ${style.title}`}>{rec.title}</h3>
                    <p className={`mt-1 text-xs ${style.text}`}>{rec.message}</p>
                    <div className="mt-2.5 pt-2.5 border-t border-slate-200/50 dark:border-slate-700/50 text-xs font-medium text-slate-800 dark:text-slate-200">
                      <span className="font-semibold text-slate-900 dark:text-white">Action: </span>
                      {rec.actionableTip}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Outdoor Activity Suitability Rating Matrix */}
      <div
        id="activity-ratings"
        className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-8 transition-colors"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div>
            <span className="text-xs font-semibold text-sky-600 dark:text-sky-400 uppercase tracking-wide">
              Outdoor Readiness Index
            </span>
            <h2 className="mt-1 text-xl font-bold text-slate-900 dark:text-white">
              Daily Activity Rating & Feasibility
            </h2>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-xl">
              {summaryText}
            </p>
          </div>

          {/* Master Overall Score Badge */}
          <div className="flex items-center gap-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 shrink-0">
            <div>
              <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Composite Score
              </div>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-3xl font-extrabold text-slate-900 dark:text-white tabular-nums">
                  {overallActivityScore}
                </span>
                <span className="text-xs text-slate-400 font-mono">/100</span>
              </div>
            </div>
            <div className="h-9 w-px bg-slate-200 dark:bg-slate-700" aria-hidden="true" />
            <div>
              <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Rating</div>
              <div
                className={`mt-1 inline-flex items-center px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider border ${getLevelBadge(
                  overallActivityLevel
                )}`}
              >
                {overallActivityLevel}
              </div>
            </div>
          </div>
        </div>

        {/* 4 Activity Cards */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {activityBreakdown.map((act) => (
            <div
              key={act.name}
              className="p-4 rounded-lg bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-800 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    {act.name}
                  </span>
                  <span
                    className={`text-[11px] font-bold px-1.5 py-0.5 rounded uppercase border ${getLevelBadge(
                      act.level
                    )}`}
                  >
                    {act.level}
                  </span>
                </div>

                <div className="mt-3 flex items-center justify-between text-xs">
                  <span className="text-slate-500 dark:text-slate-400">Feasibility</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white tabular-nums">
                    {act.score}%
                  </span>
                </div>

                {/* Score Bar */}
                <div className="mt-1.5 h-1.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      act.score >= 80
                        ? 'bg-emerald-500'
                        : act.score >= 60
                        ? 'bg-sky-500'
                        : act.score >= 40
                        ? 'bg-amber-500'
                        : 'bg-rose-500'
                    }`}
                    style={{ width: `${act.score}%` }}
                  />
                </div>
              </div>

              <p className="mt-3 text-xs text-slate-600 dark:text-slate-400">
                {act.reason}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
