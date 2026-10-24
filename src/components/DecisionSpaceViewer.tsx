import React, { useRef, useEffect, useState, useMemo } from 'react';
import {
  FEATURE_NAMES,
  FEATURE_KEYS,
  SPECIES_DETAILS,
  IrisSample,
  SPECIES_NAMES,
} from '../data/irisData';
import {
  LogRegModel,
  DecisionTreeModel,
  RandomForestModel,
  predictLogRegProbabilities,
  predictTreeSample,
  predictForestProbabilities,
  extractFeatureVector,
} from '../ml/mlEngine';
import { Crosshair, Layers, HelpCircle, Eye, EyeOff } from 'lucide-react';

interface DecisionSpaceViewerProps {
  trainData: IrisSample[];
  testData: IrisSample[];
  logRegModel: LogRegModel;
  dtModel: DecisionTreeModel;
  rfModel: RandomForestModel;
}

export const DecisionSpaceViewer: React.FC<DecisionSpaceViewerProps> = ({
  trainData,
  testData,
  logRegModel,
  dtModel,
  rfModel,
}) => {
  // Feature axes (default to Petal Length index 2 and Petal Width index 3)
  const [featureX, setFeatureX] = useState<number>(2);
  const [featureY, setFeatureY] = useState<number>(3);
  const [selectedModel, setSelectedModel] = useState<'all' | 'logReg' | 'dt' | 'rf'>('all');
  const [showTrainPoints, setShowTrainPoints] = useState(true);
  const [showTestPoints, setShowTestPoints] = useState(true);

  // Probe coordinates
  const [probeCoords, setProbeCoords] = useState<{ x: number; y: number } | null>({
    x: 4.5,
    y: 1.4,
  });

  const canvasLogRegRef = useRef<HTMLCanvasElement | null>(null);
  const canvasDtRef = useRef<HTMLCanvasElement | null>(null);
  const canvasRfRef = useRef<HTMLCanvasElement | null>(null);

  // Dataset min/max for the two selected features with padding
  const bounds = useMemo(() => {
    const all = [...trainData, ...testData];
    const valsX = all.map((d) => extractFeatureVector(d)[featureX]);
    const valsY = all.map((d) => extractFeatureVector(d)[featureY]);

    const minX = Math.max(0, Math.floor(Math.min(...valsX) * 10) / 10 - 0.4);
    const maxX = Math.ceil(Math.max(...valsX) * 10) / 10 + 0.4;
    const minY = Math.max(0, Math.floor(Math.min(...valsY) * 10) / 10 - 0.4);
    const maxY = Math.ceil(Math.max(...valsY) * 10) / 10 + 0.4;

    return { minX, maxX, minY, maxY };
  }, [trainData, testData, featureX, featureY]);

  // Compute dataset means for non-selected features to hold constant
  const datasetMeans = useMemo(() => {
    const all = [...trainData, ...testData];
    const means = [0, 0, 0, 0];
    for (let f = 0; f < 4; f++) {
      const vals = all.map((d) => extractFeatureVector(d)[f]);
      means[f] = vals.reduce((a, b) => a + b, 0) / vals.length;
    }
    return means;
  }, [trainData, testData]);

  // Render canvas function
  const renderCanvas = (
    canvas: HTMLCanvasElement,
    predictProbFn: (vector: number[]) => [number, number, number],
    modelType: 'logReg' | 'dt' | 'rf'
  ) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    const { minX, maxX, minY, maxY } = bounds;

    // 1. Draw Decision Boundary Surface (Meshgrid)
    const gridRes = 50; // 50x50 cells
    const cellW = width / gridRes;
    const cellH = height / gridRes;

    for (let i = 0; i < gridRes; i++) {
      const fx = minX + (i + 0.5) * ((maxX - minX) / gridRes);
      for (let j = 0; j < gridRes; j++) {
        // Invert Y for canvas coordinate system (0 is top)
        const fy = maxY - (j + 0.5) * ((maxY - minY) / gridRes);

        const fullVector = [...datasetMeans];
        fullVector[featureX] = fx;
        fullVector[featureY] = fy;

        const probs = predictProbFn(fullVector);
        let maxClass = 0;
        if (probs[1] > probs[maxClass]) maxClass = 1;
        if (probs[2] > probs[maxClass]) maxClass = 2;

        const conf = probs[maxClass];
        // Shading based on class
        let color = 'rgba(6, 182, 212, 0.20)'; // cyan Setosa
        if (maxClass === 1) color = 'rgba(245, 158, 11, 0.20)'; // amber Versicolor
        if (maxClass === 2) color = 'rgba(59, 130, 246, 0.22)'; // cobalt Virginica

        ctx.fillStyle = color;
        ctx.fillRect(i * cellW, j * cellH, cellW + 0.5, cellH + 0.5);
      }
    }

    // 2. Draw Subtle Coordinate Axes & Gridlines
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.25)';
    ctx.lineWidth = 1;

    for (let step = 0; step <= 4; step++) {
      const px = (step / 4) * width;
      const py = (step / 4) * height;
      ctx.beginPath();
      ctx.moveTo(px, 0);
      ctx.lineTo(px, height);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, py);
      ctx.lineTo(width, py);
      ctx.stroke();
    }

    const scaleX = (val: number) => ((val - minX) / (maxX - minX)) * width;
    const scaleY = (val: number) => height - ((val - minY) / (maxY - minY)) * height;

    // 3. Draw Training Points (Circles)
    if (showTrainPoints) {
      trainData.forEach((sample) => {
        const x = scaleX(sample[FEATURE_KEYS[featureX]]);
        const y = scaleY(sample[FEATURE_KEYS[featureY]]);
        const color = SPECIES_DETAILS[sample.species].color;

        ctx.beginPath();
        ctx.arc(x, y, 4, 0, 2 * Math.PI);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.stroke();
      });
    }

    // 4. Draw Testing Points (Diamonds with outline)
    if (showTestPoints) {
      testData.forEach((sample) => {
        const x = scaleX(sample[FEATURE_KEYS[featureX]]);
        const y = scaleY(sample[FEATURE_KEYS[featureY]]);
        const color = SPECIES_DETAILS[sample.species].color;

        // Check if correctly classified by this model
        const fullVector = extractFeatureVector(sample);
        const probs = predictProbFn(fullVector);
        let predClass = 0;
        if (probs[1] > probs[predClass]) predClass = 1;
        if (probs[2] > probs[predClass]) predClass = 2;
        const isMisclassified = predClass !== sample.species;

        // Draw diamond shape
        const size = 5.5;
        ctx.beginPath();
        ctx.moveTo(x, y - size);
        ctx.lineTo(x + size, y);
        ctx.lineTo(x, y + size);
        ctx.lineTo(x - size, y);
        ctx.closePath();

        ctx.fillStyle = color;
        ctx.fill();

        ctx.strokeStyle = isMisclassified ? '#ef4444' : '#0f172a';
        ctx.lineWidth = isMisclassified ? 2 : 1.5;
        ctx.stroke();
      });
    }

    // 5. Draw Probe Crosshairs if active
    if (probeCoords) {
      const px = scaleX(probeCoords.x);
      const py = scaleY(probeCoords.y);

      ctx.strokeStyle = '#0f172a';
      ctx.setLineDash([3, 3]);
      ctx.lineWidth = 1;

      ctx.beginPath();
      ctx.moveTo(px, 0);
      ctx.lineTo(px, height);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, py);
      ctx.lineTo(width, py);
      ctx.stroke();

      ctx.setLineDash([]);

      // Probe center dot
      ctx.beginPath();
      ctx.arc(px, py, 4.5, 0, 2 * Math.PI);
      ctx.fillStyle = '#0f172a';
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  };

  useEffect(() => {
    if (canvasLogRegRef.current) {
      renderCanvas(
        canvasLogRegRef.current,
        (vec) => predictLogRegProbabilities(logRegModel, vec),
        'logReg'
      );
    }
    if (canvasDtRef.current) {
      renderCanvas(
        canvasDtRef.current,
        (vec) => predictTreeSample(dtModel.root, vec).probabilities,
        'dt'
      );
    }
    if (canvasRfRef.current) {
      renderCanvas(
        canvasRfRef.current,
        (vec) => predictForestProbabilities(rfModel, vec),
        'rf'
      );
    }
  }, [
    bounds,
    featureX,
    featureY,
    trainData,
    testData,
    logRegModel,
    dtModel,
    rfModel,
    showTrainPoints,
    showTestPoints,
    probeCoords,
    selectedModel,
  ]);

  // Handle probe canvas click / hover
  const handleCanvasInteraction = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = e.currentTarget;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const { minX, maxX, minY, maxY } = bounds;

    const probedX = minX + (clickX / width) * (maxX - minX);
    const probedY = maxY - (clickY / height) * (maxY - minY);

    setProbeCoords({
      x: Math.max(minX, Math.min(maxX, Number(probedX.toFixed(2)))),
      y: Math.max(minY, Math.min(maxY, Number(probedY.toFixed(2)))),
    });
  };

  // Evaluate probe against all 3 models
  const probePredictions = useMemo(() => {
    if (!probeCoords) return null;
    const full = [...datasetMeans];
    full[featureX] = probeCoords.x;
    full[featureY] = probeCoords.y;

    const pLog = predictLogRegProbabilities(logRegModel, full);
    const pDt = predictTreeSample(dtModel.root, full).probabilities;
    const pRf = predictForestProbabilities(rfModel, full);

    const getWinner = (p: [number, number, number]) => {
      let w = 0;
      if (p[1] > p[w]) w = 1;
      if (p[2] > p[w]) w = 2;
      return w;
    };

    return {
      logReg: { probs: pLog, winner: getWinner(pLog) },
      dt: { probs: pDt, winner: getWinner(pDt) },
      rf: { probs: pRf, winner: getWinner(pRf) },
    };
  }, [probeCoords, datasetMeans, featureX, featureY, logRegModel, dtModel, rfModel]);

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            <span>2D Decision Space Visualizer</span>
            <span aria-hidden="true">·</span>
            <span>Geometric Hyperplanes vs Orthogonal Partitions</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
            Decision Boundary Geometry Comparison
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
            Inspect how each model partitions the 2D feature subspace. Click or drag anywhere on the canvases to probe real-time class confidence vectors.
          </p>
        </div>

        {/* Feature Axis Selectors */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs">
            <span className="font-semibold text-slate-600 dark:text-slate-400">X-Axis:</span>
            <select
              value={featureX}
              onChange={(e) => setFeatureX(parseInt(e.target.value))}
              className="px-2.5 py-1 text-xs font-medium bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200"
            >
              {FEATURE_NAMES.map((name, i) => (
                <option key={i} value={i} disabled={i === featureY}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <span className="font-semibold text-slate-600 dark:text-slate-400">Y-Axis:</span>
            <select
              value={featureY}
              onChange={(e) => setFeatureY(parseInt(e.target.value))}
              className="px-2.5 py-1 text-xs font-medium bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200"
            >
              {FEATURE_NAMES.map((name, i) => (
                <option key={i} value={i} disabled={i === featureX}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          {/* Model View Segmented Filter */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
            {(['all', 'logReg', 'dt', 'rf'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setSelectedModel(mode)}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                  selectedModel === mode
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                {mode === 'all'
                  ? 'All 3'
                  : mode === 'logReg'
                  ? 'LogReg'
                  : mode === 'dt'
                  ? 'Tree'
                  : 'Forest'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Point Legend & Layer Toggles */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs">
        <div className="flex flex-wrap items-center gap-4">
          <span className="font-semibold text-slate-700 dark:text-slate-300">Species Legend:</span>
          {SPECIES_DETAILS.map((sp) => (
            <div key={sp.id} className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: sp.color }} />
              <span className="font-medium text-slate-800 dark:text-slate-200">{sp.displayName}</span>
            </div>
          ))}
          <span className="text-slate-300 dark:text-slate-700">|</span>
          <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-400 border border-white" />
            <span>Train Circle</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
            <span className="w-2.5 h-2.5 rotate-45 bg-slate-400 border border-slate-900" />
            <span>Test Diamond</span>
          </div>
          <div className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 font-medium">
            <span className="w-2.5 h-2.5 rotate-45 border-2 border-rose-500 bg-rose-200" />
            <span>Red Outline = Misclassified</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowTrainPoints(!showTrainPoints)}
            className="flex items-center gap-1 text-slate-600 dark:text-slate-400 hover:text-slate-900"
          >
            {showTrainPoints ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span>Train ({trainData.length})</span>
          </button>
          <button
            onClick={() => setShowTestPoints(!showTestPoints)}
            className="flex items-center gap-1 text-slate-600 dark:text-slate-400 hover:text-slate-900"
          >
            {showTestPoints ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span>Test ({testData.length})</span>
          </button>
        </div>
      </div>

      {/* Canvas Grid */}
      <div
        className={`grid gap-5 ${
          selectedModel === 'all' ? 'grid-cols-1 lg:grid-cols-3' : 'grid-cols-1 max-w-2xl mx-auto'
        }`}
      >
        {/* Canvas 1: Logistic Regression */}
        {(selectedModel === 'all' || selectedModel === 'logReg') && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                1. Logistic Regression
              </h3>
              <span className="text-[11px] text-sky-600 dark:text-sky-400 font-mono">
                Linear Hyperplanes
              </span>
            </div>
            <div className="relative aspect-square w-full bg-slate-50 dark:bg-slate-950 rounded-lg overflow-hidden border border-slate-200/60 dark:border-slate-800">
              <canvas
                ref={canvasLogRegRef}
                width={360}
                height={360}
                onClick={handleCanvasInteraction}
                className="w-full h-full cursor-crosshair"
              />
            </div>
            <div className="mt-2.5 flex justify-between text-[11px] text-slate-500 font-mono">
              <span>{FEATURE_NAMES[featureX]} ({bounds.minX} - {bounds.maxX})</span>
              <span>Y: {FEATURE_NAMES[featureY]}</span>
            </div>
          </div>
        )}

        {/* Canvas 2: Decision Tree */}
        {(selectedModel === 'all' || selectedModel === 'dt') && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                2. Decision Tree (CART)
              </h3>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono">
                Orthogonal Step Cuts
              </span>
            </div>
            <div className="relative aspect-square w-full bg-slate-50 dark:bg-slate-950 rounded-lg overflow-hidden border border-slate-200/60 dark:border-slate-800">
              <canvas
                ref={canvasDtRef}
                width={360}
                height={360}
                onClick={handleCanvasInteraction}
                className="w-full h-full cursor-crosshair"
              />
            </div>
            <div className="mt-2.5 flex justify-between text-[11px] text-slate-500 font-mono">
              <span>{FEATURE_NAMES[featureX]} ({bounds.minX} - {bounds.maxX})</span>
              <span>Y: {FEATURE_NAMES[featureY]}</span>
            </div>
          </div>
        )}

        {/* Canvas 3: Random Forest */}
        {(selectedModel === 'all' || selectedModel === 'rf') && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                3. Random Forest
              </h3>
              <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-mono">
                Smooth Ensemble Contours
              </span>
            </div>
            <div className="relative aspect-square w-full bg-slate-50 dark:bg-slate-950 rounded-lg overflow-hidden border border-slate-200/60 dark:border-slate-800">
              <canvas
                ref={canvasRfRef}
                width={360}
                height={360}
                onClick={handleCanvasInteraction}
                className="w-full h-full cursor-crosshair"
              />
            </div>
            <div className="mt-2.5 flex justify-between text-[11px] text-slate-500 font-mono">
              <span>{FEATURE_NAMES[featureX]} ({bounds.minX} - {bounds.maxX})</span>
              <span>Y: {FEATURE_NAMES[featureY]}</span>
            </div>
          </div>
        )}
      </div>

      {/* Live Interactive Probe HUD */}
      {probeCoords && probePredictions && (
        <div className="p-4 bg-slate-900 text-white rounded-xl shadow-lg border border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Crosshair className="w-4 h-4 text-cyan-400 animate-spin-slow" />
              <span className="text-xs uppercase tracking-wider font-semibold text-slate-300">
                Interactive Crosshair Coordinate Probe
              </span>
            </div>
            <div className="font-mono text-xs text-cyan-300">
              {FEATURE_NAMES[featureX]}: <strong className="text-white">{probeCoords.x} cm</strong> ·{' '}
              {FEATURE_NAMES[featureY]}: <strong className="text-white">{probeCoords.y} cm</strong>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3">
            {[
              { name: 'Logistic Regression', res: probePredictions.logReg, color: 'text-sky-400' },
              { name: 'Decision Tree (CART)', res: probePredictions.dt, color: 'text-emerald-400' },
              { name: 'Random Forest', res: probePredictions.rf, color: 'text-indigo-400' },
            ].map((p, idx) => {
              const winnerSp = SPECIES_DETAILS[p.res.winner];
              return (
                <div key={idx} className="bg-slate-800/80 p-3 rounded-lg border border-slate-700/60">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className={`font-semibold ${p.color}`}>{p.name}</span>
                    <span className="font-mono text-white font-bold">{winnerSp.displayName}</span>
                  </div>
                  <div className="space-y-1 font-mono text-[11px]">
                    {SPECIES_DETAILS.map((sp) => {
                      const prob = p.res.probs[sp.id];
                      return (
                        <div key={sp.id} className="flex items-center justify-between">
                          <span className="text-slate-400">{sp.displayName}:</span>
                          <span className="text-slate-200 tabular-nums">
                            {(prob * 100).toFixed(1)}%
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
          <p className="text-[11px] text-slate-400 mt-3">
            Tip: Click anywhere on the boundary maps above to relocate the crosshair and evaluate classification boundaries.
          </p>
        </div>
      )}
    </div>
  );
};
