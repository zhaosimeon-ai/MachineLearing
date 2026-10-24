import React from 'react';
import { ModelMetrics } from '../ml/mlEngine';
import { Award, Zap, GitBranch, Layers, SlidersHorizontal, Info, ArrowUpRight } from 'lucide-react';

interface ModelComparisonSectionProps {
  metrics: {
    logReg: ModelMetrics;
    dt: ModelMetrics;
    rf: ModelMetrics;
  };
  // Hyperparameters
  logRegC: number;
  setLogRegC: (c: number) => void;
  treeDepth: number;
  setTreeDepth: (d: number) => void;
  rfEstimators: number;
  setRfEstimators: (n: number) => void;
  onSelectTab: (tab: string) => void;
}

export const ModelComparisonSection: React.FC<ModelComparisonSectionProps> = ({
  metrics,
  logRegC,
  setLogRegC,
  treeDepth,
  setTreeDepth,
  rfEstimators,
  setRfEstimators,
  onSelectTab,
}) => {
  const [showTuning, setShowTuning] = React.useState(false);

  const modelList = [
    {
      key: 'logReg' as const,
      data: metrics.logReg,
      title: 'Logistic Regression',
      subtitle: 'Linear Probabilistic Classifier',
      icon: Zap,
      iconColor: 'text-sky-500',
      borderColor: 'border-sky-500/20',
      description:
        'Computes linear hyperplanes in standardized feature space with Softmax probability normalization and L2 Ridge regularization.',
      characteristics: ['Linear decision boundaries', 'Requires feature scaling', 'Calibrated confidence scores'],
    },
    {
      key: 'dt' as const,
      data: metrics.dt,
      title: 'Decision Tree (CART)',
      subtitle: 'Recursive Orthogonal Partitioner',
      icon: GitBranch,
      iconColor: 'text-emerald-500',
      borderColor: 'border-emerald-500/20',
      description:
        'Partitions the feature space with hierarchical binary threshold cuts optimizing Gini impurity reduction. Highly interpretable.',
      characteristics: ['Axis-aligned orthogonal cuts', 'Scale-invariant features', 'Prone to sample variance'],
    },
    {
      key: 'rf' as const,
      data: metrics.rf,
      title: 'Random Forest',
      subtitle: 'Bagged Ensemble of Trees',
      icon: Layers,
      iconColor: 'text-indigo-500',
      borderColor: 'border-indigo-500/20',
      description:
        'Aggregates multiple decorrelated CART trees trained on bootstrap samples with random subspace feature subsets to reduce variance.',
      characteristics: ['Ensemble majority voting', 'High generalization stability', 'Smooth non-linear contours'],
    },
  ];

  // Determine top performing model on test accuracy
  const highestTestAcc = Math.max(
    metrics.logReg.testAccuracy,
    metrics.dt.testAccuracy,
    metrics.rf.testAccuracy
  );

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            <span>Model Evaluation &amp; Benchmarking</span>
            <span aria-hidden="true">·</span>
            <span>Step 3</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
            Tri-Model Comparative Analysis
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-3xl">
            Direct side-by-side evaluation of Logistic Regression, Decision Tree, and Random Forest trained on the exact same Iris dataset partition.
          </p>
        </div>

        {/* Hyperparameter Accordion Toggle */}
        <button
          onClick={() => setShowTuning(!showTuning)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors shrink-0 self-start sm:self-auto"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
          <span>{showTuning ? 'Hide Hyperparameters' : 'Tune Hyperparameters'}</span>
        </button>
      </div>

      {/* Hyperparameter Tuning Panel */}
      {showTuning && (
        <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <div className="flex items-center justify-between text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              <span>Logistic Regression C: {logRegC}</span>
              <span className="text-[11px] text-slate-500 font-mono">1/lambda</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="10"
              step="0.1"
              value={logRegC}
              onChange={(e) => setLogRegC(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded appearance-none cursor-pointer accent-sky-600"
            />
            <span className="text-[11px] text-slate-500">Lower C = stronger L2 regularization</span>
          </div>

          <div>
            <div className="flex items-center justify-between text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              <span>Decision Tree max_depth: {treeDepth}</span>
              <span className="text-[11px] text-slate-500 font-mono">depth limit</span>
            </div>
            <input
              type="range"
              min="1"
              max="5"
              step="1"
              value={treeDepth}
              onChange={(e) => setTreeDepth(parseInt(e.target.value))}
              className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded appearance-none cursor-pointer accent-emerald-600"
            />
            <span className="text-[11px] text-slate-500">Limits tree depth to prevent overfitting</span>
          </div>

          <div>
            <div className="flex items-center justify-between text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              <span>Random Forest n_estimators: {rfEstimators}</span>
              <span className="text-[11px] text-slate-500 font-mono">trees</span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              step="10"
              value={rfEstimators}
              onChange={(e) => setRfEstimators(parseInt(e.target.value))}
              className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded appearance-none cursor-pointer accent-indigo-600"
            />
            <span className="text-[11px] text-slate-500">Number of bagged decision trees in ensemble</span>
          </div>
        </div>
      )}

      {/* Tri-Model Architecture Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {modelList.map((m) => {
          const Icon = m.icon;
          const isTop = m.data.testAccuracy === highestTestAcc;
          return (
            <div
              key={m.key}
              className={`bg-white dark:bg-slate-900 border ${
                isTop ? 'border-blue-500/50 shadow-md ring-1 ring-blue-500/20' : 'border-slate-200 dark:border-slate-800'
              } rounded-xl p-5 flex flex-col justify-between transition-all`}
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-lg bg-slate-100 dark:bg-slate-800 ${m.iconColor}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                        {m.title}
                      </h3>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {m.subtitle}
                      </p>
                    </div>
                  </div>
                  {isTop && (
                    <span className="px-2 py-0.5 text-[10px] font-semibold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 rounded border border-blue-200 dark:border-blue-800 flex items-center gap-1">
                      <Award className="w-3 h-3" />
                      <span>Top Performer</span>
                    </span>
                  )}
                </div>

                {/* Primary Metric Hero Display */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                  <div className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">
                    Test Set Accuracy
                  </div>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-3xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
                      {(m.data.testAccuracy * 100).toFixed(1)}%
                    </span>
                    <span className="text-xs text-slate-500 font-mono">
                      (Train: {(m.data.trainAccuracy * 100).toFixed(1)}%)
                    </span>
                  </div>
                </div>

                {/* Secondary Metrics Strip */}
                <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 text-center">
                  <div className="bg-slate-50 dark:bg-slate-800/40 p-2 rounded-lg">
                    <div className="text-[10px] text-slate-400 uppercase">Precision</div>
                    <div className="text-xs font-bold font-mono text-slate-800 dark:text-slate-200 tabular-nums">
                      {m.data.precisionMacro.toFixed(3)}
                    </div>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800/40 p-2 rounded-lg">
                    <div className="text-[10px] text-slate-400 uppercase">Recall</div>
                    <div className="text-xs font-bold font-mono text-slate-800 dark:text-slate-200 tabular-nums">
                      {m.data.recallMacro.toFixed(3)}
                    </div>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800/40 p-2 rounded-lg">
                    <div className="text-[10px] text-slate-400 uppercase">F1-Score</div>
                    <div className="text-xs font-bold font-mono text-slate-800 dark:text-slate-200 tabular-nums">
                      {m.data.f1Macro.toFixed(3)}
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 mt-3 leading-relaxed">
                  {m.description}
                </p>

                {/* Characteristics */}
                <div className="mt-3 space-y-1">
                  {m.characteristics.map((c, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                      <span className="w-1 h-1 rounded-full bg-slate-400 shrink-0" />
                      <span>{c}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card Footer Action */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-400 font-mono">
                  Generalization Gap: {(m.data.generalizationGap * 100).toFixed(1)}%
                </span>
                <button
                  onClick={() => onSelectTab(m.key === 'dt' ? 'tree' : 'boundaries')}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 font-medium flex items-center gap-0.5 group"
                >
                  <span>Inspect</span>
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Comprehensive Metric Comparison Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">
              Empirical Evaluation Summary Table
            </h3>
            <p className="text-xs text-slate-500">
              Evaluated strictly on identical test partition with uniform metric definitions.
            </p>
          </div>
          <div className="text-xs text-slate-400 font-mono">
            Macro-Averaged &amp; Weighted Multi-Class Metrics
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 font-mono">
              <tr>
                <th className="py-3 px-4 font-semibold">Model Architecture</th>
                <th className="py-3 px-4 font-semibold text-right">Train Accuracy</th>
                <th className="py-3 px-4 font-semibold text-right">Test Accuracy</th>
                <th className="py-3 px-4 font-semibold text-right">Precision (Macro)</th>
                <th className="py-3 px-4 font-semibold text-right">Recall (Macro)</th>
                <th className="py-3 px-4 font-semibold text-right">F1-Score (Macro)</th>
                <th className="py-3 px-4 font-semibold text-right">F1 (Weighted)</th>
                <th className="py-3 px-4 font-semibold text-right">Overfit Delta</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 font-mono">
              {modelList.map((m) => {
                const isTop = m.data.testAccuracy === highestTestAcc;
                return (
                  <tr
                    key={m.key}
                    className={`hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors ${
                      isTop ? 'bg-blue-50/30 dark:bg-blue-950/20 font-medium' : ''
                    }`}
                  >
                    <td className="py-3.5 px-4 font-sans font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                      <m.icon className={`w-4 h-4 ${m.iconColor}`} />
                      <span>{m.title}</span>
                      {isTop && (
                        <span className="text-[10px] text-blue-600 dark:text-blue-400 font-mono font-normal">
                          [Best]
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right text-slate-600 dark:text-slate-400 tabular-nums">
                      {(m.data.trainAccuracy * 100).toFixed(2)}%
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-slate-900 dark:text-white tabular-nums">
                      {(m.data.testAccuracy * 100).toFixed(2)}%
                    </td>
                    <td className="py-3.5 px-4 text-right text-slate-700 dark:text-slate-300 tabular-nums">
                      {m.data.precisionMacro.toFixed(4)}
                    </td>
                    <td className="py-3.5 px-4 text-right text-slate-700 dark:text-slate-300 tabular-nums">
                      {m.data.recallMacro.toFixed(4)}
                    </td>
                    <td className="py-3.5 px-4 text-right text-slate-900 dark:text-white font-semibold tabular-nums">
                      {m.data.f1Macro.toFixed(4)}
                    </td>
                    <td className="py-3.5 px-4 text-right text-slate-700 dark:text-slate-300 tabular-nums">
                      {m.data.f1Weighted.toFixed(4)}
                    </td>
                    <td className="py-3.5 px-4 text-right text-slate-500 tabular-nums">
                      {(m.data.generalizationGap * 100).toFixed(2)}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Visual Bar Comparison Chart */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
        <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-4">
          Metric Comparison Chart (Normalized 0.0 - 1.0)
        </h3>

        <div className="space-y-4">
          {[
            { label: 'Test Accuracy', key: 'testAccuracy' as const },
            { label: 'Macro Precision', key: 'precisionMacro' as const },
            { label: 'Macro Recall', key: 'recallMacro' as const },
            { label: 'Macro F1-Score', key: 'f1Macro' as const },
          ].map((metric) => (
            <div key={metric.key} className="space-y-1.5">
              <div className="flex justify-between text-xs font-medium text-slate-700 dark:text-slate-300">
                <span>{metric.label}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {modelList.map((m) => {
                  const val = m.data[metric.key];
                  const percent = Math.round(val * 100);
                  return (
                    <div key={m.key} className="bg-slate-50 dark:bg-slate-800/50 p-2 rounded-lg">
                      <div className="flex justify-between text-[11px] mb-1 font-mono">
                        <span className="text-slate-600 dark:text-slate-400 font-sans">{m.title}</span>
                        <span className="font-bold text-slate-900 dark:text-white tabular-nums">
                          {val.toFixed(3)}
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                          style={{ width: `${percent}%` }}
                          className={`h-full ${
                            m.key === 'logReg'
                              ? 'bg-sky-500'
                              : m.key === 'dt'
                              ? 'bg-emerald-500'
                              : 'bg-indigo-500'
                          } rounded-full transition-all duration-500`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
