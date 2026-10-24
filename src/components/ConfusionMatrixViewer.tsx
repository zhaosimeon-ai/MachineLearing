import React, { useState } from 'react';
import { ModelMetrics, extractFeatureVector } from '../ml/mlEngine';
import { SPECIES_DETAILS, IrisSample, FEATURE_NAMES } from '../data/irisData';
import { Grid, Eye, CheckCircle2, AlertCircle } from 'lucide-react';

interface ConfusionMatrixViewerProps {
  metrics: {
    logReg: ModelMetrics;
    dt: ModelMetrics;
    rf: ModelMetrics;
  };
  testData: IrisSample[];
  predictFns: {
    logReg: (vec: number[]) => 0 | 1 | 2;
    dt: (vec: number[]) => 0 | 1 | 2;
    rf: (vec: number[]) => 0 | 1 | 2;
  };
}

export const ConfusionMatrixViewer: React.FC<ConfusionMatrixViewerProps> = ({
  metrics,
  testData,
  predictFns,
}) => {
  const [selectedCell, setSelectedCell] = useState<{
    modelKey: 'logReg' | 'dt' | 'rf';
    trueClass: 0 | 1 | 2;
    predClass: 0 | 1 | 2;
  } | null>(null);

  const modelConfigs = [
    { key: 'logReg' as const, name: 'Logistic Regression', data: metrics.logReg },
    { key: 'dt' as const, name: 'Decision Tree (CART)', data: metrics.dt },
    { key: 'rf' as const, name: 'Random Forest', data: metrics.rf },
  ];

  // Compute selected samples for the inspector
  const inspectedSamples = selectedCell
    ? testData.filter((s) => {
        const pred = predictFns[selectedCell.modelKey](extractFeatureVector(s));
        return s.species === selectedCell.trueClass && pred === selectedCell.predClass;
      })
    : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            <span>Diagnostic Evaluation</span>
            <span aria-hidden="true">·</span>
            <span>Tri-Model Confusion Heatmaps</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
            Confusion Matrices &amp; Per-Class Support
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
            Compare True Positives along the diagonal against off-diagonal misclassifications. Click any cell to inspect individual test samples and their feature values.
          </p>
        </div>

        <div className="text-xs text-slate-500 font-mono">
          Total Test Samples: {testData.length}
        </div>
      </div>

      {/* 3 Side-by-Side Confusion Matrices */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {modelConfigs.map((m) => {
          const cm = m.data.confusionMatrix;
          const maxVal = Math.max(...cm.flat(), 1);

          return (
            <div
              key={m.key}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                  {m.name}
                </h3>
                <span className="text-xs font-mono font-semibold text-slate-700 dark:text-slate-300">
                  Acc: {(m.data.testAccuracy * 100).toFixed(1)}%
                </span>
              </div>

              {/* 3x3 Heatmap Grid */}
              <div className="space-y-2">
                <div className="text-[10px] uppercase tracking-wider text-slate-400 font-mono text-center">
                  Predicted Class (Columns) →
                </div>

                <div className="grid grid-cols-[auto_1fr_1fr_1fr] gap-1 text-xs font-mono">
                  {/* Top Header */}
                  <div className="w-16"></div>
                  {SPECIES_DETAILS.map((sp) => (
                    <div
                      key={sp.id}
                      className="text-center font-semibold text-[11px] text-slate-600 dark:text-slate-400 truncate px-1"
                      title={sp.displayName}
                    >
                      {sp.name.slice(0, 4)}
                    </div>
                  ))}

                  {/* Matrix Rows */}
                  {[0, 1, 2].map((actual) => (
                    <React.Fragment key={actual}>
                      {/* Row Header */}
                      <div className="flex items-center text-[11px] font-semibold text-slate-600 dark:text-slate-400 pr-2">
                        <span className="truncate" title={SPECIES_DETAILS[actual].displayName}>
                          {SPECIES_DETAILS[actual].name.slice(0, 4)}
                        </span>
                      </div>

                      {/* 3 Cells */}
                      {[0, 1, 2].map((pred) => {
                        const count = cm[actual][pred];
                        const isDiag = actual === pred;
                        const isSelected =
                          selectedCell?.modelKey === m.key &&
                          selectedCell?.trueClass === actual &&
                          selectedCell?.predClass === pred;

                        // Shading calculation
                        const intensity = count / maxVal;
                        let cellBg = 'bg-slate-50 dark:bg-slate-800/40 text-slate-400';
                        if (isDiag) {
                          if (count > 0) {
                            cellBg = 'bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-500/40';
                          }
                        } else if (count > 0) {
                          cellBg = 'bg-rose-500/20 text-rose-800 dark:text-rose-300 font-bold border border-rose-500/40';
                        }

                        return (
                          <button
                            key={pred}
                            onClick={() =>
                              setSelectedCell({
                                modelKey: m.key,
                                trueClass: actual as 0 | 1 | 2,
                                predClass: pred as 0 | 1 | 2,
                              })
                            }
                            className={`h-12 flex flex-col items-center justify-center rounded-lg transition-all ${cellBg} ${
                              isSelected ? 'ring-2 ring-blue-600 dark:ring-blue-400 scale-[1.03]' : 'hover:opacity-80'
                            }`}
                            title={`True: ${SPECIES_DETAILS[actual].displayName}, Pred: ${SPECIES_DETAILS[pred].displayName} (${count} samples)`}
                          >
                            <span className="text-sm tabular-nums">{count}</span>
                            <span className="text-[9px] opacity-75">
                              {((count / (m.data.perClass[actual].support || 1)) * 100).toFixed(0)}%
                            </span>
                          </button>
                        );
                      })}
                    </React.Fragment>
                  ))}
                </div>

                <div className="text-[10px] text-slate-400 font-mono mt-1">
                  ↓ Actual Class (Rows)
                </div>
              </div>

              {/* Per-Class Metrics Strip */}
              <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 text-[11px] font-mono space-y-1.5">
                <div className="font-semibold text-slate-500 dark:text-slate-400 text-[10px] uppercase mb-1">
                  Class-Level Scores (Precision / Recall / F1)
                </div>
                {SPECIES_DETAILS.map((sp) => {
                  const cMetric = m.data.perClass[sp.id];
                  return (
                    <div
                      key={sp.id}
                      className="flex items-center justify-between p-1.5 rounded bg-slate-50 dark:bg-slate-800/40"
                    >
                      <span className="font-medium text-slate-700 dark:text-slate-300">
                        {sp.displayName}:
                      </span>
                      <span className="text-slate-600 dark:text-slate-400 tabular-nums">
                        P: {cMetric.precision.toFixed(2)} · R: {cMetric.recall.toFixed(2)} · F1:{' '}
                        {cMetric.f1.toFixed(2)} ({cMetric.support})
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Sample Inspector */}
      {selectedCell && (
        <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                Confusion Matrix Cell Inspector
              </h3>
              <span className="text-xs text-slate-500 font-mono">
                Model: <strong>{selectedCell.modelKey.toUpperCase()}</strong> · Actual:{' '}
                <strong>{SPECIES_DETAILS[selectedCell.trueClass].displayName}</strong> · Predicted:{' '}
                <strong>{SPECIES_DETAILS[selectedCell.predClass].displayName}</strong>
              </span>
            </div>
            <button
              onClick={() => setSelectedCell(null)}
              className="text-xs text-slate-400 hover:text-slate-700 dark:hover:text-white"
            >
              Close
            </button>
          </div>

          <div className="pt-3">
            {inspectedSamples.length === 0 ? (
              <p className="text-xs text-slate-500 py-3 text-center">
                Zero test samples fell into this prediction cell (0 errors).
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    <tr>
                      <th className="py-2 px-3">Sample ID</th>
                      <th className="py-2 px-3">Sepal Length</th>
                      <th className="py-2 px-3">Sepal Width</th>
                      <th className="py-2 px-3">Petal Length</th>
                      <th className="py-2 px-3">Petal Width</th>
                      <th className="py-2 px-3">Classification</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                    {inspectedSamples.map((s) => {
                      const isCorrect = selectedCell.trueClass === selectedCell.predClass;
                      return (
                        <tr key={s.id} className="hover:bg-slate-100/50">
                          <td className="py-2 px-3 font-semibold text-slate-800 dark:text-slate-200">
                            #{s.id}
                          </td>
                          <td className="py-2 px-3">{s.sepalLength} cm</td>
                          <td className="py-2 px-3">{s.sepalWidth} cm</td>
                          <td className="py-2 px-3">{s.petalLength} cm</td>
                          <td className="py-2 px-3">{s.petalWidth} cm</td>
                          <td className="py-2 px-3">
                            {isCorrect ? (
                              <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5" /> Correct
                              </span>
                            ) : (
                              <span className="text-rose-600 dark:text-rose-400 flex items-center gap-1 font-semibold">
                                <AlertCircle className="w-3.5 h-3.5" /> Misclassified
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
