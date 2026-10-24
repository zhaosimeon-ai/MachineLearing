import React from 'react';
import { ModelMetrics } from '../ml/mlEngine';
import { FEATURE_NAMES, FEATURE_KEYS } from '../data/irisData';
import { BarChart3, HelpCircle, CheckCircle2 } from 'lucide-react';

interface FeatureImportanceViewerProps {
  metrics: {
    logReg: ModelMetrics;
    dt: ModelMetrics;
    rf: ModelMetrics;
  };
}

export const FeatureImportanceViewer: React.FC<FeatureImportanceViewerProps> = ({ metrics }) => {
  const models = [
    { name: 'Decision Tree (CART)', importances: metrics.dt.featureImportance, color: 'bg-emerald-500' },
    { name: 'Random Forest Ensemble', importances: metrics.rf.featureImportance, color: 'bg-indigo-500' },
    { name: 'Logistic Regression (OvR Weights)', importances: metrics.logReg.featureImportance, color: 'bg-sky-500' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            <BarChart3 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>Feature Attribution &amp; Weights</span>
            <span aria-hidden="true">·</span>
            <span>Gini Reduction vs Linear Coefficients</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
            Feature Importance Comparison
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
            Examine which physical iris dimensions drive model decisions. Petal dimensions consistently provide over 80% of total discriminative power across all architectures.
          </p>
        </div>
      </div>

      {/* Feature Attribution Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {FEATURE_NAMES.map((featureName, fIdx) => {
          return (
            <div
              key={fIdx}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                  {featureName}
                </h3>
                <span className="text-[11px] text-slate-400 font-mono">
                  Feature #{fIdx + 1}
                </span>
              </div>

              <div className="space-y-3 mt-4">
                {models.map((m, mIdx) => {
                  const val = m.importances[fIdx];
                  const percent = (val * 100).toFixed(1);

                  return (
                    <div key={mIdx} className="space-y-1">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-slate-600 dark:text-slate-400">{m.name}</span>
                        <span className="font-bold text-slate-900 dark:text-white tabular-nums">
                          {percent}% ({val.toFixed(3)})
                        </span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                          style={{ width: `${Math.min(100, Math.max(0, val * 100))}%` }}
                          className={`h-full ${m.color} rounded-full transition-all duration-500`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Botanical ML Insights Box */}
      <div className="p-5 bg-blue-50/50 dark:bg-slate-900/80 border border-blue-200 dark:border-slate-800 rounded-xl">
        <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-2 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-blue-600" />
          <span>Biological &amp; Algorithmic Insights from Iris Benchmark</span>
        </h4>
        <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-1.5 leading-relaxed">
          <li>
            • <strong>Petal Dimensions Dominate:</strong> In both Decision Tree and Random Forest, Petal Length and Petal Width account for the vast majority of Gini impurity reduction. The initial root split almost always occurs on Petal Length &le; 2.45 cm.
          </li>
          <li>
            • <strong>Linear Separability of Setosa:</strong> Iris-setosa has tiny petals (1.0 to 1.9 cm) that never overlap with Versicolor (3.0 to 5.1 cm) or Virginica (4.5 to 6.9 cm). Hence, all 3 models achieve 100% precision and recall for Setosa.
          </li>
          <li>
            • <strong>Versicolor vs Virginica Ambiguity:</strong> A slight morphological overlap exists where large Versicolors and small Virginicas share petal lengths around 4.8 - 5.1 cm and widths around 1.5 - 1.8 cm. Random Forest handles this boundary most gracefully through bagged ensemble voting.
          </li>
        </ul>
      </div>
    </div>
  );
};
