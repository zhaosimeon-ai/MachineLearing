/**
 * High-Precision Machine Learning Algorithms for Iris Classification
 * 1. Dataset Splitting (Reproducible seeded PRNG, stratified sampling)
 * 2. Multi-class Logistic Regression (Standardized OvR / Softmax with L2 penalty)
 * 3. CART Decision Tree Classifier (Gini Impurity, hierarchical tree visualizer structure)
 * 4. Random Forest Classifier (Bootstrap Bagging, random subspace feature selection, majority vote)
 * 5. Full Metrics Suite (Accuracy, Precision, Recall, F1, Confusion Matrix, Classification Report)
 */

import { IRIS_DATA, IrisSample, FEATURE_KEYS, SPECIES_NAMES } from '../data/irisData';

// Deterministic Pseudo-Random Number Generator (Mulberry32)
export function createRNG(seed: number) {
  let s = Math.floor(Math.abs(seed)) + 1;
  return function () {
    let t = (s += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export interface SplitResult {
  train: IrisSample[];
  test: IrisSample[];
  trainCount: number;
  testCount: number;
  trainClassDist: [number, number, number];
  testClassDist: [number, number, number];
}

export function trainTestSplit(
  dataset: IrisSample[],
  testSize: number = 0.2,
  randomState: number = 42,
  stratify: boolean = true
): SplitResult {
  const rng = createRNG(randomState);

  // Fisher-Yates shuffle with seeded RNG
  const shuffle = <T>(array: T[]): T[] => {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  };

  const train: IrisSample[] = [];
  const test: IrisSample[] = [];

  if (stratify) {
    // Stratify by species
    for (let speciesId = 0; speciesId < 3; speciesId++) {
      const classSubset = dataset.filter((d) => d.species === speciesId);
      const shuffled = shuffle(classSubset);
      const testCount = Math.round(shuffled.length * testSize);
      test.push(...shuffled.slice(0, testCount));
      train.push(...shuffled.slice(testCount));
    }
  } else {
    const shuffled = shuffle(dataset);
    const testCount = Math.round(shuffled.length * testSize);
    test.push(...shuffled.slice(0, testCount));
    train.push(...shuffled.slice(testCount));
  }

  // Count class distributions
  const trainDist: [number, number, number] = [0, 0, 0];
  train.forEach((d) => trainDist[d.species]++);

  const testDist: [number, number, number] = [0, 0, 0];
  test.forEach((d) => testDist[d.species]++);

  return {
    train,
    test,
    trainCount: train.length,
    testCount: test.length,
    trainClassDist: trainDist,
    testClassDist: testDist,
  };
}

// Vector math helpers
function dot(a: number[], b: number[]): number {
  let sum = 0;
  for (let i = 0; i < a.length; i++) sum += a[i] * b[i];
  return sum;
}

function sigmoid(z: number): number {
  if (z < -45) return 0;
  if (z > 45) return 1;
  return 1 / (1 + Math.exp(-z));
}

export function extractFeatureVector(sample: IrisSample): number[] {
  return [sample.sepalLength, sample.sepalWidth, sample.petalLength, sample.petalWidth];
}

// ----------------------------------------------------
// 1. Logistic Regression (One-vs-Rest with Standardization & L2)
// ----------------------------------------------------
export interface LogRegModel {
  type: 'logistic_regression';
  means: number[];
  stds: number[];
  weights: number[][]; // [3 classes][4 features]
  biases: number[]; // [3 classes]
  iterations: number;
}

export function trainLogisticRegression(
  trainData: IrisSample[],
  C: number = 1.0, // Regularization inverse strength (similar to sklearn)
  maxIter: number = 400,
  lr: number = 0.1
): LogRegModel {
  const nFeatures = 4;
  const nSamples = trainData.length;

  // 1. Compute standardization parameters
  const means: number[] = new Array(nFeatures).fill(0);
  const stds: number[] = new Array(nFeatures).fill(0);

  for (let f = 0; f < nFeatures; f++) {
    const vals = trainData.map((d) => extractFeatureVector(d)[f]);
    means[f] = vals.reduce((a, b) => a + b, 0) / nSamples;
    const variance = vals.reduce((a, b) => a + Math.pow(b - means[f], 2), 0) / nSamples;
    stds[f] = Math.sqrt(variance) || 1e-6;
  }

  // Standardize X
  const X_norm = trainData.map((d) => {
    const raw = extractFeatureVector(d);
    return raw.map((v, f) => (v - means[f]) / stds[f]);
  });

  // 2. Train One-vs-Rest binary models for each of the 3 classes
  const weights: number[][] = [];
  const biases: number[] = [];
  const lambda = 1.0 / Math.max(C, 0.0001); // L2 regularization coefficient

  for (let c = 0; c < 3; c++) {
    let w = new Array(nFeatures).fill(0);
    let b = 0;

    for (let iter = 0; iter < maxIter; iter++) {
      const gradW = new Array(nFeatures).fill(0);
      let gradB = 0;

      for (let i = 0; i < nSamples; i++) {
        const xi = X_norm[i];
        const yi = trainData[i].species === c ? 1 : 0;
        const z = dot(w, xi) + b;
        const p = sigmoid(z);
        const err = p - yi;

        for (let f = 0; f < nFeatures; f++) {
          gradW[f] += err * xi[f];
        }
        gradB += err;
      }

      // Update with gradient descent and L2 regularization
      for (let f = 0; f < nFeatures; f++) {
        w[f] = w[f] - lr * (gradW[f] / nSamples + (lambda / nSamples) * w[f]);
      }
      b = b - lr * (gradB / nSamples);
    }

    weights.push(w);
    biases.push(b);
  }

  return {
    type: 'logistic_regression',
    means,
    stds,
    weights,
    biases,
    iterations: maxIter,
  };
}

export function predictLogRegProbabilities(model: LogRegModel, sample: number[]): [number, number, number] {
  // Standardize
  const x_norm = sample.map((v, f) => (v - model.means[f]) / model.stds[f]);
  const logits = [0, 1, 2].map((c) => dot(model.weights[c], x_norm) + model.biases[c]);

  // Softmax
  const maxLogit = Math.max(...logits);
  const exps = logits.map((l) => Math.exp(l - maxLogit));
  const sumExp = exps.reduce((a, b) => a + b, 0);
  return [exps[0] / sumExp, exps[1] / sumExp, exps[2] / sumExp];
}

export function predictLogReg(model: LogRegModel, sample: number[]): 0 | 1 | 2 {
  const probs = predictLogRegProbabilities(model, sample);
  if (probs[0] >= probs[1] && probs[0] >= probs[2]) return 0;
  if (probs[1] >= probs[0] && probs[1] >= probs[2]) return 1;
  return 2;
}

// ----------------------------------------------------
// 2. Decision Tree Classifier (CART with Gini Impurity)
// ----------------------------------------------------
export interface TreeNode {
  id: string;
  isLeaf: boolean;
  featureIndex?: number;
  featureName?: string;
  threshold?: number;
  left?: TreeNode;
  right?: TreeNode;
  predictedClass: 0 | 1 | 2;
  probabilities: [number, number, number];
  gini: number;
  samples: number;
  classCounts: [number, number, number];
}

export interface DecisionTreeModel {
  type: 'decision_tree';
  root: TreeNode;
  maxDepth: number;
  featureImportances: [number, number, number, number];
}

function calculateGini(counts: [number, number, number], total: number): number {
  if (total === 0) return 0;
  let sumSq = 0;
  for (let c = 0; c < 3; c++) {
    const p = counts[c] / total;
    sumSq += p * p;
  }
  return 1 - sumSq;
}

export function trainDecisionTree(
  trainData: IrisSample[],
  maxDepth: number = 3,
  minSamplesSplit: number = 2,
  featureSubsetIndices?: number[] // For Random Forest subspace sampling
): DecisionTreeModel {
  const featureGiniReductions = [0, 0, 0, 0];
  let nodeIdCounter = 0;

  function buildTree(samples: IrisSample[], depth: number): TreeNode {
    const id = `node_${nodeIdCounter++}`;
    const counts: [number, number, number] = [0, 0, 0];
    samples.forEach((s) => counts[s.species]++);
    const total = samples.length;
    const gini = calculateGini(counts, total);

    // Majority class
    let majClass: 0 | 1 | 2 = 0;
    if (counts[1] > counts[majClass]) majClass = 1;
    if (counts[2] > counts[majClass]) majClass = 2;

    const probs: [number, number, number] = [
      total > 0 ? counts[0] / total : 0,
      total > 0 ? counts[1] / total : 0,
      total > 0 ? counts[2] / total : 0,
    ];

    // Base conditions for leaf node:
    // 1. Pure node (gini === 0)
    // 2. Max depth reached
    // 3. Insufficient samples to split
    if (gini === 0 || depth >= maxDepth || total < minSamplesSplit) {
      return {
        id,
        isLeaf: true,
        predictedClass: majClass,
        probabilities: probs,
        gini,
        samples: total,
        classCounts: counts,
      };
    }

    // Find best binary split
    let bestGiniGain = -1;
    let bestFeature = -1;
    let bestThreshold = 0;
    let bestLeftSamples: IrisSample[] = [];
    let bestRightSamples: IrisSample[] = [];

    const candidateFeatures = featureSubsetIndices || [0, 1, 2, 3];

    for (const f of candidateFeatures) {
      const key = FEATURE_KEYS[f];
      // Get unique values and possible midpoints
      const sorted = [...samples].sort((a, b) => a[key] - b[key]);
      const thresholds: number[] = [];
      for (let i = 0; i < sorted.length - 1; i++) {
        const valA = sorted[i][key];
        const valB = sorted[i + 1][key];
        if (valA !== valB) {
          thresholds.push((valA + valB) / 2);
        }
      }

      for (const th of thresholds) {
        const left: IrisSample[] = [];
        const right: IrisSample[] = [];
        const leftCounts: [number, number, number] = [0, 0, 0];
        const rightCounts: [number, number, number] = [0, 0, 0];

        for (const s of samples) {
          if (s[key] <= th) {
            left.push(s);
            leftCounts[s.species]++;
          } else {
            right.push(s);
            rightCounts[s.species]++;
          }
        }

        if (left.length === 0 || right.length === 0) continue;

        const leftGini = calculateGini(leftCounts, left.length);
        const rightGini = calculateGini(rightCounts, right.length);
        const weightedChildGini = (left.length / total) * leftGini + (right.length / total) * rightGini;
        const giniGain = gini - weightedChildGini;

        if (giniGain > bestGiniGain) {
          bestGiniGain = giniGain;
          bestFeature = f;
          bestThreshold = th;
          bestLeftSamples = left;
          bestRightSamples = right;
        }
      }
    }

    // If no meaningful split was found
    if (bestGiniGain <= 1e-7 || bestFeature === -1) {
      return {
        id,
        isLeaf: true,
        predictedClass: majClass,
        probabilities: probs,
        gini,
        samples: total,
        classCounts: counts,
      };
    }

    // Accumulate feature importance
    featureGiniReductions[bestFeature] += bestGiniGain * (total / trainData.length);

    const leftNode = buildTree(bestLeftSamples, depth + 1);
    const rightNode = buildTree(bestRightSamples, depth + 1);

    return {
      id,
      isLeaf: false,
      featureIndex: bestFeature,
      featureName: FEATURE_KEYS[bestFeature],
      threshold: Number(bestThreshold.toFixed(2)),
      left: leftNode,
      right: rightNode,
      predictedClass: majClass,
      probabilities: probs,
      gini,
      samples: total,
      classCounts: counts,
    };
  }

  const root = buildTree(trainData, 0);

  // Normalize feature importances
  const totalGain = featureGiniReductions.reduce((a, b) => a + b, 0);
  const normalizedImportances: [number, number, number, number] = totalGain > 0
    ? [
        featureGiniReductions[0] / totalGain,
        featureGiniReductions[1] / totalGain,
        featureGiniReductions[2] / totalGain,
        featureGiniReductions[3] / totalGain,
      ]
    : [0.25, 0.25, 0.25, 0.25];

  return {
    type: 'decision_tree',
    root,
    maxDepth,
    featureImportances: normalizedImportances,
  };
}

export function predictTreeSample(node: TreeNode, sample: number[]): {
  predictedClass: 0 | 1 | 2;
  probabilities: [number, number, number];
} {
  if (node.isLeaf || node.featureIndex === undefined || node.threshold === undefined) {
    return {
      predictedClass: node.predictedClass,
      probabilities: node.probabilities,
    };
  }

  const val = sample[node.featureIndex];
  if (val <= node.threshold) {
    return predictTreeSample(node.left!, sample);
  } else {
    return predictTreeSample(node.right!, sample);
  }
}

// ----------------------------------------------------
// 3. Random Forest Classifier (Ensemble of Bagged Trees)
// ----------------------------------------------------
export interface RandomForestModel {
  type: 'random_forest';
  nEstimators: number;
  trees: DecisionTreeModel[];
  maxDepth: number;
  featureImportances: [number, number, number, number];
}

export function trainRandomForest(
  trainData: IrisSample[],
  nEstimators: number = 50,
  maxDepth: number = 3,
  randomState: number = 42
): RandomForestModel {
  const rng = createRNG(randomState + 100);
  const trees: DecisionTreeModel[] = [];
  const nSamples = trainData.length;
  const nFeatures = 4;
  const maxFeatures = Math.max(1, Math.round(Math.sqrt(nFeatures))); // standard sklearn default: sqrt(n_features) = 2

  const cumulativeImportances = [0, 0, 0, 0];

  for (let t = 0; t < nEstimators; t++) {
    // 1. Bootstrap sample (with replacement)
    const bootstrapSample: IrisSample[] = [];
    for (let i = 0; i < nSamples; i++) {
      const idx = Math.floor(rng() * nSamples);
      bootstrapSample.push(trainData[idx]);
    }

    // 2. Select random subset of features
    const allFeatures = [0, 1, 2, 3];
    // Shuffle feature indices
    for (let i = allFeatures.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [allFeatures[i], allFeatures[j]] = [allFeatures[j], allFeatures[i]];
    }
    const featureSubset = allFeatures.slice(0, maxFeatures);

    // 3. Fit tree on bootstrap sample with random subspace
    const tree = trainDecisionTree(bootstrapSample, maxDepth, 2, featureSubset);
    trees.push(tree);

    for (let f = 0; f < 4; f++) {
      cumulativeImportances[f] += tree.featureImportances[f];
    }
  }

  const sumImp = cumulativeImportances.reduce((a, b) => a + b, 0);
  const normalizedImportances: [number, number, number, number] = sumImp > 0
    ? [
        cumulativeImportances[0] / sumImp,
        cumulativeImportances[1] / sumImp,
        cumulativeImportances[2] / sumImp,
        cumulativeImportances[3] / sumImp,
      ]
    : [0.25, 0.25, 0.25, 0.25];

  return {
    type: 'random_forest',
    nEstimators,
    trees,
    maxDepth,
    featureImportances: normalizedImportances,
  };
}

export function predictForestProbabilities(model: RandomForestModel, sample: number[]): [number, number, number] {
  const votes = [0, 0, 0];
  const nTrees = model.trees.length;

  for (let t = 0; t < nTrees; t++) {
    const res = predictTreeSample(model.trees[t].root, sample);
    votes[0] += res.probabilities[0];
    votes[1] += res.probabilities[1];
    votes[2] += res.probabilities[2];
  }

  return [votes[0] / nTrees, votes[1] / nTrees, votes[2] / nTrees];
}

export function predictForest(model: RandomForestModel, sample: number[]): 0 | 1 | 2 {
  const probs = predictForestProbabilities(model, sample);
  if (probs[0] >= probs[1] && probs[0] >= probs[2]) return 0;
  if (probs[1] >= probs[0] && probs[1] >= probs[2]) return 1;
  return 2;
}

// ----------------------------------------------------
// Metrics Engine & Evaluation Comparisons
// ----------------------------------------------------
export interface ClassMetrics {
  precision: number;
  recall: number;
  f1: number;
  support: number;
}

export interface ModelMetrics {
  modelName: string;
  trainAccuracy: number;
  testAccuracy: number;
  precisionMacro: number;
  recallMacro: number;
  f1Macro: number;
  f1Weighted: number;
  generalizationGap: number;
  confusionMatrix: [[number, number, number], [number, number, number], [number, number, number]];
  perClass: [ClassMetrics, ClassMetrics, ClassMetrics];
  featureImportance: [number, number, number, number];
}

export function evaluateModel(
  modelName: string,
  predictFn: (sample: number[]) => 0 | 1 | 2,
  trainData: IrisSample[],
  testData: IrisSample[],
  featureImportance: [number, number, number, number]
): ModelMetrics {
  // Train accuracy
  let trainCorrect = 0;
  for (const s of trainData) {
    const pred = predictFn(extractFeatureVector(s));
    if (pred === s.species) trainCorrect++;
  }
  const trainAccuracy = trainData.length > 0 ? trainCorrect / trainData.length : 0;

  // Test accuracy & confusion matrix
  let testCorrect = 0;
  const cm: [[number, number, number], [number, number, number], [number, number, number]] = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ];

  for (const s of testData) {
    const pred = predictFn(extractFeatureVector(s));
    cm[s.species][pred]++;
    if (pred === s.species) testCorrect++;
  }

  const testAccuracy = testData.length > 0 ? testCorrect / testData.length : 0;

  // Precision, Recall, F1 per class
  const perClass: [ClassMetrics, ClassMetrics, ClassMetrics] = [
    { precision: 0, recall: 0, f1: 0, support: 0 },
    { precision: 0, recall: 0, f1: 0, support: 0 },
    { precision: 0, recall: 0, f1: 0, support: 0 },
  ];

  for (let c = 0; c < 3; c++) {
    const tp = cm[c][c];
    let actualTotal = cm[c][0] + cm[c][1] + cm[c][2];
    let predictedTotal = cm[0][c] + cm[1][c] + cm[2][c];

    const precision = predictedTotal > 0 ? tp / predictedTotal : 0;
    const recall = actualTotal > 0 ? tp / actualTotal : 0;
    const f1 = precision + recall > 0 ? (2 * precision * recall) / (precision + recall) : 0;

    perClass[c] = {
      precision,
      recall,
      f1,
      support: actualTotal,
    };
  }

  const totalSupport = testData.length;
  const precisionMacro = (perClass[0].precision + perClass[1].precision + perClass[2].precision) / 3;
  const recallMacro = (perClass[0].recall + perClass[1].recall + perClass[2].recall) / 3;
  const f1Macro = (perClass[0].f1 + perClass[1].f1 + perClass[2].f1) / 3;

  const f1Weighted = totalSupport > 0
    ? (perClass[0].f1 * perClass[0].support +
        perClass[1].f1 * perClass[1].support +
        perClass[2].f1 * perClass[2].support) /
      totalSupport
    : 0;

  const generalizationGap = Math.abs(trainAccuracy - testAccuracy);

  return {
    modelName,
    trainAccuracy,
    testAccuracy,
    precisionMacro,
    recallMacro,
    f1Macro,
    f1Weighted,
    generalizationGap,
    confusionMatrix: cm,
    perClass,
    featureImportance,
  };
}

// ----------------------------------------------------
// 2D Decision Boundary Meshgrid Generator
// ----------------------------------------------------
export interface MeshCell {
  x: number;
  y: number;
  predClass: 0 | 1 | 2;
  confidence: number;
}

export function generateDecisionBoundaryGrid(
  predictProbFn: (sample: number[]) => [number, number, number],
  featureXIndex: number,
  featureYIndex: number,
  gridResolution: number = 40,
  referenceValues: number[] = [5.84, 3.05, 3.76, 1.20] // Dataset means for remaining features
): {
  cells: MeshCell[];
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
} {
  const valsX = IRIS_DATA.map((d) => extractFeatureVector(d)[featureXIndex]);
  const valsY = IRIS_DATA.map((d) => extractFeatureVector(d)[featureYIndex]);

  const minX = Math.floor(Math.min(...valsX) * 10) / 10 - 0.4;
  const maxX = Math.ceil(Math.max(...valsX) * 10) / 10 + 0.4;
  const minY = Math.floor(Math.min(...valsY) * 10) / 10 - 0.4;
  const maxY = Math.ceil(Math.max(...valsY) * 10) / 10 + 0.4;

  const stepX = (maxX - minX) / gridResolution;
  const stepY = (maxY - minY) / gridResolution;

  const cells: MeshCell[] = [];

  for (let i = 0; i < gridResolution; i++) {
    const x = minX + (i + 0.5) * stepX;
    for (let j = 0; j < gridResolution; j++) {
      const y = minY + (j + 0.5) * stepY;

      const fullVector = [...referenceValues];
      fullVector[featureXIndex] = x;
      fullVector[featureYIndex] = y;

      const probs = predictProbFn(fullVector);
      let pred: 0 | 1 | 2 = 0;
      if (probs[1] > probs[pred]) pred = 1;
      if (probs[2] > probs[pred]) pred = 2;

      cells.push({
        x,
        y,
        predClass: pred,
        confidence: probs[pred],
      });
    }
  }

  return { cells, minX, maxX, minY, maxY };
}
