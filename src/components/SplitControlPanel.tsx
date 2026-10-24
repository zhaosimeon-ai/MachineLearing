import React from 'react';
import { Sliders, RefreshCw, CheckCircle2, ShieldCheck, Database, Split } from 'lucide-react';
import { SplitResult } from '../ml/mlEngine';
import { SPECIES_DETAILS } from '../data/irisData';

interface SplitControlPanelProps {
  testSize: number;
  setTestSize: (size: number) => void;
  randomState: number;
  setRandomState: (seed: number) => void;
  stratify: boolean;
  setStratify: (stratify: boolean) => void;
  splitResult: SplitResult;
  onReset: () => void;
}

export const SplitControlPanel: React.FC<SplitControlPanelProps> = ({
  testSize,
  setTestSize,
  randomState,
  setRandomState,
  stratify,
  setStratify,
  splitResult,
  onReset,
}) => {
  const trainPercentage = Math.round((1 - testSize) * 100);
  const testPercentage = Math.round(testSize * 100);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 mb-6 shadow-sm">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            <Split className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>Dataset Pipeline & Partitioning</span>
            <span aria-hidden="true">·</span>
            <span>Step 1 &amp; Step 2</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
            Iris Dataset Train / Test Partition
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
            150 total botanical observations loaded from Fisher&apos;s canonical collection. Split with a deterministic seed and stratified class distribution for strict scientific reproducibility.
          </p>
        </div>

        {/* Invariant Guarantee Banner */}
        <div className="flex items-center gap-2 px-3.5 py-2 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-lg text-emerald-800 dark:text-emerald-300 text-xs shrink-0">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <div>
            <div className="font-semibold">Exact Same Dataset Invariant Active</div>
            <div className="text-[11px] text-emerald-700 dark:text-emerald-400/90 font-mono">
              X_train ({splitResult.trainCount}) · X_test ({splitResult.testCount}) shared across all 3 models
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Sliders & Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        {/* Control 1: Test Size Split */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-medium text-slate-700 dark:text-slate-300">
            <span className="flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-slate-400" />
              <span>Test Size Ratio</span>
            </span>
            <span className="font-mono font-semibold text-blue-600 dark:text-blue-400">
              {testPercentage}% (test_size={testSize.toFixed(2)})
            </span>
          </div>
          <input
            type="range"
            min="0.10"
            max="0.50"
            step="0.05"
            value={testSize}
            onChange={(e) => setTestSize(parseFloat(e.target.value))}
            className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <div className="flex justify-between text-[11px] text-slate-500 font-mono">
            <span>10% (15 test)</span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">20% (Default)</span>
            <span>50% (75 test)</span>
          </div>
        </div>

        {/* Control 2: Random Seed */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-medium text-slate-700 dark:text-slate-300">
            <span className="flex items-center gap-1.5">
              <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
              <span>Random State (Seed)</span>
            </span>
            <span className="font-mono font-semibold text-slate-900 dark:text-white">
              seed={randomState}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={randomState}
              onChange={(e) => setRandomState(parseInt(e.target.value) || 0)}
              className="w-24 px-2.5 py-1 text-xs font-mono bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-900 dark:text-white"
            />
            <div className="flex items-center gap-1 text-[11px]">
              {[42, 0, 7, 100].map((seed) => (
                <button
                  key={seed}
                  onClick={() => setRandomState(seed)}
                  className={`px-2 py-1 rounded font-mono transition-colors ${
                    randomState === seed
                      ? 'bg-blue-600 text-white font-semibold'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {seed}
                </button>
              ))}
            </div>
          </div>
          <p className="text-[11px] text-slate-500">
            Fixes pseudo-random permutations for identical train/test sampling.
          </p>
        </div>

        {/* Control 3: Stratified Sampling & Quick Actions */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-medium text-slate-700 dark:text-slate-300">
            <span>Stratified Sampling</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={stratify}
                onChange={(e) => setStratify(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-slate-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200/80 dark:border-slate-700/60 text-[11px] text-slate-600 dark:text-slate-400">
            {stratify ? (
              <span className="text-emerald-700 dark:text-emerald-400 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>stratify=y: Preserves 1:1:1 class ratio across Train &amp; Test</span>
              </span>
            ) : (
              <span className="text-amber-700 dark:text-amber-400 font-medium">
                Uniform random sampling (class ratios in test set may drift slightly)
              </span>
            )}
          </div>
          <button
            onClick={onReset}
            className="text-[11px] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white underline underline-offset-2 transition-colors"
          >
            Reset to standard benchmark defaults (test_size=0.20, seed=42)
          </button>
        </div>
      </div>

      {/* Visual Partition Bar */}
      <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">
          <span>Current Partition Allocation</span>
          <span className="font-mono text-slate-500">
            Train: {splitResult.trainCount} ({trainPercentage}%) | Test: {splitResult.testCount} ({testPercentage}%)
          </span>
        </div>

        <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex shadow-inner">
          <div
            style={{ width: `${trainPercentage}%` }}
            className="h-full bg-slate-800 dark:bg-blue-600 transition-all duration-300 flex items-center justify-center text-[9px] text-white font-mono"
            title={`Training Data: ${splitResult.trainCount} samples`}
          />
          <div
            style={{ width: `${testPercentage}%` }}
            className="h-full bg-amber-500 dark:bg-amber-500 transition-all duration-300 flex items-center justify-center text-[9px] text-white font-mono"
            title={`Testing Data: ${splitResult.testCount} samples`}
          />
        </div>

        {/* Species Breakdown in Test Set */}
        <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-slate-500 dark:text-slate-400">
          <span className="font-medium text-slate-700 dark:text-slate-300">Test Set Class Balance:</span>
          {SPECIES_DETAILS.map((sp) => (
            <div key={sp.id} className="flex items-center gap-1.5 font-mono text-[11px]">
              <span
                className="w-2.5 h-2.5 rounded-sm shrink-0"
                style={{ backgroundColor: sp.color }}
              />
              <span className="text-slate-700 dark:text-slate-300">{sp.displayName}:</span>
              <span className="font-semibold text-slate-900 dark:text-white">
                {splitResult.testClassDist[sp.id]} samples
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
